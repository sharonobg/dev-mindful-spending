import { getToken } from "next-auth/jwt";
import Spendingplan from "@/models/spendingplanModel";
import {getServerSession} from "next-auth"
import {authOptions}from "@/app/api/auth/[...nextauth]/route";
import User from "@/models/userModel";
import NewSpendingPlanForm from './NewSpendinPlanForm';
import {Metadata}from "next";
import Category from "@/models/categoryModel";
import SpendingPlanList from "@/components/SpendingPlanList";
//import SpendingPlanEditClient from "@/components/SpendingPlanEditClient";
import { redirect } from 'next/navigation'
export const metadata:Metadata = {
  title: "My Spending Plan"
}
const session = await getServerSession(authOptions);
const sessionUser = session?.user?.email;
const user = await User.findOne({email:sessionUser});
const userid = user?._id

const myspendingplans = await Spendingplan.find({authorId:userid}).lean();
console.log('myspendingplan spendingplans page s',myspendingplans)
// const usecategories = JSON.parse(JSON.stringify(categories))
// console.log(usecategories)
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
] 
)

export default async function CreateSpendingPlanServer({ params }: { params: { id: string } }){
  const propspage = {params}
  console.log('propspage',propspage)
  const categoriesdl = await Category.find().sort({ title: 1 }).lean();
//const categories = JSON.parse(JSON.stringify(categoriesdl));
const categories = JSON.parse(JSON.stringify(categoriesdl));
    //const categories = await Category.find();
    const session = await getServerSession(authOptions);
    //console.log('filters session',session)
    const sessionUser = session?.user?.email;
    const user = await User.findOne({email:sessionUser});
    const userid = user?._id
    const getMonth = new Date().getMonth()+1;
    const today = new Date();
    const month = today.toLocaleString('default', { month: 'long' });
    const getYear = new Date().getFullYear();
    //const categories = await Category.find().sort({ title: 1 });
    
    //const spendingplanserv = await Spendingplan.findById(params.id).populate("authorId")
    console.log('GET month',getMonth)
    
    //if where spendingplanslist.map.includes(getMonth)&& spendingplanslist.includes
    // what is the id of any plan that is true- take from comp on dashboard
    // (getYear) redirect to spendingplans/id
    // /const thisMonthMatch = 
    
    return(
         <>
         <pre>MINE:{JSON.stringify(myspendingplans,null,2)}</pre>
          <pre>LIST:{JSON.stringify(spendingplanslist,null,2)}</pre> 
       
        {/* // <pre>{JSON.stringify(categories,null,2)}</pre> */}
        <SpendingPlanList spendingplanslist={spendingplanslist}/>
        <h1>Create Spending Plan for {month} {getYear}</h1>
    
       {spendingplanslist.includes(getMonth) ? redirect('/spendingplans') :<NewSpendingPlanForm categories={categories} />
       } 
      
        </>
    )
}


