//import { getToken } from "next-auth/jwt";
import Spendingplan from "@/models/spendingplanModel";
import {NextRequest} from "next/server";
import {getServerSession} from "next-auth"
import {authOptions}from "../../../api/auth/[...nextauth]/route";
import User from "@/models/userModel";
import { ObjectId } from "mongodb";

export async function GET(req:NextRequest,{ params }: { params: { id: ObjectId } }){
try{
    const accessToken = req.headers.get('authorization')
    if(accessToken){
        const token = accessToken.split(" ")[1]
        const decodedToken = token
        if(!accessToken||decodedToken == null){

        return new Response(JSON.stringify({error: "unauthorized (wrong or expired token)"}),{status:403})
        }
    }
    const spendingplan = await Spendingplan.findById(params.id).populate("authorId").select('-password')
    return new Response(JSON.stringify(spendingplan),{status:200})
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
        //console.log('user ln 43',userid)
    try{ 
        const body = await req.json()
        const spendingplan = await Spendingplan.findById(id).populate("authorId");
        console.log('id page spendingplan: ',spendingplan)
        if(spendingplan?.authorId?._id.toString() !== userid){
            return new Response(JSON.stringify({message:"Only author can update his spendingplan"}),{status:403})
        }
        const updatedSpendingplan = await Spendingplan.findByIdAndUpdate(id, {$set:{...body} } ,{new: true})
        console.log('updatedSpendingplan',updatedSpendingplan)
    return new Response(JSON.stringify(updatedSpendingplan),{status: 200})


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
        const spendingplan = await Spendingplan.findById(id).populate("authorId");
        if(spendingplan?.authorId?._id.toString() !== userid){
            return new Response(JSON.stringify({message:"Only author can delete this spendingplan"}),{status:403})
        }
        
        await Spendingplan.findByIdAndDelete({id })
        return new Response(JSON.stringify({message:"Spendingplan deleted"}),{status: 200})
    } catch(error) {
        console.log('Spendingplan delete Error: ',error);
        return new Response(JSON.stringify(null),{status:500})
    }
}