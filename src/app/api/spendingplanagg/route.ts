import {NextResponse,NextRequest} from "next/server";
import Spendingplan from "@/models/spendingplanModel";
import {getServerSession} from "next-auth"
import {authOptions} from "@/app/api/auth/[...nextauth]/route"
import User from "@/models/userModel";
import { getToken } from "next-auth/jwt";


//monthly spending plan
export async function GET(req:NextRequest,params:number,props:any) {
  const secret = process.env.NEXTAUTH_SECRET;
   const token = await getToken({req,secret});
    if(!token){
          return NextResponse.json(
            // {message: "Spendingplan deleted"},
            // {status: 500}
            {error: "unauthorized (wrong or expired token)"},
            {status:403})
        }
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
           {
            $addFields: {
              propsArray: {
                $objectToArray: {
                  $ifNull: ["$propfield", null]
                }
                //$objectToArray: propsfield,
              }
            }
          },
          {
            $addFields: {
              month_date: {
                $dateAdd: {
                  startDate: new Date(),
                  unit: "month",
                  amount: 0,
                  timezone: "America/New_York"
                }
              },
              year_date: {
                $dateAdd: {
                  startDate: new Date(),
                  unit: "year",
                  amount: 0,
                  timezone: "America/New_York"
                }
              }
              // propsArray: {
              //   $objectToArray: {
              //     $ifNull: ["$propfield", null]
              //   }
              //   //$objectToArray: propsfield,
              // }
            }
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
              },
              this_month: {
                $month: "$month_date"
              },
              this_year: {
                $year: "$year_date"
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
              propsMonth: {
                $ifNull: [
                  "$propsArrayMonth",
                  "$this_month"
                ]
              },
              propsYear: {
                $ifNull: ["$propsArrayYear", "$this_year"]
              },
              propsCategory: {
                $ifNull: [
                  "$propsCategory",
                  "all-categories"
                ]
              }
            }
          },
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ["$planmonth", "$propsMonth"]
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
              _id: 1,
              //propsArrayCategory:"$propsArrayCategory",
              propsYear: "$propsYear",
              month_newdate: {
                $month: "$month_local_date"
              },
              propsMonth: "$propsMonth",
              //authorId: 1,
              planyear: "$planyear",
              planmonth: "$planmonth",
              // planyear: {
              //   $year: "$planmonthyear",
              // },
              // planmonth: {
              //   $month: "$planmonthyear",
              // },
              mycategories: 1
            }
          },
          // {
          //   $addFields: {
          //     propsMonth: {
          //       $ifNull: [
          //         "$propsArrayMonth",
          //         "$month_local_date"
          //       ]
          //     }
          //   }
          // }
          // {
          //   $match: {
          //     $expr: {
          //       $and: [
          //         {
          //           $eq: ["$planmonth", "$propsMonth"]
          //         },
          //         {
          //           $eq: ["$planyear", "$propsYear"]
          //         }
          //       ]
          //     }
          //   }
          // }
          {
            $addFields: {
              mycategories_details: {
                $arrayElemAt: ["$mycategories", 0]
              }
            }
          },
          {
            $unwind: {
              path: "$mycategories"
            }
          },
          {
            $lookup: {
              from: "categories",
              let: {
                mycategoryId: {
                  $toObjectId:
                    "$mycategories.mycategoryId"
                },
                isChecked: "$mycategories.isChecked",
                planamountA: "$mycategories.planamount",
                categorynotes:
                  "$mycategories.categorynotes",
                explain: "$mycategories.explain"
              },
              pipeline: [
                {
                  $addFields: {
                    title: "$title",
                    category: "$_id"
                  }
                },
                {
                  $project: {
                    planmonth: "$planmonth",
                    planyear: "$planyear",
                    propsYear: "$propsYear",
                    propsMonth: "$propsMonth",
                    // month_local_date:"$month_local_date",
                    mycategoryId: "$$mycategoryId",
                    planamount: "$$planamountA",
                    isChecked: "$$isChecked",
                    categorynotes: "$$categorynotes",
                    explain: "$$explain",
                    title: "$title",
                    category: "$category",
                    planmonthyear: 1
                  }
                },
                {
                  $match: {
                    $expr: {
                      $eq: ["$category", "$mycategoryId"]
                    }
                  }
                }
              ],
              as: "mycategories"
            }
          }
          
          ])
          return new Response(JSON.stringify(spendingplansagg),{status:201})
        }catch(error){
          console.log('error spendingplans GET',error)
            return new Response(JSON.stringify(null), {status:500})
        }

     

    }