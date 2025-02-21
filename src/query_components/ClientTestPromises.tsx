"use client"
import {useQuery,useIsFetching} from "@tanstack/react-query";
import {useTransactionsPromise} from '@/query_components/RQTransactionsProvider';
//import CreateTransaction from '@/services/AddTransaction';
//import {useDeleteSong} from '@/query_hooks/mutations';
//import {useTransactions} from '@/query_hooks/querries';
//

//bringing in from hooks this page has the list, edit and delete forms
const ClientTestPromises = () => {
    
    
    const { data:categories, isLoading } = useQuery<Category[]>({
        queryKey:["categories"], 
        queryFn: () => fetch('http://localhost:3000/api/category')
        .then((res:Response) => res.json())
    });
    const { data:spendingplans } = useQuery<SpendingplanType[]>({
        queryKey:["spendingplans"], 
        queryFn: () => fetch('http://localhost:3000/api/spendingplan')
        .then((res:Response) => res.json())
    });
    if (isLoading) return <div>Loading...</div>
return(
    <>
    <h2>Categories Query</h2>
   <pre>{JSON.stringify(categories,null,2)}</pre>
   <h2>Spending Plans Query</h2>
      <pre>{JSON.stringify(spendingplans,null,2)}</pre>
      {/* <pre>{JSON.stringify(categories,null,2)}</pre> */}
      {/* <div>
         <h1>Hello from Transactions Client Query</h1>
         <div>Transactions: 
             {transactions?.map((transaction:any) => 
             <>
             <div key={transaction._id}>
                <div className="columns-4">
                <div>Author:{transaction.authorId}</div>
                <div>{new Date(transaction.transdate).getMonth()+1}/{new Date(transaction.transdate).getFullYear()}</div>
                <div>{transaction.descr}</div>
                <div>{transaction.amount.$numberDecimal}</div>
                </div>
            </div>
        
                <ul key={transaction._id}>
                    <li>Author:{transaction.authorId}</li>
                    <li>Date:{new Date(transaction.transdate).getMonth()+1}/{new Date(transaction.transdate).getFullYear()}</li>
                </ul>
                </>)
            }
        </div>
       
     </div> */}
     </>
    )
}
export default ClientTestPromises