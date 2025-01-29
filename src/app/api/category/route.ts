//import connect from "../../../libs/mongodb";
//import clientPromise from "@/src/libs/database/clientPromise";
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
    //console.log('token',token);
    // const sessionUser = session?.user?._id;
    // const user = await User.findOne({email:sessionUser});
    //const userid = user?._id
    if(token){
        try{
            //console.log('token',token)
            const categories= await Category.find().sort({ title: 1 });
            //console.log('categories api',categories)
            return NextResponse.json(

                {categories},
                //{message: "Categories list works"},
               // {status: 201}
            )
        }catch(error){
            console.log("category error", error)
            return new Response(JSON.stringify(null), {status:500})
        }
    }else{
        console.log("not logged in - category error")
        return

    }
    
}
//POST will be for the 5 extra categories - TODO
export async function POST(request:NextRequest){
    //await connect();
    const session = await getServerSession(authOptions);
    //const accessToken = request.headers.get("authorization")
    //const thisToken = getToken();
    //const decodedToken = (value: string | undefined)
    if(!session){
        
        return new Response(JSON.stringify({error: "unauthorized (wrong or expired token)"}),{status:403})
    }
    try{
        const body = await request.json();
        const newCategory = await Category.create(body);
        return new Response(JSON.stringify(newCategory),{status: 201})
    }catch (error){
        return new Response(JSON.stringify(null),{status:500})
    }
}


