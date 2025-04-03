"use client"

import React,{useState} from 'react';
import {useRouter} from 'next/navigation';
import {ToastContainer ,toast} from 'react-toastify';
import {useSession}from 'next-auth/react';
import 'react-toastify/dist/ReactToastify.css';
// import { useCreateTransactionMutation,useEditTransactionMutation} from '@/query_services/mutations';
import {z} from 'zod';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useCategories } from '@/query_services/queries';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm,SubmitHandler, Controller, useFieldArray} from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createTransaction } from '@/query_services/services';


// type AccountType = "debit" | "cash" | "bank_account" | "other";
enum Accounttype{
    debit = "debit",
    cash =  "cash",
    bankaccount= "bank_account",
    other = "other",
 }
//  type AddEditTransactionProps={
  
//  transaction ? (transaction:TransactionType) : undefined
//  }
 const Transactiontype=[
  "debit",
  "cash",
  "bank_account",
  "other"
] as const;
const CategorySchema=z.object({
_id:z.string(),
title:z.string(),
})
const CategoriesSchema=z.object({
categories:z.array(CategorySchema)
})
const transactionFormSchema=z.object({
  _id:z.string(),
  acctype:z.enum(Transactiontype).default("debit"),
  categoryId:z.string(),
  //title:z.string(),
  transdate:z.date(),
  descr:z.string(),
  amount:z.string(),
})

export type TransactionFormSchema = z.infer<typeof transactionFormSchema>;
// type TransactionTypeTwo={
//   _id:string,
//   title?:string,
//   transdate:Date,
//   categoryId:string,
//   descr?:string,
//   acctype:Accounttype,
//   amount:string,
// }
// const transactionCatFormSchema= transactionFormSchema
// .and(CategoriesSchema)
// type TransactionCatFormSchema = z.infer<typeof transactionCatFormSchema>;

// const transactionDefaultValues:TransactionFormSchema={
//   _id:'',
//   acctype:"debit",
//   categoryId:'',
//   //title:z.string(),
//   transdate:new Date(),
//   descr:'',
//   amount:'',
// }


const TransactionFormCreate = ({
  onSubmit
}:{
    onSubmit:any
}) => {

    // initialValue = {}
  
    const {data:session,status} = useSession();
    // const router= useRouter();
    // const [title,setTitle]= useState<string>("")
    // const [categories,setCategories]=useState<TransactionType[]>()
    //  const [title,setTitle]= useState("")
    // const[category,setCategory]=useState<TransactionType>()
    
  const categoriesManyQuery = useCategories();
/*this is for the EDIT*/
// const transaction = {};
    const {
        register,control,
        setValue,
        handleSubmit,
        formState:{errors},
        //handleSubmitcontrol,
        // formState: { isSubmitting },,
        watch
      //}=useForm<TransactionType>({
      }=useForm<TransactionFormSchema>({
        // mode:"all",
        
         defaultValues:{
            descr:'',
            acctype:Accounttype.debit,
            categoryId:'',
            transdate:new Date(),
            amount:'',
         },
      resolver:zodResolver(transactionFormSchema),
      })
     
    if(status === 'loading'){
        return <p>Loading...</p>
    }
    if(status === 'unauthenticated'){
       return <p className="font-bold text-red-500">Access Denied</p>
    }
const watchCategory = watch("categoryId");
const watchAcctype = watch("acctype");

// const _id:string='';
// const descr:string= '';
// const acctype:Accounttype = Accounttype.debit;
// const categoryId:string = '';
// const transdate:Date = new Date();
// const amount:string = '0.00';
const queryClient = useQueryClient()

 const createTransactionMutation = useMutation({
        mutationFn:createTransaction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey:['transactions']})//queryKey will be an array of a serializable string   queryKey is constant of data in app- will be issue in spendingplan   
            console.log('Created Transaction Success')
        }
    })
  const checkSubmit:SubmitHandler<TransactionFormSchema> = (data) =>
        {createTransactionMutation.mutate(data)};
            
       
return(
        <div className="flex flex-col w-full place-items-center border-l-orange-100">
            {/* <form onSubmit={handleSubmit(handleCreateNewTransaction)} className="flex flex-col flex-wrap gap-5 my-3"> */}
          <form onSubmit={handleSubmit(checkSubmit)} className="flex flex-col flex-wrap gap-5 my-3">

                {/* <h2>Transaction:</h2> */}
                <div className="datepickDiv">
           
          <Controller
        control={control}
        name="transdate"
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <DatePicker
          placeholderText="Select date"
          //showMonthDropdown
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
          {...register("categoryId",{required:"Please select a category"})}>
         
          {categoriesManyQuery.data?.slice(1).map((category:Category) =>
            <option 
            key ={category._id} 
            value={category._id} 
            defaultValue={category._id}>{category.title}
            </option>
           ) }
           
           
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
                <input type="submit" />
            </form>

            {/* <ToastContainer /> */}
        </div>
        
        )
}
export default TransactionFormCreate 

