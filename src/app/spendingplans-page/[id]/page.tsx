import SpendingplanIdEdit from "@/query_components/SpendingplanIdEdit"

export default async function TransactionsServerPg({ params}: { params:{id: string }}){
const id = params.id;
    return (
    <div className="bg-white">
       
        <h1>Transactions Server Edit by Id Page</h1>
        <SpendingplanIdEdit params={params} />
    </div>)

}
