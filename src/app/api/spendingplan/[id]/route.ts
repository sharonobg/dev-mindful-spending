//import { getToken } from "next-auth/jwt";
import Spendingplan from "@/models/spendingplanModel";
import {NextRequest} from "next/server";
import {getServerSession} from "next-auth"
import {authOptions}from "../../../api/auth/[...nextauth]/route";
import User from "@/models/userModel";
import { ObjectId } from "mongodb";

// export async function GET(req:NextRequest,{ params }: { params: { id: ObjectId } }){
    export async function GET(req:NextRequest,{ params }: { params: { id: string} }){
try{
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
            const user = await User.findOne({email:sessionUser});
    const userid = user._id;
        
    const spendingplan = await Spendingplan.findById(params.id).select('-authorId')

    
      console.log('spendingplan api',spendingplan)

    return new Response(JSON.stringify(spendingplan),{status:201})
} catch (error) {
    console.log('GET id error',error)
    return new Response(JSON.stringify(null),{status:500})
  }
}
export async function PUT(req:NextRequest,{ params }: { params:{id:string } }){
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
        const user = await User.findOne({email:sessionUser});
        const userid = user._id;
        const idn = params.id.toString();
        var mongoose = require('mongoose');
        const id = new mongoose.Types.ObjectId(idn);
        //const acctok = session?.user?.accessToken
        console.log('api route SP PLAN PUT id',id)
        
        //console.log('user ln 43',userid)

    try{ 
        const data= await req.json()
        const spendingplan = await Spendingplan.findById(id).populate("authorId");
        if(spendingplan?.authorId?._id.toString() !== userid.toString()){
            return new Response(JSON.stringify({message:"Only author can update his spendingplan"}),{status:403})
        }
        const updatedSpendingplan = await Spendingplan.findByIdAndUpdate(id, {$set:{...data} } ,{new: true})
        console.log('updatedSpendingplan PUT',updatedSpendingplan)
    return new Response(JSON.stringify(updatedSpendingplan),{status: 200})
    } catch(error) {
        console.log('error api PUT Spendingplan: ',error)
        return new Response(JSON.stringify(null),{status:500})
    } 
    
}
export async function PATCH(req:NextRequest,{ params }: { params: { id: string } }){
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
        //console.log('user ln 43',userid)
    try{ 
        const body = await req.json()
        const spendingplan = await Spendingplan.findById(id).populate("authorId");
        //console.log('id page spendingplan: ',spendingplan)
        if(spendingplan?.authorId?._id.toString() !== userid){
            return new Response(JSON.stringify({message:"Only author can update his spendingplan"}),{status:403})
        }
        const updatedSpendingplan = await Spendingplan.findOneAndUpdate(id, {$set:{...body} } ,{new: true})
        //console.log('patch updatedSpendingplan',updatedSpendingplan)
    return new Response(JSON.stringify(updatedSpendingplan),{status: 200})


    } catch(error) {
        console.log('error api patch Spendingplan: ',error)
        return new Response(JSON.stringify(null),{status:500})
        
    }
}
export async function DELETE(req:NextRequest, { params }:{params:{id:string}}){
    //await connect();
    const id = params.id;
    const accessToken = req.headers.get('authorization')
    if(accessToken){
    const token = accessToken.split(" ")[1]
    const decodedToken = token
    if(!accessToken || !decodedToken){
        return new Response(JSON.stringify({error: "unauthorized (wrong or expired token)"}),{status:403})
    }
}
const session = await getServerSession(authOptions);
    const sessionUser = session?.user?.email;
        //const acctok = session?.user?.accessToken
        const user = await User.findOne({email:sessionUser});
        const userid = user._id;
    try{
        const spendingplan = await Spendingplan.findById(id).populate("authorId");
        // const author = spendingplan?.authorId?._id.toString();
        // console.log("author",author)
        // console.log('user',userid.toString())

        if(spendingplan?.authorId?._id.toString() !== userid.toString()){
            return new Response(JSON.stringify({message:"Only author can delete this spendingplan"}),{status:403})
        }
        
        await Spendingplan.findByIdAndDelete(params.id)
        return new Response(JSON.stringify({message:"Spendingplan deleted"}),{status: 200})
    } catch(error) {
        console.log('Spendingplan delete Error: ',error);
        return new Response(JSON.stringify(null),{status:500})
    }
}