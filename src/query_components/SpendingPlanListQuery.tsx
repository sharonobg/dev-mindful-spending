"use client"
import React, {ChangeEvent} from 'react'
import {useRouter}from 'next/navigation'
import { useSpendingplans } from "@/query_services/queries";
import {useIsFetching}from "@tanstack/react-query"
import { BsFillPencilFill } from "react-icons/bs";

export default function FindSpendingPlan() {
    const router = useRouter();
    // const categoriesManyQuery = useCategories();
    const spendingplansDataNew = useSpendingplans();
        // const thisMonth = new Date().getMonth()+1;//this is default
        // const thisYear = new Date().getFullYear()
        const isFetching = useIsFetching();
        {isFetching > 0 && <h1>Waiting for your Spending Plans ...</h1>}
     
    // const inList = spendingplansDataNew?.data?.map((exists) => 
    //  new Date(` ${exists?.planyear}-${exists?.planmonth}-01`)
    // );
   

    
    //  console.log('inLIst',inList)
     //react-datepicker__month-0
    //  const filterMonth = (date:Date) => {
    //   return !inList(date)
    //  }
     
    // const currentDate=={spendingplan.month}/{spendingplan.day}/{spendingplan.year};
    //const planId = {plan}
    // if {spendingplan.month} and {spendingplan.year} match the current month/year THE ROUTER PUSH TO THE CURRENT PLAN IF NOT - STAY ON THIS PAGE

    return (
        <>
        <h2>Spending Plan list Dropdown</h2>
          {/* {JSON.stringify(spendingplansDataNew?.data,null,2)} */}
         {spendingplansDataNew?.data?.map((spendingplansel:SpendingplanTypeAll,index:number) => (
        
        <div className="flex flex-row justify-around items-center" key={spendingplansel.id}>
        <div className="self-center" key={spendingplansel.id}>
           {spendingplansel.planmonth}/{spendingplansel.planyear}
              {/* <pre>{JSON.stringify(spendingplansDataNew.data,null,2)}</pre> */}
        
        </div>
        <button key="edit" className="yellowbg colsm" onClick={() => router.push(`/spendingplans-page/${spendingplansel?.id}`)}>
                  <div className="sr-only hidden first:md:not-sr-only  md:flex">Edit</div><BsFillPencilFill />
        </button>
       
       
        {/* <button onClick={() =>router.push(`/spendingplans-page/${spendingplansel.id}`) }>Select this plan</button> */}
        </div>
        ))}
{/* {spendingplansDataNew?.data?.map((spendingplandropdown:any) => (
        <>
<select defaultValue="View your plan"  className="m-2 font-bold border border-blue-500 rounded-lg">

   <option defaultValue="View your plan" onClick={() => console.log(spendingplandropdown.id)} key={spendingplandropdown.id} id={spendingplandropdown.id} value={spendingplandropdown.id}>PLAN: {spendingplandropdown.planmonth}/{spendingplandropdown.planyear}</option>
   </select>

  </>
))} */}


   </> )
}