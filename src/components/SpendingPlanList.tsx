"use client"
import React, {ChangeEvent} from 'react'
import {useRouter}from 'next/navigation'

export default function FindSpendingPlan({spendingplanslist}:{spendingplanslist:any}) {
    const router = useRouter();
        //const [plan,setPlan]= useState("");
        const thisMonth = new Date().getMonth()+1;//this is default
        const thisYear = new Date().getFullYear()
        console.log('thisMonth',thisMonth)
        console.log('thisYear',thisYear)
        const monthdate = spendingplanslist.month_date;
        const yeardate = spendingplanslist.year_date;
        const getPlan=(event: ChangeEvent<HTMLSelectElement>) => {
        
        console.log('monthdate',monthdate)
        console.log('yeardate',yeardate)
        let thisplan = event.target.value;
            console.log('plan',thisplan)
        try{
            const planExists = spendingplanslist.map((spendingplan:any) => {
            const planmonth = spendingplan.month
            const planyear = spendingplan.year
            let thisplan = event.target.value;
            console.log('plan',thisplan)
            
            router.push(`/spendingplan/${thisplan}`)
            });
            //let isAllowedIn = allowedEmailsArr.includes(reqBody.email);
            //let ifExists = allowedEmailsArr.includes(reqBody.email);
            
           
        }
        catch(error){
            console.log('error',error)
        }
    } 
    // const currentDate=={spendingplan.month}/{spendingplan.day}/{spendingplan.year};
    //const planId = {plan}
    // if {spendingplan.month} and {spendingplan.year} match the current month/year THE ROUTER PUSH TO THE CURRENT PLAN IF NOT - STAY ON THIS PAGE
    return (
        <>
        <h2>Spending plans list select</h2>
        {/* <pre>{JSON.stringify(getPlan,null,2)}</pre> */}
    <select defaultValue="View your plan" onChange={getPlan} className="m-2 font-bold border border-blue-500 rounded-lg">
       <option defaultValue="View your plan">View existing plans</option>
        {spendingplanslist.map((spendingplan:any) => (
        //    {{spendingplan.month}  = thisMonth ?
       
          <option defaultValue="View your plan" key={spendingplan._id} value={spendingplan._id}>PLAN: {spendingplan.month}/{spendingplan.day}/{spendingplan.year}</option>
        )
    )
        }
         </select>
         
          </>
    );
  }