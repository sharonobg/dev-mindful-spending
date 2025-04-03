import TransactionsCompIdEdit from "@/query_components/TransactionsCompIdEdit"

export default async function TransactionsServerPg({ params}: { params:{id: string }}){
const id = params.id;
    return (
    <div>
       
        <h1>Transactions Server Edit by Id Page</h1>
        <TransactionsCompIdEdit params={params} />
    </div>)

}
