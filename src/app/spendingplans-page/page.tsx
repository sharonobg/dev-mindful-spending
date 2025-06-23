
import Link from 'next/link';
import SpendingplansComp from "@/query_components/SpendingplansComp"
import {getServerSession} from "next-auth";
import {authOptions} from "../api/auth/[...nextauth]/route";
import {Metadata}from "next";
// import CacheComp from '@/query_components/CacheComp';
import SpendingPlanListQuery from "@/query_components/SpendingPlanListQuery";
export const metadata:Metadata = {
  title: "Spending Plans Page"
}


async function SpendingplansServerPg(){
const session = await getServerSession(authOptions);

if(session){
    return (
    <div className="place-items-center">
         
    <SpendingplansComp />
       
    </div>

    )
    }
    return(
      <div><Link href="/login"><h2>You Are Not logged in</h2>
        <h1>Please click here to login in to Mindful Spending or Register</h1>
        </Link></div>
    )
}
export default SpendingplansServerPg