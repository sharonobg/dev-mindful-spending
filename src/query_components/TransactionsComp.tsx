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


export default function TransactionsClientPg(){
  const {fyear,fmonth,fcategory} = usePropsContext();
  const router = useRouter();
  
    const categoriesManyQuery = useCategories();
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
        handleSubmit,
        control,
        setValue,
        formState:{errors},
        //handleSubmitcontrol,
        // formState: { isSubmitting },,
        watch} = useForm<TransactionType>();
    const watchCategory = watch("categoryId");
    const watchAcctype = watch("acctype");
    const handleDelete = (id:any) => deleteTransactionMutation.mutate(id)
    return (
        <div className="flex flex-col">
        <h2>Transactions Client Page</h2>
        <h2>transactionsAggrMonth status: {transactionsAggrMonth.fetchStatus}</h2>
        <h2>transactions status: {transactionsData.fetchStatus}</h2>
        <h2>transaction status: {transactionsData.status}</h2>
        <h2>Global isFetching: {howManyFetching}</h2>
        <h2>Create Transaction</h2>
        <h2>Context: {fmonth}/{fyear}/{fcategory}</h2>
        <form className="flex flex-col" onSubmit={handleSubmit(handleCreateTransactionSubmit)}>
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
                       <p>Watch Category:{watchCategory}</p>
                       <label>SelectAccount type:</label>
                        <select
                             {...register("acctype",{required:"Please select an account type"})}>
                              <option value="debit">Debit/Credit Card</option>
                              <option value="cash">Cash</option>
                              <option value="bank_account">Bank Account</option>
                              <option value="other">Other</option>
                             </select>
                             <p>Acctype: {watchAcctype}</p>
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
                    <input type="submit" disabled={createTransactionMutation.isPending} value={createTransactionMutation.isPending ? "Submitting..." : "Submit"} />
        </form>

        <h2>Transactions:</h2>
        <pre>GET transactionsData:{JSON.stringify(transactionsData?.data, null, 2)}</pre>
        <pre>GET transactionsAggrMonth:{JSON.stringify(transactionsAggrMonth?.data, null, 2)}</pre>
      
          
         <div className="spreadsheetContNew">
            <div className="layoutGrid">
               <div className="grid layout-grid sheet col-7 font-bold">
                    <div className="">Date</div>
                    <div className="col2">Category</div>
                    <div className="col3">Description</div>
                    <div className="col2">Type of <br />Account</div>
                    {/*<div className="font-bold border-collapse border border-amber-500 w-[200px] p-2">Category</div>*/}
                    <div className="">Amount</div>
                    <div className="colsm">Edit</div>
                    <div className="colsm">Delete</div>
                </div>
              </div>
            {transactionsAggrMonth ? (transactionsAggrMonth?.data?.map( (transaction) => 
                  
                // <div key={transaction._id} className="transactionsList layoutGrid">
                  <div key={transaction._id} className="layoutGrid">

                    <div className="grid layout-grid sheet col-7">
                    {/* { transaction.year == `${props.fyear}` && transaction.month == `${props.fmonth}` && transaction.month == `${props.fmonth}` && 
                    (`${props.category}` === 'all-categories' ||  transaction.title == `${props.category}`) &&  */}
                            {/* <> */}
                        <div className="">{transaction?.month}/{transaction?.day}/{transaction?.year}</div>
                        <div className="col2">{transaction?.title?.toUpperCase()}</div>
                        <div className="col3">{transaction?.descr}</div>
                        <div className="col2">{transaction?.acctype}</div>
                        <div className="">{transaction?.amount?.$numberDecimal}</div>
                        <button className="yellowbg colsm" onClick={() => router.push(`/transactions-page/${transaction._id}`)}>
              <div className="sr-only hidden first:md:not-sr-only  md:flex">Edit</div><BsFillPencilFill />
             </button>
              <button className="redbg colsm" onClick={(id:any) => deleteTransactionMutation.mutate(transaction._id)}>
                <div className="sr-only hidden md:not-sr-only md:flex">Delete</div><AiFillDelete />
                </button>
                    </div>
                    {/* <div>{transaction?.transactiontotal}</div> */}
                </div>
                
               )): "no transactions are available"}
               
               </div>
          {transactionsData?.data?.map((data:TransactionsAggregate) => (
            <div key={data._id}>
            {/* <h2>_id:{data._id}</h2> */}
            <ul key={data?._id}>
                <li>{data?.month}/{data?.day}/{data?.year}</li>
                <li>{data?.title?.toUpperCase()}</li>
                <li>{data?.descr}</li>
                <li>{data?.amount?.$numberDecimal}</li>
            </ul>
            </div>
            
        )
        )} 
       
        </div>
    )
}