"use client"

import {useMutation,useQuery,useQueries,useQueryClient} from "@tanstack/react-query";
import {
    // createAuthorCategory, 
    //getCategory,
    getCategories,
    getSpendingplans,
    getTransactions,
    getTransactionsAggrMonth,
    getTransactionsById,
    getTransactionsIds,
    getSpendingplanById,
    getSpendingplansaAggr,
    getSpendingplanByIdsim,
    getSpendingplanByIdRet
    ,
    // getSpendingplanByIdAggr
} from "@/query_services/services";

//category queries
export function useCategories(){
    return useQuery({
        queryKey:['categories'],
        queryFn: getCategories,
    }) 
   
}

// export const usePrefetchCategories = async () => {
//     const queryClient = useQueryClient() 
//     // The results of this query will be cached like a normal query
//     await queryClient.prefetchQuery({
//       queryKey: ['categories'],
//       queryFn: getCategories,
//     })
//   }
//categories useQueries for multiple queries
// export function useCategoriesMany(ids:(any | undefined[] | undefined)){
//     return useQueries({
//         queries:ids.map((id:any) => {
//             return{
//                 queryKey: ["category", {id}],
//                 queryFn:() => getCategory({id}),
//                 cacheTime: Infinity,
//                 staleTime: Infinity,
//             }
//         })
//     })
// }
//new transaction queries
// export function useTransactionsData(){
//     return useQuery({
//         queryKey:['transactions'],//can use anthning as key but best to use db name
//         queryFn:getTransactions,
//     }) }

export function useTransactionById(id:any){
    return useQuery({
          queryKey:['transaction',{id}],
          queryFn: () => getTransactionsById(id),
          retry: 5,
          enabled: !!id,
          //enabled: id !== undefined,
          // refetch every second
          refetchInterval: 30000
      }) 
}
export function useTransactionsIds(){
        return useQuery({
            queryKey:['transactions'],//can use anthning as key but best to use db name
            queryFn:getTransactionsIds,
        }) }
    export function useTransactionsQueries(data:any[] | undefined){
        return useQueries({
            queries:(data ?? []).map((id:any) => {//ids or map empty array
                return {
                    queryKey:['transaction',{id}],
                    queryFn:() => getTransactionsById(id),
                    onSuccess: () => {
                        // console.log('id',{id});
                        // console.log('func',getTransactionsById())
                        const queryClient = useQueryClient()
                        queryClient.invalidateQueries({ queryKey:['transactions']})//queryKey will be an array of a serializable string   queryKey is constant of data in app- will be issue in spendingplan   
                        console.log('Transactions useQueries Success')
                     },
                     
                }}),
            })} 
//transaction queries
export function useTransactions(){
    return useQuery({
        queryKey:['transactions'],
        queryFn: getTransactions,
    }) 
}
export function useTransactionsAggrMonth(){
    return useQuery({
        queryKey:['transactions'],
        queryFn: getTransactionsAggrMonth,
    }) 
}






export function useTransactionsMany(ids:(any | undefined[] | undefined)){
    return useQueries({
        queries:(ids ?? []).map((id:any) => {
            return{
                queryKey: ["transaction", {id}],
                queryFn:() => getTransactionsById(id),
                
            }
        })
    })
}
// export function useCreateTransactionMutation(){
//     const queryClient = useQueryClient()
   
//    return useMutation({
//         mutationFn:createAuthorCategory,
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey:['categories']})//queryKey will be an array of a serializable string   queryKey is constant of data in app- will be issue in spendingplan   
//             console.log('Created Category Success')
//         }
//      })
// }
//SPENDINGPLAN queries
export function useSpendingplans(){
    return useQuery({
        queryKey:['spendingplans'],
        queryFn: getSpendingplans
    }) 
}
export function useSpendingplanByIdRet(id:any){
    return useQuery({
          queryKey:['spendingplan',{id}],
          queryFn: () => getSpendingplanById(id),
          
          //retry: 5,
          enabled: !!id,
          //enabled: id !== undefined,
          // refetch every second
          refetchInterval: 30000
      }) 

      
}
export function useSpendingplanById(id:any){
    return useQuery({
          queryKey:['spendingplan',{id}],
          queryFn: () => getSpendingplanByIdsim(id),
          //retry: 5,
          enabled: !!id,
          //enabled: id !== undefined,
          // refetch every second
          refetchInterval: 30000
      }) 
}
export function useSpendingplansAggr(){
    return useQuery({
        queryKey:['spendingplans'],
        queryFn: getSpendingplansaAggr
    }) 
}
// export function useSpendingplanByIdAggr(id:any){
//     return useQuery({
//         queryKey:['spendingplan',{id}],
//         queryFn: getSpendingplanByIdAggr(id),
//         enabled: !!id,
//         refetchInterval: 30000
//     })
// }

