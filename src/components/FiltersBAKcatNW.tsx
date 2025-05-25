"use client"

import React,{useState} from 'react';
import {useRouter,useSearchParams,useParams} from 'next/navigation';
import {ToastContainer ,toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useSession} from 'next-auth/react'
import { useQuery } from '@tanstack/react-query';

export default function SimpleFilterTransaction() {
//export default function FilterTransaction ()  {
    //get the year and the month - get the months up to the current month
    //get the previous year - get the months from the first month available to the end of the year
    //date details:
    //const newD = new Date()
   
    const getMonth = new Date().getMonth()
    //const monthLong = newD.toLocaleString('default', { month: 'long' });
    const getYear = new Date().getFullYear()
    //const getMonthYear = getMonth +', ' +getYear;
    //const [transdate,setTransdate]= useState(new Date())
    const [categories,setCategories]=useState([])
    const [categoryId,setCategoryId]= useState<string>("")
    const [categoryTitle,setCategoryTitle]= useState<string>("")
    //const [filters,setFilters]=useState([])
    const [datesfilter,setDatesfilter]=useState<string>("")
    //const [transactionstotal,setTransactionstotal]=useState([])
    const [fmonth,setFmonth]=useState('')
    const [fyear,setFyear]=useState('')
    const {data:session,status} = useSession();
    const router= useRouter();
    const searchParams = useSearchParams();
    const queryCategory = searchParams.get('category');
    const queryMonth = searchParams.get('fmonth') != null ? searchParams.get('fmonth'):getMonth;
    const queryYear = searchParams.get('fyear') != null ? searchParams.get('fyear'):getYear;
    
    //console.log('queryCategory filter: ',queryCategory)
    console.log('queryMonth filter: ',queryMonth)
    console.log('queryYear filter: ',queryYear)
    const params = searchParams ? searchParams : undefined;
    console.log('params useParams filter: ', params)
           

            const {data:filters} = useQuery<any>({
              queryKey:['filters'],
              queryFn: () => 
                fetch('http://localhost:3001/api/filter').then((res) => res.json())
              
            })
    const clearFilter = (e:React.FormEvent<HTMLElement>) => {
      e.preventDefault();
     //console.log('filter params', params)
     router.push('/dashboard')

    }
    const categoryFilter = (e:React.FormEvent<HTMLElement>) => {
      e.preventDefault();
      
      //const datesfilterVal = datesfilter ? datesfilter : fmonth;
      
      //let newYear = datesfilterVal.slice(datesfilterVal.length - 4); 
      //let newMonth = datesfilterVal.slice(0, - 4); 
      let categoryT = categoryTitle.toLowerCase();
      //let qm = queryMonth?queryMonth:"no month";
      //console.log('qm?: ',qm)
      //console.log('params props newYear filter: ',newYear)
      //console.log('params props category filter: ',categoryTitle)
      //console.log('params props dates filter: ',datesfilterVal)
      router.push(`/dashboard?fyear=${queryYear ? queryYear : getYear }&fmonth=${queryMonth ? queryMonth : getMonth+1 }`)

      //console.log('categories: ',categories)
  // if fmonth = the transaction month = show results = else hide results
  //console.log('filters - filter month: ',fmonth)
  //router.refresh() 
  }
    const dateFilter = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const datesfilterVal = datesfilter ? datesfilter : fmonth;
        let newYear = datesfilterVal.slice(datesfilterVal.length - 4); 
        let newMonth = datesfilterVal.slice(0, - 4); 
        router.push(`/dashboard?fyear=${newYear ? newYear: queryYear}&fmonth=${newMonth ? newMonth : queryMonth}`)
    }
    
    return(
        <>
        <div className="outerDiv">
            {/* i dunno */}
           

        </div>

        <div className="outerDiv">
          <form onSubmit={dateFilter} className="flex flex-col flex-wrap gap-5 my-3">
            <h2>Choose a Different Month</h2>
            <div className="flex flex-row font-bold place-items-center">
              <span>Transactions available:</span><select onChange={(e) => setDatesfilter(e.target.value)} className="m-2">
                {filters?.length > -1 ? 
                  (filters.map((filter:any,index:number) =>
                  {return(
                    <option key={index} defaultValue="Month/Year" value={`${filter._id.month}${filter._id.year}`}>{filter._id.month}/{filter._id.year}</option>
                )}
                )): "no dates are available"}
              </select>
              <button className="bg-blue-400 rounded-md p-1 m-2 h-fit justify-center align-middle text-white font-semibold flex" type="submit">Choose This Month</button>
              <button 
                   className="bg-blue-400 rounded-md p-1 m-2 h-fit justify-center align-middle text-white font-semibold"  
                   onClick={clearFilter}>Clear filter</button>
            </div>
          </form>
        </div>
                  
        
        </>
        )
}
//export default SimpleFilterTransaction
