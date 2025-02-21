'use server'
import {NextResponse,NextRequest} from "next/server";
import type { NextApiRequest, NextApiResponse } from "next/types";

import Transaction from "@/models/transactionModel";
//import Category from "@/src/models/categoryModel";
import {getServerSession} from "next-auth"
import {authOptions}from"@/app/api/auth/[...nextauth]/route";
import User from "@/models/userModel";
import { getToken } from "next-auth/jwt";

import {revalidatePath} from 'next/cache';

const createTransactionAction = async (FormData:FormData) => {
    const secret = process.env.NEXTAUTH_SECRET;
        const session = await getServerSession(authOptions);
        //const token = await getToken({req,secret});
        const sessionUser = session?.user?._id;
        
        //console.log('sessionUser',sessionUser)
        if(session){
          try{
              const session = await getServerSession(authOptions);
              const sessionUser = session?.user?.email;
              const user = await User.findOne({email:sessionUser});
              const userid = user._id;
            //const body = await req.json();
              const body = FormData.get('body')
                //"authorId":token?.sub,
                  const transdate = FormData.get('transdate')
                  const descr = FormData.get('descr')
                  const acctype = FormData.get('acctype')
                  const amount = FormData.get('amount')
                  const categoryId = FormData.get('categoryId')
              console.log('transaction body fr route',body)
              const newTransaction = await Transaction.create(
                {data:{
                  authorId:userid,
                  transdate:transdate as string,
                  descr:descr as string,
                  acctype:acctype as string,
                  amount:Number(amount),
                  categoryId:categoryId as string
                }
                  });
              revalidatePath("/spendingplan")
              console.log('newTransaction fr action',newTransaction)
              return new Response(JSON.stringify(newTransaction),{status: 201})
          }catch (error:any){
            console.log(error)
            return new Response(JSON.stringify(null),{status:500})
          }
        }
        
      }

export default createTransactionAction

