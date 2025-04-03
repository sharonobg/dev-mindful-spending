
import SpendingplansComp from "@/query_components/SpendingplansComp"
import {Metadata}from "next";
import SpendingPlanListQuery from "@/query_components/SpendingPlanListQuery";
import SpendingplansCompTest from "@/query_components/SpendingplansCompTest";
export const metadata:Metadata = {
  title: "Spending Plans Page"
}

function SpendingplansServerPg(){

     
    return (
    <div className="place-items-center">
        
        <SpendingPlanListQuery />
       
        {/* <CreateSpendingPlan /> */}
        {/* ServicesIDs:{JSON.stringify(getTransactionsIds,null,2)} */}
   
        <SpendingplansCompTest />
       
    </div>)

}
export default SpendingplansServerPg