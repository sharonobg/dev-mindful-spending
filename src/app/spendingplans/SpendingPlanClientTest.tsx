 "use client"
import *as React from 'react';
import {useState,useEffect,use} from 'react'
import {useSession}from 'next-auth/react';
import {useRouter} from 'next/navigation'
import Link from "next/link"
import { BsFillPencilFill } from 'react-icons/bs'
import { AiFillDelete } from 'react-icons/ai'
import {ToastContainer ,toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

//import RemoveSpendingplan from '../../../components/RemoveSpendingplan'
import mongoose from "mongoose";
//type MyCategoryType=
// {
//   mycategoryId:string,
//   isChecked:boolean,
//   explain:string,
//   categorynotes:string,
//   planamount:string,
// }
type MyCategoriesType=[{
  mycategoryId:string,
  isChecked:boolean,
  explain:string,
  categorynotes:string,
  planamount:string,
}]


const EditSpendingPlanClient= (
  { params }: 
  { 
    params: { id: string } 
  },
   {...mycategories}: [MyCategoriesType],
   {...categories}: [Category],
   spendingplanserver:any
 
)  =>{

 
    
    // const mycategoriesArr=mycategories   
    // console.log('mycategoriesArr',mycategoriesArr)
    const {data:session,status} = useSession();
    //const newcats = use(mycategories);
    if(status === 'unauthenticated'){
      return <p className="font-bold text-red-500 text-center">Access Denied</p>
  }


if(status === 'loading'){
    return <p>Loading...</p>
}


    

return(
    <>
    <pre>spendingplanserver client:{JSON.stringify(spendingplanserver, null, 2)}</pre>
 <pre>mycategories client:{JSON.stringify(mycategories, null, 2)}</pre>
    <pre>params client:{JSON.stringify(params, null, 2)}</pre>
    {/* <pre>params mycats client:{JSON.stringify(mycategories, null, 2)}</pre> */}
      {/*<pre>spendingplan client:{JSON.stringify(spendingplan, null, 2)}</pre>
       <pre>spendingplanDetails client:{JSON.stringify(spendingplanDetails, null, 2)}</pre> */}
    <div className="flex flex-col self-center place-items-center border-l-orange-100"> 

   
    <div>
    <div className="flex flex-col">
    { categories.length > -1 ? (categories.map((category:Category) =>
    
    <div key={category._id} className="flex flex-col m-0 py-0 px-2 items-end">     
    <label htmlFor={category._id} className="m-0 py-0 px-2 align-items-center ">{category.title}
    <input 
    className="m-0 py-0 px-2 w-fit align-items-right ml-2 text-sm"
    name="checkbox"
    placeholder="Select Category"
    type="checkbox"
    //checked={isChecked}
    value={category._id}
    id={category._id}
    />
    </label>
    </div>
    )): "no categories are available" }
    
    </div>
        </div>)
</div>

   
    
    </> )

}
export default EditSpendingPlanClient



