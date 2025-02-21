"use client"

import React, {useState,useEffect, ChangeEvent,FormEvent} from 'react'
import {useSession}from 'next-auth/react';
import {useRouter} from 'next/navigation'
//import Link from "next/link"
//import { BsFillPencilFill } from 'react-icons/bs'
import { AiFillDelete } from 'react-icons/ai'
import {ToastContainer ,toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

//import RemoveTransaction from '../../../components/RemoveTransaction'
import mongoose from "mongoose";
//import { revalidatePath } from 'next/cache';
//type AccountType = "debit" | "cash" | "bank_account" | "other"; 
enum Accounttype{
   debit = "debit",
   cash =  "cash",
   bankaccount= "bank_account",
   other = "other",
}

//type CategoriesProps = {categories: Category[]}
const EditTransactionById = ({ params }: { params: { id: string } }) => {
    
    const [transdate,setTransdate]= useState<Date | null>(new Date())
    const [descr,setDescr]= useState<string>("")
    const [acctype,setAcctype]= useState<Accounttype>(Accounttype.debit)
    //const [categoryTitle,setCategoryTitle]= useState<string>("")
    const [categoryId,setCategoryId]=useState<string>("")
    const [amount,setAmount]= useState("")
    const [categories,setCategories]=useState<Category[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const {data:session,status} = useSession();
  
    const router= useRouter();
    const [transactionDetails,setTransactionDetails]=useState({
        descr:descr,
        transdate:transdate,
        amount:amount,
        acctype:acctype,//not working 
        categoryId:categoryId,//not working
        //categoryId:(new mongoose.Types.ObjectId("6596d7aa62e7201d60afc64d")),
    });
    useEffect(() => {
        async function fetchCategories() { 
            const res = await fetch(`/api/category`
                ,{cache:'no-store'}
                )
                const {categories} = await res.json()
                setCategories(categories)
                setIsLoading(false)
            }
            //console.log('fetchCategories page id',categories)
    fetchCategories();
    }, []);
  
useEffect(() => {
   async function fetchTransaction() {  
       const res = await fetch(`/api/transaction/${params.id}`
       ,{cache:'no-store'})
       const transaction = await res.json()
       //console.log('fetchTransaction',transaction)
       const transdatePrev = transaction?.transdate.toString();
       const dataamount=transaction?.amount.$numberDecimal;
       setTransactionDetails({
            transdate:transaction.transdate,
            //transdate:transdatePrev,
            //acctype:transaction?.acctype as Accounttype,
            acctype:transaction.acctype,
            descr:transaction?.descr,
            categoryId:transaction?.categoryId,
            amount:dataamount,
            //authorId:session?.user._id
        },
    )
    }
    fetchTransaction()
    //setIsLoading(false)
},[])
/* jshint ignore:end*/


//console.log('useeffect categories: ',categories)
//console.log('transactionDetails after set categorieswith useeffect: ',transactionDetails)
if(status === 'loading'){
    return <p>Loading...</p>
}
if(status === 'unauthenticated'){
    
    return <p className="font-bold text-red-500">AccessDenied</p>
}
// const handleChange=async (e:React.ChangeEvent<HTMLInputElement>)=>{
//     (e:ChangeEvent<HTMLSelectElement>) => ((prevCategoryId:Category) => ([...prevCategoryId, ...result]))
// }
const handleSubmit= async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try{
        
        const body = {
            //authorId:session?.token.sub,
            authorId:session?.user?._id,
            //transdate:new Date(transdate),
            transdate:new Date(transdate? transdate :new Date()),
            amount:parseFloat(amount).toFixed(2),
            //amount: amount,
            //categoryId:new mongoose.Types.ObjectId(categoryId),
            categoryId:categoryId,
            descr:descr,
            //categoryTitle,
            acctype:acctype,
        }
        //const res = await fetch(`/api/transaction/${params}`,{
        const transdatePre = transactionDetails?.transdate;
        // console.log('transdatePre',transdatePre)
        //const dataamountPre=transactionDetails?.amount;
        const res = await fetch(`/api/transaction/${params.id}`,{
        headers: {
            "Content-Type": 'application/json',
            "Authorization": `Bearer ${session?.user?.accessToken}`
        },
        method: "PUT",
        //body: JSON.stringify(body)
        
        body:JSON.stringify({
            authorId:session?.user?._id,
            //transdate:new Date(transdate),
            transdate: transdate,
            //transdate: transdate? transdate : transdatePre,
            //amount:parseFloat(amount).toFixed(2),
            amount:parseFloat(amount? amount : transactionDetails.amount).toFixed(2),
            //categoryId:new mongoose.Types.ObjectId(categoryId),
            categoryId:categoryId? categoryId : transactionDetails.categoryId,
            //categoryId: toObjectId(categoryId),
            descr: descr? descr: transactionDetails.descr,
            //categoryTitle,
            acctype: acctype? acctype as Accounttype: transactionDetails?.acctype as Accounttype,
        })
    })
    //console.log('transdatePre',transdatePre)
    //console.log('EDIT body after PUT:', body)
    if(res.ok){
        console.log("Edit went through(res ok)")
    }else{
        toast.error("Edit failed")
        console.log("Edit failed")
    }
    //const transaction = await res.json();
    //console.log('transaction edit: ',transaction);
    //revalidatePath('/');

    //router.push("/dashboard");
    //router.refresh()
    }catch(error){
        console.log('PUT edit error',error)
    }

    
}
const handleDeleteA= async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try{
            
        const res = await fetch(`/api/transaction/${params.id}`,{
    
        headers: {
            "Content-Type": 'application/json',
            "Authorization": `Bearer ${session?.user?.accessToken}`
        },
        method: "DELETE",
        //body: JSON.stringify(body)
        //body:JSON.stringify(body)
        
    })
    //console.log('res after edit:',res)
    if(res.ok){
        toast.success("Delete went through")
        console.log("Delete went through")
    }else{
        toast.error("Edit failed")
        console.log("Edit failed")
    }

    //const transaction = await res.json();
    //console.log('transaction edit: ',transaction);
    router.push("/dashboard");
    }catch(error){
        console.log('delete error',error)
    }

    
}
console.log('useeffect transactionDetails',transactionDetails)
return(
    <>
        <div className="outerDiv">
            <h2>Edit Transaction</h2>
            {/* <pre>TransactionDetails:{JSON.stringify(transactionDetails, null, 2)}</pre>
           <pre>Categories:{JSON.stringify(categories, null, 2)}</pre>*/}
            <form onSubmit={handleSubmit} className="flex flex-col flex-wrap gap-5 my-3">
            <label>Category:</label>
             <select value={transactionDetails.categoryId}
             id="categoryselect"  onChange={(e:ChangeEvent<HTMLSelectElement>) => setCategoryId(e.target.value)
            }>
            {categories?.length > -1 ? 
                (categories.slice(1).map((category:Category) =>
                    <option 
                    key={category._id}  
                    value={category._id}
                    >{category.title}
                    </option>
                   ) ): "no categories are available"}</select>
             <label>Date of transaction:</label>
             <DatePicker 
             id="dateselect"
             selected={transactionDetails?.transdate}
             onChange={(date:Date|null) => {
                setTransdate(date);
               //console.log('date at setTransdate',date);
                
             } }
             className="border border-blue-600" 
               />
              <label>Description:</label>
            <input 
                onChange={(e:ChangeEvent<HTMLInputElement>) => setDescr(e.target.value)}
                className="px-4 py-2 mt-4 mx-5 border border-green-200 text-green-500"
                name="descr"
                placeholder="Description"
                type="text"
                defaultValue={transactionDetails?.descr}
                />
                <label>Account type:</label>
                <select 
                name="acctype"
                id="acctype"
                value={transactionDetails.acctype}
                onChange={(e:ChangeEvent<HTMLSelectElement>) => setAcctype(e.target.value as Accounttype)}
                >
                <option value="debit">Debit</option>
                <option value="cash">Cash</option>
                <option value="bank_account">Bank Account</option>
                <option value="other">Other</option>
                onSelected={acctype}
                </select>   
                <label>Amount:</label>     
                <input onChange={(e:ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
                name="amount"
                placeholder="0.00"
                type="string"
                //defaultValue={parseInt(transactionDetails?.amount).toFixed(2)}
                defaultValue={transactionDetails?.amount}
                />
                {/* <h2>AMOUNT:{transactionDetails.amount}</h2>
                <h2>CATEGORYID:{transactionDetails.categoryId}</h2> */}
                
                
                
                <button type="submit" className="bg-blue-400 rounded-md p-3 text-white font-semibold">Edit Transaction</button>
            </form>
            <div className="flex gap-2 flex-row ">
                    {/* <div className="flex flex-row">
                        <Link className="flex flex-row gap-1" href={`/transaction/edit/${params}`}>Edit<BsFillPencilFill /></Link>
                    </div> 
                   <RemoveTransaction id="" />*/}
                    <button onClick={(event) => {handleDeleteA}} className="flex flex-row gap-1" >Delete<AiFillDelete /></button>
                </div>
            
        </div>
        <ToastContainer />
    </>
)
}
export default EditTransactionById


