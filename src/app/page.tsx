import Link from 'next/link';
import {getServerSession} from "next-auth";
import { URLSearchParams } from "url";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
//import Categories from "@/src/components/Categories";
import connect from "../libs/database/mongo";

//import SigninForm from "@/src/components/SigninForm";
//import connect from '../../libs/mongodb'
//import TransactionsListId from '../../components/TransactionsListId';
//import SimpleFilters from '../../components/SimpleFilters';
//import SPWSpendPlanCombo from '../../components/SPWSpendPlanCombo';
//import SpendingP\lanRunningTot from '../../components/SpendingPlanRunningTot';
//import connect from "@/libs/database/mongo";
//global.URLSearchParams = URLSearchParams
// import Category from "@/src/models/categoryModel";
// const categories = await Category.find();


let searchParams = new URLSearchParams({}).toString();
//export default async function Dashboard({searchParams}:URLSearchParams) {
  export default async function LandingPage(props:any) {
 
  await connect()
  const session = await getServerSession(authOptions);
  console.log('session',session)
      //const sessionUser = session?.user?._id;
  //const sessionUser = session?.user?.email;

  return (
    <>
   
    <div className="mainContentDiv">
    
    {session?.user?.email ? 
    (
      <>
      <h1>Logged in as :{session?.user?.email}</h1>
   
      {/*<h1>Month:{filtermonth}/{filteryear}     Category: {filtercategory ? filtercategory : "All-Categories"}</h1>
      <SimpleFilters />
      <SPWSpendPlanCombo fyear={filteryear} fmonth={filtermonth} category={filtercategory} />
    <SpendingPlanRunningTot fyear={filteryear} fmonth={filtermonth} category={filtercategory} />*/}
      
      {/*<TransactionsListId fyear={filteryear} fmonth={filtermonth} category={filtercategory} />*/}
      </>
      ):(
        <div id="welcome" className="m2 p2">
         
        <Link href="/login">
        {session?.user?.name ? (<h2>{session?.user?.name}</h2>):(<h2>You Are Not logged in</h2>)}
        <h1>Please log in to see your Spending Plan</h1>
        </Link>
        </div>
      )
      }
    </div>
    </>
  )
}
