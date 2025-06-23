"use client"

import { useDeleteTransactions,useTransactionsCreate, useUpdateTransactionMutation } from "@/query_services/mutations";
import { useCategories, useTransactions,useTransactionsAggrMonth } from "@/query_services/queries";
import {useIsFetching}from "@tanstack/react-query";
import {usePropsContext} from "@/query_components/PropsProvider";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { AiFillDelete } from "react-icons/ai";
import { BsFillPencilFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {useEffect} from 'react';


export default function TransactionsClientPg(){
  const {fyear,fmonth,fcategory} = usePropsContext();
  const router = useRouter();
  //get categories, get transactions
    const categoriesManyQuery = useCategories();
    console.log('categoriesManyQuery',categoriesManyQuery)
//     if(categoriesManyQuery.isPending){
//      return <span>Waiting for Categories ...</span>
//  }
//  if(categoriesManyQuery.isError){
//      return <span>Sorry, Error Loading Categories</span>
//  }
const transactionsAggrMonth = useTransactionsAggrMonth();
    const transactionsData = useTransactions();
    const howManyFetching = useIsFetching();
   const createTransactionMutation = useTransactionsCreate();
    const deleteTransactionMutation = useDeleteTransactions()
   const handleCreateTransactionSubmit:SubmitHandler<TransactionType> = (data) => {
    
    createTransactionMutation.mutate(data)
 
   }
    
  //  const handleDelete = () => {
  //   alert('will delete soon')
  //  }
  //  const handleDeleteA= async (e:React.FormEvent<HTMLFormElement>) => {
  //      e.preventDefault();
  //      try{
               
  //          const res = await fetch(`/api/transaction/${params.id}`,{
       
  //          headers: {
  //              "Content-Type": 'application/json',
  //              "Authorization": `Bearer ${session?.user?.accessToken}`
  //          },
  //          method: "DELETE",
  //          //body: JSON.stringify(body)
  //          //body:JSON.stringify(body)
           
  //      })
  //      //console.log('res after edit:',res)
  //      if(res.ok){
  //          toast.success("Delete went through")
  //          console.log("Delete went through")
  //      }else{
  //          toast.error("Edit failed")
  //          console.log("Edit failed")
  //      }
   
  //      //const transaction = await res.json();
  //      //console.log('transaction edit: ',transaction);
  //      router.push("/dashboard");
  //      }catch(error){
  //          console.log('delete error',error)
  //      }
  //  }
  //  const updateTransactionMutation = useUpdateTransactionMutation();
  //  const handleUpdateTransactionSubmit = (data:TransactionType | undefined) => {
  //   if(data){ updateTransactionMutation.mutate({...data, })}
  //  };
    const {
        register,
        reset,
        handleSubmit,
        control,
        setValue,
        formState:{isSubmitSuccessful,errors,
        isSubmitting,},
        //handleSubmitcontrol,
        // formState: { isSubmitting },,
        watch} = useForm<TransactionType>({
          shouldUnregister: true,
              mode:"onChange",
              defaultValues:{}
            }
          );
    // const watchCategory = watch("categoryId");
    // const watchAcctype = watch("acctype");
    useEffect(() => {
    if (isSubmitSuccessful) {
      reset()
    }
   }, [isSubmitSuccessful])
    const handleDelete = (id:any) => deleteTransactionMutation.mutate(id)
    //     if(categoriesManyQuery.isPending|| getT){
//      return <span>Waiting for Categories ...</span>
//  }
//if(howManyFetching > 0){return <span>Waiting ...</span>}

if (transactionsAggrMonth.isPending) {
  return 'One minute - getting your Transactions...'
}
    return (
      <>
      <div className="flex flex-col">
        <h2>Transactions Client Page</h2>
        <h2>transactionsAggrMonth status: {transactionsAggrMonth.fetchStatus}</h2>
        <h2>transactions status: {transactionsData.fetchStatus}</h2>
        <h2>transaction status: {transactionsData.status}</h2>
        <h2>Global isFetching: {howManyFetching}</h2>
        
        <h2>Create Transaction</h2>
        <h2>Context: {fmonth}/{fyear}/{fcategory}</h2>
        <form className="flex flex-col" onSubmit={
          handleSubmit(handleCreateTransactionSubmit)
          }>
            {/* <h2>categories:{JSON.stringify(categoriesManyQuery.data,null,2)}
              </h2> */}
              <label>Choose a Date:</label>
            <div className="datepickDiv">
                       
                      <Controller
                    control={control}
                    name="transdate"
                    
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                      <DatePicker
                      //showMonthDropdown
                      placeholderText="Click to Select a Date"
                        className="border border-blue-600"
                        onChange={onChange} // send value to hook form
                        // dropdownMode="select"
                        
                        onBlur={onBlur} // notify when input is touched/blur
                        selected={value}
                      />
                    )}
                  /></div>
                      {/* <p className="errorStyle">{errors.descr?.message}</p> */}
                      <label>Choose a Category:</label>
                      <select
                    //   {...register("categoryId",{required:"Please select a category"})}
                   {...register("categoryId",{required:"Select category from the dropdown"})}>
                      
                      {categoriesManyQuery.data?.slice(1).map((category:Category) =>
                        <option 
                        key ={category._id} 
                        value={category._id} 
                        defaultValue={category._id}>{category.title}
                        </option>
                       ) }
                       
                         {/* {...register(`categories.${category._id}`)} */}
                       </select>
                       
                       <label>SelectAccount type:</label>
                        <select
                             {...register("acctype",{required:"Please select an account type"})}>
                              <option value="debit">Debit/Credit Card</option>
                              <option value="cash">Cash</option>
                              <option value="bank_account">Bank Account</option>
                              <option value="other">Other</option>
                             </select>
                             
                            <p className="errorStyle">{errors.acctype?.message}</p>
                           
                            <label>Description:</label>
                             <input 
                                placeholder="Select Descr"
                                {...register("descr",{
                                  minLength:{
                                    value:4,
                                    message:"A minimum of 4 characters required"
                                }
                              })}
                            />
                            <p className="errorStyle">{errors.descr?.message}</p>
                           
                            
                            <label>Amount:</label>
                             <input 
                                placeholder="Amount"
                                {...register("amount",{required:"Missing the transaction amount"})}
                            />
                           {/*} <p>amount:{watchAmount}</p>*/}
                            {/* <p className="errorStyle">{errors.amount?.message}</p> */}
                    <input type="submit" 
                    //disabled={createTransactionMutation.isPending} 
                    disabled={isSubmitting}
                    //value={createTransactionMutation.isPending ? "Submitting..." : "Submit"}
                    value={isSubmitting ? 'Submitting...' : 'Submit'}
                    // isSubmitSuccessful={reset()} 
                    />
        </form>

        <h2>Transactions:</h2>
        {/* <pre>GET transactionsData:{JSON.stringify(transactionsData?.data, null, 2)}</pre>
        <pre>GET transactionsAggrMonth:{JSON.stringify(transactionsAggrMonth?.data, null, 2)}</pre>
       */}
          </div>
          <div className="outerDiv">
         <div className="spreadsheetContNew">
            <div className="spreadsheetCont w-auto *:min-w-full overflow-scroll">
               <div className="font-bold horizGrid grid-cols-8 md:grid-cols-9">
                    <div className="">Date</div>
                    <div className="col-span-2">Category</div>
                    <div className="col-span-2">Description</div>
                    <div className="hidden md:inline-flex">Type of Account</div>
                    {/*<div className="font-bold border-collapse border border-amber-500 w-[200px] p-2">Category</div>*/}
                    <div className=""><span className="md:hidden">Amt</span><span className="hidden md:inline-flex">Amount</span></div>
                    <div className="">Edit</div>
                    <div className="">Delete</div>
                </div>
              </div>
            {transactionsAggrMonth ? (transactionsAggrMonth?.data?.map( (transaction) => 
                  
                // <div key={transaction._id} className="transactionsList layoutGrid">
                  <div key={transaction._id} className="horizGrid">

                    <div className="horizGrid grid-cols-8 md:grid-cols-9">
                    {/* { transaction.year == `${props.fyear}` && transaction.month == `${props.fmonth}` && transaction.month == `${props.fmonth}` && 
                    (`${props.category}` === 'all-categories' ||  transaction.title == `${props.category}`) &&  */}
                            {/* <> */}
                        <div className="">{transaction?.month}/{transaction?.day}<span className="hidden md:inline-grid">/{transaction?.year}</span></div>
                        <div className="col-span-2">{transaction?.title}</div>
                        <div className="col-span-2">{transaction?.descr}</div>
                        <div className="hidden md:inline-grid">{transaction?.acctype}</div>
                        <div className="">{transaction?.amount?.$numberDecimal}</div>
                        <div><button className="yellowbg" onClick={() => router.push(`/transactions-page/${transaction._id}`)}>
              <div className="sr-only hidden md:not-sr-only  md:inline-flex">Edit</div><BsFillPencilFill />
             </button></div>
             <div><button className="redbg" onClick={(id:any) => deleteTransactionMutation.mutate(transaction._id)}>
                <div className="sr-only hidden md:not-sr-only md:inline-flex">Delete</div><AiFillDelete />
                </button></div>
                    </div>
                    {/* <div>{transaction?.transactiontotal}</div> */}
                </div>
                
               )): "no transactions are available"}
               
          {/* {transactionsData?.data?.map((data:TransactionsAggregate) => (
            <div key={data._id} className="">
            
            <ul key={data?._id} className="">
                <li>{data?.month}/{data?.day}/{data?.year}</li>
                <li>{data?.title}</li>
                <li>{data?.descr}</li>
                <li>{data?.amount?.$numberDecimal}</li>
            </ul>
            </div>
            
        )
        )}  */}
       </div>
        </div>
   </> )
}