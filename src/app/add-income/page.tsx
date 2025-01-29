"use client"
// need "add" an individual income transaction 
// need "add" a planned income function :

import * as React from 'react';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {useSession} from 'next-auth/react'
import {ToastContainer ,toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import mongoose from "mongoose";

enum Incometype{
    wages = "wages",
    freelance = "free-lance",
    tips = "tips",
    interest = "interest",
    childsupport =  "child-support",
    retirementincome ="retirement-income",
    otherincome =  "other"
 }
// type Income = {//object with individual type enter income i.e. from wages
//   incometype: string;
//   incomeamount:string;
//   incomedescr:string;
//   incomedate:Date;//expected date (by type-instead of category) income arrives
// }
const ExpectedIncome = () => {
  const [incometype,setIncometype]=useState<Incometype>(Incometype.wages)//income type required
  const [incomedescr,setIncomedescr]= useState<string>("")//set income description
  const [incomeamount,setIncomeamount]=useState("")//the amount expected for income type for this month
  const [incomedate,setIncomedate]=useState(new Date()) //date for individual type 

  const {data:session,status} = useSession();
  const router= useRouter();
//add new income ObjectId to monthly plannedIncome array of income:
if(status === 'loading'){
  return <p>Loading...</p>
}
if(status === 'unauthenticated'){
  return <p className="font-bold text-red-500 text-center">Access Denied - Please Sign In</p>
}

const handleNewIncome = async (e: React.FormEvent<HTMLFormElement>) => {//each type of income planned
      e.preventDefault();
      if(!incomedate || !incomedescr ||!incometype  ||!incomeamount){
        toast.error("Please fill in all the fields")
        return
    }
    try{
      //const thistoken = session?.token?.sub;
      const res = await fetch('/api/income',{
      headers:{
            "Content-type":"application/json",
            "Authorization":`Bearer` 
            //${session?.user?.accessToken}`
          },
      method:'POST',
      body:JSON.stringify({
        //authorId:userid,
        //authorId:session?.user?._id,
        incomedate:new Date(incomedate),
        incometype:incometype,
        incomedescr:incomedescr,
        incomeamount:parseFloat(incomeamount).toFixed(2),
      })
  }
  )
    if(!res.ok){
            throw new Error("Error on income plan or auth")
    }
    const income = await res.json();
    //console.log('income ln62',income)
        //router.push(`/spending-plan/${spendingplan?._id}`)
        //router.refresh();
        router.push('/dashboard');
    }catch (error) {
      console.log('not working',error)
      toast.error("Handle newIncome did't go through");
      return
    }
}
    return(
        <>
        <div className="flex flex-col self-center place-items-center border-l-orange-100">
        <h2 className="mb-8 text-lg font-bold text-center">Enter new Income transaction</h2>
        <div  className="flex flex-row">
        
      <div  className="flex flex-col px-5">
        <form onSubmit={handleNewIncome} className="flex flex-col flex-wrap gap-5 my-3">
          <div  className="flex flex-col">
                <DatePicker 
                className="border border-blue-600" 
                selected={incomedate} 
                
                onChange={(date) => date && setIncomedate(date)} />
                <input 
                onChange={(e) => setIncomedescr(e.target.value)}
                className="px-4 py-2 mt-4 mx-5 border border-green-200 text-green-500"
                name="description"
                placeholder="Description"
                type="text"
                />
                <select 
                //type="text" 
                value ={incometype} 
                onChange={(e) => setIncometype(e.target.value as Incometype)}>
                <option value="wages">Wages</option>
                <option value="free-lance">Free-lance</option>
                <option value="tips">Tips</option>
                <option value="interest">Interest Received</option>
                <option value="child-support">Child Support</option>
                <option value="retirement-income">Retirement Income</option>
                <option value="other">Other Income</option>
                </select>
                <input onChange={(e) => setIncomeamount((e.target as HTMLInputElement).value)}
                className="px-4 py-2 m-0 border border-green-200 text-charcoal-500 w-[100px]"
                name="planned-amt"
                placeholder="0.00"
                //selected={planamount}
                type="string"
                />
              </div>
              <button className="w-fit bg-blue-400 rounded-md p-3 text-white font-semibold ml-0" type="submit">Add Income</button>
              
          </form>
        </div>
        </div>
</div>
    
       <ToastContainer />  
        
        </> )
}
export default ExpectedIncome
