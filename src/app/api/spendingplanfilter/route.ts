//import connect from "../../../libs/mongodb";
//import{verifyToken} from '../../../libs/jwt'
import {NextResponse,NextRequest} from "next/server";
import User from "@/models/userModel";
import Transaction from "@/models/transactionModel";
//import Category from "../../../models/categoryModel";
import {getServerSession} from "next-auth"
import {authOptions} from"@/app/api/auth/[...nextauth]/route"
import Spendingplan from "@/models/spendingplanModel";

export async function GET(request:NextRequest){
    //send data as JSON
    try{
        //await connect();
        const session = await getServerSession(authOptions);
        //console.log('filters session',session)
        const sessionUser = session?.user?.email;
        const user = await User.findOne({email:sessionUser});
        const userid = user?._id
        //console.log('filters sessionUser',sessionUser)
        //console.log('filters user',user)
        const spfilters= await Spendingplan.find({authorId:userid})
      //let formattedResult = result.map(({data}) => data)
      //let filtersd = filters.map(({data}) => data)
      //console.log('transactions from route',transactions)
    //  return NextResponse.json(
    //    filters,
    //    {message: "Transactions Filter by Date"},
    //    {status: 201}
    //)
    //}catch(error){
    //    return new Response(JSON.stringify(null), {status:500})
    //}
    return new Response(JSON.stringify(spfilters),{status:200})
    }catch(error){
        return new Response(JSON.stringify(null), {status:500})
    }
}


