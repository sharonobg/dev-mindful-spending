//import connect from "../../../libs/mongodb";
//import clientPromise from "@/src/libs/database/clientPromise";
import User from "@/models/userModel";
import {getToken} from "next-auth/jwt"
import {NextRequest,NextResponse} from "next/server";
import Category from "@/models/categoryModel";
import {getServerSession} from "next-auth";
//import User from "@/src/models/userModel";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
//session user can create a category- the session userId will be the categoryOwnerId which determines which categories are owned by the user
//spending plan:
//the category will be added to the users spending-plan and will appear in the list of mycategories which are checked(true): default categories and owned categories (sorted alpha)
//followed by existing unchecked categories and owned categories
export async function GET(req:NextRequest){

    const secret = process.env.NEXTAUTH_SECRET;
    //const secret = await getEncryptedParameter('/prod/NEXTAUTH_SECRET')
    const token = await getToken({req,secret});
    const session = await getServerSession(authOptions);
    
    // const sessionUser = session?.user?._id;
    // const user = await User.findOne({email:sessionUser});
    //const userid = user?._id
     if(!token){
            return NextResponse.json(
              // {message: "Spendingplan deleted"},
              // {status: 500}
              {error: "unauthorized (wrong or expired token)"},
            {status:403})
        }
    
        try{
            const categories= await Category.find().sort({ title: 1 }).lean();
            //console.log('categories api',categories)
            return NextResponse.json(categories)
        }catch(error){
            console.log("category error no token", error)
            return new Response(JSON.stringify(null), {status:500})
    
    }
    
     
    
}
//POST will be for the 5 extra categories - TODO
export async function POST(req:NextRequest){
    //await connect();
    const secret = process.env.NEXTAUTH_SECRET;
    //const secret = await getEncryptedParameter('/prod/NEXTAUTH_SECRET')
    const token = await getToken({req,secret});
    const session = await getServerSession(authOptions);
   
    
    //const accessToken = request.headers.get("authorization")
    //const thisToken = getToken();
    //const decodedToken = (value: string | undefined)
   if(!token){
            return NextResponse.json(
              // {message: "Spendingplan deleted"},
              // {status: 500}
              {error: "unauthorized (wrong or expired token)"},
            {status:403})
        }
    try{
        const category = await req.json();
        //console.log('newCategory category',category)
        const newCategory = await Category.create(category);
        //console.log('newCategory',newCategory)
        console.log('session triggered')
        return new Response(JSON.stringify(newCategory),{status: 201})
    }catch (error){
        return new Response(JSON.stringify(null),{status:500})
    }
}


