
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
              planmonth: "$planmonth",
              planyear: "$planyear",
              mycategories: {
                mycategoryId:
                  "$mycategories.mycategoryId",
                planamount: "$mycategories.planamount",
                categorynotes:
                  "$mycategories.categorynotes",
                explain: "$mycategories.explain",
                newtitle: "$newtitle",
                // newtitle: {
                //   $arrayElemAt: ["$result.title", 0]
                // },
                // title: "$result.title",
                category: "$category",
                planmonthyear: 1
              }
            }
          }
      ])
    return(
      <>
    <pre>spendingplanloccats:{JSON.stringify(spendingplanloccats, null, 2)}</pre>
       {/*} <pre>SPW GET transactionstotalspw:{JSON.stringify(transactionstotalspw, null, 2)}</pre>
          <pre>GET props:{JSON.stringify(props, null, 2)}</pre>*/}
       <div className="my-5 flex flex-col place-items-center">
       <h1>Monthly Spending Plan All Cats Two: {props.fmonth}/{props.fyear}<br /></h1>
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
           
            
            <div className="editCol border border-amber-500 w-full p-2 "><Link href={`/spendingplans-page/${spending?._id}`}><BsFillPencilFill /></Link></div>
            {/*<div className="border border-amber-500 w-[200px] p-2">{spending.mycategories?._id}</div>*/}
         </div>
        {/* </div>     */}
        
        </>)):("cant find plan")
        }

{/*<pre>transactionstotalspw:{JSON.stringify(transactionstotalspw,null,2)}</pre>*/}
      {/* {transactionstotalspw?.length > -1 ? (transactionstotalspw.map((sptotal) =>
           <div key={sptotal._id} className="w-[800px] justify-around flex p-2 border-2 border-amber-500 font-bold">
              <div>Plan Total:</div>
              <div>{parseFloat(sptotal.cattotal).toFixed(2)}</div>
              
          </div>)):("no totals")}  */}
    
          </div> 
          </div>
        </>) 
}