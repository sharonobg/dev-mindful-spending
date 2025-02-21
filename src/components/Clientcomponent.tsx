"use client"
import *as React from 'react';
import {useState,useEffect} from 'react'
import {useSession}from 'next-auth/react';
import {useRouter} from 'next/navigation'
type Category = {_id:string; title: string}

type Categories =  Category[]
type MyCategory = {
     mycategoryId:string,
     isChecked:boolean,
     explain:string,
     categorynotes:string,
     planamount:string,
   }
type MyCategories = MyCategory[]
type SpendingPlan = {
     planmonthyear:Date;
     mycategories:MyCategories;
}
type SpendinPlans = SpendingPlan[]
const Clientcomponent = (
      {categories}:
     {
       categories:Categories
     },
     {spendingplans}:
     {
     spendingplans:SpendinPlans
     },
)  => {
    return(
        <div>
             <h1>Hello</h1>
         <pre>Client comp: spendingplans{JSON.stringify(spendingplans,null,2)}</pre>
       
          { 
          ( categories.map((category:Category) => 
        <>
          <ul>
               <li key={category._id}>
               {category.title}
               </li>
          </ul>
          </>
        ))}
        </div>
       
       
        )
    
  }

  export default Clientcomponent