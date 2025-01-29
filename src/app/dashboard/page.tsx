import Link from 'next/link';
//import Category from '@/src/models/categoryModel';
//import { Suspense } from 'react'
import {getServerSession} from "next-auth";
import {authOptions} from "../api/auth/[...nextauth]/route";

import TransactionsListId from '@/components/TransactionsListId';
//import IncomeList from '../../components/IncomeList';
//import IncomeListDates from '../../components/IncomeListDates';
import Filters from '@/components/Filters';
//import IncomeFilters from '@/src/components/IncomeFilters';
//import Categories from "@/src/components/Categories";
import SPWSpendPlanCombo from '@/components/SPWSpendPlanCombo';
import SpendingPlanRunningTot from '@/components/SpendingPlanRunningTot';
//import IncomeplanList from '@/src/components/IncomeplanList';


export default async function Dashboard({searchParams,
}: {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const session = await getServerSession(authOptions);
  //const categories = await Category.find().sort({ title: 1 });
const getMonth = new Date()
//const month = getMonth.toLocaleString('default', { month: 'long' });
const thisMonth = new Date().getMonth()+1;//this is default
const thisYear = new Date().getFullYear()
//PUT THESE BACK or figure another way for props:
 //const newpropsfield = {params};
 const dbfilteryear = searchParams?.fyear|| searchParams.fyear ===null ? searchParams.fyear : thisYear;
 const dbfiltermonth = searchParams?.fmonth ? searchParams.fmonth : thisMonth; 
 //const filtermonthtotal=searchParams.fmonth? searchParams.fmonth : thisMonth;
 const filtercategory= searchParams?.category? searchParams?.category : "all-categories"

  return (

    <>
         
   <div className="dashboardDiv">
    
    {session && session?.user?.email ? 
    (
      <>
      <h1 className="largeTxt">My Spending</h1>
      <Filters />
      <TransactionsListId fyear={dbfilteryear} fmonth={dbfiltermonth} category={filtercategory} />
      <SpendingPlanRunningTot fyear={dbfilteryear} fmonth={dbfiltermonth} category={filtercategory} />
      <SPWSpendPlanCombo fyear={dbfilteryear} fmonth={dbfiltermonth} category={filtercategory} />
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
