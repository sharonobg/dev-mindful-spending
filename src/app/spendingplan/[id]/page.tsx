"use client"

import React, {useState,useEffect} from 'react'
import {useSession}from 'next-auth/react';
import {useRouter} from 'next/navigation'
// import Link from "next/link"
// import { BsFillPencilFill } from 'react-icons/bs'
// import { AiFillDelete } from 'react-icons/ai'
import {ToastContainer ,toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
//import RemoveSpendingplan from '../../../components/RemoveSpendingplan'
import mongoose from "mongoose";
type MyCategoriesType={
  mycategoryId:string,
  isChecked:boolean,
  explain:string,
  categoryNotes:string,
  planamount:string,
}
type SpendingplanType={
  //authorId:'string',
  planmonthyear:Date,
  mycategories:[MyCategoriesType],
  // incometype?:string,
  // incomedate?:Date,
  // incomedescr?:string,
  // incomeamount?:number,
}
    
const Edit = ({ params }: { params: { id: string } }) => {
  
    const [selections,setSelections]=useState([
      {mycategoryId:'',
        categorynotes:'',
        planamount:'',
        explain:'',
        isChecked:true,
        checked:true}
    ])
  const[selectedcats,setSelectedcats]=useState<string[]>([])
    const [category,setCategory]=useState("")
    const [explain,setExplain]=useState("")
    const [categories,setCategories]=useState<Category[]>([])
    const [mycategories,setMycategories]=useState([])
    const [planmonthyear,setPlanmonthyear]=useState(new Date())
    const [spendingplanDetails,setSpendingplanDetails]=useState<SpendingplanType>({
      planmonthyear:new Date(),
      mycategories:[{
        mycategoryId:'',
        isChecked:true,
        explain:'',
        categoryNotes:'',
        planamount:'0.00',
      }],
    })
    const [planamount,setPlanamount]=useState("")
    //const [categoryId,setCategoryId]= useState("")
    //const [title,setTitle]=useState("")
    const [categorynotes,setCategorynotes]= useState<string>("")
    const [mycategoryId,setMycategoryId]= useState("")
    const [isChecked, setIsChecked] = useState(false);
    const {data:session,status} = useSession();
    //const isCheckedId="";
    const router= useRouter();
    useEffect(() => {
      fetch('/api/category')
        .then((res) => res.json())
        .then(({categories}) => {
          setCategories(categories)
          //get an array of categories that are in the plan - Maybe server size then for those categories set isChecked(true)
          //setIsChecked(true)
        })
        /* jshint ignore:start*/
    }, []);
    /* jshint ignore:end*/
  
    useEffect(() => {
    async function fetchSpendingplan() {  
                           
      const res = await fetch(`/api/spendingplan/${params.id}`
      ,{cache:'no-store'}
      )
      const spendingplan = await res.json()
      //console.log('fetch spendingPlan page id',spendingplan)
      const planmonthyearPrev = spendingplan.planmonthyear;
      //const planamountPrev=spendingplan?.amount.$numberDecimal;
      //const dataamount=spendingplan.mycategories.planamount.$numberDecimal;
      //const mycats=spendingplan.mycategories;
      setSpendingplanDetails({
        planmonthyear:planmonthyearPrev,
        mycategories:spendingplan.mycategories,
        // mycategories:[{
        //   mycategoryId:spendingplan?.mycategories.mycategoryId,
        //   isChecked:true,
        //   explain:spendingplan?.mycategories.explain,
        //   categoryNotes:spendingplan?.mycategories.categoryNotes,
        //   planamount:spendingplan?.mycategories.planamount,
        // }]
       })
       console.log(spendingplanDetails)
      }
   fetchSpendingplan()

  /* jshint ignore:start*/
  },[])
  /* jshint ignore:end*/
  //console.log('spendingplanDetails after useEffect',spendingplanDetails)
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
//       const handleCategories = async (e:React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         const target = e.currentTarget;
//         const catid = target.id;
//       setSelections({
//         mycategoryId:mycategoryId,
//         categorynotes:{categorynotes},
//         planamount:{planamount},
//         explain:{explain},
//         isChecked:true,
//         //checked:true
//         //authorId:session?.user._id
//     })
// mycategories.push({selections})
//console.log('set my categories',mycategories)
     // }

//console.log('spendingplanDetails after set: ',spendingplanDetails)
//on page load - any category that matches mycategoryId should be checked

//for edit:
// const handleSubmit= async (e:React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     try{
//         const body = {
//             planmonthyear,
//             mycategories:{
//             mycategoryId,
//             planamount,
//             explain,
//             isChecked,
//             categorynotes
//         }
            
//         }
//         const res = await fetch(`/api/spendingplan/${params}`,{
    
//         headers: {
//             "Content-Type": 'application/json',
//             "Authorization": `Bearer`
//             //${session?.user?.accessToken}`
//         },
//         method: "PUT",
//         //body: JSON.stringify(body)
//         body:JSON.stringify(body)
        
//     })
//     //console.log('res after edit:',res)
//     if(res.ok){
//         console.log("Edit went through")
//     }else{
//         toast.error("Edit failed")
//         console.log("Edit failed")
//     }

//     const spendingplan = await res.json();
//     //console.log('spendingplan edit: ',spendingplan);
//     router.push("/dashboard");
//     }catch(error){
//         console.log(error)
//     }
 //}//end edit
const handleDeleteA= async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try{
        //const id = {params.id};
        //const body = {
        //    transdate,descr,acctype,categoryId,amount
        //}
        
        const res = await fetch(`/api/spendingplan/${params.id}`,{
    
        headers: {
            "Content-Type": 'application/json',
            "Authorization": `Bearer`
            // ${session?.user?.accessToken}`
        },
        method: "DELETE",
        //body: JSON.stringify(body)
        //body:JSON.stringify(body)
        
    })
    //console.log('res after edit:',res)
    if(res.ok){
        toast.success("Delete went through")
        console.log("Delete went through")
    }else{
        toast.error("Edit failed")
        console.log("Edit failed")
    }

    //const spendingplan = await res.json();
    //console.log('spendingplan edit: ',spendingplan);
    //router.push("/");
    }catch(error){
        console.log(error)
    }
}

return(
    <>
     <pre>spendingplanDetails:{JSON.stringify(spendingplanDetails, null, 2)}</pre> 
    <div className="flex flex-col self-center place-items-center border-l-orange-100">
    <h2 className="mb-8 text-lg font-bold text-center">Edit categories, notes and planned amounts for your spending plan</h2>
    <div  className="flex flex-row">
    <div  className="flex flex-col border-r-2 border-blue-500 min-w-fit">
    <div className="flex flex-col">
    {categories?.length > -1 ? (categories.map((category) =>
    <div key={category._id} className="flex flex-col m-0 py-0 px-2 items-end">     
    <label htmlFor={category._id} className="m-0 py-0 px-2 align-items-center ">{category.title}
    <input 
    className="m-0 py-0 px-2 w-fit align-items-right ml-2 text-sm"
    name="checkbox"
    placeholder="Select Category"
    type="checkbox"
    checked={isChecked}
    value={category._id}
    id={category._id}
    onChange={handleCategory}
    />
    </label>
    </div>
    )): "no categories are available"}
    
    </div>
  </div>
  <div  className="flex flex-col px-5">
    <form className="flex flex-col flex-wrap gap-5 my-3">
      <div  className="flex flex-col">
        <DatePicker
        value={spendingplanDetails.planmonthyear.toString()}
          className="ml-0"
            dateFormat="MMMM yyyy"
            showMonthYearPicker 
            selected={planmonthyear} 
            onChange={(date) => date && setPlanmonthyear(date)}
            />
          {spendingplanDetails.mycategories?.length > -1 ? (spendingplanDetails.mycategories.map((mycategory,index) => 
          
          
          <div key={index} className="mycategoryArr flex flex-row m-0 p-0"> 
          
            <input onChange={(e) => setMycategoryId(e.target.value)}
            value={mycategory.mycategoryId}
            id={mycategory.mycategoryId}
            className="px-2 py-2 m-0 border border-green-200 max-w-2xl text-charcoal-500 w-[250px]"
            name={mycategory.mycategoryId}
            placeholder={mycategory.mycategoryId}
            type="text"
            />
         <h2>{mycategoryId}</h2>
            <input 
            onChange={(e) => setCategorynotes(e.target.value)}
            value={mycategory?.categoryNotes}
            className="px-4 py-2 m-0 border border-green-200 text-charcoal-500 w-[350px]"
            name="category-notes"
            placeholder="Category Notes (for ex Mortgage: could be Chase"
            type="text"
            />
            {/*<h2>{categorynotes}</h2>*/}
            <input onChange={(e) => setPlanamount(e.target.value)}
            className="px-4 py-2 m-0 border border-green-200 text-charcoal-500 w-[100px]"
            value={mycategory.planamount}
            name="planamount"
            placeholder="0.00"
            //selected={planamount}
            type="string"
            />
            <h2>{planamount}</h2>
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
            ) ): "no categories are available"}
            
          </div>
          <button className="w-fit bg-blue-400 rounded-md p-3 text-white font-semibold ml-0" type="submit">Create Spending Plan</button>
          
      </form>
      </div>
  </div>
</div>

   <ToastContainer />  
    
    </> )
}
export default Edit

