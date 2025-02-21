//import clientPromise from "@/src/libs/database/clientPromise";
//import verifyToken from '@/src/libs/database/jwt';
import {NextRequest,NextResponse} from "next/server";
import Category from "@/models/categoryModel";
import {getServerSession} from "next-auth"
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
//import { Types } from 'mongoose';


export async function GET(req:NextRequest,{ params}: { params:{slug: string }}){
    
    try{
    const id = {params};
    const category = await Category.findById(id).lean();
    return new Response(JSON.stringify(category),{status:200})
} catch (error) {
    return new Response(JSON.stringify(null),{status:500})
}
}
export async function PUT(req: NextRequest,{ params}: { params:{slug: string }}){
    //await connect();
    const session = await getServerSession(authOptions);
    if(!session){
        return new Response(JSON.stringify({error: "unauthorized (wrong or expired token)"}),{status:403})
    }
    try{
        const id={params};
        const body = await req.json()
        //console.log('body befor breaks: ',body)
        const category = await Category.findById(id);
        //console.log(category)
        
        const updatedCategory = await Category.findByIdAndUpdate(id, {$set:{...body} } ,{new: true})
    
        //console.log('updated: ',updatedCategory)

    return new Response(JSON.stringify(updatedCategory),{status: 200})

    } catch(error) {
        return new Response(JSON.stringify(null),{status:500})
    }
}

export async function DELETE(req:NextRequest,{ params}: { params:{slug: string }}){
    //await connect();
    const session = await getServerSession(authOptions);
    if(!session){
        return new Response(JSON.stringify({error: "unauthorized (wrong or expired token)"}),{status:403})
    }
    try{
        const id={params};
        const category = await Category.findById(id);
        await Category.findByIdAndDelete(id)
        return new Response(JSON.stringify({message:"Category deleted"}),{status: 200})
    } catch(error) {
        console.log('Error: ',error);
        return new Response(JSON.stringify(null),{status:500})
    }
}