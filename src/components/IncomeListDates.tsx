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
  console.log('incomelist dates props',{props})
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
              $arrayElemAt: ["$propsArray.v.fyear", 0]
            },
            propsArrayMonth: {
              $arrayElemAt: ["$propsArray.v.fmonth", 0]
            },
            incomemonth: {
              $month: "$incomedate"
            },
            incomeyear: {
              $year: "$incomedate"
            },
            month_date: {"$month": new Date() } ,
            year_date: {"$year": new Date() } ,
            //date_props:{"$propsfield":"fyear"},
            //year_props:{fyear}
          }
      },
      {
        $match: {
          $expr: {
            $and: [
              {
                $eq: ["$incomemonth","$propsArrayMonth"]
              },
              {
                $eq: ["$incomeyear", "$propsArrayYear"]
              }
            ]
          }
        }
      },
          {
            $project: {
              incomelistid:"$_id",
              "incomedate":1,
              "incomedescr":1,
              incometype:"$incometype",
              day : {$dayOfMonth : "$incomedate"},
              month : {$month : "$incomedate"}, 
              year : {$year :  "$incomedate"},
              "incomeamount":1,
              month_date:1,
              propsArrayYear:1,
              propsArrayMonth:1,
              sumamount:{$sum:"$incomeamount"},

            }
            
          },
         
          {
            "$group" : {
                _id:
                {
                  id: "$_id",
                  incomelistid:"$incomelistid",
                  // sumamount:"$sumamount",
                  propsArrayYear: "$propsArrayYear",
                  propsArrayMonth: "$propsArrayMonth",
                  incomedate:"$incomedate",
                  incomedescr:"$incomedescr",
                  incometype:"$incometype",
                  day :"$day",
                  month : "$month",
                  year : "$year",
                 incomeamount:"$incomeamount"
                  //month_date:1
                },
                incometotal:{$sum: "$incomeamount"},
                
              }
             
      },
      {
        "$sort": {
          //"year": -1,
          //"month":1
          "incomedate":1
        }
    }
        
    ])

    return(
       <>
       
       {/* <pre>GET income list dates:{JSON.stringify(incomelist, null, 2)}</pre> */}
       
       <div>
       <h1 >My Income List: {thisMonth} / {thisYear}/Props:{props.fmonth}/{props.fyear}</h1>
       <div className="spreadsheetCont">
       <div className="sheet font-bold">
            <div className="w-[200px]">Month/Day/Year</div>
            <div className="flex-wrap w-[250px]">Description</div>
            <div className="w-[200px]">Type of Account</div>
            {/*<div className="font-bold border-collapse border border-amber-500 w-[200px] p-2">Category</div>*/}
            <div className="w-[150px] py-2">Income Amount</div>
            <div className= "w-[100px] py-2 flex flex-row justify-center gap-3">Edit/Delete</div>
        </div>
        {incomelist?.length > -1 ? (incomelist.map( (income,index) => 
          
        <div key={income.id} className="transactionsList">
        
            <div key={income.id} className="sheet">
            {/* { transaction.year == `${props.fyear}` && transaction.month == `${props.fmonth}` && transaction.month == `${props.fmonth}` && 
            (`${props.category}` === 'all-categories' ||  transaction.title == `${props.category}`) &&  */}
                    
                <div className="w-[200px] p-2">{income._id.month}/{income._id.day}/{income._id.year}</div>
                <div className="w-[250px] p-2 flex-wrap">{income._id.incomedescr}</div>
                <div className="w-[200px] p-2">{income._id.incometype}</div>
                <div className="w-[150px] py-2">{parseFloat(income._id.incomeamount).toFixed(2)}</div>
                <div className= "w-[100px] py-2 flex flex-row justify-center gap-3">
                {/* <Link
          href={{
            pathname: '/create-income/[id]',
            query: { id: `${income._id.incomelistid}`},
          }}
        ><BsFillPencilFill />
        </Link> */}
        <Link className="flex flex-row gap-1 justify-center" href={`/create-income/${income?._id.incomelistid}`}><BsFillPencilFill /></Link>
                {/*<button className="flex flex-row gap-1 justify-center" onClick={() => {router.push(`/create-income/${income._id.incomelistid}`)}}><BsFillPencilFill />Edit/Del</Link>
                <Link className="flex flex-row gap-1 justify-center" href={`/transaction/${transaction?._id}`}><BsFillPencilFill /></Link>
                <RemoveTransaction className="flex flex-row gap-1 justify-center" id={transaction._id} />*/}
                </div>
            
            
        {/* } */}
            </div>
        </div>
       )): "no incomelist available"}
       
       </div></div>
       </>
        
    )
}