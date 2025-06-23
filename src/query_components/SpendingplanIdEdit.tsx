"use client"

import { useTransactionsCreate, useUpdateTransactionMutation,useUpdateSpendingplanMutation, useDeleteSpendingplan } from "@/query_services/mutations";
import { useCategories, useSpendingplanByIdRet, useSpendingplansAggr } from "@/query_services/queries";
import { getTransactions, getTransactionsById,getSpendingplanById, getSpendingplanByIdsim, getSpendingplansById, getSpendingplanByIdRet,getCategories } from "@/query_services/services";
import {useIsFetching, useQueries, useQuery, useSuspenseQuery,QueryClient}from "@tanstack/react-query"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {z} from 'zod';
import { Controller, SubmitHandler, useFieldArray, useForm,useFormState } from "react-hook-form";
import { usePropsContext } from "./PropsProvider";
import { useEffect, useState } from "react";
// import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { BsFillPencilFill } from "react-icons/bs";
import { AiFillDelete } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";


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

const numberDecimalSchema = z.number();
const myCategories = z.object({
  mycategoryId:z.string(),
  title:z.string(),
  isChecked:z.boolean(),
  categorynotes:z.string(),
  explain:z.string(),
  //planamount:z.string()
  planamount:z.any()
})
export const spendingplanSchema=z.object({
  id:z.string(),
  planmonthyear:z.date(),
  mycategories:z.array(myCategories)
})

export type SpendingplanFormSchema = z.infer<typeof spendingplanSchema>;

const EditSpendingplanById = ({ params, }: { params:{id: string }}
) => {
  const queryClient = new QueryClient()
  // look ma, no await
  queryClient.prefetchQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })
  
  const id = params.id;
  const _id = params.id;
  const router = useRouter();
  console.log('params_id',_id)
  console.log('params id',id)
  const spendingplansDataById = useSpendingplanByIdRet(id);
    const howManyFetching = useIsFetching();
    const deleteSpendingplannMutation = useDeleteSpendingplan()
  // type ThisTransaction = z.infer<typeof transactionFormAggrSchema>

   
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
      queryFn: () => getSpendingplansById(id),
      retry: 5,
      enabled: !!id,
      //enabled: id !== undefined,
      // refetch every second
      refetchInterval: 30000
  }) 
 
