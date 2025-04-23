
import {getServerSession} from "next-auth"
import {authOptions} from "@/app/api/auth/[...nextauth]/route"
import User from "@/models/userModel";
import Spendingplan from "@/models/spendingplanModel";
import Link from "next/link";
import { BsFillPencilFill } from 'react-icons/bs'
import Transaction from "@/models/transactionModel";

//monthly spending plan
export default async function MonthlySpendingPlan(props:any) {
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
    const userid = user._id
    const propsfield = {props};
    console.log('spendingplan combo propsfield',propsfield);
    const spendingplanloccats = await Spendingplan.aggregate([

          {$match: { $expr : { $eq: [ '$authorId' , { $toObjectId: userid } ] } }
           },
           {
            $addFields: {
              propsArray: {
                $objectToArray: propsfield,
              }
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
              planmonth: {
                $month: "$planmonthyear"
              },
              planyear: {
                $year: "$planmonthyear"
              }
            }
          },
          
        
           {
            $project: {
              _id:1,
              //propsArrayCategory:"$propsArrayCategory",
              propsArrayYear: {$toInt: "$propsArrayYear"},
              propsArrayMonth: {$toInt: "$propsArrayMonth"},
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
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ["$planmonth","$propsArrayMonth"]
                  },
                  {
                    $eq: ["$planyear", "$propsArrayYear"]
                  }
                ]
              }
            }
          },
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
                    propsArrayYear:"$propsArrayYear",
                    propsArrayMonth:"$propsArrayMonth",
                    mycategoryId: "$$mycategoryId",
                    planamount: "$$planamountA",
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
              
              planyear: 1,
              planmonth: 1,
              propsArrayYear:1,
              propsArrayMonth:1,
              mycategories: 1,
              propsArray:1,
              planfield: {$cond: [{$not: ["$mycategories.mycategoryId"]}, "$categoryId", "$mycategories.mycategoryId"]} ,
          catfield: {$cond: [{$not: ["$categoryId"]}, "$mycategories.mycategoryId", "$categoryId"]} ,
          
              planamount:"$mycategories.planamount",
              totalamount:"$amount"
            },
          },
     
          
          ])


        const transactionstotalspw = await Spendingplan.aggregate([
            { $match: {
                $expr : { $eq: [ '$authorId' , { $toObjectId: userid } ] } 
            }
          },
          {
            $addFields: {
              propsArray: {$objectToArray: propsfield},
              planmonth: { $month: "$planmonthyear"},
              planyear: {$year: "$planmonthyear"},
            }
          },
         
          {
            $project: {
              //authorId: 1,
              planmonth: "$planmonth",
              planyear:"$planyear",
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
              
              mycategories: 1,
              planamount:"$mycategories.planamount",
              
              
            },
          },
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ["$planmonth", "$propsArrayMonth"],
                  },
                  {
                    $eq: ["$planyear", "$propsArrayYear"],
                  },
                ],
              },
            },
          },
          {
            $project: {
              // propsmonth:"$propsArrayMonth",
              // propsyear:"$propsArrayYear",
              // planyear: 1,
              // planmonth: 1,
              // mycategories: "$mycategories",
              planamount:"$planamount",
              cattotal: { $sum: "$planamount" },
            },
          },

      ])
      //console.log("spendingplanloc: ",spendingplanloc)
      const transactionscategories = await Transaction.aggregate([
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
          month_date: {"$month": new Date() } ,
          year_date: {"$year": new Date() } ,
        }
      },
      {
      $match: {
        $expr: {
          $and: [
            {
              $eq: ["$transactionmonth","$propsArrayMonth"]
            },
            {
              $eq: ["$transactionyear", "$propsArrayYear"]
            }
          ]
        }
      }
      },
      {
        $lookup: {
          from: "categories",
          let: {
            categoryId: {
              $toObjectId: "$categoryId"
            },
            firstamount: {
              $sum: "$amount"
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
              $addFields: {
                titleLower: {
                  $toLower: "$title"
                }
              }
            },
            {
              $project: {
                //transactionmonth:"$transactionmonth"
                //,
                categoryId: 1,
                title: 1,
                titleLower: "$titleLower",
                category: "$category",
                transdate: 1,
                descr: 1,
                plaintitle: "$category.title",
                amount: 1,
                firstamount: "$$firstamount"
              }
            }
          ],
          as: "category"
        }
      },
      {
        $unwind: "$category"
      },
      // {
      //   $match: {
      //     $expr: {
      //       // $and: [
      //       // {
      //       $eq: [
      //         "$mycategories.mycategoryId",
      //         "$_id"
      //       ]
      //     }
      //   }
      // },
      {
        $project: {
          //_id: 0,
          planfield: {$cond: [{$not: ["$mycategories.mycategoryId"]}, "", "$mycategories.mycategoryId"]} ,
          catfield: {$cond: [{$not: ["$categoryId"]}, "$mycategories.mycategoryId", "$categoryId"]} ,
          category:1,
          categoryTitle: "$category.title",
          categoryId: "$categoryId",
          amount: "$amount",
          transactionmonth: "$transactionmonth",
          transactionyear: "$transactionyear",
          propsArrayYear: {
            $toInt: "$propsArrayYear"
          },
          propsArrayMonth: {
            $toInt: "$propsArrayMonth"
          }
        }
      },
      {
        $group:
          {
            _id: {
              category: "$categoryId",
              title: "$categoryTitle"
            },
            catsum: {
              $sum: "$amount"
            }
          }
      },
      
      {
        $sort: {
          "_id.title": 1
        }
      }
      ])
    return(
      <>
    <pre>spendingplanloccats:{JSON.stringify(spendingplanloccats, null, 2)}</pre>
       {/*} <pre>SPW GET transactionstotalspw:{JSON.stringify(transactionstotalspw, null, 2)}</pre>
          <pre>GET props:{JSON.stringify(props, null, 2)}</pre>*/}
       <div className="my-5 flex flex-col place-items-center">
       <h1>Monthly Spending Plan All Cats: {props.fmonth}/{props.fyear}<br /></h1>
       </div>
       <div className="justify-center">
          <div className="spreadsheetCont">
            <div className="sheet font-bold col-5 w-full">
              <div className="w-full p-2">Category</div>
              <div className="w-full p-2">Category Notes</div>
              <div className="w-full p-2">Planned Amount</div>
              <div className="w-full p-2">Explain</div>
              <div className="w-full p-2">Edit/Delete</div>
            </div>
             {/* <h1>Plan Date: {spendingplanloccats.planmonth}/{spendingplanloccats.planyear}</h1>  */}
      {spendingplanloccats?.length > -1 ? (spendingplanloccats.map((spending:any,index:number) =>
       <>
        <div className="sheet flex flex-row col-5 w-full" key={index}>
          <div className="border border-amber-500 w-full p-2 font-bold">{spending?.catfield}{spending.mycategories?.title}</div>
            <div className="border border-amber-500 w-full p-2 ">{spending.mycategories?.categorynotes}</div>
           
            {/*<div className="border border-amber-5w-fullpx] p-2 ">{spending.planmonth}/{spending.planyear}</div>*/}
            <div className="border border-amber-500 w-full p-2 ">{parseFloat(spending.planamount).toFixed(2)}</div>
           
            <div className="border border-amber-500 w-full p-2 font-bold">
            plan:{spending?.planfield}cat:{spending?.catfield}
              </div>
            <div className="editCol border border-amber-500 w-full p-2 "><Link href={`/spendingplans-page/${spending?._id}`}><BsFillPencilFill /></Link></div>
            {/*<div className="border border-amber-500 w-[200px] p-2">{spending.mycategories?._id}</div>*/}
         </div>
        {/* </div>     */}
        
        </>)):("cant find plan")
        }

{/*<pre>transactionstotalspw:{JSON.stringify(transactionstotalspw,null,2)}</pre>*/}
      {transactionstotalspw?.length > -1 ? (transactionstotalspw.map((sptotal) =>
           <div key={sptotal._id} className="w-[800px] justify-around flex p-2 border-2 border-amber-500 font-bold">
              <div>Plan Total:</div>
              <div>{parseFloat(sptotal.cattotal).toFixed(2)}</div>
              
          </div>)):("no totals")} 
    
          </div> 
          </div>
        </>) 
}