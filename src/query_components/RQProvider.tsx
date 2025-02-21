"use client"
//import {useRef} from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";


export default function ReactQueryProvider({
    children,
}:{children:React.ReactNode

}) {
    const queryClient = new QueryClient({defaultOptions: {
        queries: {
          gcTime: 5 * 2000, // this sets the garbage collection time to 5 seconds
        },
      },});
        return ( 
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
        )
}