import {NextResponse,NextRequest} from "next/server";
import Spendingplan from "@/models/spendingplanModel";
import {getServerSession} from "next-auth"
import {authOptions} from "@/app/api/auth/[...nextauth]/route"
import User from "@/models/userModel";
import { getToken } from "next-auth/jwt";


//monthly spending plan
export async function GET(request:NextRequest,params:number,props:any) {
  try{
    //const transactiontotals = await getTotals();
    //const getplans = await getPlans();
    const getMonth = new Date().getMonth()+1
    const newD = new Date()
    //const month = newD.toLocaleString('default', { month: 'long' });
    const getYear = new Date().getFullYear()
    //const getMonthYear = getMonth +'/' +getYear;
    const session = await getServerSession(authOptions);
    //console.log('session spplancombo',session)
    const sessionUser = session?.user?.email;
    const user = await User.findOne({email:sessionUser});
    const userid = user._id;
    
    const propsfield = {props};
    console.log('spendingplan combo propsfield',propsfield);
    const spendingplansagg = await Spendingplan.aggregate([

          {$match: { $expr : { $eq: [ '$authorId' , { $toObjectId: userid } ] } }
           },
          //  {
          //   $addFields: {
          //     propsArray: {
          //       $objectToArray: propsfield,
          //     }
          //   }
          // },
          {
            $addFields: {
              month_date: {"$month": new Date() } ,
              year_date: {"$year": new Date() } ,
            propsArray: {
              $objectToArray: {
                $ifNull: ["$propfield", null]
              }
              //$objectToArray: propsfield,
            }}
          },
          {
            $addFields: {
           
              propsArrayYear: {
                $arrayElemAt: ["$propsArray.v.fyear", 0]
              },
              propsArrayMonth: {
                $arrayElemAt: ["$propsArray.v.fmonth", 0]
              },
              propsArrayCategory: {
                $arrayElemAt: [
                  "$propsArray.v.category",
                  0
                ]
              }
            }
          },
          { 
            $addFields: {
              planmonth: {
                $month: "$planmonthyear"
              },
              planyear: {
                $year: "$planmonthyear"
              },
              propsMonth :{$ifNull:["$propsArrayMonth","$month_date"]},
              propsYear :{$ifNull:["$propsArrayYear","$year_date"]},
              propsCategory:{$ifNull:["$propsArrayCategory","all-categories"]}
            },
          },
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ["$planmonth","$propsMonth"]
                  },
                  {
                    $eq: ["$planyear", "$propsYear"]
                  }
                ]
              }
            }
          },
           {
            $project: {
              _id:1,
              //propsArrayCategory:"$propsArrayCategory",
              propsYear: {$toInt: "$propsYear"},
              propsMonth: {$toInt: "$propsMonth"},
              //authorId: 1,
              planyear:"$planyear",
              planmonth:"$planmonth",
              // planyear: {
              //   $year: "$planmonthyear",
              // },
              // planmonth: {
              //   $month: "$planmonthyear",
              // },
              mycategories: 1,
            },
          },
          // {
          //   $match: {
          //     $expr: {
          //       $and: [
          //         {
          //           $eq: ["$planmonth","$propsMonth"]
          //         },
          //         {
          //           $eq: ["$planyear", "$propsYear"]
          //         }
          //       ]
          //     }
          //   }
          // },
          {
            $addFields: {
              mycategories_details: {
                $arrayElemAt: ["$mycategories", 0],
              },
            },
          },
          {
            $unwind: {
              path: "$mycategories",
            },
          },
          
          {
            $lookup: {
              from: "categories",
              let: {
                mycategoryId: {
                  $toObjectId:
                    "$mycategories.mycategoryId",
                },
                isChecked: "$mycategories.isChecked",
                planamountA: "$mycategories.planamount",
                categorynotes:"$mycategories.categorynotes",
                explain:"$mycategories.explain",
              },
              pipeline: [
                {
                  $addFields: {
                    title: "$title",
                    category: "$_id",
                  },
                },
               
              
                {
                  $project: {
                    planmonth:"$planmonth",
                    planyear:"$planyear",
                    propsYear:"$propsYear",
                    propsMonth:"$propsMonth",
                    mycategoryId: "$$mycategoryId",
                    planamount: "$$planamountA",
                    isChecked:"$$isChecked",
                    categorynotes:"$$categorynotes",
                    explain:"$$explain",
                    title: "$title",
                    category: "$category",
                    planmonthyear: 1,
                  },
                },
                {
                  $match: {
                    $expr: {
                      $eq: ["$category", "$mycategoryId"],
                    },
                  },
                },
              ],
              as: "mycategories",
            },
          },
          {
            $unwind: "$mycategories",
          },
         
          {
            $project: {
              isChecked:"$mycategories.isChecked",
              planamount:"$mycategories.planamount",
              planyear: 1,
              planmonth: 1,
              propsYear:1,
              propsMonth:1,
              mycategories: 1,
              propsArray:1,
              
              //isChecked:"$mycategories.isChecked",
              totalamount:"$amount"
            },
          },
          
          ])
          return new Response(JSON.stringify(spendingplansagg),{status:201})
        }catch(error){
          console.log('error spendingplans GET',error)
            return new Response(JSON.stringify(null), {status:500})
        }

      //   const transactionstotalspw = await Spendingplan.aggregate([
      //       { $match: {
      //           $expr : { $eq: [ '$authorId' , { $toObjectId: userid } ] } 
      //       }
      //     },
      //     {
      //       $addFields: {
      //         propsArray: {$objectToArray: propsfield},
      //         planmonth: { $month: "$planmonthyear"},
      //         planyear: {$year: "$planmonthyear"},
      //       }
      //     },
         
      //     {
      //       $project: {
      //         //authorId: 1,
      //         planmonth: "$planmonth",
      //         planyear:"$planyear",
      //         propsArrayYear: {
      //           $toInt:{$arrayElemAt: ["$propsArray.v.fyear", 0]}
      //         },
      //         propsArrayMonth: {
      //           $toInt:{$arrayElemAt: ["$propsArray.v.fmonth", 0]}
      //         },
      //         propsArrayCategory: {
      //           $arrayElemAt: [
      //             "$propsArray.v.category",
      //             0
      //           ]
      //         },
              
      //         mycategories: 1,
      //         planamount:"$mycategories.planamount",
              
              
      //       },
      //     },
      //     {
      //       $match: {
      //         $expr: {
      //           $and: [
      //             {
      //               $eq: ["$planmonth", "$propsArrayMonth"],
      //             },
      //             {
      //               $eq: ["$planyear", "$propsArrayYear"],
      //             },
      //           ],
      //         },
      //       },
      //     },
      //     {
      //       $project: {
      //         // propsmonth:"$propsArrayMonth",
      //         // propsyear:"$propsArrayYear",
      //         // planyear: 1,
      //         // planmonth: 1,
      //         // mycategories: "$mycategories",
      //         planamount:"$planamount",
      //         cattotal: { $sum: "$planamount" },
      //       },
      //     },

      // ])

    }