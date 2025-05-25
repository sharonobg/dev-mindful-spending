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
          

        }},
        
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
             amount: "$amount"
              //month_date:1
            },
            amounttotal:{$sum: "$amount"},
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
      "$project" : {
          _id:"$_id",
          
          totalsum: {$sum:"$amounttotal"}
        }
     
  },
  // {"$sort": { "_id.day": 1 }}
  {
    "$sort": {
      "_id.year": -1,
      "_id.month":-1,
      "_id.day":-1
      //"transdate":1
    }
}
]);
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
{
  $project: {
    //_id: 0,
    //category:1,
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
        title: "$categoryTitle",
       
      },
       catsum: {
        $sum: "$amount"
      }
    }
},
{
  $project:{
    category:"$_id.category",
    title:"$_id.title",
    catsum:"$catsum",
    totalamount: {
        $sum: "$catsum"
      }
  }
  

},
{
  $sort: {
    "_id.title": 1
  }
}
])
    return (
       <>
       {/*<pre>Transaction Cats: {JSON.stringify(transactionscategories,null,2)}</pre>
        <pre>GET transactions:{JSON.stringify(transactions, null, 2)}</pre> */}
       <h2 className="font-bold">Categories View and Totals for {props.fmonth}/{props.fyear}:</h2>
       <div className="w-full">
        <div className="amberBorder font-bold grid grid-cols-2 w-full">
            <div className="">Category</div>
            <div className="">Category Total</div>
        </div>
        {transactionscategories?.length > -1 ? (transactionscategories.map( (category) => 
          <>
          <div key={category?._id?.category} className="amberBorder grid grid-cols-2 w-fullr">
            <div>{category?._id?.title}</div>
            <div>{parseFloat(category?.catsum).toFixed(2)}</div>
          </div>
        </>
        )):"data unavailable"}
        </div>
       <h1>My Transactions List:  {props.fmonth}/{props.fyear}<br /></h1>
       <div className="spreadsheetCont w-auto *:min-w-full overflow-scroll">
       <div className="font-bold horizGrid grid-cols-8 md:grid-cols-9">
            <div className="place-items-center"><span className="hidden md:inline-grid">Month/Day/Year</span><span className="flex md:hidden">M/D</span></div>
            <div className="col-span-2 border border-blue-400">Category</div>
            <div className="col-span-2 border border-blue-400">Descr<span className="hidden md:inline-grid">iption</span></div>
            <div className="border border-blue-400 hidden md:inline-grid">Type<span className="hidden md:inline-grid">of Account</span></div>
            {/*<div className="font-bold border-collapse border border-amber-500 w-[200px] p-2">Category</div>*/}
            <div className="col-span-2 border border-blue-400">Amount</div>
            <div className="col-span-['50px'] border border-blue-400">Edit<span className="hidden md:inline-grid"> /Del</span></div>
        </div>

        {transactions?.length > -1 ? (transactions.map( (transaction) => 
          
        <div key={transaction.id} className="transactionsList">
        
            <div className="horizGrid grid-cols-8 md:grid-cols-9">
            {/* { transaction.year == `${props.fyear}` && transaction.month == `${props.fmonth}` && transaction.month == `${props.fmonth}` && 
            (`${props.category}` === 'all-categories' ||  transaction.title == `${props.category}`) &&  */}
                    {/* <> */}
                    
                <div className=" ">{transaction?._id.month}/{transaction._id.day}<span className="hidden md:inline-grid">/{transaction._id.year}</span></div>
                <div className="col-span-2">{transaction?._id.title}</div>
                <div className="col-span-2">{transaction?._id.descr}</div>
                <div className="hidden md:inline-grid">{transaction?._id.acctype}</div>
                <div className="col-span-2">{parseFloat(transaction?._id.amount).toFixed(2)}</div>
                <div className="editCol col-span-[50%]"> 
                  {/* <button onClick={transaction/{transaction._id.id}>nw</button>  */}
                  <Link href={`/transactions-page/${transaction?._id.id}`}><BsFillPencilFill /></Link>
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