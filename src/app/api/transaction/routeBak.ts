import {NextResponse,NextRequest} from "next/server";
import Transaction from "@/models/transactionModel";
//import Category from "@/src/models/categoryModel";
import {getServerSession} from "next-auth"
import {authOptions}from"../../api/auth/[...nextauth]/route"
import User from "@/models/userModel";
import { getToken } from "next-auth/jwt";

export async function getTransactions(request:NextRequest,params:number){
  //send data as JSON
  try{
      //await connect();
      const yeardate = params;
      const session = await getServerSession(authOptions);
      //console.log('session transaction',session)
      const sessionUser = session?.user?.email;
      const user = await User.findOne({email:sessionUser});
      const userid = user._id;
      //console.log('session',session)
      //console.log('sessionUser',sessionUser)
      //console.log('yeardate',yeardate)
      //console.log('user',user)
      //console.log('userid',userid)
      //console.log('yeardate',yeardate)
      const transactions= await Transaction.aggregate([
        { $match: {
            $expr : { $eq: [ '$authorId' , { $toObjectId: userid } ] } 
        }},
         {
            "$lookup": {
              "from": "categories",
              "let": {
                categoryId: {
                 "$toObjectId": "$categoryId"
                }
              },
              "pipeline": [
                {
                  $match: {
                    $expr: {
                      $eq: [
                        "$_id",
                        "$$categoryId",
                      ]
                    }
                  }
                },
                {
                  $project: {
                    _id:0,
                    day : {$dayOfMonth : "$transdate"},
                    month : {$month : "$transdate"}, 
                    year : {$year :  "$transdate"},
                    "transdate":1,
                   "descr":1,
                   categoryId:"$categoryId",
                   title: { $toLower : '$title' },
                    //title: 1,//category title,
                    amount:1
                    
                  }
                }
              ],
              "as": "category"
            }
          },
          {
            "$unwind": "$category"
          },
          { 
              $addFields: {
                month_date: {"$month": new Date() } 
                }
            },
          {
            $project: {
              "transdate":1,
              "descr":1,
              "acctype":1,
              day : {$dayOfMonth : "$transdate"},
              month : {$month : "$transdate"}, 
              year : {$year :  "$transdate"},
              categoryId:"$categoryId",
              title: { $toLower : "$category.title" },
              "amount":1,
              month_date:1
            }
            
          },
      {
        "$sort": {
          //"year": -1,
          //"month":1
          "transdate":1
        }
    }
        
    ])
    //console.log('transactions from route',transactions)
    return new Response(JSON.stringify(transactions),{status:201})
  }catch(error){
    console.log('error transaction GET',error)
      return new Response(JSON.stringify(null), {status:500})
  }
}
export async function GET(request:NextRequest,params:number){
  //send data as JSON
  try{
      //await connect();
      const yeardate = params;
      const session = await getServerSession(authOptions);
      //console.log('session transaction',session)
      const sessionUser = session?.user?.email;
      const user = await User.findOne({email:sessionUser});
      const userid = user._id;
      //console.log('session',session)
      //console.log('sessionUser',sessionUser)
      //console.log('yeardate',yeardate)
      //console.log('user',user)
      //console.log('userid',userid)
      //console.log('yeardate',yeardate)
      const transactions= await Transaction.aggregate([
        { $match: {
            $expr : { $eq: [ '$authorId' , { $toObjectId: userid } ] } 
        }},
         {
            "$lookup": {
              "from": "categories",
              "let": {
                categoryId: {
                 "$toObjectId": "$categoryId"
                }
              },
              "pipeline": [
                {
                  $match: {
                    $expr: {
                      $eq: [
                        "$_id",
                        "$$categoryId",
                      ]
                    }
                  }
                },
                {
                  $project: {
                    _id:0,
                    day : {$dayOfMonth : "$transdate"},
                    month : {$month : "$transdate"}, 
                    year : {$year :  "$transdate"},
                    "transdate":1,
                   "descr":1,
                   categoryId:"$categoryId",
                   title: { $toLower : '$title' },
                    //title: 1,//category title,
                    amount:1
                    
                  }
                }
              ],
              "as": "category"
            }
          },
          {
            "$unwind": "$category"
          },
          { 
              $addFields: {
                month_date: {"$month": new Date() } 
                }
            },
          {
            $project: {
              "transdate":1,
              "descr":1,
              "acctype":1,
              day : {$dayOfMonth : "$transdate"},
              month : {$month : "$transdate"}, 
              year : {$year :  "$transdate"},
              categoryId:"$categoryId",
              title: { $toLower : "$category.title" },
              "amount":1,
              month_date:1
            }
            
          },
      {
        "$sort": {
          //"year": -1,
          //"month":1
          "transdate":1
        }
    }
        
    ])
    //console.log('transactions from route',transactions)
    return new Response(JSON.stringify(transactions),{status:201})
  }catch(error){
    console.log('error transaction GET',error)
      return new Response(JSON.stringify(null), {status:500})
  }
}
export async function postTransaction(req: NextRequest){
  
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

