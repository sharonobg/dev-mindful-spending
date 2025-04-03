"use client"

import {useMutation,useQueryClient,useQuery} from "@tanstack/react-query";
import { useForm,SubmitHandler, Controller, useFieldArray} from 'react-hook-form';
import TransactionFormCreate from '@/query_forms/notinuse/TransactionFormCreate';
//import {createCategoryMutation} from "@/query_services/queries";
import {useCreateTransactionMutation}from "@/query_services/mutations";
import {createTransaction}from "@/query_services/services";
import {z} from 'zod';

enum Accounttype{
    debit = "debit",
    cash =  "cash",
    bankaccount= "bank_account",
    other = "other",
 }
 const Transactiontype=[
  "debit",
  "cash",
  "bank_account",
  "other"
] as const;
const transactionFormSchema=z.object({
  _id:z.string(),
  acctype:z.enum(Transactiontype).default("debit"),
  categoryId:z.string(),
  //title:z.string(),
  transdate:z.date(),
  descr:z.string(),
  amount:z.string(),
})
// type TransactionTypeTwo={
//     _id:string,
//     title?:string,
//     transdate:Date,
//     categoryId:string,
//     descr?:string,
//     acctype:Accounttype,
//     amount:string,
// }
export type TransactionFormSchema = z.infer<typeof transactionFormSchema>;

const AddTransaction = ({
    onSubmit,
  }:{
      onSubmit:any
  }) => {

    const queryClient = useQueryClient()
     const createTransactionMutation = useMutation({
            mutationFn:createTransaction,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey:['transactions']})//queryKey will be an array of a serializable string   queryKey is constant of data in app- will be issue in spendingplan   
                console.log('Created Transaction Success')
            }
        })
        
 const submitCreate:SubmitHandler<TransactionFormSchema> = (data) =>
          {createTransactionMutation.mutate({...data})};
    return(
        <div>
            <h1>Add Transaction:</h1>
            <TransactionFormCreate onSubmit={submitCreate}/>
            
        </div>
    )
}
export default AddTransaction
