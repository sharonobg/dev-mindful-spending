//import connect from "@/src/libs/database/mongo";
import { getToken } from "next-auth/jwt"
import {NextRequest, NextResponse} from "next/server";
import {getServerSession} from "next-auth"
import {authOptions}from"../auth/[...nextauth]/route"
import Spendingplan from "@/models/spendingplanModel";
import User from "@/models/userModel";


//import Transaction from "@/src/models/transactionModel";
//import { ObjectId } from "mongodb";
export async function GET(request:NextRequest){
  //send data as JSON
  try{
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user?.email;
    const user = await User.findOne({email:sessionUser});
    const userid = user._id;
      const spendingplans= await Spendingplan.find({authorId :  userid});
      return new Response(JSON.stringify(spendingplans),{status:201})
  }catch(error){
    
      return new Response(JSON.stringify(null), {status:500})
  }
}

export async function POST(req:NextRequest){
  //await connect();
  const secret = process.env.NEXTAUTH_SECRET;
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user?.email;
  const user = await User.findOne({email:sessionUser});
  //console.log('session spendingplan',session)
  const userid = user._id;
  if(session){
  try{
    
      const body = await req.json();
      const newSpendingplan = await Spendingplan.create(
        {
        "authorId":userid,
        planmonthyear: body.planmonthyear,
        mycategories:[...body.mycategories]
      }
      )
      //console.log("body",body);
      console.log('newSpendingplan fr SP route at create',newSpendingplan)
      return new Response(JSON.stringify(newSpendingplan),{status: 201})
     
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
    await Spendingplan.findByIdAndDelete(id);
    return NextResponse.json(
        
        {message: "Spendingplan deleted"},
        {status: 200}
    )
}

