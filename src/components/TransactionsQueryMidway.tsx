"use client"
import {useQuery} from "@tanstack/react-query";
import {useTransactionsPromise} from '@/query_components/RQTransactionsProvider';
//import CreateTransaction from '@/services/AddTransaction';
//import {useDeleteSong} from '@/query_hooks/mutations';
//import {useTransactions} from '@/query_hooks/querries';
//
const TransactionsQuery = () => {
    const transactionsPromise = useTransactionsPromise();
    //console.log(categoriesPromise)
    //const foods= use(foodPromise);
    //const data = ["foods"];
    
    const { data:transactions } = useQuery({
        queryKey:["transactions"], 
        queryFn: () => transactionsPromise
        // ,{
        //     initialData: use(foodPromise),
        //     refetchOnMount: false,
        //     refetchOnWindowFocus: false,
        //     refetchOnReconnect: false,
        // }
        
    });
return(
    <h2>Transactions Query</h2>
    // <>
    // <h2>Transactions Query</h2>
    // {/* <pre>{JSON.stringify(transactions,null,2)}</pre> */}
    //  <div>
    //     <h1>Hello from Transactions Client Query</h1>
    //     <div>Transactions: 
    //         {transactions?.map((transaction:any) => 
    //         <>
    //         <div key={transaction._id}>
    //             <div className="columns-4">
    //             <div>Author:{transaction.authorId}</div>
    //             <div>{new Date(transaction.transdate).getMonth()+1}/{new Date(transaction.transdate).getFullYear()}</div>
    //             <div>{transaction.descr}</div>
    //             <div>{transaction.amount.$numberDecimal}</div>
    //             </div>
    //         </div>
               
    //             {/* <ul key={transaction._id}>
    //                 <li>Author:{transaction.authorId}</li>
    //                 <li>Date:{new Date(transaction.transdate).getMonth()+1}/{new Date(transaction.transdate).getFullYear()}</li>
    //             </ul> */}
    //             </>)
    //         }
    //     </div>
       
    // </div>
    // </>
    )
}
export default TransactionsQuery