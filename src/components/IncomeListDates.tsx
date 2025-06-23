import {getServerSession} from "next-auth";
import Link from "next/link"
import { BsFillPencilFill } from 'react-icons/bs'
import Income from "@/models/incomeModel";
import User from "@/models/userModel";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";

export default async function IncomeListProps(props:any) {
  const thisMonth = new Date().getMonth()+1;//this is default
  const thisYear = new Date().getFullYear()
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user?.email;
  const user = await User.findOne({email:sessionUser});
  const userid = user._id
  const propsfield = {props};
  console.log('incomelist dates props',propsfield)
  
   console.log('income propsfield',propsfield);
  const incomelist = await Income.aggregate([
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
      incomemonth: {
        $month: "$incomedate"
      },
      incomeyear: {
        $year: "$incomedate"
      },
      month_date: {
        $month: new Date()
      },
      year_date: {
        $year: new Date()
      }
    }
  },
  {
    $project: {
      incomelistid: "$_id",
      incomedate: 1,
      incomedescr: 1,
      incometype: "$incometype",
      day: {
        $dayOfMonth: "$incomedate"
      },
      month: {
        $month: "$incomedate"
      },
      year: {
        $year: "$incomedate"
      },
      incomeamount: 1,
      month_date: 1,
      propsArrayYear: 1,
      propsArrayMonth: 1,
      incomemonth: "$incomemonth",
      incomeyear: "$incomeyear"
    }
  },
  {
    $match: {
      $expr: {
        $and: [
          {
            $eq: [
              "$incomemonth",
              "$propsArrayMonth"
            ]
          },
          {
            $eq: [
              "$incomeyear",
              "$propsArrayYear"
            ]
          }
        ]
      }
    }
  },
  {
    $sort: {
      //"year": -1,
      //"month":1
      incomedate: 1
    }
  }
        
    ])
const incometotals= await Income.aggregate([
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
      incomemonth: {
        $month: "$incomedate"
      },
      incomeyear: {
        $year: "$incomedate"
      },
      month_date: {
        $month: new Date()
      },
      year_date: {
        $year: new Date()
      }
    }
  },
  {
    $project: {
      _id: 0,
      incomelistid: "$_id",
      incomedate: 1,
      //incomedescr: 1,
      incometype: "$incometype",
      day: {
        $dayOfMonth: "$incomedate"
      },
      month: {
        $month: "$incomedate"
      },
      year: {
        $year: "$incomedate"
      },
      incomeamount: 1,
      month_date: 1,
      propsArrayYear: 1,
      propsArrayMonth: 1,
      incomemonth: "$incomemonth",
      incomeyear: "$incomeyear"
    }
  },
  {
    $match: {
      $expr: {
        $and: [
          {
            $eq: [
              "$incomemonth",
              "$propsArrayMonth"
            ]
          },
          {
            $eq: [
              "$incomeyear",
              "$propsArrayYear"
            ]
          }
        ]
      }
    }
  },
  {
    $group: {
      _id: {
        month: "$month",
        year: "$year"
      },
      incometotal: {
        $sum: "$incomeamount"
      }
    }
  }])
    return(
       <>
       
     <pre>GET income list dates:{JSON.stringify(incomelist, null, 2)}</pre>
       
       <div>
       <h1>Income List For:{props.fmonth}/{props.fyear}</h1>
       <div className="spreadsheetCont">
       <div className="font-bold horizGrid grid-cols-6 md:grid-cols-8 w-full align-middle">
            <div className="col-span-2">Month/Day/Year</div>
            <div className="col-span-2">Descr<span className="hidden md:inline-flex">iption</span></div>
            <div className="hidden md:inline-flex md:col-span-2">Type of Account</div>
            {/*<div className="font-bold border-collapse border border-amber-500 w-[200px] p-2">Category</div>*/}
            <div className="col-span-2 py-2">Income Amount</div>
            {/* <div className= "w-[100px] py-2 flex flex-row justify-center gap-3">Edit/Delete</div> */}
        </div>
        {incomelist?.length > 0 ? (incomelist.map( (income,index) => 
          
        <div key={income.id} className="w-full">
        
            <div key={income.id} className="horizGrid grid-cols-6 md:grid-cols-8">
            {/* { transaction.year == `${props.fyear}` && transaction.month == `${props.fmonth}` && transaction.month == `${props.fmonth}` && 
            (`${props.category}` === 'all-categories' ||  transaction.title == `${props.category}`) &&  */}
                    {/* <div>Length:{incomelist?.length}</div> */}
                <div className="col-span-2 p-2">{income.month}/{income.day}/{income.year}</div>
                <div className="col-span-2 p-2 flex-wrap">{income?.incomedescr}</div>
                <div className="hidden md:inline-flex md:col-span-2 p-2">{income.incometype}</div>
                <div className="col-span-2 py-2">{parseFloat(income.incomeamount).toFixed(2)}</div>
                {/* <div className= "w-[100px] py-2 flex flex-row justify-center gap-3"> */}
                {/* <Link
          href={{
            pathname: '/create-income/[id]',
            query: { id: `${income._id.incomelistid}`},
          }}
        ><BsFillPencilFill />
        </Link> */}
        {/* <Link className="flex flex-row gap-1 justify-center" href={`/create-income/${income?._id.incomelistid}`}><BsFillPencilFill /></Link> */}
                {/*<button className="flex flex-row gap-1 justify-center" onClick={() => {router.push(`/create-income/${income._id.incomelistid}`)}}><BsFillPencilFill />Edit/Del</Link>
                <Link className="flex flex-row gap-1 justify-center" href={`/transaction/${transaction?._id}`}><BsFillPencilFill /></Link>
                <RemoveTransaction className="flex flex-row gap-1 justify-center" id={transaction._id} />*/}
                {/* </div> */}
            
            
        {/* } */}
        
            </div>
        </div>
         
       )): 
       <div>There is no income added yet - <Link className="underline font-extrabold" href="/add-income">Add Income</Link></div>}
       
       {incometotals?.length > 0 ? (incometotals.map( (total,index) =>
       <>
       <div className="totals grid-cols-6 md:grid-cols-8">
       <div className="col-span-2 pl-4">Total Income {total._id.month}/{total._id.year}:</div>
          <div className="col-span-2 col-end-7 md:col-end-9">{parseFloat(total.incometotal).toFixed(2)}</div>
       </div>
         </>)):<div>There are no totals</div>
         }
       </div>
       </div>
       
       </>
        
    )
}