"use client"

import { useTransactionsCreate, useUpdateTransactionMutation } from "@/query_services/mutations";
import { useCategories, useTransactions } from "@/query_services/queries";
import { getTransactions, getTransactionsById } from "@/query_services/services";
import {useIsFetching, useQueries, useQuery, useSuspenseQuery}from "@tanstack/react-query"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {z} from 'zod';
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

const Transactiontype=[
  "debit",
  "cash",
  "bank_account",
  "other"
] as const;
const transactionFormAggrSchema=z.object({
  _id:z.string(),
  acctype:z.enum(Transactiontype).default("debit"),
  categoryId:z.string(),
  title:z.string(),
  transdate:z.date(),
  descr:z.string(),
  //amount:z.coerce.number(),
  amount:z.string()
})

export type TransactionFormSchema = z.infer<typeof transactionFormAggrSchema>;
const EditTransactionById = (
  { params,
    //values
  }: { params:{id: string }
  // ,values:TransactionFormSchema
}
) => {


     const id = params.id;
    const _id = params.id;
    const categoriesManyQuery = useCategories();
    const {
      isPending,
      isError,
      data:transaction,
      error
  } = useQuery({
      queryKey:['transaction',{id}],
      queryFn: () => getTransactionsById(id),
      retry: 5,
      enabled: !!id,
      //enabled: id !== undefined,
      // refetch every second
      refetchInterval: 30000
  }) 
  console.log('this transaction by id',transaction)
    // const transactionsData = useTransactions();
    const isFetching = useIsFetching();
   
    const updateTransactionMutation = useUpdateTransactionMutation();
    const handleUpdateTransactionSubmit = (data:TransactionType | undefined) => {
    //  if(data){ updateTransactionMutation.mutate({...data, })}
     if(data){ updateTransactionMutation.mutate({
      _id:_id,
      transdate:data.transdate,
      descr:data.descr,
      amount:data.amount,
      categoryId:data.categoryId,
      acctype:data.acctype
     })}

    };
    const thisDay = new Date().getDay();//this is default
    const thisMonth = new Date().getMonth()+1;//this is default
    const thisYear = new Date().getFullYear();

    const  {
        
        register,
        handleSubmit,
        control,
        setValue,
        formState:{errors},
        //handleSubmitcontrol,
        // formState: { isSubmitting },,
        watch
      } = useForm<TransactionType>({
         
          defaultValues: {
            _id: id,
            acctype:transaction?.acctype,
            categoryId:transaction?.categoryId,
            // title: transaction?.title,
            descr:transaction && transaction?.descr,
            transdate:transaction?.transdate,
            // amount:parseFloat(transaction?.amount).toFixed(2),
            amount:transaction?.amount.$numberDecimal,
            // month:transaction?.month,
            // day:transaction?.day,
            // year:transaction?.year,

          },
          // values
         // values:{transaction?.transaction{} || [] },
          // {
             //data: data ? transaction || []
            // _id: transaction ? transaction._id :'',
            // transdate:transaction ? transaction.transdate : new Date(),
            // acctype:transaction ? transaction?.acctype : "debit",
            // categoryId:transaction ? transaction?.categoryId : "",
            // title:transaction ? transaction?.title : "",
            // descr:transaction ? transaction?.descr : "",
            // month:transaction ? transaction?.month : thisMonth,
            // day:transaction ? transaction?.day : thisDay,
            // year:transaction ? transaction?.year : thisYear,
            // amount:transaction ? transaction?.amount : 0.00
        //   }
         }
       

        );
    

    const watchCategory = watch("categoryId");
    const watchTransactionCategory = watch("categoryId");
    // const watchTransactionTitle = watch("title");
    const watchAcctype = watch("acctype");
    const watchDate = watch("transdate");
    // if (categoriesManyQuery.status === 'pending') {
    //   return <span>Loading...</span>
    // }
  
    // if (categoriesManyQuery.status === 'error') {
    //   return <span>Error: {error?.message}</span>
    // }
    //if(isPending){return <span>Waiting for Transaction ...</span>}
    if(transaction) {
    return (
        <div className="flex flex-col">
         <h2>transaction: {JSON.stringify(transaction,null,2)}</h2>   
        <h2>Transactions Client Page</h2>
        {/* <h2>transactions status: {transactionsData.fetchStatus}</h2>
        <h2>transaction status: {transactionsData.status}</h2>
        <h2>Global isFetching: {howManyFetching}</h2> */}
        {/* <h2>Create Transaction</h2> */}
        {isFetching > 0 && <span>Waiting for Transaction ...</span>}
        {isError && <span>Error: {error.message}</span>}
        {/* const trStatus = {transactionsData.status}
        <h1>Status:{transactionsData.status}</h1> */}
        <div className="transactionDef">
          <h2>Current Transaction</h2>
          {/* <h2>transaction{JSON.stringify(transaction,null,2)}</h2> */}
          {/* { transaction !== undefined ? transaction.map((transaction) => ( */}
            <ul key={transaction && transaction?._id}>
                <li>Transaction in Li:{transaction && transaction?.amount.$numberDecimal}</li>
                  
                <li>Data:{transaction?.month!}{transaction && transaction?.month}/{transaction && transaction?.day}/{transaction && transaction?.year}</li>
                <li>Data Title:{JSON.stringify(transaction && transaction?.title)}</li>
                <li>Data:{transaction && transaction?.descr}</li>
                <li>{transaction?.amount.$numberDecimal}</li>
            </ul>
          {/* )):"undefined"
            } */}
        </div>
        <form className="flex flex-col" onSubmit={handleSubmit(handleUpdateTransactionSubmit)}>
        <label>Choose a Category: {transaction?.categoryId}{transaction?.title}
          </label>
                <select
                      defaultValue={transaction?.categoryId}
                   {...register("categoryId",{required:"Select category from the dropdown"})}>
                      
                      {categoriesManyQuery.data?.slice(1).map((category:Category) =>
                        <option 
                        key ={category._id} 
                        value={category._id}>
                          {category.title}
                        </option>
                       ) }
                       </select>
                       <p>Watch TransactionCategory:{watchTransactionCategory}</p>
                       {/* <p>Watch TransactionTitle:{watchTransactionTitle}</p> */}
                       <p>Watch Category:{watchCategory}</p>
                       <label>Choose a Date:</label>
            <div className="datepickDiv">
                       
                      <Controller
                      name="transdate"
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
                        selected={value ?? transaction?.transdate}
                        dropdownMode="select"
                        onBlur={onBlur} // notify when input is touched/blur
                        
                    
                      />
                    )}
                  /></div>
                  {/* <p>Watch Date:{watchDate?.toLocaleTimeString()}</p> */}
                      {/* <p className="errorStyle">{errors.descr?.message}</p> */}
                  
                       <label>SelectAccount type:</label>
                        <select
                            defaultValue={transaction?.acctype}
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
                             defaultValue={transaction?.descr}
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
                                // value={transaction && parseFloat(transaction?.amount).toFixed(2)}
                                defaultValue={transaction && transaction?.amount.$numberDecimal}
                                placeholder="Amount"
                                {...register("amount",{required:"Missing the transaction amount"})}
                            />
    {/* <button className="" onClick={() => handleUpdateTransactionSubmit(data)}></button> */}

    {/*} <p>amount:{watchAmount}</p>*/}
    {/* <p className="errorStyle">{errors.amount?.message}</p> */}
    <input type="submit" value="Submit"
                            // disabled={handleUpdateTransactionSubmit} value={handleUpdateTransactionSubmit.isPending ? "Submitting..." : "Submit"} 
                            />
        </form>

        <h2>Transactions:</h2>
        {/* {transaction && transaction.map((data:TransactionsAggregate) => ( */}
            <div key={transaction?._id}>
             <h2>_id:{transaction?._id}</h2> 
             <ul key={transaction?._id}>
                {/* <li>{data.month}/{data.day}/{data.year}</li>
                <li>{data.title.toUpperCase()}</li> */}
                 <li>Title:{transaction?.title}</li>
                <li>{transaction?.categoryId}</li>
                <li>{transaction?.acctype}</li>
                <li>{transaction?.descr}</li>
                <li>{transaction?.amount.$numberDecimal}</li>
            </ul>
            </div> 
         {/* )
        )}   */}
        
        </div>
    )}
}
export default EditTransactionById