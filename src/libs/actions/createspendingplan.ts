'use server'
import {NextResponse,NextRequest} from "next/server";
import type { NextApiRequest, NextApiResponse } from "next/types";

import Spendingplan from "@/models/spendingplanModel";
//import Category from "@/src/models/categoryModel";
import {getServerSession} from "next-auth"
import {authOptions}from"@/app/api/auth/[...nextauth]/route";
import User from "@/models/userModel";
import { getToken } from "next-auth/jwt";

import {revalidatePath} from 'next/cache';

const createSpendingPlanAction = async (FormData:FormData) => {
    const secret = process.env.NEXTAUTH_SECRET;
        const session = await getServerSession(authOptions);
        //const token = await getToken({req,secret});
        const sessionUser = session?.user?._id;
        
        if(session){
          try{
              const session = await getServerSession(authOptions);
              const sessionUser = session?.user?.email;
              const user = await User.findOne({email:sessionUser});
              const userid = user._id;
            //const body = await req.json();
              //const body = FormData.get('body')
                //"authorId":token?.sub,
              const planmonthyear = FormData.get('planmonthyear')
              const mycategoryId = FormData.get('mycategory.mycategoryId')
              const mycategoryTitle=FormData.get('mycategory.title)')
              const isChecked =FormData.get('mycategory.isChecked)')
              const categorynotes = FormData.get('mycategory.categorynotes')
              const planamount = FormData.get('mycategory.planamount')

              const newSpendingplan = await Spendingplan.create(
                {data:{
                  authorId:userid,
                  planmonthyear:planmonthyear as string,
                  mycategoryId:mycategoryId as string,
                  mycategoryTitle:mycategoryTitle as string,
                  isChecked:isChecked as string,
                  planamount:Number(planamount),
                  categorynotes:categorynotes as string
                }

                  });
                console.log('newSpendingplan fr action',newSpendingplan)
              revalidatePath("/spendingplan")
              return new Response(JSON.stringify(newSpendingplan),{status: 201})
          }catch (error:any){
            console.log(error)
            return new Response(JSON.stringify(null),{status:500})
          }
        }
        
      }

export default createSpendingPlanAction

