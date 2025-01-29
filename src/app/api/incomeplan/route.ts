//import connect from "@/src/libs/database/mongo";
import { getToken } from "next-auth/jwt"
import {NextRequest, NextResponse} from "next/server";
import {getServerSession} from "next-auth"
import {authOptions}from"@/app/api/auth/[...nextauth]/route"
import Spendingplan from "@/models/spendingplanModel";
import Incomeplan from "@/models/incomeplanModel";
import User from "@/models/userModel";
//import Transaction from "@/src/models/transactionModel";
//import { ObjectId } from "mongodb";

export async function GET(request:NextRequest){
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user?.email;
  const user = await User.findOne({email:sessionUser});
  const userid = user._id;
  try{
      const incomeplans= await Incomeplan.find({ "authorId": userid });
      return new Response(JSON.stringify(incomeplans),{status:201})
  }catch(error){
      return new Response(JSON.stringify(null), {status:500})
  }
}

export async function POST(req:NextRequest){
  //await connect();
  const secret = process.env.NEXTAUTH_SECRET;
  const session = await getServerSession(authOptions);
  const token = await getToken({req,secret});
  const sessionUser = session?.user?._id;
  //console.log('sessionUser',sessionUser)
  
  if(session){
  try{
    const session = await getServerSession(authOptions);
        const sessionUser = session?.user?.email;
        const user = await User.findOne({email:sessionUser});
        //console.log('session incomeplan',session)
        const userid = user._id;
        //console.log('session',session)
        //console.log('authorId',userid);
        //console.log('user',user)
      const body = await req.json();
      console.log("body",body);
      const newIncomeplan = await Incomeplan.create(
        {
        "authorId":token?.sub,
        incplanmonthyear: body.incplanmonthyear,
        //mycategories:[...body.mycategories]
        plannedIncome:[...body.plannedIncome]
      }
      )
      //console.log("body",body);
      console.log('newIncomeplan fr SP route at create',newIncomeplan)
      return new Response(JSON.stringify(newIncomeplan),{status: 201})
     
  }catch (error){
    console.log('api error',error)
      return (
        new Response(JSON.stringify(null),{status:500})
      )
  }
}
}
  
export async function DELETE(req:NextRequest){
    //send data as json
    const id = req.nextUrl.searchParams.get('id');
    //await connect();
    await Incomeplan.findByIdAndDelete(id);
    return NextResponse.json(
        
        {message: "Incomeplan deleted"},
        {status: 200}
    )
}

