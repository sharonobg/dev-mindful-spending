import SpendingPlanEditClient from "@/components/SpendingPlanEditClient";



export default async function EditSpendingPlan({ params }: { params: { id: string } }){
const serverid = params.id.toString();

console.log(serverid)
    return (<h1>spending plan edit</h1>
        //serverid.toString()
        //  <SpendingPlanEditClient params={params} />
    )
}