//import connect from "../../../libs/mongodb";
//import{verifyToken} from '../../../libs/jwt'
import {NextResponse,NextRequest} from "next/server";
import {getToken} from "next-auth/jwt"
import User from "@/models/userModel";
import Transaction from "@/models/transactionModel";
//import Category from "../../../models/categoryModel";
import {getServerSession} from "next-auth"
import {authOptions} from"@/app/api/auth/[...nextauth]/route"
import Spendingplan from "@/models/spendingplanModel";

export async function GET(req:NextRequest){
    //send data as JSON
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
        //await connect();
        const session = await getServerSession(authOptions);
        //console.log('filters session',session)
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
      month_date: {
        $month: new Date()
      },
      year_date: {
        $year: new Date()
      }
    }
  },
  {
    $lookup: {
      from: "categories",
      let: {
        categoryId: {
          $toObjectId: "$categoryId"
        }
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ["$_id", "$$categoryId"]
            }
          }
        },
        {
          $project: {
            //_id:0,
            day: {
              $dayOfMonth: "$transdate"
            },
            month: {
              $month: "$transdate"
            },
            year: {
              $year: "$transdate"
            },
            descr: 1,
            categoryId: "$categoryId",
            propsArraycategory:
              "$propsArray.v.category",
            title: {
              $toLower: "$title"
            },
            amount: 1
          }
        }
      ],
      as: "category"
    }
  },
  {
    $unwind: "$category"
  },
  {
    $lookup: {
      from: "spendingplans",
      let: {
        authorId: "$authorId",
        month: {
          $month: "$transdate"
        },
        year: {
          $year: "$transdate"
        }
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ["$authorId", "$$authorId"]
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
            }
          }
        },
        {
          $match: {
            $expr: {
              $and: [
                {
                  $eq: ["$planmonth", "$$month"]
                },
                {
                  $eq: ["$planyear", "$$year"]
                }
              ]
            }
          }
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
              categoryId: "$categoryId",
              categoryTitle: "$title",
              titleLower: "$titleLower"
            }
          }
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
            newRoot: "$date"
          }
        }
      ],
      as: "myspendingplans"
    }
  },
  {
    $project: {
      categoryId: "$categoryId",
      categoryTitle: "$category.title",
      titleLower: "$titleLower",
      //month : {$month : "$transdate"},
      //year : {$year :  "$transdate"},
      planmonth: {
        $toString: {
          $month: "$planmonth"
        }
      },
      planyear: {
        $toString: {
          $month: "$planyear"
        }
      },
      month: {
        $toString: {
          $month: "$transdate"
        }
      },
      year: {
        $toString: {
          $year: "$transdate"
        }
      },
      month_date: 1,
      year_date: 1,
      //date:{
      //  month : $month,
      //  year : $year,
      //},

      count: {
        $sum: 1
      }

      //doc_date:1
    }
  },
  {
    $group: {
      _id: {
        //categoryId: "$categoryId",
        categoryTitle: "$categoryTitle",
        //titleLower: "$titleLower",
        year: "$year",
        month: "$month"
        //month_date: "$month_date",
        //year_date: "$year_date"
      },
      count: {
        $sum: 1
      }
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


