"use client"
import * as React from 'react';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {useSession} from 'next-auth/react'
import {ToastContainer ,toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
//import mongoose from "mongoose";

enum IncomeType{
  choose="choose",
    wages = "wages",
    freelance = "free-lance",
    tips = "tips",
    interest = "interest",
    childsupport =  "child-support",
    retirementincome ="retirement-income",
    otherincome =  "other"
 }
// type PlannedIncomeType = {
//   incomeType:IncomeType;
//   incomeplandescr:string;
//   incomeplanamount:string;
//   incdateexpected:Date;
// };

const ExpectedIncomePlan = () => {
  const [incplanmonthyear,setIncplanmonthyear]=useState(new Date())//month/year of plan
  // const [selectedtypes,setSelectedtypes]=useState<Array<{
  //   incomeType:IncomeType;
  //   incomeplandescr:string;
  //   incomeplanamount:string;
  //   incdateexpected:Date;
  // }>>([])
  const [selectedtype,setSelectedtype]=useState<string>("");
  
  const [selectedtypeArr,setSelectedtypeArr]=useState<IncomeType[]>([]);
  const [plannedIncome,setPlannedIncome]=useState<Array<{
    incomeType:IncomeType;
    incomeplandescr:string;
    incomeplanamount:string;
    incdateexpected:Date;
}>>([])//array of plannedIncomeType objects
  const [incomeType,setIncomeType]=useState<IncomeType>(IncomeType.choose);
  const [incomeplandescr,setIncomeplandescr]= useState<string>("");
  const [incomeplanamount,setIncomeplanamount]= useState<string>("");
  const [incdateexpected,setIncdateexpected]=useState(new Date());

  
  const {data:session,status} = useSession();
  const router= useRouter();
//when user selects type on left: add a row for that type
//when user clicks on add new income type = start array or add to array
const handleIncomeByType = async (e: React.ChangeEvent<HTMLSelectElement>) => {
  e.preventDefault() 
  try{
    const target = e.currentTarget;
    const typeid = e.currentTarget.value;
    console.log('typeid', target)
    // if (typeid) {
    //   const target = e.currentTarget;
    //   const typeid = target.value;
    setIncomeType(typeid as IncomeType)
      console.log("Selectedtype incomeType",incomeType);
      console.log("selection made. add to list.",typeid);
      setSelectedtypeArr([
        ...selectedtypeArr, typeid as IncomeType
      ])
    //selectedtypes.push(typeid);
    //}
    console.log('selectedtypeArr',selectedtypeArr)
  } catch(err){
    console.log(err)
  }
} 
  const handleNewIncome = async (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();
  try{
    //0const newIncomeType = incomeType;
    const newIncomeByType =  {
      incomeType: incomeType,
      incdateexpected : incdateexpected,
      incomeplandescr:incomeplandescr,
      incomeplanamount:parseFloat(incomeplanamount).toFixed(2),
      }
  console.log('newIncomeByType', newIncomeByType)
  setPlannedIncome([ 
    ...plannedIncome, newIncomeByType
  ]);
  console.log('newIncomeByType', newIncomeByType)
  console.log('plannedIncome', plannedIncome)
}catch(error){
  console.log('error',error)
}
}
const handleSubmitInc = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
 // const finalCategories = mycategories;
 console.log('plannedInc at handlSubmitInc',plannedIncome)//same (keep this for edits) has all but first is empty default  values

  try{
    const res = await fetch('/api/incomeplan',{
    headers:{
          "Content-type":"application/json",
          "Authorization":`Bearer` 
          //${session?.user?.accessToken}`
        },
    method:'POST',
    body:JSON.stringify({
      authorId:session?.user?._id,
      planmonthyear:new Date(incplanmonthyear),
      plannedIncome:plannedIncome
    })
}
)
  if(!res.ok){
          throw new Error("Error on income plan or auth")
  }
  const incomeplan = await res.json();
  console.log('incomeplan ln94',incomeplan)
      //router.push(`/spending-plan/${spendingplan?._id}`)
      //router.refresh();
      //router.push('/');
  }catch (error) {
    console.log('not working',error)
    toast.error("Handle Submit Income plan did't go through");
    return
  }
}


    return(
      <>
      <div className="flex flex-col self-center place-items-center border-l-orange-100">
        <h2 className="mb-8 text-lg font-bold text-center">Enter new Income Plan</h2>
        <div  className="flex flex-col">
          
         <div  className="flex flex-col px-5">
         <div>
          
          </div>
          <form onSubmit={handleSubmitInc} className="flex flex-col flex-wrap gap-5 my-3">
            <div  className="flex flex-col">
              <DatePicker
                className="ml-0"
                dateFormat="MMMM yyyy"
                showMonthYearPicker 
                selected={incplanmonthyear} 
                onChange={(date) => date && setIncplanmonthyear(date)}
                />
                <select
                    defaultValue ={incomeType} 
                    onChange={handleIncomeByType}>
                    <option value="choose">Choose Income Type</option>
                    <option value="wages">Wages</option>
                    <option value="free-lance">Free-lance</option>
                    <option value="tips">Tips</option>
                    <option value="interest">Interest Received</option>
                    <option value="child-support">Child Support</option>
                    <option value="retirement-income">Retirement Income</option>
                    <option value="other">Other Income</option>
                  </select>
                  <div className="border-t-4 border-blue-500 pt-5">Expected Income: </div>
                { selectedtypeArr ?.length > -1 ?(selectedtypeArr.map((selectedtype) => 
                  <> 
                <div key={this} className="myIncomeRow flex flex-col m-0 p-0">
                  
                  {/* <pre>selectedtypeArr:{JSON.stringify(selectedtypeArr, null, 2)}</pre> */}
                  
                  <DatePicker
                className="ml-0"
                dateFormat="MMMM dd yyyy"
                selected={incdateexpected} 
                onChange={(date) => date && [...[plannedIncome],setIncdateexpected(date)]}
                />
                <select 
                    name={selectedtype}
                    defaultValue ={selectedtype} 
                    onChange={(e) => 
                    [...[plannedIncome],setIncomeType((e.target).value as IncomeType)]}>
                    <option value="wages">Wages</option>
                    <option value="free-lance">Free-lance</option>
                    <option value="tips">Tips</option>
                    <option value="interest">Interest Received</option>
                    <option value="child-support">Child Support</option>
                    <option value="retirement-income">Retirement Income</option>
                    <option value="other">Other Income</option>
                  </select>
                  <input 
                    onChange={(e) => [...[plannedIncome],setIncomeplandescr((e.target as HTMLInputElement).value)]}
                    className="px-4 py-2 mt-4 mx-5 border border-green-200    text-green-500"
                    name="description"
                    placeholder="Description"
                    type="text"
                  />
                  <input onChange={(e) =>  [...[plannedIncome], setIncomeplanamount((e.target as HTMLInputElement).value)]}
                    className="px-4 py-2 m-0 border border-green-200    text-charcoal-500 w-[100px]"
                    name="planned-amt"
                    placeholder="0.00"
                    //selected={planamount}
                    type="string"
                  />
                  <button onClick={handleNewIncome}>Add to plan</button>
                
                 </div>
                 
                  </>)):("nothing added")

                 } 
                 
                 
            </div>
            <button className="w-fit bg-blue-400 rounded-md p-3 text-white font-semibold ml-0" type="submit">Create Income Plan
              </button>
          </form>
        </div>
          <ToastContainer />  
      </div>
    </div>
  </> 
  )
}
export default ExpectedIncomePlan
