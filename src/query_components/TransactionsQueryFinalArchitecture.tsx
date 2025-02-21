"use client"
//NEW FILES TO BE CREATED:
//import CreateTransaction from '@/services/AddTransaction';
//import {useDeleteTransaction} from '@/query_hooks/mutations';
//import {useTransactions} from '@/query_hooks/querries';
//

//bringing in from hooks this page has the list, edit and delete forms
const TransactionsList = () => {
    //LIST WITH FUNCTIONS TO ADD, EDIT(LINK) ,DELETE TRANSACTIONS
    //hooks:
//    const {isPending,isError,data:transactions,error} = useTransactions()
   //const deleteTransaction = useDeleteTransaction()'
       // if (isPending) return <span>Loading Transactions...</span>
       // if (isError) return `Error: ${error.message}`

    //const handleDelete = {id} => deleteTransactionMutation.mutate(id)
return(
    <h2>Transactions Query</h2>
    // <>
    // <AddTransaction />

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
    //          <button onClick={Link to '(transaction/id)}>Edit</button>
    //          <button onClick={handleDelete(transaction.id)}>Delete</button>
               //WITH EDIT/ WHICH GOES TO THE PAGE
               //DELETE / DELETES THE ID IN PLACE??
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
export default TransactionsList