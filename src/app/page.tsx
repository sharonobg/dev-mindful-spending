import Link from 'next/link';
import {getServerSession} from "next-auth";
import { URLSearchParams } from "url";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import connect from "../libs/database/mongo";
// import Testpromises from "@/obsolete/Testpromises";
import {Suspense} from "react";
// import FoodProvider from '@/components/FoodProvider';
import SpendingPlanListFilter from "@/components/SpendingPlanListFilter";

//let searchParams = new URLSearchParams({}).toString();
//export default async function Dashboard({searchParams}:URLSearchParams) {
  export default async function LandingPage(props:any) {
 
  //await connect()
  const session = await getServerSession(authOptions);

  
  return (
    <>
   
    <div className="mainContentDiv">
    
    {session?.user?.email ? 
    (
      <>
      <h1>Logged in as :{session?.user?.email}</h1>
      <div>
        <h1>Hello from Server</h1>
        {/* <FoodProvider foodPromise={foodfetch}> */}
        <Suspense fallback={<div>Loading...</div>}>
            {/* <Testpromises /> */}
            <SpendingPlanListFilter />
        </Suspense>
        {/* </FoodProvider> */}
    </div>
      {/*<h1>Month:{filtermonth}/{filteryear}     Category: {filtercategory ? filtercategory : "All-Categories"}</h1>
      <SimpleFilters />
      <SPWSpendPlanCombo fyear={filteryear} fmonth={filtermonth} category={filtercategory} />
    <SpendingPlanRunningTot fyear={filteryear} fmonth={filtermonth} category={filtercategory} />*/}
      
      {/*<TransactionsListId fyear={filteryear} fmonth={filtermonth} category={filtercategory} />*/}
      </>
      ):(
        <div id="welcome" className="m2 p2">
         
         {session?.user?.name ? (<h2>{session?.user?.name}</h2>):(
         <>
         <Link href="/login"><h2>You Are Not logged in</h2>
        <h1 >Please <span className="underline">Login</span> to see your Spending Plan</h1>
        </Link>
        <h2 className="text-xl text-blue-500 font-bold">Or <Link href="/register"><span className="underline">Click Here</span> to Register</Link></h2>
       
       </>  )}
       </div>
      )
      }
    </div>
    </>
  )
}
