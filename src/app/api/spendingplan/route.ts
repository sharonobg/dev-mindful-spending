//import connect from "@/src/libs/database/mongo";
import { getToken } from "next-auth/jwt"
import {NextRequest, NextResponse} from "next/server";
import {getServerSession} from "next-auth"
import {authOptions}from"../auth/[...nextauth]/route"
import Spendingplan from "@/models/spendingplanModel";
import User from "@/models/userModel";


//import Transaction from "@/src/models/transactionModel";
//import { ObjectId } from "mongodb";
export async function GET(request:NextRequest,props:any){
  //send data as JSON
  try{
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user?.email;
    const user = await User.findOne({email:sessionUser});
    const userid = user._id;
//     const thisMonth = new Date().getMonth()+1;//this is default
// const thisYear = new Date().getFullYear()
// //PUT THESE BACK or figure another way for props:
//  //const newpropsfield = {params};
//  const dbfilteryear = searchParams?.fyear|| searchParams.fyear ===null ? searchParams.fyear : thisYear;
//  const dbfiltermonth = searchParams?.fmonth || searchParams.fyear ===null ? searchParams.fmonth : thisMonth; 
//  //const filtermonthtotal=searchParams.fmonth? searchParams.fmonth : thisMonth;
//  const filtercategory= searchParams?.category? searchParams?.category : "all-categories"

    // const propsfield = {searchParams};
    // console.log('route params',searchParams.fyear)
    // console.log('route spendingplan combo propsfield',propsfield);
    const spendingplans = await Spendingplan.aggregate([
      {$match: { $expr : { $eq: [ '$authorId' , { $toObjectId: userid } ] } }
       },

       {
        $addFields: {
          planmonth: {
            $month: "$planmonthyear"
          },
          planyear: {
            $year: "$planmonthyear"
          }
        }
      },
      {
        $unwind:
          /**
           * path: Path to the array field.
           * includeArrayIndex: Optional name for index.
           * preserveNullAndEmptyArrays: Optional
           *   toggle to unwind null and empty values.
           */
    
          "$mycategories"
      },
      {
        $lookup:
          /**
           * from: The target collection.
           * localField: The local join field.
           * foreignField: The target join field.
           * as: The name for the results.
           * pipeline: Optional pipeline to run on the foreign collection.
           * let: Optional variables to use in the pipeline field stages.
           */
          {
            from: "categories",
            localField: "mycategories.mycategoryId",
            foreignField: "_id",
            as: "result"
          }
      },
      {
        $addFields: {
          newtitle: {
            $arrayElemAt: ["$result.title", 0]
          }
        }
      },
      {
        $project: {
          id:"$_id",
          planmonth: "$planmonth",
          planyear: "$planyear",
          mycategories: {
            mycategoryId:
              "$mycategories.mycategoryId",
            isChecked:"$mycategories.isChecked",
            planamount: "$mycategories.planamount",
            categorynotes:
              "$mycategories.categorynotes",
            explain: "$mycategories.explain",
            title: "$newtitle",
            // newtitle: {
            //   $arrayElemAt: ["$result.title", 0]
            // },
            // title: "$result.title",
            category: "$category",
            planmonthyear: 1
          }
        }
      },
      {
        $group:
          /**
           * _id: The id of the group.
           * fieldN: The first field name.
           */
          {
            _id: {
              id:"$id",
              planmonth: "$planmonth",
              planyear: "$planyear",
              planmonthyear:"$planmonthyear"
            },
            mycategories: {
              $addToSet: "$mycategories"
            }
          }
      },
      {
        $project:
          /**
           * specifications: The fields to
           *   include or exclude.
           */
          {
            _id: 0,
            id:"$_id.id",
            planmonthyear:"$_id.planmonthyear",
            planmonth: "$_id.planmonth",
            planyear: "$_id.planyear",
            mycategories: "$mycategories"
          }
      }
      // {
      //   $addFields: {
      //     planmonth: {
      //       $arrayElemAt: ["$_id", 0]
      //     }
      //   }
      // }
    ])
    console.log('spendingplans new',spendingplans)
    return new Response(JSON.stringify(spendingplans),{status:201})
  }catch(error){
    
      return new Response(JSON.stringify(null), {status:500})
  }
}

export async function POST(req:NextRequest){
  //await connect();
  const secret = process.env.NEXTAUTH_SECRET;
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user?.email;
  const user = await User.findOne({email:sessionUser});
  //console.log('session spendingplan',session)
  const userid = user._id;
  if(session){
  try{
    
      const body = await req.json();
      const newSpendingplan = await Spendingplan.create(
        {
        "authorId":userid,
        planmonthyear: body.planmonthyear,
        mycategories:[...body.mycategories]
      }
      )
      //console.log("body",body);
      console.log('newSpendingplan fr SP route at create',newSpendingplan)
      return new Response(JSON.stringify(newSpendingplan),{status: 201})
     
  }catch (error){
    console.log('api error',error)
      return (
        new Response(JSON.stringify(null),{status:500})
      )
  }
}
}
  
export async function DELETE(req:NextRequest){
    //send data as json
    const id = req.nextUrl.searchParams.get('id');
    //await connect();
    await Spendingplan.findByIdAndDelete(id);
    return NextResponse.json(
        
        {message: "Spendingplan deleted"},
        {status: 200}
    )
}

