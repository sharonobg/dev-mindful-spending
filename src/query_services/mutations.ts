"use client"

import {useMutation,useQueryClient} from "@tanstack/react-query";
import {
    // createAuthorCategory,
    // deleteAuthorCategory,
    // editAuthorCategory,
    createTransaction,
    deleteTransaction,
    createSpendingplan,
    deleteSpendingplan,
    editTransaction,
    newUpdateTransaction,
    deleteTransactions,
    updateSpendingplan,
    patchSpendingplan,
    
} from "@/query_services/services";
import {useRouter} from 'next/navigation';

// export function useCreateCategoryMutation() {
//     const queryClient = useQueryClient()

//     return useMutation({
//         mutationFn:(data:Category) => createAuthorCategory(data),
//         onMutate:() => {
//             console.log("mutate");
//         },
//         onError: () => {console.log('error')},
//         onSuccess: () => {
//             queryClient.invalidateQueries({queryKey: ['categories']})
//         },
//         onSettled:async (data,error,variables) => {
//             if(error){
//                 console.log('on settled error',error)
//             }else{
//                 await queryClient.invalidateQueries({queryKey:["categories"]});
//                 await queryClient.invalidateQueries({queryKey:["category",{id:variables._id}]});
//             }
//             console.log("settled variables",variables); }
//             //if I didn't need data, this would be: onSettled: (_,error,variables)
//     });
// }
// export function useUpdateCategory(){
//     const queryClient = useQueryClient();
//     return useMutation({
//         mutationFn:(data:Category) => editAuthorCategory(data),
//         onSettled:async(_,error,variables:any) => {
//             if(error){console.log('updateCategory',error)}else{
//                 await queryClient.invalidateQueries({queryKey:["categories"]});
//                 await queryClient.invalidateQueries({queryKey:["category",{id:variables._id}]});
//             }
           
//         }
//     })
// }

// export function useDeleteAuthorCategory(){
// const queryClient = useQueryClient()  
//     return useMutation({
//         mutationFn:deleteAuthorCategory,
//         onSuccess(){
//             queryClient.invalidateQueries({ queryKey:['categories']})//queryKey will be an array of a serializable string   queryKey is constant of data in app- will be issue in spendingplan   
//             console.log('Deleted Category Successfully')
//         }
//     })
// }
//transactions

//newtransactions
export function useTransactionsCreate(){
    const queryClient = useQueryClient()
    return useMutation({
        
        mutationFn:(data:TransactionType) => createTransaction(data),
        onMutate:() => {
            console.log('mutate')
        },
        onError: () => {console.log('error')},
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['transactions']})
        },
        onSettled:async (data,error,variables) => {
            if(error){
                console.log('on transaction edit settled error',error)
            }else{
                await queryClient.invalidateQueries({queryKey:["transactions"]});
                await queryClient.invalidateQueries({queryKey:["transaction",{id:variables._id}]});
            }
            console.log("settled transaction variables",variables); }
    })
}
//new edit 
export function useUpdateTransactionMutation() {
    const queryClient = useQueryClient();
    const router = useRouter();
    return useMutation({
        mutationFn: (data:TransactionType) => newUpdateTransaction(data),
        onSuccess:(data,variables) => {
            queryClient.setQueryData(['transaction',{ id: variables._id }], data)
        },
        onSettled:async(data,error,variables:any) => {
            if(error){console.log('updateTransaction',error)}else{
                await queryClient.invalidateQueries({queryKey:["transactions"]});
                await queryClient.invalidateQueries({queryKey:["transaction",{id:variables._id}]});
                console.log("settled edit variables",variables);
            }
            router.push('/transactions-page')
        }
        })
    }
//end newtransactions
// export function useNewEditTransactionMutation(){
//     return useMutation({
//         mutationFn:editTransaction,
//         onSuccess: () => {
//           const queryClient = useQueryClient()
//             queryClient.invalidateQueries({ queryKey:['transactions']})//queryKey will be an array of a serializable string   queryKey is constant of data in app- will be issue in spendingplan   
//             console.log('Edited Transaction Success')
//         },
//     })
// } 
export function useCreateTransactionMutation() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn:(data:TransactionType) => createTransaction(data),
        onMutate:() => {
            console.log("mutate");
        },
        onError: () => {console.log('error')},
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['transactions']})
        },
        onSettled:async (data,error,variables) => {
            if(error){
                console.log('on transaction edit settled error',error)
            }else{
                await queryClient.invalidateQueries({queryKey:["transactions"]});
                await queryClient.invalidateQueries({queryKey:["transaction",{id:variables._id}]});
            }
            console.log("settled transaction variables",variables); }
            //if I didn't need data, this would be: onSettled: (_,error,variables)
    });
}
// export function useEditTransactionMutation(){
//     const queryClient = useQueryClient();
//     return useMutation({
//         mutationFn:(data:TransactionType) => editTransaction(data),
//         onSettled:async(_,error,variables:any) => {
//             if(error){console.log('updateTransaction',error)}else{
//                 await queryClient.invalidateQueries({queryKey:["transactions"]});
//                 await queryClient.invalidateQueries({queryKey:["transaction",{id:variables._id}]});
//                 console.log("settled edit variables",variables);
//             }
//         },
        
