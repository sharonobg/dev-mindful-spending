"use client"

import { useDeleteSpendingplan } from "@/query_services/mutations";
import { useCategories, useTransactions,useSpendingplans,useSpendingplansAggr } from "@/query_services/queries";
import {useIsFetching}from "@tanstack/react-query"
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { AiFillDelete } from "react-icons/ai";
import { BsFillPencilFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import SpendingplansCompTest from "./SpendingplansCompTest";


export default function SpendingPlansClientPg(){
  const router = useRouter();
    const categoriesManyQuery = useCategories();
//     if(categoriesManyQuery.isPending){
//      return <span>Waiting for Categories ...</span>
//  }
//  if(categoriesManyQuery.isError){
//      return <span>Sorry, Error Loading Categories</span>
//  }
    const transactionsData = useTransactions();
    const spendingplansData = useSpendingplansAggr();
    console.log('spendingplansData',spendingplansData.data)
    const howManyFetching = useIsFetching();
  //  const createTransactionMutation = useTransactionsCreate();
    const deleteSpendingplannMutation = useDeleteSpendingplan()
  //  const handleCreateTransactionSubmit:SubmitHandler<TransactionType> = (data) => {
  //   createTransactionMutation.mutate(data)
  //  }
    // const {
    //     register,
    //     handleSubmit,
    //     control,
    //     setValue,
    //     formState:{errors},
    //     //handleSubmitcontrol,
    //     // formState: { isSubmitting },,
    //     watch} = useForm<TransactionType>();
    // const watchCategory = watch("categoryId");
    // const watchAcctype = watch("acctype");
    const handleDelete = (id:any) => deleteSpendingplannMutation.mutate(id)
    if(spendingplansData) {
      return (
      <div className="flex flex-col bg-white">
        <h2>Spendingplans status: {spendingplansData.fetchStatus}</h2>
        <h2>spendingplans status: {spendingplansData.status}</h2>
        <h2>Global isFetching: {howManyFetching}</h2>
        {/* <h2>spendingplansData: {JSON.stringify(spendingplansData.data,null,2)}</h2> */}
        {/* <h2>spendingplansData parsed: {JSON.stringify(spendingplansData)}</h2> */}
       
     <SpendingplansCompTest />
        <h2>Create Spending Plan</h2>
          <div key="spendingplans1" className="spreadsheetContNew">
            <div key="spendingplans2" className="spreadsheetCont place-items-center">
              <h2>Spending Plans</h2>
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
    )
  }
}