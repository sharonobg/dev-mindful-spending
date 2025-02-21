import {getServerSession} from "next-auth";
import Link from "next/link"
import { BsFillPencilFill } from 'react-icons/bs'
import Spendingplan from "@/models/spendingplanModel";
import User from "@/models/userModel";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import Category from "@/models/categoryModel";
import SpendingPlanDetails from "@/components/Spendingplancomp";
import SpendingPlanFilter from "@/components/SpendingPlanFilter";
import SpendingPlanCreateClient from "@/components/SpendingPlanCreateClient";
import SpendingPlanList from "@/components/SpendingPlanList";
//import { getToken } from "next-auth/jwt";
import {NextRequest} from "next/server";
import { ObjectId } from "mongodb";
import Dates from "@/components/Dates";

const session = await getServerSession(authOptions);
const sessionUser = session?.user?.email;
const user = await User.findOne({email:sessionUser});
const userid = user?._id


const categoriesdl = await Category.find().sort({ title: 1 }).lean();
const categories = JSON.parse(JSON.stringify(categoriesdl));
// const usecategories = JSON.parse(JSON.stringify(categories))
// console.log(usecategories)
const spendingplanslistl = await Spendingplan.aggregate([
  { $match: {
    $expr : { $eq: [ '$authorId' , { $toObjectId: userid } ] } 
}},
{
    $addFields : {dateField : new Date()}

},
{
  $project: {
    //_id:0,
    day : {$dayOfMonth : "$planmonthyear"},
    month : {$month : "$planmonthyear"}, 
    year : {$year :  "$planmonthyear"},
    "planmonthyear":1,
    month_date: {"$month": new Date() } ,
    year_date: {"$year": new Date() } ,
  }
}
] 
)
const spendingplanslist = JSON.parse(JSON.stringify(spendingplanslistl));
console.log('spendingplanslist',spendingplanslist
//if a spending plan date matches this month and this year, route to viewedit that plan else create a plan on this page 
)



export default async function SpendingPlansPage(){
  // const thisMonth = new Date().getMonth()+1;
  // const thisYear = new Date().getFullYear()
  // const session = await getServerSession(authOptions);
  // const sessionUser = session?.user?.email;
  
  // const user = await User.findOne({email:sessionUser});
  // const userid = user._id
  

    return(
      <>
      
    <h1>SPENDING PLANS DATES</h1>

         <SpendingPlanList spendingplanslist={spendingplanslist}/>
        
        <SpendingPlanCreateClient categories={categories} />
        </>
    )

    
}
