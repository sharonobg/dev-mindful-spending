"use client"
import {useQuery,useIsFetching} from "@tanstack/react-query";
import React,{useState,ChangeEvent} from 'react';
import {useRouter} from 'next/navigation';
import {ToastContainer ,toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useSession} from 'next-auth/react'

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {useCategoriesPromise} from '@/query_components/RQCategoriesProvider';
import { useTransactionsPromise } from "@/query_components/RQTransactionsProvider";
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

const TransactionForm = () => {
    const categoriesPromise = useCategoriesPromise();
    const { data:categories } = useQuery({
        queryKey:["categories"], 
        queryFn: () => categoriesPromise
        
    });
    const transactionsPromise = useTransactionsPromise();
    const { data:transactions } = useQuery({
        queryKey:["transactions"], 
        //queryFn: (props:any) => transactionsPromise
        queryFn: (props:any) => fetch('http://localhost:3000/api/transaction')
        .then((res) => res.json()),
    });
    //console.log('data:transactions',transactions)
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [transdate,setTransdate]= useState(new Date())
    const [descr,setDescr]= useState<string>("")
    //const [acctype,setAcctype]= useState("")
    const [acctype,setAcctype]= useState<AccountType>("debit")
    //const [categories,setCategories]=useState<Category[]>([])
    //const [transactions,setTransactions]=useState([])
    const [categoryId,setCategoryId]=useState<string>("");
    const [amount,setAmount]= useState("");
    const {data:session,status} = useSession();
    const router= useRouter();
    const propsfield = {props:''};
    console.log('transactions propsfield',propsfield)

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
    
    return(
        <>
       {/*<pre>GET transactions:{JSON.stringify(transactions, null, 2)}</pre>
        <pre>GET categories:{JSON.stringify(categories, null, 2)}</pre>*/}
       
        <div className="outerDiv">
            <div className="spreadsheetCont">
                <div className="sheet font-bold flex-col-6">
            <div className=""><span className="hidden md:flex">Month/Day/Year</span><span className="flex md:hidden">M/D/Y</span></div>
            <div className="">Category</div>
            <div className="">Description</div>
            <div className="">Type of Account</div>
            {/*<div className="font-bold border-collapse border border-amber-500 w-[200px] p-2">Category</div>*/}
            <div className="">Amount</div>
            <div className="">Edit / Delete</div>
        </div>

        {(transactions?.map( (transaction:TransactionType) => 
          
        <div key={transaction?._id} className="transactionsList">
        
            <div className="sheet col-6">
            {/* { transaction.year == `${props.fyear}` && transaction.month == `${props.fmonth}` && transaction.month == `${props.fmonth}` && 
            (`${props.category}` === 'all-categories' ||  transaction.title == `${props.category}`) &&  */}
                    {/* <> */}
                <div className="">
                    {/* {transaction?._id.month}/{transaction._id.day}/ */}
                    {/* {new Date(transaction?.transdate).toISOString().split('T', 1)[0]} */}
                    {new Date(transaction?.transdate).toLocaleDateString()}
                    </div>
                {/* <div className="">{transaction?._id.title}</div> */}
                <div className="">Title Needed</div>
                <div className="">{transaction?.descr}</div>
                <div className="">{transaction?.acctype}</div>
                <div className="">{parseFloat(transaction?.amount).toFixed(2)}</div>
                <div className= "editCol"> 
                  {/* <button onClick={transaction/{transaction._id.id}>nw</button>  */}
                  <Link href={`/transaction/${transaction?._id}`}><BsFillPencilFill /></Link>
                 {/*<Link className="flex flex-row gap-1 justify-center" href={`/transaction/${transaction?._id}`}><BsFillPencilFill /></Link>
                  <Link href={`/transaction/`}><BsFillPencilFill />transaction</Link> */}
                {/* <Link className="flex flex-row gap-1 justify-center" href={`/transaction/${transaction?._id}`}><BsFillPencilFill /></Link>
                <RemoveTransaction className="flex flex-row gap-1 justify-center" id={transaction._id} />*/}
                </div>
                {/* </> */}
            
            
        {/* } */}
            </div>
        </div>
    //    )): "no transactions are available"}
    ))}
       
       </div>
            
<h2>Create Transaction</h2>
            {session &&
            <form onSubmit={handleSubmit} className="flex flex-col flex-wrap gap-5 my-3">
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
        <ToastContainer />
        
        </>)
}
export default TransactionForm