//     })
// }
// export function useDeleteTransaction(){
//     const queryClient = useQueryClient()  
//         return useMutation({
//             mutationFn: deleteTransaction,
//             onSuccess(){
//                 queryClient.invalidateQueries({ queryKey:['transactions']})//queryKey will be an array of a serializable string   queryKey is constant of data in app- will be issue in spendingplan   
//                 console.log('Deleted Transaction Successfully')
//             },
//             onSettled:async (data,error,variables) => {
//                             if(error){
//                                 console.log('on settled error',error)
//                             }else{
//                                 await queryClient.invalidateQueries({queryKey:["transactions"]});
//                                 await queryClient.invalidateQueries({queryKey:["transaction",{id:variables._id}]});
//                             }
//                             console.log("settled variables",variables); }
//         })
//     }
    export function useDeleteTransactions(){
        const queryClient = useQueryClient()  
            return useMutation({
                mutationFn: deleteTransactions,
                onSuccess(){
                    queryClient.invalidateQueries({ queryKey:['transactions']})//queryKey will be an array of a serializable string   queryKey is constant of data in app- will be issue in spendingplan   
                    console.log('Deleted Transaction Successfully')
                },
                onSettled:async (data,error,variables) => {
                                if(error){
                                    console.log('on settled error',error)
                                }else{
                                    await queryClient.invalidateQueries({queryKey:["transactions"]});
                                    await queryClient.invalidateQueries({queryKey:["transaction",{id:variables._id}]});
                                }
                                console.log("settled variables",variables); }
            })
        }
    export function EditSpendingplan(){
        const queryClient = useQueryClient()  
            return useMutation({
                mutationFn:deleteSpendingplan,
                onSuccess(){
                    queryClient.invalidateQueries({ queryKey:['spendingplans']})//queryKey will be an array of a serializable string   queryKey is constant of data in app- will be issue in spendingplan   
                    console.log('Deleted Spendingplan Successfully')
                }
            })
        }
        export function usePatchSpendingplanMutation() {
            const queryClient = useQueryClient();
            const router = useRouter();
            return useMutation({
                mutationFn: (data:SpendingplanType) => patchSpendingplan(data),
                onSuccess:(data,variables) => {
                    queryClient.setQueryData(['transaction',{ id: variables._id }], data)
                },
                onSettled:async(data,error,variables:any) => {
                    if(error){console.log('updateTransaction',error)}else{
                        await queryClient.invalidateQueries({queryKey:["transactions"]});
                        await queryClient.invalidateQueries({queryKey:["transaction",{id:variables._id}]});
                        console.log("settled edit variables",variables);
                    }
                    router.push('/transactions-page')
                }
                })
            }
            export function useSpendingplanCreate(){
                const queryClient = useQueryClient()
                return useMutation({
                    
                    mutationFn:(data:SpendingplanType) => createSpendingplan(data),
                    onMutate:() => {
                        console.log('mutate')
                    },
                    onError: () => {console.log('error')},
                    onSuccess: () => {
                        queryClient.invalidateQueries({queryKey: ['spendingplans']})
                    },
                    onSettled:async (data,error,variables) => {
                        if(error){
                            console.log('on spendingplan create settled error',error)
                        }else{
                            await queryClient.invalidateQueries({queryKey:["spendingplans"]});
                            await queryClient.invalidateQueries({queryKey:["spendingplan",{id:variables._id}]});
                        }
                        console.log("settled spendingplan variables",variables); }
                })
            }
        export function useUpdateSpendingplanMutation() {
            const queryClient = useQueryClient();
            const router = useRouter();
            return useMutation({
                mutationFn: (data:SpendingplanType) => updateSpendingplan(data),
                onSuccess:(data,variables) => {
                    queryClient.setQueryData(['transaction',{ id: variables._id }], data)
                },
                onSettled:async(data,error,variables:any) => {
                    if(error){console.log('updateTransaction',error)}else{
                        await queryClient.invalidateQueries({queryKey:["transactions"]});
                        await queryClient.invalidateQueries({queryKey:["transaction",{id:variables._id}]});
                        console.log("settled edit variables",variables);
                    }
                    router.push('/transactions-page')
                }
                })
            }
    export function useDeleteSpendingplan(){
        const queryClient = useQueryClient()  
        return useMutation({
            mutationFn: deleteSpendingplan,
            onSuccess(){
                queryClient.invalidateQueries({ queryKey:['spendingplans']})//queryKey will be an array of a serializable string   queryKey is constant of data in app- will be issue in spendingplan   
                console.log('Deleted Spending Plan Successfully')
            },
            onSettled:async (data,error,variables) => {
                            if(error){
                                console.log('on settled error',error)
                            }else{
                                await queryClient.invalidateQueries({queryKey:["spendingplans"]});
                                await queryClient.invalidateQueries({queryKey:["spendingplan",{id:variables._id}]});
                            }
                }
        })
        }

    
