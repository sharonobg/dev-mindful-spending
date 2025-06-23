import SpendingplansComp from "@/query_components/SpendingplansComp"
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import SpendingplanIdEdit from "@/query_components/SpendingplanIdEdit"
import Link from 'next/link';
// import { QueryClient } from '@tanstack/react-query'
// import {getCategories} from '@/query_services/services';

export default async function SpendingplansServerPg({ params}: { params:{id: string }}){
const session = await getServerSession(authOptions);
if(session){

    return (
    <div className="bg-white">
       
        <h1>Spending Plan Edit by Id Page</h1>
        {/* <h2>Categories prefetched: {JSON.stringify(categories,null,2)}</h2> */}
        <SpendingplanIdEdit params={params} />
    </div>)
     }
        return(
          <div><Link href="/login"><h2>You Are Not logged in</h2>
            <h1>Please click here to login in to Mindful Spending or Register</h1>
            </Link></div>
        )

}
