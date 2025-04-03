"use client"

import { useTransactionsCreate, useUpdateTransactionMutation,useUpdateSpendingplanMutation, useDeleteSpendingplan } from "@/query_services/mutations";
import { useCategories, useTransactions,useSpendingplanById, useSpendingplans } from "@/query_services/queries";
import { getTransactions, getTransactionsById,getSpendingplanById, getSpendingplanByIdsim, getSpendingplansById } from "@/query_services/services";
import {useIsFetching, useQueries, useQuery, useSuspenseQuery}from "@tanstack/react-query"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {z} from 'zod';
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { BsFillPencilFill } from "react-icons/bs";
import { AiFillDelete } from "react-icons/ai";
import { useRouter } from "next/navigation";


// type MyCategoriesTypeAll={
//   mycategoryId:string,
//   isChecked:boolean,
//   explain:string,
//   categorynotes:string,
//   planamount:number,
//   title:string
// }
// type SpendingplanTypeAll={
//   _id:any,
//   id?:string,
//   planmonthyear:Date,
//   planmonth:number,
//   planyear:number,
//   mycategories:[MyCategoriesTypeAll],
// }

const spendingplanAggrSchema=z.object({
  id:z.string(),
  planmonthyear:z.date(),
  mycategories:z.object({
    mycategoryId:z.string(),
    title:z.string(),
    isChecked:z.boolean(),
    categorynotes:z.string(),
    explain:z.string(),
    planamount:z.coerce.number()
  })
})

export type SpendingplanFormSchema = z.infer<typeof spendingplanAggrSchema>;

