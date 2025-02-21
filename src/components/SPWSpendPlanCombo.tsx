//import {headers} from "next/headers"
//import Transaction from "@/models/transactionModel";
import {getServerSession} from "next-auth"
import {authOptions} from "@/app/api/auth/[...nextauth]/route"
import User from "@/models/userModel";
import Spendingplan from "@/models/spendingplanModel";
import Link from "next/link";
import { BsFillPencilFill } from 'react-icons/bs'

//monthly spending plan
export default async function SPCategoryView(props:any) {
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
    const spendingplanloc = await Spendingplan.aggregate([

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
      
    return(
      <>
    {/*<pre>SPW GET spendingplanloc:{JSON.stringify(spendingplanloc, null, 2)}</pre>
        <pre>SPW GET transactionstotalspw:{JSON.stringify(transactionstotalspw, null, 2)}</pre>
          <pre>GET props:{JSON.stringify(props, null, 2)}</pre>*/}
       <div className="my-5 flex flex-col place-items-center">
       <h1>Monthly Spending Plan: {props.fmonth}/{props.fyear}<br /></h1>
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
             {/* <h1>Plan Date: {spendingplanloc.planmonth}/{spendingplanloc.planyear}</h1>  */}
      {spendingplanloc?.length > -1 ? (spendingplanloc.map((spending:any,index:number) =>
       <>
        <div className="sheet flex flex-row col-5 w-full" key={index}>
          <div className="border border-amber-500 w-full p-2 font-bold">{spending.mycategories?.title}</div>
            <div className="border border-amber-500 w-full p-2 ">{spending.mycategories?.categorynotes}</div>
           
            {/*<div className="border border-amber-5w-fullpx] p-2 ">{spending.planmonth}/{spending.planyear}</div>*/}
            <div className="border border-amber-500 w-full p-2 ">{parseFloat(spending.planamount).toFixed(2)}</div>
            <div className="border border-amber-500 w-full p-2 ">{spending.mycategories?.explain}</div>
            <div className="editCol border border-amber-500 w-full p-2 "><Link href={`/spendingplans/${spending?._id}`}><BsFillPencilFill /></Link></div>
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