"use client"
import {useQuery,useIsFetching} from "@tanstack/react-query";
import {useTransactionsPromise} from '@/query_components/RQTransactionsProvider';
import TransactionsEditQueryForm from './TransactionsEditQueryForm';
const EditTransactionQuery = ()=> {
    const transactionsPromise = useTransactionsPromise();//not sure
    //console.log(categoriesPromise)
    //const foods= use(foodPromise);
    //const data = ["foods"];
    
    const { data:transactions } = useQuery({ // again not sure
        queryKey:["transactions"], 
        queryFn: () => transactionsPromise//need to get the id to edit
        // ,{
        //     initialData: use(foodPromise),
        //     refetchOnMount: false,
        //     refetchOnWindowFocus: false,
        //     refetchOnReconnect: false,
        // }
    });

//    const updateTransaction=useMutation({
//     mutationFn:editTransaction,//this comes from api or services
//      onSuccess: () => {
//         queryClient.invalidateQueries({ queryKey:['transactions'] })
//      },
//     })

//  if(isPending) return <span> Loading Spending Transactions...</span>
//  if(isError) return `Error: ${error.message}`

//const handleSubmit = (updateTransaction) =>{
//     updateTransactionMutation.mutate({ id,...updatedTransaction})
// }

return (
    <TransactionsEditQueryForm />
    // <TransactionsEditQueryForm onSubmit={handleSubmit} initialValue={transaction} />
)
}
export default EditTransactionQuery

