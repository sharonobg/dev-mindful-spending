"use client"

import React,{useState,useEffect} from 'react';
import {useRouter,useSearchParams,useParams} from 'next/navigation';
import {ToastContainer ,toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useSession} from 'next-auth/react'
import { usePropsContext } from '@/query_components/PropsProvider';

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
    const [monthfilter,setMonthfilter]=useState<string>("")
    const [yearfilter,setYearfilter]=useState<string>("")
    const [datesfilter,setDatesfilter]=useState<string>("")
    const [categoryfilter,setCategoryfilter]=useState<string>("")
    //const [transactionstotal,setTransactionstotal]=useState([])
    // const [fmonth,setFmonth]=useState('')
    const {data:session,status} = useSession();
    const router= useRouter();
     const {fyear,fmonth,fcategory} = usePropsContext();
  
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
     router.push(`/dashboard?fyear=${fyear ? fyear : getYear }&fmonth=${fmonth ? fmonth : getMonth+1 }&category=${fcategory ? fcategory :"all-categories"} `)

    }
    //push current date OR selected date selected category to the url
    const categoryFilter = (e:React.FormEvent<HTMLElement>) => {
      e.preventDefault();
      let categoryT = categoryTitle.toLowerCase();
      const categoryfilterVal = categoryfilter ? categoryfilter : "all-categories";
      
      router.push(`/dashboard?fyear=${fyear ? fyear : getYear }&fmonth=${fmonth ? fmonth : getMonth+1 }&category=${fcategory ? fcategory :"all-categories"}`) 
  }
  //push selected date to the url
    const dateFilter = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let categoryT = categoryTitle.toLowerCase();
      const categoryfilterVal = categoryfilter ? categoryfilter : "all-categories";
      
        const datesfilterVal = datesfilter ? datesfilter : fmonth.toString();
        let newYear = datesfilterVal.slice(datesfilterVal.length - 4); 
        let newMonth = datesfilterVal.slice(0, - 4);
        let newCategory = categoryfilterVal;
        router.push(`/dashboard?fyear=${newYear ? newYear: fyear}&fmonth=${newMonth ? newMonth : fmonth}&category=${newCategory? newCategory : fcategory}`)

        //console.log('categories: ',categories)
    // if fmonth = the transaction month = show results = else hide results
    //console.log('filters - filter month: ',fmonth)
    //router.refresh() 
    }
    //console.log('filter month: ',fmonth)
    //console.log('new date: ',newD)

    //const FilterProvider = ({ children, fmonth }) => (
    //    <FilterProvider fmonth={fmonth}>
    //        {children}
    //    </FilterProvider>
    //)
    return(
        <>
        <div className="outerDiv">
          <form onSubmit={dateFilter} className="flex flex-col flex-wrap gap-5 my-3 place-items-center">
            <h2>See your Transactions below or choose Transactions from a Different Month</h2>
            <div className="flex flex-row align-middle">
              <select onChange={(e) => setDatesfilter(e.target.value)} className="m-2">
                {filters?.length > -1 ? 
                  (filters.map((filter:any,index:number) =>
                  {return(
                    <option key={index} value={`${filter._id.month}${filter._id.year}`}>{filter._id.month}/{filter._id.year}</option>
                )}
                )): "no dates are available"}
              </select>
              {/* <h2>Month:</h2> */}
              {/* <select onChange={(e) => setMonthfilter(e.target.value)} className="m-2">
                {filters?.length > -1 ? 
                  (filters.map((filter:any,index:number) =>
                  {return(
                    
                    <option key={filter._id.month} value={`${filter._id.month}`}>{filter._id.month}</option>
                )}
                )): "no dates are available"}
              </select>
              <h2>Year:</h2>
              <select onChange={(e) => setYearfilter(e.target.value)} className="m-2">
                {filters?.length > -1 ? 
                  (filters.map((filter:any,index:number) =>
                  {return(
                    <option key={filter._id.year} value={`${filter._id.year}`}>{filter._id.year}</option>
                )}
                )): "no dates are available"}
              </select> */}
              <select onChange={(e) => setCategoryfilter(e.target.value)} className="m-2">
                {filters?.length > -1 ? 
                  (filters.map((filter:any,index:number) =>
                  {return(
                    <option key={filter._id.categoryTitle} value={`${filter._id.categoryTitle}`}>{filter._id.categoryTitle}</option>
                )}
                )): "no dates are available"}
              </select>
               <button className="bg-blue-400 rounded-md p-1 m-2 h-fit justify-center align-middle text-white font-semibold flex" type="submit">Click to Choose Options</button>
            </div>
           
          </form>
          {/* <form onSubmit={categoryFilter} className="flex flex-col flex-wrap gap-5 my-3 place-items-center">
            <h2>See your Transactions below or view Transactions by Category</h2>
            <div className="flex flex-row align-middle">
              <select onChange={(e) => setCategoryfilter(e.target.value)} className="m-2">
                {filters?.length > -1 ? 
                  (filters.map((filter:any,index:number) =>
                  {return(
                    <option key={index} value={`${filter._id.categoryId}`}>{filter._id.categoryId}</option>
                )}
                )): "no dates are available"}
              </select>
              <button className="bg-blue-400 rounded-md p-1 m-2 h-fit justify-center align-middle text-white font-semibold flex" type="submit">View by Category</button>
            </div>
          </form> */}
        </div>
                  
        
        </>)
}
//export default SimpleFilterTransaction
