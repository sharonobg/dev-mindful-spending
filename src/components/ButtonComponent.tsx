"use client"
import React, {useState,useEffect, ChangeEvent} from 'react'
import {useRouter}from 'next/navigation'



export default function Button({spendingplansdates}:{spendingplansdates:any}) {
    const router = useRouter();
        //const [plan,setPlan]= useState("");
        const getPlan=(event: React.ChangeEvent<HTMLSelectElement>) => {
        
        let thisplan = event.target.value;
            console.log('plan',thisplan)
        try{
            let thisplan = event.target.value;
            console.log('plan',thisplan)
            //setPlan(event.target.value);
            //setPlan(event.target.value);
            
            router.push(`/spendingplan/${thisplan}`)
        }
        catch(error){
            console.log('error',error)
        }
        
    } 
    
    //const planId = {plan}
    
    return (
        <>
        <select onChange={getPlan} className="m-2">
        {spendingplansdates.map((spendingplan:any) => (
            
          <option key={spendingplan._id} value={spendingplan._id}>PLAN: {spendingplan.month}/{spendingplan.day}/{spendingplan.year}</option>
          
         
        ))
        }
         </select>
          </>
    );
  }