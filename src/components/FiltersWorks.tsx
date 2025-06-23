"use client"

import React,{useState,useEffect} from 'react';
import {useRouter,useSearchParams,useParams} from 'next/navigation';
import {ToastContainer ,toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useSession} from 'next-auth/react'

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
    const [filters,setFilters]=useState([])
    const [datesfilter,setDatesfilter]=useState<string>("")
    //const [transactionstotal,setTransactionstotal]=useState([])
    const [fmonth,setFmonth]=useState('')
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
//props available through transactions so these should determine if the transaction would show if a date selected
    // "propsArrayYear": 2025,
    // "propsArrayMonth": 1,
    // "transactionmonth": 1,
    // "transactionyear": 2025


   // console.log('prop search filter:',search)
    //list of options with current year, all months up to and including the current month.
    //create api endpoint to retrieve all transactions OR use the api/transaction already there 
    //get months with transaction transaction month/years in array by lookup then export only the month/date as array
    //set array into dropdown as options (see categories dropdown)
    //route push year and month to params for month selected
    //do same for Categories in params

//console.log('path',router.pathname);
    


    //const filtersearch = new URLSearchParams({searchParams});
    //const filteryear = searchParams.fyear ? searchParams.fyear : "not there";
    //console.log('filtersearch',{searchParams})
        useEffect(() => {
            fetch('/api/filter')
            .then((res) => res.json())
              .then((filters) => {
                //console.log('filters: ',filters)
                setFilters(filters)
              })
            /* jshint ignore:start*/
            },[])
            /* jshint ignore:end*/
          useEffect(() => {
            fetch('/api/category')
              .then((res) => res.json())
              .then(({categories}) => {
                setCategories(categories)
                //console.log('categories: ',categories)
              })
              /* jshint ignore:start*/
          }, [])
          /* jshint ignore:end*/
    const clearFilter = (e:React.FormEvent<HTMLElement>) => {
      e.preventDefault();
     //console.log('filter params', params)
     router.push(`/dashboard?fyear=${queryYear ? queryYear : getYear }&fmonth=${queryMonth ? queryMonth : getMonth+1 }&category=all-categories`)

    }
    const categoryFilter = (e:React.FormEvent<HTMLElement>) => {
      e.preventDefault();
      let categoryT = categoryTitle.toLowerCase();
      router.push(`/dashboard?fyear=${queryYear ? queryYear : getYear }&fmonth=${queryMonth ? queryMonth : getMonth+1 }&category=${categoryT}`)
  }
    const dateFilter = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const datesfilterVal = datesfilter ? datesfilter : fmonth;
        let newYear = datesfilterVal.slice(datesfilterVal.length - 4); 
        let newMonth = datesfilterVal.slice(0, - 4); 
        router.push(`/dashboard?fyear=${newYear ? newYear: queryYear}&fmonth=${newMonth ? newMonth : queryMonth}&category=${queryCategory ? queryCategory : "all-categories"}`)
    }
    return(
        <>

        <div className="outerDiv">
          <form onSubmit={dateFilter} className="flex flex-col flex-wrap gap-5 my-3">
            <h2>Choose Transactions from a Different Month</h2>
            <div className="flex flex-row align-middle">
              <select onChange={(e) => setDatesfilter(e.target.value)} className="m-2">
                {filters?.length > -1 ? 
                  (filters.map((filter:any,index:number) =>
                  {return(
                    <option key={index} value={`${filter._id.month}${filter._id.year}`}>{filter._id.month}/{filter._id.year}</option>
                )}
                )): "no dates are available"}
              </select>
              <button className="bg-blue-400 rounded-md p-1 m-2 h-fit justify-center align-middle text-white font-semibold flex" type="submit">Click to Choose Month</button>
            </div>
          </form>
        </div>
                  
        
        </>)
}
//export default SimpleFilterTransaction
