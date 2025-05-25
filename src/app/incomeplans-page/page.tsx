
import SpendingplansComp from "@/query_components/SpendingplansComp"
import {Metadata}from "next";
// import CacheComp from '@/query_components/CacheComp';
import SpendingPlanListQuery from "@/query_components/SpendingPlanListQuery";
export const metadata:Metadata = {
  title: "Spending Plans Page"
}

function SpendingplansServerPg(){

     
    return (
    <div className="place-items-center">
        
        {/* <SpendingPlanListQuery /> */}
       
        {/* <CreateSpendingPlan /> */}
        {/* ServicesIDs:{JSON.stringify(getTransactionsIds,null,2)} */}
      {/* <CacheComp /> */}
        <SpendingplansComp />
       
    </div>)

}
export default SpendingplansServerPg