import {NextResponse,NextRequest} from "next/server";
import Transaction from "@/models/transactionModel";
//import Category from "@/src/models/categoryModel";
import {getServerSession} from "next-auth"
import {authOptions}from"@/app/api/auth/[...nextauth]/route";
import User from "@/models/userModel";
import { getToken } from "next-auth/jwt";
import Spendingplan from "@/models/spendingplanModel";
import Category from "@/models/categoryModel";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { headers } from "next/headers";


//query client should come from provider
const session = await getServerSession(authOptions);
    const sessionUser = session?.user?.email;
    const user = await User.findOne({email:sessionUser});
    const userid = user?._id

export const fetchTransactions = async (): Promise<Transaction[]> => {
  const response = await Transaction.find({authorId:userid});
  return JSON.parse(JSON.stringify(response));
};

// export const updateTransaction = async (updatedTransaction: Transaction): Promise<Transaction> => {
//   const response = await fetch(`/transaction/${Transaction.id}`, {
//     method: 'PUT',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(updatedTransaction),
//   });
//   return response.json();
// };

function useTransactions() {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: async (): Promise<Array<Transaction>> => {
      const response = await fetch('http://localhost/api/transaction')
      return await response.json()
    },
  })
}
export const getTransactions = async (props:any) => {
  //send data as JSON
  try{
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user?.email;
    const user = await User.findOne({email:sessionUser});
    const userid = user?._id
    const categoriesfetch = await Category.find().sort({ title: 1 });
    const categories = JSON.parse(JSON.stringify(categoriesfetch));
    const spendingplansfetch = await Spendingplan.find({authorId:userid});
    const spendingplans = JSON.parse(JSON.stringify(spendingplansfetch));
    const transactionsfetch = await Transaction.find({authorId:userid});
    const transactions = JSON.parse(JSON.stringify(transactionsfetch));
   
    return (
      <>
      <h2>Transactions:{JSON.stringify(transactions,null,2)}</h2>
      <h2>Spendingplans:{JSON.stringify(spendingplans,null,2)}</h2>
      <h2>Categories:{JSON.stringify(categories,null,2)}</h2>
      </>
    )
  }catch(error){
    console.log('error transaction GET',error)
      return new Response(JSON.stringify(null), {status:500})
  }
}

export async function POST(req: NextRequest){
  
  const secret = process.env.NEXTAUTH_SECRET;
  const session = await getServerSession(authOptions);
  const token = await getToken({req,secret});
  const sessionUser = session?.user?._id;
  //console.log('sessionUser',sessionUser)
  if(session){
    try{
        const session = await getServerSession(authOptions);
        const sessionUser = session?.user?.email;
        const user = await User.findOne({email:sessionUser});
        const userid = user._id;
        //console.log('session',session)
        //this is email console.log('sessionUser',sessionUser)
        //const thisAuthorId = userid;
        //console.log('authorId',userid);
        //console.log('sessionUserId',sessionUserId)
        //console.log('yeardate',yeardate)
        //console.log('user',user)
        const body = await req.json();
        console.log('transaction body fr route',body)
        const newTransaction = await Transaction.create(
          {
            "authorId":token?.sub,
            "transdate":body.transdate,
            "descr":body.descr,
            "acctype":body.acctype,
            "amount":body.amount,
            "categoryId":body.categoryId
            });
        //console.log('newTransaction fr route',newTransaction)
        return new Response(JSON.stringify(newTransaction),{status: 201})
    }catch (error:any){
      console.log(error)
      return new Response(JSON.stringify(null),{status:500})
    }
  }
    
}
export async function DELETE(request: NextRequest){
    //send data as json
    const id = request.nextUrl.searchParams.get('id');
    //await connect();
    await Transaction.findByIdAndDelete(id);
    return NextResponse.json(
        
        {message: "Transaction deleted"},
        {status: 200}
    )
}
