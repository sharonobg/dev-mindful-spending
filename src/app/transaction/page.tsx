"use client"

import React,{useState,useEffect,ChangeEventHandler, ChangeEvent} from 'react';
import {useRouter} from 'next/navigation';
import {ToastContainer ,toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useSession} from 'next-auth/react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import mongoose from "mongoose";
//import { ObjectId } from 'bson';
type AccountType = "debit" | "cash" | "bank_account" | "other";
enum Accounttype{
    debit = "debit",
    cash =  "cash",
    bankaccount= "bank_account",
    other = "other",
 }
const CreateTransaction = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [transdate,setTransdate]= useState(new Date())
    const [descr,setDescr]= useState<string>("")
    //const [acctype,setAcctype]= useState("")
    const [acctype,setAcctype]= useState<AccountType>("debit")
    const [categories,setCategories]=useState<Category[]>([])
    const [transactions,setTransactions]=useState([])
    const [categoryId,setCategoryId]=useState<string>("6596d7aa62e7201d60afc64d");
    const [amount,setAmount]= useState("");
    const {data:session,status} = useSession();
    const router= useRouter();

     //console.log('session',session)
    useEffect(() => {
        async function fetchCategories() { 
            const res = await fetch(`/api/category`
                ,{cache:'no-store'}
                )
                const {categories} = await res.json()
                setCategories(categories)
                //setIsLoading(false)
            }
            //console.log('fetchCategories page id',categories)
    fetchCategories();
    }, []);
      useEffect(() => {

        async function fetchTransactions() { 
            const res = await fetch(`/api/transaction`
                ,{cache:'no-store'}
                )
                const transactions = await res.json()
                setTransactions(transactions)
                setIsLoading(false)
            }
            fetchTransactions();
        //     fetch('/api/transaction')
        //   .then((res:Response) => res.json())
        //   .then((transactions) => {
        //     setTransactions(transactions)
        //     //setLoading(false)
            
    //       })
       }, [])
  
    if(status === 'loading'){
        return <p>Loading...</p>
    }
    if(status === 'unauthenticated'){
        //console.log('auth ok')
        return <p className="font-bold text-red-500 text-center">Access Denied - Please Sign In</p>
    }
    //console.log('transactions',transactions)
    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!transdate || !descr ||!acctype  ||!amount){
            toast.error("Please fill in all the fields")
            return
        }
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
                    //categoryId:new mongoose.Types.ObjectId(categoryId),
                    //categoryId:new mongoose.Types.ObjectId(categoryId),
                    categoryId:categoryId,
                    //categoryId: toObjectId(categoryId),
                    descr:descr,
                    //categoryTitle,
                    acctype:acctype,
                    
                })
            })

            if(!res.ok){
                throw new Error("Error on auth")
            }
            const transaction = await res.json();
            //console.log('transaction after await',transaction);
            //router.push(`/transaction/${transaction._id.id}`);
            router.push(`/dashboard`)
        }catch (error:any) {
            console.log('page error',error)
        }
    }
    
    return(
       
        <>
       {/*<pre>GET transactions:{JSON.stringify(transactions, null, 2)}</pre>
        <pre>GET categories:{JSON.stringify(categories, null, 2)}</pre>*/}
        
        <div className="outerDiv">
            <h2>Create Transaction</h2>
            {session &&
            <form onSubmit={handleSubmit} className="flex flex-col flex-wrap gap-5 my-3">
<label>Category:</label>
            <select onChange={(e:ChangeEvent<HTMLSelectElement>) => setCategoryId(e.target.value)}>
                    {categories?.length > -1 ? 
                    (categories.slice(1).map((category:Category) =>
                        <option 
                    key ={category._id} 
                    value={category._id} 
                    defaultValue={category._id}>{category.title}</option>
                   ) ): "no categories are available"}</select>
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
        <ToastContainer />
        
        </>)
}
export default CreateTransaction

// function toObjectId(categoryId: string) {
//     throw new Error('Function not implemented.');
// }
