export default function EditTransactionForm() {
    const transactions:[] = [];
    
    return(
    <>
    <h2>Transactions Query</h2>
    {/* <pre>{JSON.stringify(transactions,null,2)}</pre> */}
     <div>
        <h1>Hello from Transactions Client Query</h1>
        <div>Transactions: 
            {transactions.length > -1 ? transactions ?.map((transaction:any) => 
            <>
            <div key={transaction._id}>
                <div className="columns-4">
                <div>Author:{transaction.authorId}</div>
                <div>{new Date(transaction.transdate).getMonth()+1}/{new Date(transaction.transdate).getFullYear()}</div>
                <div>{transaction.descr}</div>
                <div>{transaction.amount.$numberDecimal}</div>
                </div>
            </div>
               
                {/* <ul key={transaction._id}>
                    <li>Author:{transaction.authorId}</li>
                    <li>Date:{new Date(transaction.transdate).getMonth()+1}/{new Date(transaction.transdate).getFullYear()}</li>
                </ul> */}
                </>):"no transactionsfound"}
        </div>
       
    </div>
    </>)
}