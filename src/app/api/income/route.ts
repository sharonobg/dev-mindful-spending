//import connect from "@/src/libs/database/mongo";
import { getToken } from "next-auth/jwt"
import {NextRequest, NextResponse} from "next/server";
import {getServerSession} from "next-auth"
import {authOptions}from"../auth/[...nextauth]/route"
import Income from "../../../models/incomeModel";
import User from "../../../models/userModel";

export async function GET(request:NextRequest,props:any){
  //send data as JSON
  try{
    
    const propsapi = {props}
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user?.email;
    const user = await User.findOne({email:sessionUser});
    const userid = user._id;

    //const headersList = headers();

    const incomes= await Income.find({authorId :  userid});
    console.log('props api income',propsapi)

      return (new Response(JSON.stringify(incomes),{status:201}))
  }catch(error){
      return new Response(JSON.stringify(null), {status:500})
  }
}

export async function POST(req:NextRequest){
  //await connect();
  
const secret = process.env.NEXTAUTH_SECRET;
  //const token = await getToken({req,secret});
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user?.email;
  const user = await User.findOne({email:sessionUser});
  const userid = user._id;
  
  if(session){
  try{
      const body = await req.json();
      //console.log("body",body);
      const newIncome = await Income.create(
        {
        "authorId":userid,
        "incomedate":body.incomedate,
        "incometype":body.incometype,
        "incomedescr":body.incomedescr,
        "incomeamount":body.incomeamount,
        
      }
      )
      //console.log("body",body);
      console.log('newIncome fr SP route at create',newIncome)
      return new Response(JSON.stringify(newIncome),{status: 201})
     
  }catch (error){
    console.log('api income error',error)
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
    await Income.findByIdAndDelete(id);
    return NextResponse.json(
        
        {message: "Income deleted"},
        {status: 200}
    )
}

