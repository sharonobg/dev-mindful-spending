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

const TransactionFormMulti = () => {

    const[categoryId,setCategoryId]=useState("")
    const [acctype,setAcctype]= useState<AccountType>("debit")
    const [transdate,setTransdate]= useState(new Date())
    const [descr,setDescr]= useState<string>("")
    const [amount,setAmount]= useState("");
    const {data:session,status} = useSession();
    const router= useRouter();
    const propsfield = {props:''};
    //console.log('transactions propsfield',propsfield)


    const { data:categories, isLoading } = useQuery<Category[]>({
        queryKey:["categories"], 
        queryFn: () => fetch('http://localhost:3000/api/category')
        .then((res:Response) => res.json())
    });
    // const { data:transactions } = useQuery<Transaction[]>({
    //         queryKey:["transactions"], 
    //         //queryFn: (props:any) => transactionsPromise
    //         queryFn: (props:any) => fetch('http://localhost:3000/api/transaction')
    //         .then((res) => res.json()),
    //     });
        if (isLoading) return <div>Loading...</div>
    //CREATE FORM
    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            // if(!transdate || !descr ||!acctype  ||!amount){
            //     toast.error("Please fill in all the fields")
            //     return
            // }
            try{
                const res = await fetch('/api/transaction',{
                    headers:{
                        "Content-type":"application/json",
                        "Authorization":`Bearer`// ${session?.user?.accessToken}`
                    },
                    method:'POST',
                    body:JSON.stringify({
                        //authorId:session?.token.sub,
                        //authorId:session?.user?._id,
                        transdate:new Date(transdate),
                        amount:parseFloat(amount).toFixed(2),
                        categoryId:categoryId,
                        descr:descr,
                        acctype:acctype,
                    })
                })
    
                if(!res.ok){
                    throw new Error("Error on auth")
                }
                const transaction = await res.json();
                router.push(`/dashboard`)
            }catch (error:any) {
                console.log('page error',error)
            }
    }
//   const mutation = useMutation({
//     mutationFn: (newTransaction:Promise<Transaction>) => {
//       return Transaction.create("http://api/transaction"), newTransaction);
//     }
//   })
  return (
    <div className="outerDiv place-items-center">
     {session &&
        <form onSubmit={handleSubmit} className="flex flex-col flex-wrap gap-5 my-3 max-w-[75%]">
    <label>Category:</label>
                <select 
                onChange={(e:ChangeEvent<HTMLSelectElement>) => setCategoryId(e.target.value)}>
                        {(categories?.slice(1).map((category:Category) =>
                            <option 
                        key ={category._id} 
                        value={category._id} 
                        defaultValue={category._id}>{category.title}</option>
                       ))}</select>
                    <label>Date:</label>
                    <DatePicker 
                    className="border border-blue-600" 
                    selected={transdate} 
                    onChange={(date) => date && setTransdate(date)}
                
                    />
                    <label>Description:</label>
                    <input 
                    onChange={(e) => setDescr(e.target.value)}
                    className="px-4 py-2 mt-4 mx-5 border border-green-200 text-green-500"
                    name="description"
                    placeholder="Description"
                    type="text"
                    />
                    <label>Account type:</label>
                    <select 
                    //type="text" 
                    value ={acctype} 
                    onChange={(e) => setAcctype(e.target.value as Accounttype)}>
                    <option value="debit">Debit</option>
                    <option value="cash">Cash</option>
                    <option value="bank_account">Bank Account</option>
                    <option value="other">Other</option>
                    </select>
                    <label>Amount:</label> 
                    <input onChange={(e) => setAmount(e.target.value)}
                    name="amount"
                    placeholder="0.00"
                    type="string"
                    />
    
                    <button className="bg-blue-400 rounded-md p-3 text-white font-semibold" type="submit">Create Transaction</button>
                </form>
                }
         </div>
  )
}
export default TransactionFormMulti