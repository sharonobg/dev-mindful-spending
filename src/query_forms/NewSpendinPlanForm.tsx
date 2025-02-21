"use client"
import {useQuery,useIsFetching} from "@tanstack/react-query";
import React,{useState} from 'react';
import {useRouter} from 'next/navigation';
import {useSession} from 'next-auth/react'
import {ToastContainer ,toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
//import CategoriesQuery from "@/components/CategoriesQuery";
import {useCategoriesPromise} from '@/query_components/RQCategoriesProvider';

export type CategorySel = {
  _id:string;
  title?:string
 }

export type MyCategoriesMyCategorySel ={
  mycategoryId: string;
  isChecked:boolean;
  planamount:string;
  categorynotes?:string;
  explain?:string;
}
export type MyCategory ={
  mycategoryId: string;
  isChecked:boolean;
  planamount:string;
  categorynotes?:string;
  explain?:string;
}
export type MyCategoryArray={
  mycategories:MyCategory[]
}
export type CategoryArray={
  categories:Category[]
}
type SelectedCatsType = {
 mycategoryId: string;
  mycategoryTitle: string; // you can specify enum also
 }
//this client page is used to edit planned spending amounts, add or remove categories, 
//show my categories with checkbox- user can uncheck category and amt 0. unless there is a previous amount stored in mongodb
//assign checked categories to user
//this will be the dropdown list in add-transaction unless user wants to add more- then click (popup category list? to add?)
//categories with an amount > 0 or previously checked will be checked on load. These will be retrieved for the transaction-titles-totals
//need section - available categories not in spending plan (could be via sort)
{/*export default function MySpendingPlan() {*/}
//export default function CreateSpendingPlan({categories}:{categories:any}) {
  export default function CreateSpendingPlan() {
    const categoriesPromise = useCategoriesPromise();
    const { data:categories } = useQuery({
        queryKey:["categories"], 
        queryFn: () => categoriesPromise
        // ,{
        //     initialData: use(foodPromise),
        //     refetchOnMount: false,
        //     refetchOnWindowFocus: false,
        //     refetchOnReconnect: false,
        // }
        
    });
  const [planmonthyear,setPlanmonthyear]=useState(new Date())//month/year of plan
  //first have a list of available categories to check or uncheck:
  //const [categories,setCategories]=useState<Category[]>([])//an array of categories
  //const[selectedcats,setSelectedcats]=useState<SelectedCatsType|null>(null)//an object with mycategoryId,mycategoryTitle
  const[selectedcats,setSelectedcats]=useState<Array<SelectedCatsType>>([])//an object with mycategoryId,mycategoryTitleconsole.log('selectedcats',selectedcats);
  // //elements in each of mycategories a subset of spending plan:
  // const [selections,setSelections]=useState<MyCategory[]>([
  //   {
  //     mycategoryId: '',
  //     isChecked:true,
  //     planamount:'0.00',
  //     categorynotes:'',
  //     explain:'',
  //   }
  // ])//array of selected objects to add to mycategories
  const [mycategories,setMycategories]=useState<MyCategory[]>([])//array of mycategory objects
  //for each new category selected
  const [mycategoryId,setMycategoryId]= useState<string>("")//set the new selected const
 //const [categories,setCategories]=useState<Category[]>([])
  const[mycategoryTitle,setMycategoryTitle]= useState<string>("")
  const [isChecked, setIsChecked] = useState<boolean>(false);//set the selected mycategorId as checked true
  const [categorynotes,setCategorynotes]= useState("")//any notes re the category in this month's plan(such as subscriptions: netflix,ancestry,etc)
  const [planamount,setPlanamount]=useState("")//the amount allotted to the category for this month
  const [explain,setExplain]=useState("")//any explanation for the amount allotted category in this month's plan
  const {data:session,status} = useSession();
  const router= useRouter();

    if(status === 'loading'){
      return <p>Loading...</p>
  }
    if(status === 'unauthenticated'){
      return <p className="font-bold text-red-500">Access Denied</p>
  }
  
  const handleCategory = async (e: React.ChangeEvent<HTMLInputElement>) => {
    //e.preventDefault();- e.preventDefault() prevent the default checkbox behavior
    // checkboxes - set up category plan-get date and select from category list
    try{
      const target = e.currentTarget;
      const catid = target.id;
      const mycategoryTitle=target.name
      //console.log('catid',catid)
      if (e.target.checked) {
        console.log("box is checked. should be added.");
        setMycategoryId(catid)
        setMycategoryTitle(mycategoryTitle) //setup for next func?
        setIsChecked(!isChecked)
        const selectedcat = {mycategoryId,mycategoryTitle};
      //setMycategories(mycategories => [...mycategories, selections]);

        setSelectedcats([...selectedcats,selectedcat]);
        //selectedcats.push(catid,mycategoryTitle)//removing - may be superfluous
      console.log('selectedcats',selectedcats);//each should trigger the next func which now each overrides the previous and the first is empty
      }
      
    } catch(err){
      console.log(err)
    }
  }
    //add to plan:
    const handleCategories = async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      try {
        const newSelection = {
          mycategoryId:mycategoryId,
          categorynotes:categorynotes,
          explain:explain,
          isChecked:true,
          planamount:parseFloat(planamount).toFixed(2),
          //authorId:session?.user?._id,
        }
        console.log('newSelection',newSelection)
       
  setMycategories([
    ...mycategories,newSelection
  ]);
      } catch(error){
        console.log('page error',error)
      }
    }
    //CONVERT TO SERVER ACTION:
  //Button Create Spending Plan(form submit)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
   // const finalCategories = mycategories;
   console.log('mycategories at handlSubmitSp',mycategories)//same (keep this for edits) has all but first is empty default  values

    try{
      //bring this in from react-query
      const res = await fetch('/api/spendingplan',{
      headers:{
            "Content-type":"application/json",
            "Authorization":`Bearer` 
            //${session?.user?.accessToken}`
          },
      method:'POST',
      body:JSON.stringify({
        authorId:session?.user?._id,
        planmonthyear:new Date(planmonthyear),
        mycategories:mycategories
        // mycategories:[
        //   { 
        //   mycategoryId:new mongoose.Types.ObjectId(mycategoryId),
        //   categorynotes:categorynotes,
        //   explain:explain,
        //   isChecked:true,
        //   planamount:parseFloat(planamount).toFixed(2)
        //   }
        // ]
      })
  }
  )
    if(!res.ok){
            throw new Error("Error on spending plan or auth")
    }
    const spendingplan = await res.json();
    //console.log('spendingplan ln218',spendingplan)
        //router.push(`/spending-plan/${spendingplan?._id}`)
        //router.refresh();
        toast.success("Spending plan success!");
        router.push('/dashboard');
    }catch (error) {
      console.log('not working',error)
      toast.error("Handle Submit did't go through");
      return
    }
}
    return(
        <>
        {/* <pre>{JSON.stringify(categories,null,2)}</pre> */}
        <h1>Categories</h1>
        {/*<SpendingplanListSimple />
        <SpendingplanListSimple fyear={dbfilteryear} fmonth={dbfiltermonth} category={filtercategory} />*/}
          
        <div className="flex flex-col self-center place-items-center border-l-orange-100">
        <h2 className="mb-8 text-lg font-bold text-center">Check the box to select categories and fill in your spending plan</h2>
     <div  className="flex flex-row">
        
      <div  className="flex flex-col px-5">
        <form onSubmit={handleSubmit} className="flex flex-col flex-wrap gap-5 my-3">
             <DatePicker
                className="ml-0 border-none focus:border-none focus:outline-none outline-none"
                dateFormat="MMMM yyyy"
                showMonthYearPicker 
                selected={planmonthyear} 
                onChange={(date) => date && setPlanmonthyear(date)}
                />
     <div  className="flex flex-row  min-w-fit w-full">
        <div className="flex flex-col w-1/2">
        {(categories?.slice(1).map((category:Category) =>
        <div key={category._id} className="catlist flex flex-col m-0 py-0 px-2 items-end">     
        <label htmlFor={category._id} className="m-0 py-0 px-2 align-items-center flex text-sm text-right md:text-base">{category.title}
        <input 
        className="m-0 py-0 px-2 w-fit align-items-right ml-2 text-sm"
        placeholder="Select Category"
        type="checkbox"
        name={category.title}
        //value={category._id}
        id={category._id}
        onChange={handleCategory}
        />
        </label>
        </div>
        ))}
        {/* // ): "Can't find any categories"} */}
        
        </div>

          <div className="flex flex-col w-1/2 text-sm md:text-base px-2 border-l-2 ml-3 border-blue-500">
          {selectedcats?.length > 0 ? (selectedcats.map((mycat,index) => 
            
              <div key={index} className="mycategoryArr flex flex-col m-0 p-0">{/*Cat:{mycat}Index:{index}*/}
                <input 
                onChange={(e) => [...[mycategories],setMycategoryId(e.target.value)]}
                value={mycat.mycategoryTitle}
                id={mycat.mycategoryId}
                className="px-2 py-2 m-0 border border-green-200 max-w-2xl text-charcoal-500 md:w-[90%]"
                name={mycat.mycategoryTitle}
                placeholder="my category"
                type="text"
                />
              {/*<h2>{mycategoryId}-{mycat.mycategoryId}</h2>*/}
                <input onChange={(e) => [...[mycategories],setCategorynotes((e.target as HTMLInputElement).value)]}
                className="px-4 py-2 m-0 border border-green-200 text-charcoal-500 md:w-[95%]"
                name="category-notes"
                placeholder="Category Notes (for ex Mortgage: could be Chase"
                type="text"
                />
                {/*<h2>{categorynotes}</h2>*/}
                <input onChange={(e) => setPlanamount((e.target as HTMLInputElement).value)}
                className="px-4 py-2 m-0 border border-green-200 text-charcoal-500 md:w-[95%]"
                name="planned-amt"
                placeholder="0.00"
                //selected={planamount}
                type="string"
                />
                <input onChange={(e) => [...[mycategories],setExplain((e.target as HTMLInputElement).value)]}
                className="px-4 py-2 m-0 border border-green-200 text-charcoal-500 md:w-[95%]"
                name="explain"
                placeholder="Explain Difference"
                type="text"
                />
                {/*<h2>{planamount}</h2>
                on click should set - everything in my
                */}
                <button className="font-bold text-white bg-blue-600 x-4 py-2 rounded-lg hover:opacity-80" onClick={handleCategories}>Add to plan</button>
                <hr className="my-4 border-2 border-blue-400" />
                </div>
                ) ): "Select a checkbox and get started with categories"}
                
              </div>
              
              </div>
              <button className="w-fit bg-blue-400 rounded-md p-3 text-white font-semibold ml-0" type="submit">Create Spending Plan</button>
              
          </form>
        </div>
        </div>
</div>
    
       <ToastContainer />  
        
        </> )
}
//export default CreateSpendingPlan