//  console.log('this plan Idim',spendingplan)
//  console.log('this plan id',`${spendingplan?._id}`)
    // const transactionsData = useTransactions();
    const isFetching = useIsFetching();
    const updateSpendingplanMutation = useUpdateSpendingplanMutation();
    // const spendingplansData = useSpendingplans();
    // console.log('spendingplansData', spendingplansData.data)
    
    const handleUpdateSpendingplanSubmit = (data:SpendingplanType | undefined) => {
     if(data){ updateSpendingplanMutation.mutate({
      _id: _id,
      planmonthyear:data.planmonthyear,
      mycategories:data.mycategories
    });
    console.log('data',data)
  }};
  const spendingplansData = useSpendingplansAggr();
  const categoriesManyQuery = useCategories();
  //const prefetchCategories = usePrefetchCategories();
  const spendingplannew = spendingplan && spendingplan;
  // console.log('spendingplannew',spendingplannew)
    const thisDay = new Date().getDay();//this is default
    const thisMonth = new Date().getMonth()+1;//this is default
    const thisYear = new Date().getFullYear();
  //  const defaultValues:SpendingplanFormSchema = {
  //     planmonthyear: spendingplan && spendingplan?.planmonthyear ? spendingplan?.planmonthyear : new Date(),
  //     mycategories: spendingplan?.mycategories &&  m {
  //       mycategoryId: spe;
  //       title: string;
  //       isChecked: boolean;
  //       categorynotes: string;
  //       explain: string;
  //       planamount: number;
  //   }[]}
       
        //const handleDelete = (id:any) => deleteSpendingplannMutation.mutate(id)
        const {
                reset,
                register,
                unregister,
                getValues,
                getFieldState,
                handleSubmit,
                control,
                setValue,
                formState:{errors,isSubmitting},
                //handleSubmitcontrol,
                watch
              } = useForm<SpendingplanType>( 
                  { mode:'all',
                    //resolver: zodResolver(spendingplanSchema),
                    defaultValues:{
                      //_id: _id,
                      planmonthyear:spendingplan && spendingplan?.planmonthyear,
                      mycategories:spendingplan && spendingplan?.mycategories
                    },
                      shouldUnregister: true,
                  })
                  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
                      control, // control props comes from useForm (optional: if you are using FormProvider)
                      name: 'mycategories', // unique name for your Field Array
                      keyName:'mycategoriesId'
                  });
    const inList = spendingplansData?.data?.map((exists) => 
      new Date(` ${exists?.planyear}-${exists?.planmonth}-01`)
     );
     const onSubmit = (data:SpendingplanFormSchema) => console.log("edited data", data)
     const watchMyCategoriesArray = watch("mycategories");
    //  const controlledFields = fields.map((field, index) => {
    //   return {
    //     ...field,
    //     ...watchMyCategoriesArray[index]
    //     };
    //   });
    // console.log('inLIst',inList) 
    useEffect(() => {
      if(spendingplan){
        reset(spendingplan)
      }
    },[reset,spendingplan])


    if(spendingplan) {
    return (
        <div key={spendingplan._id} className="flex flex-col place-items-center">
          <h2>{JSON.stringify(spendingplan,null,2)}</h2>
             <h2 className="text-2xl font-bold">Edit this Spending Plan</h2>
               
   <form className="flex flex-col place-items-center" id="editform" onSubmit={handleSubmit(handleUpdateSpendingplanSubmit)}>
    <label>Choose a Month:</label>
      <div className="datepickDiv" key={`date_${spendingplan?._id}`}>
        <Controller
          name="planmonthyear"
          control={control}
          render={
          ({ field: { onChange, onBlur, value, ref } 
          }) => (
          <DatePicker
            //showMonthDropdown
            placeholderText="Click to Select a Date"
            // placeholderText={transaction?.transdate.toString()}
            className="border border-blue-600"
            onChange={onChange} // send value to hook form
            dateFormat="MMMM yyyy"
            showMonthYearPicker
            selected={spendingplan?.planmonthyear}
            dropdownMode="select"
            excludeDates={inList}
            onBlur={onBlur} // notify when input is touched/blur
            />
          )}
          />
        </div>
    {/* <button
                 className="bluebgborder p-0 m-0"
                 type="button"
                 onClick={() => append(
                  { 
                     mycategoryId:'67918ac304905ddfc5d860f6',
                     isChecked:true,
                     explain:"explain difference",
                     categorynotes:"add category notes",
                     planamount:'0.00',
                     title:'' 
                    }
                    )}
               ><span>Add a Category</span></button> */}
      <ul className="flex flex-col border-none p-0 m-0">
        {/* {fields.map((plancategory:MyCategory, index:number) => ( */}
         {/* {fields.map((field,index:number) => ( */}
         {fields.map((field,index:number) => (

          <>
            <li key={field.mycategoriesId} className="flex flex-col">
            <label className="">Category new:</label>
            <select
            // key={`mycategories.${index}.mycategoryId`}
              defaultValue={`mycategories.${index}.mycategoryId`}
             
              {...register(`mycategories.${index}.mycategoryId` as const,{required:"Select a category from the dropdown"})} >
                
              {categoriesManyQuery.data?.slice(1).map((category:Category,index:number) =>
                <>
                <option 
                // key={`mycategories.${index}.mycategoryId`}
                  key={`field.mycategoriesId.${index}.mycategoryId`} 
                  defaultValue={`mycategories.${index}.mycategoryId`}
                  value={category?._id} selected>{category.title}
                </option>
                </> )}
            </select>
            <p>{errors.mycategories ? errors.mycategories[index]?.mycategoryId?.message : null}</p>
            {/* <label>Planned Amount:{parseFloat(`mycategories.${index}.planamount`).toFixed(2)}</label> */}
            <label>Planned Amount:{ `mycategories.${index}.planamount`}</label>
            <input 
              //defaultValue={`mycategories.${index}.planamount`}
              //id={field.planamount}
              placeholder="0.00"
              {...register(`mycategories.${index}.planamount.$numberDecimal` as const,{required:"Missing the planned amount"})}
              aria-invalid={errors.id ? "true" : "false"}
               //     {errors.mycategories.planamount && errors.name.type === "required" && <span>This is required</span>}
                     //  {errors.name && errors.name.type === "maxLength" && <span>Max length exceeded</span> }
               />
               {/* <p>{errors.mycategories ? errors.mycategories[index]?.planamount?.message : null}</p> */}
               <label>{`mycategories.${index}.categorynotes`}Enter any Category Notes, i.e. for Rent could be "Chase mortgage"</label> 
                  {/* <input 
                    defaultValue={plancategory?.categorynotes}
                    // {...register(`mycategories.${index}.categorynotes` as const)} 
                  /> */}
                  {/* <p className="text-">ERROR{errors.mycategories ? errors.mycategories[index]?.categorynotes?.message : null}</p> */}
                  {/* <Controller
                       render={({ field }) => <input {...field} />}
                       name={`mycategories.${index}.categorynotes`}
                       
                       control={control}
                     /> */}
                     <input 
                   defaultValue={`mycategories.${index}.categorynotes`}
                   placeholder="Category notes"
                  {...register(`mycategories.${index}.categorynotes` as const,{
                       minLength:{
                        value:4,
                        message:"A minimum of 4 characters required"
                    }
                  })}
                  />
                  <div key={`date_${field}`} className="error errors.message text-red-600">Error:{errors.mycategories ? errors.mycategories[index]?.categorynotes?.message : null}</div>

                 <label>{`mycategories.${index}.explain`}Explain why/if this is different this month</label>
                 <input 
                   defaultValue={`mycategories.${index}.explain`}
                   placeholder="Explain any difference"
                  {...register(`mycategories.${index}.explain` as const,{
                       minLength:{
                        value:4,
                        message:"A minimum of 4 characters required"
                    }
                  })}
                  />
           <div key={`date_${field}`} className="error errors.message text-red-600">{errors.mycategories ? errors.mycategories[index]?.explain?.message : null}</div>

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
                    console.log('index',(`mycategories.${index}`))}>Console what is unregistered</button>
                    <button type="button" onClick={ () => 
                    console.log('index',index)}>Console this category</button> 
                    <button type="button" onClick={ () => {
                    //unregister(`mycategories.${index}`);
                    remove(index)
                    }}>Remove this category
                    </button> 
                   </li>
                   </> ))}
               </ul>
               
               <button
                 className="bluebgborder p-0 m-0"
                 type="button"
                 onClick={(e) => {
                  //e.preventDefault();
                  append(
                  { 
                     mycategoryId:"",
            isChecked:false,
            explain:"",
            categorynotes:"",
            planamount:""
                     //title:'' 
                    }
                    )}}
               ><span>Add a Category</span></button>
               <input type="submit" disabled={isPending} />
             </form>
         <h2>Spending Plan Data: {JSON.stringify(spendingplan,null,2)}</h2>
         <h2>ID:
          {/* /{spendingplan && spendingplan.planmonthyear.getMonth()}/{spendingplan && spendingplan.planmonthyear.getFullYear()} */}
          </h2>  
        {/* <h2>Spending Plan Client Page:{spendingplansData && spendingplansData?.planmonth}/{spendingplansData && spendingplansData?.planyear}</h2> */}
        {/* <h2>transactions status: {transactionsData.fetchStatus}</h2>
        <h2>transaction status: {transactionsData.status}</h2>
        <h2>Global isFetching: {howManyFetching}</h2> */}
        <h1>Edit Spending Plan</h1>
        {isFetching > 0 && <span>Waiting for Spending Plan ...</span>}
        {isError && <span>Error: {error.message}</span>}
        {/* <h2>Current Spending Plan</h2> */}
        
        {/* <div className="flex flex-col w-3/4">
             <div className="my-4 font-bold text-lg">
             key={`header_${spendingplan?._id}`}
                <div className="categoriesRow place-items-center w-full">
                    <div>{spendingplan && spendingplan?._id}
                    </div>
                    {spendingplan && spendingplan?.mycategories?.map((plancategory:MyCategoriesTypeAll)=>(
                      <div className="grid layout-grid grid-flow-row col-5 w-full" key={plancategory?.mycategoryId}>
                        <div className="">Checked?:{plancategory?.title}</div>
                        <div className="">{plancategory?.planamount.$numberDecimal}</div>
                        <div className="col2">{plancategory?.categorynotes}</div>
                        <div className="">Checked?:{plancategory?.isChecked}</div>
                        <div className="">{plancategory?.explain}</div>
                      </div>
                    ))}
                  </div>
                </div>
        </div>  */}
        {/* <h2>from other form </h2>
         <div className="flex flex-col bg-white">
                 <h2>Global isFetching: {howManyFetching}</h2>
               
                  <div key="spendingplans1" className="spreadsheetContNew">
                    <div key="spendingplans2" className="spreadsheetCont place-items-center">
                      <h2>This Spending Plan</h2> */}
                    {/* {spendingplan ? (spendingplan?.map((spendingplan:SpendingplanTypeAll)=> */}
                      {/* <div key={spendingplan?._id} className="flex flex-col w-3/4">
                          
                            <div key={spendingplan?._id} className="key categoriesRow place-items-center w-full">
                            {spendingplan?.mycategories?.map((plancategory)=>(
                              <div className="grid layout-grid grid-flow-row col-5 w-full" key={plancategory?.mycategoryId}>
                     {/*<div key="1" className="">{plancategory?.title}</div>           {/*  */}
                                {/* <div key="2" className="">{plancategory?.planamount.$numberDecimal}</div>
                                <div key="3" className="col2">{plancategory?.categorynotes}</div>
                                <div key="4" className="">{plancategory?.isChecked}</div>
                                <div key="5" className="">{plancategory?.explain}</div>
                              </div>
                            ))}
                          </div>
                        </div> */}
        
                 {/* </div>
                </div> */}

        {/* </div> */}
       </div>

    )
}
}
export default EditSpendingplanById