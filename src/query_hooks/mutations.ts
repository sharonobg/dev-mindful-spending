import {useMutation, useQueryClient} from '@tanstack/react-query';
//import {deleteTransaction} from '/api/transaction';//or wherever it winds up

//transaction mutations
export function useDeleteTransaction() {
    const queryClient = useQueryClient()

    // return useMutation({    
    //     mutationFn: deleteTransaction,
    //     onSuccess() {
    //         queryClient.invalidateQueries({ queryKey:['transactions']})
            //console.log('transaction delete successful')
    //     }

    // })
}