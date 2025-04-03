import {NextRequest,NextResponse} from 'next/server';
import {getServerSession} from "next-auth";
import Transaction from "@/models/transactionModel";
import User from "@/models/userModel";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import connect from "@/libs/database/mongo";
import { getToken } from 'next-auth/jwt';

await connect()
export async function GET(request:NextRequest,
  props:any,
  searchParams: {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}){
    try{
        //await connect();
        // const month_date= new Date().getMonth() + 1;
        // const year_date = new Date().getFullYear() ;
        const session = await getServerSession(authOptions);
        //console.log('session transaction',session)
        const sessionUser = session?.user?.email;
        const user = await User.findOne({email:sessionUser});
        const userid = user._id;
        //const propsfield = props ? {props} : null;
        const {fyear,fmonth,category}= props;
        const propsfield = {props};
        const newparams = {searchParams};
        console.log('aggr propsfield',propsfield);
        //console.log('aggr newparams',newparams);
  //const categories = await Category.find();
  const transactionsaggr = await Transaction.aggregate([
    { $match: {
        $expr : { $eq: [ '$authorId' , { $toObjectId: userid } ] } 
    }},
    {
      $addFields: {
        propsArray: {
          $objectToArray: propsfield,
        }
      }
    },
    { 
      $addFields: {
        //description: { $ifNull: [ "$description", "Unspecified" ] }
        month_date: {"$month": new Date() } ,
        year_date: {"$year": new Date() } ,
        propsArrayYear: {
        $toInt:{$arrayElemAt: ["$propsArray.v.fyear", 0]}
        },
        propsArrayMonth: {
          $toInt:{$arrayElemAt: ["$propsArray.v.fmonth", 0]}
        },
        propsArrayCategory: {
          $arrayElemAt: [
            "$propsArray.v.category",
            0
          ]
        },
        transactionday: {
          $dayOfMonth: "$transdate"
        },
        transactionmonth: {
          $month: "$transdate"
        },
        transactionyear: {
          $year: "$transdate"
        },
        
      }
  },
  { 
    $addFields: {
              //description: { $ifNull: [ "$description", "Unspecified" ] }
      propsMonth :{$ifNull:["$propsArrayMonth","$month_date"]},
      propsYear :{$ifNull:["$propsArrayYear","$year_date"]},
      propsCategory:{$ifNull:["$propsArrayCategory","all-categories"]}
    },
  },
     {
        $lookup: {
          from: "categories",
          let: {
            categoryId: {
             "$toObjectId": "$categoryId"
            }
          },
          pipeline: [
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
                //_id:0,
                day : {$dayOfMonth : "$transdate"},
                month : {$month : "$transdate"}, 
                year : {$year :  "$transdate"},
               descr:1,
               propsMonth:"$propsMonth",
               propsYear:"$propsYear",
               categoryId:"$categoryId",
               propsCategory:"$propsC",
               title: { $toLower : '$title' },
               amount:1
                
              }
            }
          ],
          "as": "category"
        }
      },
      { "$unwind": "$category"},
      {$project: {
          "transdate":1,
          "descr":1,
          "acctype":1,
          propsYear: {
            $toInt: "$propsYear"
          },
          propsMonth: {
            $toInt: "$propsMonth"
          },
          "propsCategory":1,
          "transactionyear":1,
          "transactionmonth":1,
          transactionday: {$dayOfMonth: "$transdate"},
          day : {$dayOfMonth : "$transdate"},
          month : {$month : "$transdate"}, 
          year : {$year :  "$transdate"},
          categoryId:"$categoryId",
          title:"$category.title",
          //title: "$category.title" ,
          "amount":1,
          month_date:1,
          sumamount:{$sum:"$amount"},

         }},
        {
          $match: {
            $expr: {
              $and: [
                {
                  $eq: ["$transactionmonth","$propsMonth"]
                },
                {
                  $eq: ["$transactionyear", 
                    "$propsYear"
                  ]
                }
              ]
            }
          }
        },
  //     {
  //       "$group" : {
  //           _id:
  //           {
  //             id: "$_id",
  //             // sumamount:"$sumamount",
  //             propsYear: "$propsYear",
  //             propsMonth: "$propsMonth",
  //             transactionmonth:"$transactionmonth",
  //             transactionday: {$dayOfMonth: "$transdate"},
  //             transactionyear:"$transactionyear",
  //             transdate:"$transdate",
  //             descr:"$descr",
  //             acctype:"$acctype",
  //             day :"$day",
  //             month : "$month",
  //             year : "$year",
  //             categoryId:"$categoryId",
  //             title: "$title",
  //            amount:"$amount"
  //             //month_date:1
  //           },
  //           transactiontotal:{$sum: "$amount"},
            
  //         }
         
  // },
//     {
//       "$project" : {
//           _id:"$_id",
        
//           transactiontotalnew:{$sum: "$transactiontotal"},
//           //"totalplanamount": {$sum: "$sumcatotal"}
//         }
     
// },
  // {"$sort": { "_id.day": 1 }}
  {$project: {
    "transdate":1,
    "descr":1,
    "acctype":1,
    propsYear: {
      $toInt: "$propsYear"
    },
    propsMonth: {
      $toInt: "$propsMonth"
    },
    "propsCategory":1,
    "transactionyear":1,
    "transactionmonth":1,
    transactionday: {$dayOfMonth: "$transdate"},
    day : {$dayOfMonth : "$transdate"},
    month : {$month : "$transdate"}, 
    year : {$year :  "$transdate"},
    categoryId:"$categoryId",
    titlecat:"$titlecat",
    title:1,
    "amount":1,
    month_date:1,
    sumamount:{$sum:"$amount"},

   }},
  {
    "$sort": {
      "_id.year": -1,
      "_id.month":-1,
      "_id.day":-1
      //"transdate":1
    }
}
]);
return new Response(JSON.stringify(transactionsaggr),{status:201})
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
