//import connect from "@/src/libs/database/mongo";
import { getToken } from "next-auth/jwt"
import {NextRequest, NextResponse} from "next/server";
import {getServerSession} from "next-auth"
import {authOptions}from"@/app/api/auth/[...nextauth]/route";
import Income from "@/models/incomeModel";
import User from "@/models/userModel";

export async function GET(req:NextRequest,{ params }: { params: { id: string } } ){
  try{
  const income = await Income.findById(params.id).populate("authorId")
  console.log('GET income route',income)
  return new Response(JSON.stringify(income),{status:200})
  }catch(error){
    
      return new Response(JSON.stringify(null), {status:500})
  }
}

export async function PUT(req:NextRequest,{params}:{ params:{id:string}}){
  //connect();
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
       //const id= {params};
       const id = {params};
       //const acctok = session?.user?.accessToken
       const user = await User.findOne({email:sessionUser});
       const userid = user._id;
       console.log('user ln 43',userid)
   try{ 
       const body = await req.json()
       //console.log('body befor breaks: ',body)
       const income = await Income.findById(id).populate("authorId");
   console.log('id ROUTE PUT(populate) income: ',income)
       if(income?.authorId?._id.toString() !== userid){
           console.log('user ln 50',user._id)
           console.log('author',income?.authorId?._id.toString())
           return new Response(JSON.stringify({message:"Only author can update their income"}),{status:403})
       }
       const updatedIncome = await Income.findByIdAndUpdate(id, {$set:{...body} } ,{new: true})
   console.log('updatedIncome PUT',updatedIncome)
  
   return new Response(JSON.stringify(updatedIncome),{status: 200})


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
      const income = await Income.findById(id).populate("authorId");
      if(income?.authorId?._id.toString() !== userid){
          return new Response(JSON.stringify({message:"Only author can delete their income"}),{status:403})
      }
      await Income.findByIdAndDelete({id })
      return new Response(JSON.stringify({message:"Income deleted"}),{status: 200})
  } catch(error) {
      console.log('Income delete Error: ',error);
      return new Response(JSON.stringify(null),{status:500})
  }
}

