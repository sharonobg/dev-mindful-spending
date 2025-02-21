
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import Filters from '@/components/Filters';
//import Link from 'next/link';
import Spendingplan from '@/models/spendingplanModel';
import User from '@/models/userModel';
import RQCategoriesProvider from "@/query_components/RQCategoriesProvider";
import Category from "@/models/categoryModel";

export default async function SpendingPlanListFilter() {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user?.email;
    const user = await User.findOne({email:sessionUser});
    const userid = user?._id
    const categoriesfetch = await Category.find().sort({title:1});
    const categories = JSON.parse(JSON.stringify(categoriesfetch));
    
    const spendingplanslist = await Spendingplan.aggregate([
      { $match: {
        $expr : { $eq: [ '$authorId' , { $toObjectId: userid } ] } 
    }},
    {$addFields : {dateField : new Date()}},
    {
      $project: {
        //_id:0,
        day : {$dayOfMonth : "$planmonthyear"},
        month : {$month : "$planmonthyear"}, 
        year : {$year :  "$planmonthyear"},
        "planmonthyear":1,
        month_date: {"$month": new Date() } ,
        year_date: {"$year": new Date() } ,
        mycategories:"$mycategories"
      }
    }
    ] )
    return(
        <>
         
        <RQCategoriesProvider categoriesPromise={categories}>
        <Filters />
        </RQCategoriesProvider>
        </>
    )
}
