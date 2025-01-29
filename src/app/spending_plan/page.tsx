// import React,{useState,useEffect} from 'react';
// import {useRouter} from 'next/navigation';
// import {useSession} from 'next-auth/react'
// import {ToastContainer ,toast} from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import "react-datepicker/dist/react-datepicker.css";
// import DatePicker from "react-datepicker";
import {getServerSession} from "next-auth";
import Link from "next/link"
import { BsFillPencilFill } from 'react-icons/bs'
import Spendingplan from "@/models/spendingplanModel";
import User from "@/models/userModel";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import Category from "@/models/categoryModel";
//import CreateSpendingPlan from "@/components/CreateSpendingPlan";
import SpendingPlanDetails from "@/components/Spendingplancomp";
import SpendingPlanFilter from "@/components/SpendingPlanFilter";
import ButtonComponent from "@/components/ButtonComponent";

const session = await getServerSession(authOptions);
//console.log('filters session',session)
const sessionUser = session?.user?.email;
const user = await User.findOne({email:sessionUser});
const userid = user?._id

  //const propsfield = {props};
const categories= await Category.find().sort({ title: 1 });
const spendingplansdates = await Spendingplan.aggregate([
  { $match: {
    $expr : { $eq: [ '$authorId' , { $toObjectId: userid } ] } 
}},
{
  $project: {
    //_id:0,
    day : {$dayOfMonth : "$planmonthyear"},
    month : {$month : "$planmonthyear"}, 
    year : {$year :  "$planmonthyear"},
    "planmonthyear":1,
  }
}
]
  
)

export default async function SpendingPlansPage(){
  const thisMonth = new Date().getMonth()+1;//this is default
  const thisYear = new Date().getFullYear()
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user?.email;
  
  const user = await User.findOne({email:sessionUser});
  const userid = user._id
  //const list = spendingplanslist
  // const month   = spendingplanslist.getUTCMonth() + 1; // months from 1-12
  // const day     = dateObj.getUTCDate();
  // const year    = dateObj.getUTCFullYear();
    return(
      <>

    {/* <pre>{JSON.stringify(spendingplanslist,null,2)}</pre> */}
    <h1>SPENDING PLANS DATES</h1>
    {/* <pre >{JSON.stringify(spendingplansdates, null, 2)}</pre> */}
       {/* <SpendingPlanFilter />
         <SpendingPlanDetails />  */}
         <ButtonComponent spendingplansdates={spendingplansdates}/>
        {/* <div>
      <ul >
      {spendingplansdates.map((spendingplan) => (
        <li key={spendingplan._id}>PLAN: {spendingplan.month}/{spendingplan.day}/{spendingplan.year}</li>
      ))}
       </ul>
        </div> */}
        </>
    )

    
}
