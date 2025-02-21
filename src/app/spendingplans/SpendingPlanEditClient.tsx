 "use client"
import *as React from 'react';
import {useState} from 'react'
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
type SpendingplanType={
  //authorId:'string',
  planmonthyear:Date,
  mycategories:MyCategoriesType
}

const EditSpendingPlanClient = async (
  { params }: 
  { 
    params: { id: string } 
  },
  {categories}:
  {
    categories:[Category]
  },
  
   {...spendingplan}:
  {
    spendingplan:SpendingplanType
  },
  {...mycategories}:
  {
    mycategories:MyCategoriesType
  },
 
 
 
)  =>{

  const[selectedcats,setSelectedcats]=useState<string[]>([])
    const [category,setCategory]=useState("")
    const [explain,setExplain]=useState("")
    const [planmonthyear,setPlanmonthyear]=useState(new Date())
    const [planamount,setPlanamount]=useState("")
    const [categorynotes,setCategorynotes]= useState<string>("")
    const [mycategoryId,setMycategoryId]= useState<string>("")
 
    const [spendingplanDetails,setSpendingplanDetails]=useState({
        planmonthyear:planmonthyear,
        mycategories:[{
          //mycategories={
            mycategoryId:mycategoryId,
            isChecked:true,
            explain:explain,
            categorynotes:categorynotes,
            planamount:parseInt(planamount).toFixed(2),
          }
        ]
      })
    //const mycategoriesArr=[spendingplan?.mycategories]   
    console.log('spendingplanDetails',spendingplanDetails)
    console.log('mycategories',mycategories)
    

    const {data:session,status} = useSession();
    const router= useRouter();
    if(status === 'unauthenticated'){
      return <p className="font-bold text-red-500 text-center">Access Denied</p>
  }


if(status === 'loading'){
    return <p>Loading...</p>
}


    const handleCategory = async (e:React. FormEvent<HTMLInputElement>) => {
      
      e.preventDefault();
      try{
        const target = e.currentTarget;
        const catid = target.id;
        //console.log(catid)
        setSelectedcats(
          () => 
        target.checked ? [...selectedcats,catid]
        : selectedcats.filter((mycategory) => mycategory !== catid))
      }catch(error){
          console.log(error)
      }
        //const target = e.target;
        
      }

return(
    <>
    <pre>categories client:{JSON.stringify(categories, null, 2)}</pre>
      <pre>spendingplan client:{JSON.stringify(spendingplan, null, 2)}</pre>
      <pre>spendingplanDetails client:{JSON.stringify(spendingplanDetails, null, 2)}</pre>
    <div className="flex flex-col self-center place-items-center border-l-orange-100"> 
    <h2 className="mb-8 text-lg font-bold text-center">Edit categories, notes and planned amounts for your spending plan</h2>
    <div  className="flex flex-row">
    <div  className="flex flex-col border-r-2 border-blue-500 min-w-fit">
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
    onChange={handleCategory}
    />
    </label>
    </div>
    )): "no categories are available" }
    
    </div>
  </div>
  <div  className="flex flex-col px-5">
    <form className="flex flex-col flex-wrap gap-5 my-3">
     
      
      <div  className="flex flex-col">
       
        
        <DatePicker
        value={planmonthyear.toString()}
          className="ml-0"
            dateFormat="MMMM yyyy"
            showMonthYearPicker 
            selected={planmonthyear} 
            onChange={(date) => date && setPlanmonthyear(date)}
            />
          {[mycategories].length -1 ? ([mycategories].map((mycategory:any) => 
          <div key={mycategory.mycategoryId} className="mycategoryArr"> 
          <h1>Mapping</h1>
            <h2>there are categories</h2>
            <input onChange={(e) => setMycategoryId(e.target.value)}
            value={mycategory.mycategoryId}
            id={mycategory.mycategoryId}
            className="px-2 py-2 m-0 border border-green-200 max-w-2xl text-charcoal-500 w-[250px]"
            name={mycategory.mycategoryId}
            placeholder={mycategory.mycategoryId}
            type="text"
            />
            <input 
            onChange={(e) => setCategorynotes(e.target.value)}
            value={mycategory?.categorynotes}
            className="px-4 py-2 m-0 border border-green-200 text-charcoal-500 w-[350px]"
            name="category-notes"
            placeholder="Category Notes (for ex Mortgage: could be Chase"
            type="text"
            />
            {/*<h2>{categorynotes}</h2>*/}
            <input onChange={(e) => setPlanamount(e.target.value)}
            className="px-4 py-2 m-0 border border-green-200 text-charcoal-500 w-[100px]"
            value={parseFloat(mycategory.planamount).toFixed(2)}
            name="planamount"
            placeholder="0.00"
            //selected={planamount}
            type="string"
            />
            
            <input onChange={(e) => setExplain(e.target.value)}
            value={mycategory?.explain}
            className="px-4 py-2 m-0 border border-green-200 text-charcoal-500 w-[350px]"
            name="explain"
            placeholder="Explain Difference"
            type="text"
            />
            {/*<h2>{planamount}</h2>
            on click should set - everything in my
            
            <button onClick={handleCategories}>Add to plan</button>*/}
            </div>
            ) ): "can't find categories for this spending plan"}
            
          </div>
          <button className="w-fit bg-blue-400 rounded-md p-3 text-white font-semibold ml-0" type="submit">Edit Spending Plan</button>
      </form>
      </div>
  </div>
</div>

   <ToastContainer />  
    
    </> )

}
export default EditSpendingPlanClient

//

