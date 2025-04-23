"use client"

import {useQueryClient} from "@tanstack/react-query";
//import {Link}from 'react-router-dom';
import {useRouter} from 'next/navigation';
const CacheComp = () => {
    const queryClient = useQueryClient();
console.log('spendingplans query cache',queryClient.getQueryCache().getAll());
setTimeout(() => {
    console.log(queryClient.getQueryCache().getAll());
},11000);
const router = useRouter();



return (
    <div>
        <h1>Cache </h1>
        <button onClick={() => router.push('/spendingplans-page')}>Go to dashboard</button>
    </div>
)
}
export default CacheComp

