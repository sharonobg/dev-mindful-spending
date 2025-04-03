import Category from "@/models/categoryModel";
import {getServerSession} from "next-auth"
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {getToken} from "next-auth/jwt"
import {NextRequest,NextResponse} from "next/server";

//import { Types } from 'mongoose';


export async function GET(req:NextRequest,{ params}: { params:{id: string }}){
    //  const secret = process.env.NEXTAUTH_SECRET;
    //     //const secret = await getEncryptedParameter('/prod/NEXTAUTH_SECRET')
    //     const token = await getToken({req,secret});
        const session = await getServerSession(authOptions);
        //console.log('token',token);
        // const sessionUser = session?.user?._id;
        // const user = await User.findOne({email:sessionUser});
        //const userid = user?._id
        if(session){
    try{
    const category = await Category.findById(params.id).lean();
    return new Response(JSON.stringify(category),{status:200})
} catch (error) {
    console.log('error from category route id ',error)
    return new Response(JSON.stringify(null),{status:500})
}}
}

export async function PUT(req: NextRequest,{ params}: { params:{id: string }}){
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
        console.log('api/cat/route put',category)
        
        const updatedCategory = await Category.findByIdAndUpdate(category, {$set:{...body} } ,{new: true})
    
        console.log('updated/cat/route put: ',updatedCategory)

    return new Response(JSON.stringify(updatedCategory),{status: 200})

    } catch(error) {
        return new Response(JSON.stringify(null),{status:500})
    }
}

export async function DELETE(req:NextRequest,{ params}: { params:{id: string }}){
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