import {NextResponse,NextRequest} from "next/server";
import User from "@/models/userModel";
import Transaction from "@/models/transactionModel";
import {getServerSession} from "next-auth"
import {authOptions} from"@/app/api/auth/[...nextauth]/route"
import Spendingplan from "@/models/spendingplanModel";

export async function GET(request:NextRequest){
    //send data as JSON
    try{
        //await connect();
        const session = await getServerSession(authOptions);
        const sessionUser = session?.user?.email;
        const user = await User.findOne({email:sessionUser});
        const userid = user?._id
        //console.log('filters sessionUser',sessionUser)
        //console.log('filters user',user)
        const filters= await Transaction.aggregate([
          { $match: {
              $expr : { $eq: [ '$authorId' , { $toObjectId: userid } ] } 
          }},
          
            { 
              $addFields: {
                month_date: {"$month": new Date() } ,
                year_date: {"$year": new Date() }
                }
            },
            {
              $lookup: {
                from: "spendingplans",
                let: {
                  authorId: "$authorId",
                  month: {
                    $month: "$transdate",
                  },
                  year: {
                    $year: "$transdate",
                  },
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ["$authorId", "$$authorId"],
                      },
                    },
                  },
                  {
                    $addFields: {
                      planmonth: {
                        $month: "$planmonthyear",
                      },
                      planyear: {
                        $year: "$planmonthyear",
                      },
                    },
                  },
                  {
                    $match: {
                      $expr: {
                        $and: [
                          {
                            $eq: ["$planmonth", "$$month"],
                          },
                          {
                            $eq: ["$planyear", "$$year"],
                          },
                        ],
                      },
                    },
                  },
                  {
                    $project: {
                      _id: 0,
                      date: {
                        //mycategories: "$mycategories",
                        month: "$$month",
                        year: "$$year",
                        planmonth: "$planmonth",
                        planyear: "$planyear",
                        //categoryId: "$categoryId",
                        //categoryTitle: "$title",
                        //titleLower: "$titleLower",
                      },
                    },
                  },
                  // {
                  //   $match: {
                  //     $expr: {
                  //       $and: [
                  //         {
                  //           $eq: ["$planmonth", "$$month"],
                  //         },
                  //         {
                  //           $eq: ["$planyear", "$$year"],
                  //         },
                  //       ],
                  //     },
                  //   },
                  // },
                  {
                    $replaceRoot: {
                      newRoot: "$date",
                    },
                  },
                ],
                as: "myspendingplans",
              },
            },
            {
              $project: {
                //month : {$month : "$transdate"}, 
                //year : {$year :  "$transdate"},
                planmonth:{$toString:{$month : "$planmonth"}},
                planyear:{$toString:{$month : "$planyear"}},
                month : {$toString:{$month : "$transdate"}}, 
                year : {$toString:{$year :  "$transdate"}},
                month_date:1,
                year_date:1,
                //date:{
                //  month : $month, 
                //  year : $year,
                //},
                
                count:{"$sum":1},
                
                //doc_date:1
              }
            },
            
         {
           "$group":{
             _id:{
               year:"$year",
               month:"$month",
               month_date:"$month_date",
              year_date:"$year_date",
             },
             count:{"$sum":"$count"}
           },
         },
         //{
         //  $project:{
         //      "_id":1,
         //      "$year":1,
         //      "$month":1,
         //      count:1
         //  }
         //}
        {
         "$sort": {
            "year": 1,
          //  "month":-1
             }
         }
        
            
          
      ])
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
    return new Response(JSON.stringify(filters),{status:200})
    }catch(error){
        return new Response(JSON.stringify(null), {status:500})
    }
}


