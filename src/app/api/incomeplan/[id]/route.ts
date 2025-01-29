import { getToken } from "next-auth/jwt";
import Incomeplan from "@/models/incomeplanModel";
import {NextRequest, NextResponse} from "next/server";
import {getServerSession} from "next-auth"
import {authOptions}from "../../../api/auth/[...nextauth]/route";
import User from "@/models/userModel";
import { ObjectId } from "mongodb";

export async function GET(req:NextRequest,{ params }: { params: { id: ObjectId } }){
try{
    const incomeplan = await Incomeplan.findById(params.id).populate("authorId")
    return new Response(JSON.stringify(incomeplan),{status:200})
} catch (error) {
    console.log('GET id error',error)
    return new Response(JSON.stringify(null),{status:500})
}
}
export async function PUT(req:NextRequest,{ params }: { params: { slug: string } }){
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
        const spendingplan = await Incomeplan.findById(id).populate("authorId");
        console.log('id page spendingplan: ',spendingplan)
        if(spendingplan?.authorId?._id.toString() !== userid){
            return new Response(JSON.stringify({message:"Only author can update his spendingplan"}),{status:403})
        }
        const updatedIncomeplan = await Incomeplan.findByIdAndUpdate(id, {$set:{...body} } ,{new: true})
        console.log('updatedSpendingplan',updatedIncomeplan)
    return new Response(JSON.stringify(updatedIncomeplan),{status: 200})


    } catch(error) {
        console.log('error api Spendingplan: ',error)
        return new Response(JSON.stringify(null),{status:500})
        
    }
}

export async function DELETE(req:NextRequest, { params }:{params:{slug:string}}){
    //await connect();
    const id = {params};
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
        const incomeplan = await Incomeplan.findById(id).populate("authorId");
        if(incomeplan?.authorId?._id.toString() !== userid){
            return new Response(JSON.stringify({message:"Only author can delete this spendingplan"}),{status:403})
        }
        
        await Incomeplan.findByIdAndDelete({id })
        return new Response(JSON.stringify({message:"Incomeplan deleted"}),{status: 200})
    } catch(error) {
        console.log('Incomeplan delete Error: ',error);
        return new Response(JSON.stringify(null),{status:500})
    }
}