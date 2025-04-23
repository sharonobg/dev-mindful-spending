import SpendingplanIdEdit from "@/query_components/SpendingplanIdEdit"
// import { QueryClient } from '@tanstack/react-query'
// import {getCategories} from '@/query_services/services';

export default async function SpendingplansServerPg({ params}: { params:{id: string }}){
// const queryClient = new QueryClient({
//     defaultOptions: {
//         queries: {
//           staleTime: Infinity,
//         },
//       },
//     })
//   await queryClient.prefetchQuery({ queryKey: ['categories'], queryFn: getCategories })



    return (
    <div className="bg-white">
       
        <h1>Spending Plan Edit by Id Page</h1>
        {/* <h2>Categories prefetched: {JSON.stringify(categories,null,2)}</h2> */}
        <SpendingplanIdEdit params={params} />
    </div>)

}
