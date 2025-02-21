"use client"
import {use} from "react";
import {useQuery} from "@tanstack/react-query";
import {useFoodPromise} from './FoodProvider';

export default function TestPromisesQuery() {
    const foodPromise = useFoodPromise();
    //console.log(foodPromise)
    //const foods= use(foodPromise);
    //const data = ["foods"];
    const { data:foods,isFetching } = useQuery({
        queryKey:["foods"], 
        queryFn: () => foodPromise
        // ,{
        //     initialData: use(foodPromise),
        //     refetchOnMount: false,
        //     refetchOnWindowFocus: false,
        //     refetchOnReconnect: false,
        // }
        
    });
return(
    <div>
        <h1>Hello from Client Testpromises Query</h1>
        <div>Foods: {foods?.join(", ")}</div>
       
    </div>
    )
}