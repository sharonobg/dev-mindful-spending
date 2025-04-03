"use client"

import {useSpendingplanCreate, useDeleteSpendingplan } from "@/query_services/mutations";
import { useCategories, useTransactions,useSpendingplans,useSpendingplansAggr } from "@/query_services/queries";
import {useIsFetching}from "@tanstack/react-query"
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { Controller, SubmitHandler, useFieldArray, useForm,useFormState } from "react-hook-form";
import { AiFillDelete } from "react-icons/ai";
import { BsFillPencilFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { usePropsContext } from "./PropsProvider";
import { useState } from "react";


export default function SpendingPlansClientPg(){
    const[selectedcats,setSelectedcats]=useState<Array<string>>([])//a string of categoryIds
    const {fyear,fmonth,fcategory} = usePropsContext();
    const router = useRouter();
    const createSpendingplanMutation = useSpendingplanCreate();
    const categoriesManyQuery = useCategories();
    //const transactionsData = useTransactions();
    const spendingplansData = useSpendingplansAggr();
    console.log('spendingplansData',spendingplansData.data)
    const fetchingdata = useIsFetching();
    {fetchingdata > 0 && <h1>Waiting for your data ...</h1>}
     
  //  const createTransactionMutation = useTransactionsCreate();
    const deleteSpendingplannMutation = useDeleteSpendingplan()
   
    const handleCreateSpendingplanSubmit:SubmitHandler<SpendingplanType> = (data) => {
        createSpendingplanMutation.mutate(data)
       }
    const monthyrdate = new Date();
    const monthyr = monthyrdate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
    const handleDelete = (id:any) => deleteSpendingplannMutation.mutate(id)
    const {
            register,
            getFieldState,
            handleSubmit,
            control,
            setValue,
            formState:{errors,isSubmitting},
            //handleSubmitcontrol,
            watch} = useForm<SpendingplanType>( {
              mode:"onChange",
                    defaultValues:{
                      //planmonthyear: new Date()
                     }
                })
             

 //const fieldState = getFieldState("planmonthyear")
//  function Child({ control }:any) {
//     const { dirtyFields } = useFormState({ control })
                  
//     return dirtyFields.firstName ? <p>Field is dirty.</p> : null
// }
// handleSubmit(data => console.log('testform',data))
const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormProvider)
    name: "mycategories", // unique name for your Field Array
});
const {
    fields: mycategories,
    append: appendcategory,
    remove: removecategory
  } = useFieldArray({ control, name: "mycategories" });
