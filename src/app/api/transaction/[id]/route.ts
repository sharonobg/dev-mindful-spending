//import connect from "@/src/libs/database/mongodb";
import{NextRequest} from "next/server";
import { getToken } from "next-auth/jwt"
import token from '@/libs/database/jwt';
import Transaction from "@/models/transactionModel";
import {getServerSession} from "next-auth"
import {authOptions}from"@/app/api/auth/[...nextauth]/route"
import User from "@/models/userModel";
import mongoose from "mongoose";
//import { ObjectId } from 'mongodb'

import { headers } from 'next/headers'

export async function GET(req:NextRequest,{ params }: { params: { id: string } } ){
    try{
        const headersList = headers();
        //console.log('headersList',headersList)
    const transaction = await Transaction.findById(params.id).populate("authorId")
    console.log('GET transaction route',transaction)
    return new Response(JSON.stringify(transaction),{status:200})
} catch (error) {
    console.log(error)
    return new Response(JSON.stringify(null),{status:500})
}
}  
export async function putTransactionById(req:NextRequest,{ params }: { params:{id:string } }){
    //connect();const id = {params};
    
     const accessToken = req.headers.get('authorization')
     if(accessToken){
         const token = accessToken.split(" ")[1]
         const decodedToken = token
         if(!accessToken||decodedToken == null){
 
         return new Response(JSON.stringify({error: "unauthorized (wrong or expired token)"}),{status:403})
         }
     }
     const session = await getServerSession(authOptions);
         const sessionUser = session?.user?.email;
         const idn = params.id.toString();
         var mongoose = require('mongoose');
         const id = new mongoose.Types.ObjectId(idn);
         // const id = new ObjectId(idn) 
         //console.log('id',id)
         
         //const acctok = session?.user?.accessToken
         const user = await User.findOne({email:sessionUser});
         const userid = user._id;
         console.log('user ln 43',userid)
     try{ 
         const body = await req.json()
         console.log('body befor breaks: ',body)
         const transaction = await Transaction.findById(id).populate("authorId");
     console.log('id page ROUTE PUT(populate) transaction: ',transaction)
         if(transaction.authorId._id.toString() !== userid.toString()){
             return new Response(JSON.stringify({message:"Only author can update his transaction"}),{status:403})
         }
     const updatedTransaction = await Transaction.findByIdAndUpdate(id, {$set:{...body} } ,{new: true})
     console.log('updatedTransaction PUT',updatedTransaction)
     return new Response(JSON.stringify(updatedTransaction),{status: 200})
     } catch(error) {
         console.log('PUT error: ',error)
         return new Response(JSON.stringify(null),{status:500})
         
     }
 }
                      //req:NextRequest,{ params }: { params:{id:string } } 
export async function PUT(req:NextRequest,{ params }: { params:{id:string } }){
   //connect();const id = {params};
   
    const accessToken = req.headers.get('authorization')
    if(accessToken){
        const token = accessToken.split(" ")[1]
        const decodedToken = token
        if(!accessToken||decodedToken == null){

        return new Response(JSON.stringify({error: "unauthorized (wrong or expired token)"}),{status:403})
        }
    }
    const session = await getServerSession(authOptions);
        const sessionUser = session?.user?.email;
        const idn = params.id.toString();
        var mongoose = require('mongoose');
        const id = new mongoose.Types.ObjectId(idn);
        // const id = new ObjectId(idn) 
        //console.log('id',id)
        
        //const acctok = session?.user?.accessToken
        const user = await User.findOne({email:sessionUser});
        const userid = user._id;
        console.log('user ln 43',userid)
    try{ 
        const body = await req.json()
        console.log('body befor breaks: ',body)
        const transaction = await Transaction.findById(id).populate("authorId");
    console.log('id page ROUTE PUT(populate) transaction: ',transaction)
        if(transaction.authorId._id.toString() !== userid.toString()){
            return new Response(JSON.stringify({message:"Only author can update his transaction"}),{status:403})
        }
    const updatedTransaction = await Transaction.findByIdAndUpdate(id, {$set:{...body} } ,{new: true})
    console.log('updatedTransaction PUT',updatedTransaction)
    return new Response(JSON.stringify(updatedTransaction),{status: 200})
    } catch(error) {
        console.log('PUT error: ',error)
        return new Response(JSON.stringify(null),{status:500})
        
    }
}
export async function DELETE(req:NextRequest,{ params }:{params:{slug:string}}){
    //await connect();
    const id = {params};
    const accessToken = req.headers.get('authorization')
    if(accessToken){
        const token = accessToken.split(" ")[1]
        const decodedToken = token
        if(!accessToken||decodedToken == null){
            return new Response(JSON.stringify({error: "unauthorized (wrong or expired token)"}),{status:403})
        }
    }
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user?.email;
        //const acctok = session?.user?.accessToken
        const user = await User.findOne({email:sessionUser});
        const userid = user._id;
    try{
        const transaction = await Transaction.findById(id).populate("authorId");
        if(transaction?.authorId?._id.toString() !== userid){
            return new Response(JSON.stringify({message:"Only author can delete this transaction"}),{status:403})
        }
        await Transaction.findByIdAndDelete({id })
        return new Response(JSON.stringify({message:"Transaction deleted"}),{status: 200})
    } catch(error) {
        console.log('Transaction delete Error: ',error);
        return new Response(JSON.stringify(null),{status:500})
    }
}