const EditSpendingplanById = (
  { params,
    //values
  }: { params:{id: string }
  // ,values:TransactionFormSchema
}
) => {
  //const id = params.id;
  const router = useRouter();
  
  //const spendingplansData = useSpendingplans();
    const howManyFetching = useIsFetching();
    const deleteSpendingplannMutation = useDeleteSpendingplan()
  // type ThisTransaction = z.infer<typeof transactionFormAggrSchema>

    const id = params.id;
    //const spendingplanData = useSpendingplanById(id);
    //const _id = params.id;
    // const categoriesManyQuery = useCategories();
    //the following is from api/spendingplan/id - an aggregate
    const {
      isPending,
      isError,
      data:spendingplan,
      error
  } = useQuery({
      queryKey:['spendingplan',{id}],
      queryFn: () => getSpendingplanById(id),
      retry: 5,
      enabled: !!id,
      //enabled: id !== undefined,
      // refetch every second
      refetchInterval: 30000
  }) 
 console.log('this plan',spendingplan)
 console.log('this plan id',`${spendingplan?.id}`)
    // const transactionsData = useTransactions();
    const isFetching = useIsFetching();
    const updateSpendingplanMutation = useUpdateSpendingplanMutation();
    // const spendingplansData = useSpendingplans();
    // console.log('spendingplansData', spendingplansData.data)
    
    const handleUpdateSpendingplanSubmit = (data:SpendingplanTypeAll | undefined) => {
     if(data){ updateSpendingplanMutation.mutate({
      _id: {id},
      planmonthyear:data.planmonthyear,
      mycategories:data.mycategories
    })
  }};
  const spendingplannew = spendingplan && spendingplan;
  console.log('spendingplannew',spendingplannew)
    const thisDay = new Date().getDay();//this is default
    const thisMonth = new Date().getMonth()+1;//this is default
    const thisYear = new Date().getFullYear();

    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState:{errors},
        //handleSubmitcontrol,
        // formState: { isSubmitting },,
        watch
      } = useForm<SpendingplanTypeAll>({
          defaultValues: {
            id: spendingplan && spendingplan?.id,
            planmonthyear:spendingplan && spendingplan?.planmonthyear,
            planmonth: spendingplan && spendingplan?.planmonth,
            planyear: spendingplan && spendingplan?.planyear,
            mycategories:spendingplan && spendingplan?.mycategories
        }});
       
    // const watchCategory = watch("categoryId");
    // const watchTransactionCategory = watch("categoryId");
    // const watchTransactionTitle = watch("title");
    // const watchAcctype = watch("acctype");
    // const watchDate = watch("transdate");
    // if (categoriesManyQuery.status === 'pending') {
    //   return <span>Loading...</span>
    // }
  
    // if (categoriesManyQuery.status === 'error') {
    //   return <span>Error: {error?.message}</span>
    // }
    //if(isPending){return <span>Waiting for Transaction ...</span>}
  
    
    if(spendingplan) {
    return (
        <div className="flex flex-col place-items-center">
         
         <h2>Spending Plan Data: {JSON.stringify(spendingplan,null,2)}</h2>
         <h2>ID:{spendingplan && spendingplan?._id}/{spendingplan && spendingplan?.planmonth}/{spendingplan?.planyear}</h2>  
        {/* <h2>Spending Plan Client Page:{spendingplansData && spendingplansData?.planmonth}/{spendingplansData && spendingplansData?.planyear}</h2> */}
        {/* <h2>transactions status: {transactionsData.fetchStatus}</h2>
        <h2>transaction status: {transactionsData.status}</h2>
        <h2>Global isFetching: {howManyFetching}</h2> */}
        <h1>Edit Spending Plan</h1>
        {isFetching > 0 && <span>Waiting for Spending Plan ...</span>}
        {isError && <span>Error: {error.message}</span>}
        <h2>Current Spending Plan</h2>
        
        <div key={spendingplan?._id} className="flex flex-col w-3/4">
             <div className="my-4 font-bold text-lg">
             
               {/* <div>Plan Month: {planmonth}/{spendingplan?.planmonthyear.getFullYear}</div> */}
                <div className="categoriesRow place-items-center w-full">
                    <div>{spendingplan && spendingplan?.id}
                      {spendingplan && spendingplan?.planmonth}/{spendingplan?.planyear}
                    </div>
               

                  
                  
                    {spendingplan && spendingplan?.mycategories?.map((plancategory:MyCategoriesTypeAll)=>(
                      <div className="grid layout-grid grid-flow-row col-5 w-full" key={plancategory?.mycategoryId}>
                        <div className="">Checked?:{plancategory?.isChecked}</div>
                        <div className="">{plancategory?.title}</div>
                        <div className="">{plancategory?.planamount.$numberDecimal}</div>
                        <div className="col2">{plancategory?.categorynotes}</div>
                        <div className="">Checked?:{plancategory?.isChecked}</div>
                        <div className="">{plancategory?.explain}</div>
                      </div>
                    ))}
                  </div>
                </div>
        </div> 
        <h2>from other form </h2>
         <div className="flex flex-col bg-white">
                {/* <h2>Spendingplans status: {spendingplan.fetchStatus}</h2>
                <h2>spendingplans status: {spendingplanData.status}</h2> */}
                <h2>Global isFetching: {howManyFetching}</h2>
                {/* <h2>spendingplansData: {JSON.stringify(spendingplansData.data,null,2)}</h2> */}
               
                  <div key="spendingplans1" className="spreadsheetContNew">
                    <div key="spendingplans2" className="spreadsheetCont place-items-center">
                      <h2>This Spending Plan</h2>
                    {/* {spendingplan ? (spendingplan?.map((spendingplan:SpendingplanTypeAll)=> */}
                      <div key={spendingplan?.id} className="flex flex-col w-3/4">
                          {/* <div key={spendingplan?._id} className="my-4 font-bold text-lg flex flex-row place-items-center justify-around"> */}
                        
                            {/* <span key="edit_delete" className="flex flex-row">
                              <button key="edit" className="yellowbg colsm" onClick={() => router.push(`/spendingplans-page/${spendingplan?.id}`)}>
                                  <div className="sr-only hidden first:md:not-sr-only  md:flex">Edit</div><BsFillPencilFill />
                                        </button>
                              <button key="delete" className="redbg colsm" onClick={(id:any) => deleteSpendingplannMutation.mutate(spendingplan.id)}>
                                    <div className="sr-only hidden md:not-sr-only md:flex">Delete</div><AiFillDelete />
                              </button>
                              </span> */}
                              {/* </div> */}
                            <div key={spendingplan?.id} className="key categoriesRow place-items-center w-full">
                            {spendingplan?.mycategories?.map((plancategory)=>(
                              <div className="grid layout-grid grid-flow-row col-5 w-full" key={plancategory?.mycategoryId}>
                                <div key="1" className="">{plancategory?.title}</div>
                                <div key="2" className="">{plancategory?.planamount.$numberDecimal}</div>
                                <div key="3" className="col2">{plancategory?.categorynotes}</div>
                                <div key="4" className="">{plancategory?.isChecked}</div>
                                <div key="5" className="">{plancategory?.explain}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                  {/* )):"no plans available"  */}
        
                 </div>
                </div>

        </div>
       </div>

    )
}
}
export default EditSpendingplanById