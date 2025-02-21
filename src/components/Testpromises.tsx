"use client"
import {use} from "react";
import {useFoodPromise} from './FoodProvider';

export default function TestPromisesList() {
    // const foodPromise = useFoodPromise();
    // console.log(foodPromise)
//const foods = use(useFoodPromise());//switching to tanstack use-query provider
//console.log('foods',foods)
const foods = use(useFoodPromise());//switching to tanstack
return (
    <div>
        <h1>Hello from Client</h1>
        <div>Foods: {foods.join(", ")}</div>
        {/* Promises Promises: {res.map((plan:SpendingPlan,index:number)=>
    <div key={index}>
        <h1>{plan._id}</h1>
     </div>
    )} */}
    </div>
    )
}