//  handleCreateSpendingplanSubmit
  console.log(watch())
      return (
        <>
      <div className="flex flex-col bg-white w-full">
      <h1 className="font-bold">Create Your Spending Plan</h1>

    <form className="flex flex-col place-items-center" id="testform" onSubmit={handleSubmit(handleCreateSpendingplanSubmit)}>
          <label>Choose a Month:</label>
                <div className="datepickDiv">
                    <Controller
                              name="planmonthyear"
                              control={control}
                            render={
                              (
                              { field: 
                                { onChange, onBlur, value, ref } 
                              }) => (
                              <DatePicker
                              //showMonthDropdown
                              placeholderText="Click to Select a Date"
                              // placeholderText={transaction?.transdate.toString()}
                                className="border border-blue-600"
                                onChange={onChange} // send value to hook form
                                //dateFormat="MMMM yyyy"
                                showMonthYearPicker
                                selected={value}
                                dropdownMode="select"
                                onBlur={onBlur} // notify when input is touched/blur
                              />
                            )}
                          /></div>
                         
                          {/* <p>{getFieldState("planmonthyear").isTouched && "touched"}</p> */}
  {getFieldState("planmonthyear").isDirty && 
   <>                
      <ul className="flex flex-col border-none p-0 m-0">
        {fields.map((mycategory:MyCategory, index:number) => (
          <li key={mycategory.mycategoryId} className="flex flex-col">
            <label className="">Select a Category from dropdown:</label>
                <select
              //   {...register("categoryId",{required:"Please select a category"})}
             {...register(`mycategories.${index}.mycategoryId`,{required:"Select a category from the dropdown"})}>
                
                {categoriesManyQuery.data?.map((category:Category,index:number) =>
                <>
                  <option 
                  key ={category._id} 
                  value={category._id} 
                  defaultValue={category._id}>{category.title}
                  </option>
                </> ) }
            </select>
            <label>Planned Amount:</label>
            <input 
                id={`mycategories.${index}.planamount`}
                placeholder="Planned amount"
                {...register(`mycategories.${index}.planamount`,{required:"Missing the planned amount"})}
                aria-invalid={errors.id ? "true" : "false"}
            //     {errors.mycategories.planamount && errors.name.type === "required" && <span>This is required</span>}
            //  {errors.name && errors.name.type === "maxLength" && <span>Max length exceeded</span> }
            />
             
            <div className="errors.message"></div>
             <label>Enter any Category Notes, i.e. for Rent could be "Chase mortgage"</label> 
            <input {...register(`mycategories.${index}.categorynotes`)} />
            {/* <Controller
              render={({ field }) => <input {...field} />}
              name={`mycategories.${index}.categorynotes`}
              control={control}
            /> */}
             <label>Explain why/if this is different this month</label>
                 <input 
                 
                    placeholder="Explain any difference"
                    {...register(`mycategories.${index}.explain`,{
                        minLength:{
                            value:4,
                            message:"A minimum of 4 characters required"
                        }
                    })}
                    />
          {/* <label>Choose date</label>
                    <Controller
                      control={control}
                      name="planmonthyear"
                      render={({ field: { onChange, onBlur, value, ref } }) => (
                         <DatePicker
                            placeholderText="Click to Select a Date"
                            className="border border-blue-600"
                            onChange={onChange} // send value to hook form
                            onBlur={onBlur} // notify when input is touched/blur
                            selected={value}
                          />
                      )}
                      /> */}
           
            <button type="button" onClick={() => remove(index)}>Delete</button>
          </li>
        ))}
      </ul>
      
      <button
        className="bluebgborder p-0 m-0"
        type="button"
        onClick={() => append({ 
            mycategoryId:'67918ac304905ddfc5d860f6',
            isChecked:true,
            explain:"explain difference",
            categorynotes:"add category notes",
            planamount:0.00 })}
      ><span>{fields.length > 0  ? "Add another Category" : "Add a Category"}</span></button>
      <span>Length:{mycategories.length}</span>
      <input type="submit" />
      </> }
    </form>

        
        {/* <h2>Spendingplans status: {spendingplansData.fetchStatus}</h2>
        <h2>spendingplans status: {spendingplansData.status}</h2> */}
       
        {/* <h2>spendingplansData: {JSON.stringify(spendingplansData.data,null,2)}</h2> */}
        {/* <h2>spendingplansData parsed: {JSON.stringify(spendingplansData)}</h2> */}
        
          <div key="spendingplans1" className="spreadsheetContNew">
            <div key="spendingplans2" className="spreadsheetCont place-items-center">
              <h2 className="text-3xl font-bold">My Spending Plans</h2>
            {spendingplansData ? (spendingplansData.data?.map((spendingplan:SpendingplanTypeAll)=>
               <div key={spendingplan?.id} className="flex flex-col w-3/4">
                  <div key={spendingplan?.planmonth + "_" +spendingplan?.planyear} className="my-4 font-bold text-lg flex flex-row place-items-center justify-around">
                    <span>spendingplan Month: {spendingplan?.planmonth}/{spendingplan?.planyear}</span>
                    <span key="edit_delete" className="flex flex-row">
                      <button key="edit" className="yellowbg colsm" onClick={() => router.push(`/spendingplans-page/${spendingplan?.id}`)}>
                          <div className="sr-only hidden first:md:not-sr-only  md:flex">Edit</div><BsFillPencilFill />
                                </button>
                      <button key="delete" className="redbg colsm" onClick={(id:any) => deleteSpendingplannMutation.mutate(spendingplan.id)}>
                            <div className="sr-only hidden md:not-sr-only md:flex">Delete</div><AiFillDelete />
                      </button>
                      </span>
                      </div>
                    <div key={spendingplan?.id} className="key categoriesRow place-items-center w-full">
                    {spendingplan.mycategories.map((plancategory:MyCategoriesTypeAll)=>(
                      <div className="grid layout-grid grid-flow-row col-5 w-full" key={plancategory?.mycategoryId}>
                        <div key="1" className="">{plancategory?.title}</div>
                        <div key="2" className="">{plancategory?.planamount.$numberDecimal}</div>
                        <div key="3" className="col2">{plancategory?.categorynotes}</div>
                        <div key="4" className="">{plancategory?.isChecked === true ? "true" : "false"}</div>
                        <div key="5" className="">{plancategory?.explain}</div>
                      </div>
                    ))}
                  </div>
                </div>
          )):"no plans available" }

         </div>
        </div>
        
    
      </div>
      </> )
  //}
}