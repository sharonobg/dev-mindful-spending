"use client"
import {useQuery,useMutation,useQueryClient} from "@tanstack/react-query";
import React,{useState,ChangeEvent} from 'react';
import {useRouter} from 'next/navigation';
import {ToastContainer ,toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useSession} from 'next-auth/react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BsFillPencilFill } from "react-icons/bs";
import Link from "next/link";

export type CategorySel = {
    _id:string;
    title?:string
   }
type AccountType = "debit" | "cash" | "bank_account" | "other";
enum Accounttype{
    debit = "debit",
    cash =  "cash",
    bankaccount= "bank_account",
    other = "other",
 }
// const SpendingPlansRQ = () => {
//   const { data:spendingplans, isLoading } = useQuery<SpendingplanType[]>({
//   queryKey:["spendingplans"], 
//   queryFn: () => fetch('http://localhost:3000/api/spendingplan')
//   .then((res:Response) => res.json())
// });
// if (isLoading) return <div>Loading...</div>

const TransactionQueryForm= () => {
    const[categoryId,setCategoryId]=useState("")
    const [acctype,setAcctype]= useState<AccountType>("debit")
    const [transdate,setTransdate]= useState(new Date())
    const [descr,setDescr]= useState<string>("")
    const [amount,setAmount]= useState("");
    const {data:session,status} = useSession();
    const router= useRouter();

 
    const { data:categories, isLoading } = useQuery<Category[]>({
        queryKey:["categories"], 
        queryFn: () => fetch('http://localhost:3000/api/category')
        .then((res:Response) => res.json())
    });
    const { data:transactions } = useQuery<Transaction[]>({
        queryKey:["transactions"], 
        queryFn: () => fetch('http://localhost:3000/api/transaction')
        .then((res:Response) => res.json())
    });
    if (isLoading) return <div>Loading...</div>

    // const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    //         e.preventDefault();
    //         // if(!transdate || !descr ||!acctype  ||!amount){
    //         //     toast.error("Please fill in all the fields")
    //         //     return
    //         // }
    //         try{
    //             const res = await fetch('/api/transaction',{
    //                 headers:{
    //                     "Content-type":"application/json",
    //                     "Authorization":`Bearer`// ${session?.user?.accessToken}`
    //                 },
    //                 method:'POST',
    //                 body:JSON.stringify({
    //                     //authorId:session?.token.sub,
    //                     //authorId:session?.user?._id,
    //                     transdate:new Date(transdate),
    //                     amount:parseFloat(amount).toFixed(2),
    //                     categoryId:categoryId,
    //                     descr:descr,
    //                     acctype:acctype,
    //                 })
    //             })
    
    //             if(!res.ok){
    //                 throw new Error("Error on auth")
    //             }
    //             const transaction = await res.json();
    //             router.push(`/dashboard`)
    //         }catch (error:any) {
    //             console.log('page error',error)
    //         }
    //     }//end handleSubmit
        
//   const mutation = useMutation({
//     mutationFn: (newTransaction:Promise<Transaction>) => {
//       return Transaction.create("http://api/transaction"), newTransaction);
//     }
//   })
  return (
   <div>
    <h1>Tranasction Query Form</h1>
    {/* <h2>Categories:</h2> */}
    {/* <h2>Categories:{JSON.stringify(categories,null,2)}</h2> */}
    {/* <h2>Transactions:</h2> */}
    {/* <h2>Transactions:{JSON.stringify(transactions,null,2)}</h2> */}
    </div>
  )
}
export default TransactionQueryForm