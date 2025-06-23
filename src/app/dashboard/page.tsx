import Link from 'next/link';
import {getServerSession} from "next-auth";
import {authOptions} from "../api/auth/[...nextauth]/route";
import TransactionsListId from '@/components/TransactionsListId';
import TransactionsListIdWithCats from '@/components/TransactionsListIdWithCats';
import IncomeListDates from '../../components/IncomeListDates';
import Filters from '@/components/Filters';
import MonthlySpendingPlan from '@/components/MonthlySpendingPlan';
import SpendingPlanRunningTot from '@/components/SpendingPlanRunningTot';
import SpendingPlanRunningNewCatsNOTYET from '@/components/SpendingPlanRunningNewCatsNOTYET';
import SpendingPlanRunningNewCatsAgainYET from '@/components/SpendingPlanRunningNewCatsAgainYET';

// import Testserver from '@/obsolete/Testserver';
import Spendingplan from '@/models/spendingplanModel';
import User from '@/models/userModel';
import SpendingPlanList from '@/components/SpendingPlanList';
//import MonthlySpendingPlanAllCatsT from '@/components/MonthlySpendingPlanAllCatsT';
export default async function Dashboard({searchParams,
}: {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  //import IncomeplanList from '@/src/components/IncomeplanList';
const session = await getServerSession(authOptions);
const sessionUser = session?.user?.email;
const user = await User.findOne({email:sessionUser});
const userid = user?._id
// console.log('session',session)
const spendingplanslist = await Spendingplan.aggregate([
  { $match: {
    $expr : { $eq: [ '$authorId' , { $toObjectId: userid } ] } 
}},
{$addFields : {dateField : new Date()}},
{
  $project: {
    //_id:0,
    day : {$dayOfMonth : "$planmonthyear"},
    month : {$month : "$planmonthyear"}, 
    year : {$year :  "$planmonthyear"},
    "planmonthyear":1,
    month_date: {"$month": new Date() } ,
    year_date: {"$year": new Date() } ,
    mycategories:"$mycategories"
  }
}
] 
)
//const propsProvided = propsProvided
const thisMonth = new Date().getMonth()+1;//this is default
const thisYear = new Date().getFullYear()

//PUT THESE BACK or figure another way for props:
 const dbfilteryear = searchParams?.fyear|| searchParams.fyear ===null ? searchParams.fyear : thisYear;
 const dbfiltermonth = searchParams?.fmonth || searchParams.fyear ===null ? searchParams.fmonth : thisMonth; 
 const filtercategory= searchParams?.category? searchParams?.category : "all-categories"

  return (

    <>
         
   <div className="dashboardDiv">
    
    {session && session?.user?.email ? 
    (
      <>
      <h1 className="largeTxt">My Spending</h1>
      <h2><Link className="underline font-extrabold" href="/transactions-page">Add a Transaction</Link></h2>
      
      
      <Filters />
      
    
      <SpendingPlanList spendingplanslist={spendingplanslist}/>
      <h2>SpendingPlanRunningNewCatsNOTYET</h2>
      <SpendingPlanRunningNewCatsNOTYET fyear={dbfilteryear} fmonth={dbfiltermonth} category={filtercategory} />
      <SpendingPlanRunningNewCatsAgainYET fyear={dbfilteryear} fmonth={dbfiltermonth} category={filtercategory} />
      {/* <MonthlySpendingPlanAllCatsT fyear={dbfilteryear} fmonth={dbfiltermonth} category={filtercategory} /> */}
      <TransactionsListId fyear={dbfilteryear} fmonth={dbfiltermonth} category={filtercategory} />
      <SpendingPlanRunningTot fyear={dbfilteryear} fmonth={dbfiltermonth} category={filtercategory} />
      <MonthlySpendingPlan fyear={dbfilteryear} fmonth={dbfiltermonth} category={filtercategory} />
    <TransactionsListIdWithCats fyear={dbfilteryear} fmonth={dbfiltermonth} category={filtercategory} />
    <IncomeListDates fyear={dbfilteryear} fmonth={dbfiltermonth} />

      {/*<pre><p>Categories available:{JSON.stringify(categories, null, 2)}</p></pre>
    
      <h1 className="largeTxt">Transactions</h1>

       <Filters />
      <Categories />
      <SpendingPlanRunningTot fyear={dbfilteryear} fmonth={dbfiltermonth} category={filtercategory} />
     <TransactionsListId fyear={dbfilteryear} fmonth={dbfiltermonth} category={filtercategory} /> 
    <SPWSpendPlanCombo fyear={dbfilteryear} fmonth={dbfiltermonth} category={filtercategory} />
    <h1 className="largeTxt mt-10">Income</h1> */}
    {/* <IncomeplanList fyear={dbfilteryear} fmonth={dbfiltermonth} category={filtercategory} />
   
    <IncomeList fyear={dbfilteryear} fmonth={dbfiltermonth} />
    <IncomeListDates fyear={dbfilteryear} fmonth={dbfiltermonth} />
      */}
      </>
      ):(
        <Link href="/login">
        {session?.user?.email ? (<h2>{session?.user?.email}</h2>):(<h2>You Are Not logged in</h2>)}
        <h1>Please click here to login in to Mindful Spending or Register</h1>
        </Link>
      )
      }
     
    </div>
    </>
  )
}
