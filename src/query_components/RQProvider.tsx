"use client"
//import {useRef} from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";


export default function ReactQueryProvider({
    children,
}:{children:React.ReactNode

}) {//put the [ use state]so only 1 intance
    const [queryClient] = useState(()  => new QueryClient({
      defaultOptions: {
        queries: {
          
          staleTime:100,
          gcTime: 1000 * 60  * 5,
          //refetchOnWindowFocus:false, // this sets the garbage collection time to 5 seconds
        },
      
      // mutations: {
      //   retry: 2,
      //   retryDelay: (attemptIndex) => attemptIndex * 1000, // Increase delay with each retry
      //   onMutate: async (variables) => {
      //       // Perform tasks before mutation operation
      //     },
      //   onError: (error, variables, context) => {
      //       // Handle errors gracefully
      //     },
      //    onSuccess: (data, variables, context) => {
      //       // Update UI components after successful mutation
      //     },
      //    onSettled: (data, error, variables, context) => {
      //       // Perform cleanup tasks after mutation operation
      //     },
      // }
    
    }}));
        return ( 
        <QueryClientProvider client={queryClient}>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
        )
}