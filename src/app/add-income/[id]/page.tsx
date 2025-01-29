"use client"
// need "add" an individual income transaction 
// need "add" a planned income function :

import {useState,useEffect} from 'react';
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
type Income = {//object with individual type enter income i.e. from wages
incometype: Incometype;
incomeamount:string;
incomedescr:string;
incomedate:Date;//expected date (by type-instead of category) income arrives
}
const Edit = ({ params }: { params: { id: string } }) => {

const [incometype,setIncometype]=useState<Incometype>(Incometype.wages)//income type required
const [incomedescr,setIncomedescr]= useState<string>("")//set income description
const [incomeamount,setIncomeamount]=useState("")//the amount expected for income type for this month
const [incomedate,setIncomedate]=useState(new Date()) //date for individual type 

const {data:session,status} = useSession();
const router= useRouter();
const [incomeDetails,setIncomeDetails]=useState({
  incomedescr:incomedescr,
  incomedate:new Date(),
  incomeamount:0.00,
  incometype:Incometype.wages,
});
//console.log('income details from edit',incomeDetails)

useEffect(() => {
    
  async function fetchIncome() {  
                        
      const res = await fetch(`/api/income/${params.id}`
      ,{cache:'no-store'}
      )
      //const transdatePrev = transdate;
      
      const income = await res.json()
      //console.log('fetchIncome',income)
      const incomePrev = income?.incomedate;
      const dataamount=income.incomeamount.$numberDecimal;
      setIncomeDetails({
           incomedate:incomePrev,
           incometype:income.incometype,
           incomedescr:income.descr,
           incomeamount:dataamount,
           //authorId:session?.user._id
       })}
   fetchIncome()
   /* jshint ignore:start*/
},[])
/* jshint ignore:end*/
//console.log('incomeDetails after set: ',incomeDetails)
if(status === 'loading'){
  return <p>Loading...</p>
}
if(status === 'unauthenticated'){
  
  return <p className="font-bold text-red-500">AccessDenied</p>
}
const handleSubmitEdit = async (e:React.FormEvent<HTMLFormElement>) => {//each type of income planned
      e.preventDefault();
      try {
        const body = {//individual object for each monthly income expected by type
          authorId:session?.user?._id,
          incomedate:new Date(incomedate),
          incometype:incometype,
          incomedescr:incomedescr,
          incomeamount:parseFloat(incomeamount).toFixed(2),
        }
      
    
      const res = await fetch('/api/income/${params.id}`',{
      headers:{
            "Content-type":"application/json",
            "Authorization":`Bearer` 
            //${session?.user?.accessToken}`
          },
      method:'PUT',
      body:JSON.stringify({
        authorId:session?.user?._id,
        incomedate:new Date(incomedate),
        incomeamount:parseFloat(incomeamount).toFixed(2),
        incometype:incometype,
        incomedescr:incomedescr,
      })
  })
  //console.log('EDIT body after PUT:',body)
  //console.log('EDIT res after edit:',res)
  if(res.ok){
      console.log("Edit went through")
  }else{
      toast.error("Edit failed")
      console.log("Edit failed")
  }

  const income = await res.json();
  
  router.push("/dashboard");
  }catch(error){
      console.log(error)
  }
}
const handleDelete= async (e:React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  try{
          
      const res = await fetch(`/api/income/${params.id}`,{
  
      headers: {
          "Content-Type": 'application/json',
          "Authorization": `Bearer ${session?.user?.accessToken}`
      },
      method: "DELETE",
  })
  //console.log('res after edit:',res)
  if(res.ok){
      toast.success("Delete went through")
      console.log("Delete went through")
  }else{
      toast.error("Delete income failed")
      console.log("Delete income failed")
  }

  //const transaction = await res.json();
  //console.log('transaction edit: ',transaction);
  router.push("/dashboard");
  }catch(error){
      console.log("Delete income failed",error)
  }
}
   
    return(
        <>
        <div className="flex flex-col self-center place-items-center border-l-orange-100">
        <h2 className="mb-8 text-lg font-bold text-center">Edit Income Transaction</h2>
        <div  className="flex flex-row">
        
      <div  className="flex flex-col px-5">
        <form onSubmit={handleSubmitEdit} className="flex flex-col flex-wrap gap-5 my-3">
          <div  className="flex flex-col">
                <DatePicker 
                className="border border-blue-600" 
                value={incomeDetails.incomedate.toString()}
                onChange={(date) => date && setIncomedate(date)} />
                <input 
                onChange={(e) => setIncomedescr(e.target.value)}
                value={incomeDetails.incomedescr}
                className="px-4 py-2 mt-4 mx-5 border border-green-200 text-green-500"
                name="description"
                placeholder="Description"
                type="text"
                />
                <select 
                onChange={(e) => setIncometype(e.target.value as Incometype)}
                defaultValue = {incomeDetails.incometype}>
                <option value="wages">Wages</option>
                <option value="freelance">Free-lance</option>
                <option value="tips">Tips</option>
                <option value="interest">Interest Received</option>
                <option value="childsupport">Child Support</option>
                <option value="retirementincome">Retirement Income</option>
                <option value="other">Other Income</option>
                </select>
                <input onChange={(e) => setIncomeamount(e.target.value)}
                value={incomeDetails.incomeamount}
                className="px-4 py-2 m-0 border border-green-200 text-charcoal-500 w-[100px]"
                name="planned-amt"
                placeholder="0.00"
                //selected={planamount}
                type="string"
                />
              </div>
              <button className="w-fit bg-blue-400 rounded-md p-3 text-white font-semibold ml-0" type="submit">Create Monthly Income Plan</button>
              
          </form>
        </div>
        </div>
</div>
    
       <ToastContainer />  
        
        </> )
}
export default Edit
