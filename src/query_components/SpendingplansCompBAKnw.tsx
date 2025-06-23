"use client"

import {useSpendingplanCreate, useDeleteSpendingplan } from "@/query_services/mutations";
import { useCategories, useTransactions,useSpendingplans,useSpendingplansAggr } from "@/query_services/queries";
import {useIsFetching}from "@tanstack/react-query"
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import mongoose from "mongoose";
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
    //const[initialCategory,setInitialCategory]=useState<string>("Choose")
    const {fyear,fmonth,fcategory} = usePropsContext();
    const router = useRouter();
    const createSpendingplanMutation = useSpendingplanCreate();
    const categoriesManyQuery = useCategories();
    
    //const transactionsData = useTransactions();
    // const spendingplansData = useSpendingplansAggr();
    const spendingplansData = useSpendingplans();
    
    // console.log('initialCategory',initialCategory)
    // console.log('spendingplansData',spendingplansData.data)
    const fetchingdata = useIsFetching();
    console.log('fethc data', fetchingdata)
    {fetchingdata > 0 && <h1>Waiting for your data ...</h1>}
     
  //  const createTransactionMutation = useTransactionsCreate();
    const deleteSpendingplannMutation = useDeleteSpendingplan()
   
    const handleCreateSpendingplanSubmit:SubmitHandler<SpendingplanType> = (data) => {
        createSpendingplanMutation.mutate(data),{onSuccess:() => {
          reset({}),
          unregister()
        }}}
    
    const inList = spendingplansData?.data?.map((exists) => 
                  new Date(` ${exists?.planyear}-${exists?.planmonth}-01`)
                 );
    const initialVals = { 
            planmonthyear:undefined,
            mycategoryId:undefined,
            explain:"",
            categorynotes:"",
            planamount:"" }
    //const handleDelete = (id:any) => deleteSpendingplannMutation.mutate(id)
    const {
            register,
            unregister,
            getFieldState,
            handleSubmit,
            reset,
            control,
            setValue,
            formState:{errors,isSubmitting},
            //handleSubmitcontrol,
            watch} = useForm<SpendingplanType>( {
              shouldUnregister: true,
              mode:"onChange",
              //defaultValues:"",
                      //planmonthyear: new Date()
                })
                //console.log('inLIst',inList)  
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
  //My Spending Plans
 if (spendingplansData.isPending) {
  return 'One minute - getting your Spending Plans...'
}
      return (
        <>
        <h2 className="text-2xl font-bold">View/Edit an Existing Spending Plan</h2>
              
                  {/* {JSON.stringify(spendingplansDataNew?.data,null,2)} */}
                 {spendingplansData && spendingplansData?.data?.map((spendingplansel:SpendingplanTypeAll,index:number) => (
                <div className="flex flex-row justify-around items-center">
                <div className="self-center" key={spendingplansel.id}>
                {spendingplansel.planmonth}/{spendingplansel.planyear}/
                      {/* <pre>{JSON.stringify(spendingplansDataNew.data,null,2)}</pre> */}
                </div>
                <button key={`edit_${spendingplansel.id}`} className="yellowbg colsm" onClick={() => router.push(`/spendingplans-page/${spendingplansel?.id}`)}>
                      <div className="sr-only hidden first:md:not-sr-only  md:flex">Edit</div><BsFillPencilFill />
                </button>
                {/* <button onClick={() =>router.push(`/spendingplans-page/${spendingplansel.id}`) }>Select this plan</button> */}
                </div>
                ))}
    <div className="flex flex-col w-full place-items-center">
      <h2 className="text-2xl font-bold">Create a New Spending Plan</h2>
      
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
                                dateFormat="MMMM yyyy"
                                showMonthYearPicker
                                selected={value}
                                dropdownMode="select"
                                excludeDates={inList}
                                onBlur={onBlur} // notify when input is touched/blur
                              />
                            )}
                          /></div>
                          {/* <p>{getFieldState("planmonthyear").isTouched && "touched"}</p> */}
  {getFieldState("planmonthyear").isDirty && 
   <>                
      <ul className="flex flex-col border-none p-0 m-0">
        {fields.map((field, index:number) => (
          <li key={field.id} className="flex flex-col">
            <label className="">Select a Category from dropdown:</label>
                <select 
                 defaultValue="Choose"
              //   {...register("categoryId",{required:"Please select a category"})}
             {...register(`mycategories.${index}.mycategoryId`,{required:"Select a category from the dropdown"}
             )}
            >
                {categoriesManyQuery?.data?.slice(1).map((category:Category,index:number) =>
                <>
                  <option 
                  key ={category._id} 
                  //</>defaultValue="{category._id}">{category.title}
                  defaultValue="Choose"
                  value={category._id}>{category.title}
                  </option>
                </> )
                }
            </select>
            <label>Planned Amount:</label>
            <input 
                id={`mycategories.${index}.planamount`}
                placeholder="0.00"
                {...register(`mycategories.${index}.planamount`,{required:"Missing the planned amount"})}
                aria-invalid={errors.id ? "true" : "false"}
            //     {errors.mycategories.planamount && errors.name.type === "required" && <span>This is required</span>}
            //  {errors.name && errors.name.type === "maxLength" && <span>Max length exceeded</span> }
            />
            {/* <div className="errors.message"></div> */}
              <label>Enter any Category Notes, i.e. for Rent could be "Chase mortgage"</label> 
              <input {...register(`mycategories.${index}.categorynotes`)} 
              placeholder="Add Category Notes"
              />
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
             <button type="button" onClick={ () => 
                    console.log('index',index)}>Console this category</button>
            <button type="button" onClick={() => remove(index)}>Remove this category</button>
          </li>
        ))}
      </ul>
      <button
        className="bluebgborder p-0 m-0"
        type="button"
        onClick={() => append({ 
            mycategoryId:"",
            isChecked:false,
            explain:"",
            categorynotes:"",
            planamount:"" })}
      ><span>{fields.length > 0  ? "Add another Category" : "Add a Category"}</span></button>
     
      <span>Length:{mycategories.length}</span>
      <input type="submit" disabled={isSubmitting} />
      </> }
    </form>
        {/* <h2>Spendingplans status: {spendingplansData.fetchStatus}</h2>
        <h2>spendingplans status: {spendingplansData.status}</h2> */}
        {/* <h2>spendingplansData: {JSON.stringify(spendingplansData.data,null,2)}</h2> */}
        {/* <h2>spendingplansData parsed: {JSON.stringify(spendingplansData)}</h2> */}
          {/* <div key="spendingplans1" className="spreadsheetContNew"> */}
            {/* <div key="spendingplans2" className="flex flex-col spreadsheetCont place-items-center"> */}

        </div>
        <div className="outerDiv">
              <h2 className="text-2xl font-bold">My Spending Plans</h2>
            {spendingplansData ? (spendingplansData.data?.map((spendingplan:SpendingplanTypeAll)=>
               <div key={spendingplan?.id} className="flex flex-col">
                  <div key={spendingplan?.planmonth + "_" +spendingplan?.planyear} className="my-4 font-bold text-lg flex flex-row place-items-center justify-around">
                    <span>spendingplan Month: {spendingplan?.planmonth}/{spendingplan?.planyear}</span>
                    <span key="edit_delete" className="flex flex-row justify-between align-middle">
                      <button key="edit" className="yellowbg colsm" onClick={() => router.push(`/spendingplans-page/${spendingplan?.id}`)}>
                          <div className="sr-only hidden first:md:not-sr-only md:flex">Edit</div><BsFillPencilFill />
                                </button>
                      {/* <button key="delete" className="redbg colsm" onClick={(id:any) => deleteSpendingplannMutation.mutate(spendingplan.id)}>
                            <div className="sr-only hidden md:not-sr-only md:flex">Delete</div><AiFillDelete />
                      </button> */}
                      </span>
          </div>
            <div key={spendingplan?.id} className="key spreadsheetCont w-auto *:min-w-full overflow-scroll">
              {spendingplan.mycategories.map((plancategory:MyCategoriesTypeAll)=>(
                      <div className="horizGrid grid-cols-6 w-full" key={plancategory?.mycategoryId}>
                        <div key="1" className="col-span-2">{plancategory?.title}</div>
                        <div key="2" className="">{plancategory?.planamount.$numberDecimal}</div>
                        <div key="3" className="col-span-2">{plancategory?.categorynotes}</div>
                        {/* <div key="4" className="">{plancategory?.isChecked === true ? "true" : "false"}</div> */}
                        <div key="5" className="">{plancategory?.explain}</div>
                      </div>
                    ))}
                  </div>
                 </div>
          )):"no plans available" }
         </div>
       
      </> )
  //}
}