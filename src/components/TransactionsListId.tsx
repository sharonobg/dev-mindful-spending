import {getServerSession} from "next-auth";
import Link from "next/link"
import { BsFillPencilFill } from 'react-icons/bs'
import Transaction from "@/models/transactionModel";
import User from "@/models/userModel";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import { headers } from 'next/headers';
//import {ObjectId} from 'mongodb';
import connect from "@/libs/database/mongo";
import Category from '@/models/categoryModel';

await connect()
export default async function TransactionList(props:any) {
  const thisMonth = new Date().getMonth()+1;//this is default
  const thisYear = new Date().getFullYear()
  const session = await getServerSession(authOptions);
  //console.log('session transactionlistid comp',session)
  const sessionUser = session?.user?.email;
  const user = await User.findOne({email:sessionUser});
  const userid = user._id
  const propsfield = {props};
  console.log('transactions propsfield',propsfield)
  
  //const categories = await Category.find();
  const transactions = await Transaction.aggregate([
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
               categoryId:"$categoryId",
               propsArraycategory:"$propsArray.v.category",
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
          propsArrayYear: {
            $toInt: "$propsArrayYear"
          },
          propsArrayMonth: {
            $toInt: "$propsArrayMonth"
          },
          "propsArraycategory":1,
          "transactionyear":1,
          "transactionmonth":1,
          transactionday: {$dayOfMonth: "$transdate"},
          day : {$dayOfMonth : "$transdate"},
          month : {$month : "$transdate"}, 
          year : {$year :  "$transdate"},
          categoryId:"$categoryId",
          title: { $toLower : "$category.title" },
          "amount":1,
          month_date:1,
          sumamount:{$sum:"$amount"},

        }},
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
        "$group" : {
            _id:
            {
              id: "$_id",
              // sumamount:"$sumamount",
              propsArrayYear: "$propsArrayYear",
              propsArrayMonth: "$propsArrayMonth",
              transactionmonth:"$transactionmonth",
              transactionday: {$dayOfMonth: "$transdate"},
              transactionyear:"$transactionyear",
              transdate:"$transdate",
              descr:"$descr",
              acctype:"$acctype",
              day :"$day",
              month : "$month",
              year : "$year",
              categoryId:"$categoryId",
              title: "$title",
             amount:"$amount"
              //month_date:1
            },
            transactiontotal:{$sum: "$amount"},
            
          }
         
  },
//     {
//       "$project" : {
//           _id:"$_id",
        
//           transactiontotalnew:{$sum: "$transactiontotal"},
//           //"totalplanamount": {$sum: "$sumcatotal"}
//         }
     
// },
  {"$sort": { "transactionday": 1 }}
]);

    return (
       <>
       
       {/*<pre>GET transactions:{JSON.stringify(transactions, null, 2)}</pre>
        <pre>GET categories:{JSON.stringify(categories, null, 2)}</pre> */}
       {/*<div>
         <div className="spreadsheetCont">
         {/* propsArrayMonth:"$propsArrayMonth",
                   propsArrayYear:"$propsArrayMonth",propsArrayMonth:"$propsArrayMonth",
        propsArrayYear:"$propsArrayMonth", 
        </div> */}
        
       <h1>My Transactions List:  {props.fmonth}/{props.fyear}<br /></h1>
       <div className="spreadsheetCont">
       <div className="sheet font-bold flex-col-6">
            <div className=""><span className="hidden md:flex">Month/Day/Year</span><span className="flex md:hidden">M/D/Y</span></div>
            <div className="">Category</div>
            <div className="">Description</div>
            <div className="">Type of Account</div>
            {/*<div className="font-bold border-collapse border border-amber-500 w-[200px] p-2">Category</div>*/}
            <div className="">Amount</div>
            <div className="">Edit / Delete</div>
        </div>

        {transactions?.length > -1 ? (transactions.map( (transaction) => 
          
        <div key={transaction.id} className="transactionsList">
        
            <div className="sheet col-6">
            {/* { transaction.year == `${props.fyear}` && transaction.month == `${props.fmonth}` && transaction.month == `${props.fmonth}` && 
            (`${props.category}` === 'all-categories' ||  transaction.title == `${props.category}`) &&  */}
                    {/* <> */}
                <div className="">{transaction?._id.month}/{transaction._id.day}/{transaction._id.year}</div>
                <div className="">{transaction?._id.title}</div>
                <div className="">{transaction?._id.descr}</div>
                <div className="">{transaction?._id.acctype}</div>
                <div className="">{parseFloat(transaction?._id.amount).toFixed(2)}</div>
                <div className= "editCol"> 
                  {/* <button onClick={transaction/{transaction._id.id}>nw</button>  */}
                  <Link href={`/transaction/${transaction?._id.id}`}><BsFillPencilFill /></Link>
                 {/*<Link className="flex flex-row gap-1 justify-center" href={`/transaction/${transaction?._id}`}><BsFillPencilFill /></Link>
                  <Link href={`/transaction/`}><BsFillPencilFill />transaction</Link> */}
                {/* <Link className="flex flex-row gap-1 justify-center" href={`/transaction/${transaction?._id}`}><BsFillPencilFill /></Link>
                <RemoveTransaction className="flex flex-row gap-1 justify-center" id={transaction._id} />*/}
                </div>
                {/* </> */}
            
            
        {/* } */}
            </div>
        </div>
       )): "no transactions are available"}
       
       </div>
       {/* </div> */}
       </>
        
    )
}