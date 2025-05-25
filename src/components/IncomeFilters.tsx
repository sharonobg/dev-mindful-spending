"use client"

import * as React from 'react';
import {useState,useEffect} from 'react'; 
import {useRouter,useSearchParams,useParams} from 'next/navigation';
import {ToastContainer ,toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useSession} from 'next-auth/react'
enum IncomeType{
    choose="choose",
      wages = "wages",
      freelance = "free-lance",
      tips = "tips",
      interest = "interest",
      childsupport =  "child-support",
      retirementincome ="retirement-income",
      savings ="from-savings",
      businessincome ="business-income",
      otherincome =  "other"
   }
export default function IncomeFilterTransaction() {
//export default function FilterTransaction ()  {
    //get the year and the month - get the months up to the current month
    //get the previous year - get the months from the first month available to the end of the year
    //date details:
    
    const newD = new Date()
   
    const getMonth = new Date().getMonth()
    //const monthLong = newD.toLocaleString('default', { month: 'long' });
    const getYear = new Date().getFullYear()
    //const getMonthYear = getMonth +', ' +getYear;
    //const [transdate,setTransdate]= useState(new Date())
    const [plannedIncome,setPlannedIncome]=useState([])
    const [incomeType,setIncomeType]= useState<IncomeType>()
    //const [categoryTitle,setCategoryTitle]= useState<string>("")
    const [filtersinc,setFiltersinc]=useState([])
    const [datesfilterinc,setDatesfilterinc]=useState<string>("")
    //const [transactionstotal,setTransactionstotal]=useState([])
    const [fmonth,setFmonth]=useState('')
    const {data:session,status} = useSession();
    const router= useRouter();
    const searchParams = useSearchParams();
    //const queryIncometype = searchParams.get('incometype');
    const queryMonth = searchParams.get('fmonth') != null ? searchParams.get('fmonth'):getMonth;
    const queryYear = searchParams.get('fyear') != null ? searchParams.get('fyear'):getYear;
    
    //console.log('queryCategory filter: ',queryCategory)
    console.log('queryMonth filter: ',queryMonth)
    console.log('queryYear filter: ',queryYear)
    const params = searchParams ? searchParams : undefined;
    console.log('params useParams filter: ', params)
        useEffect(() => {
            fetch('/api/filterincomeplans')
            .then((res) => res.json())
              .then((filtersinc) => {
                //console.log('filters: ',filters)
                setFiltersinc(filtersinc)
              })
              /* jshint ignore:start*/
            },[])
            /* jshint ignore:end*/
    const clearFilter = (e:React.FormEvent<HTMLElement>) => {
      e.preventDefault();
     router.push(`/dashboard?fyear=${queryYear ? queryYear : getYear }&fmonth=${queryMonth ? queryMonth : getMonth+1 }`)

    }
//     const incometypeFilter = (e:React.FormEvent<HTMLElement>) => {
//       e.preventDefault();
      
//       //const datesfilterVal = datesfilter ? datesfilter : fmonth;
      
//       //let newYear = datesfilterVal.slice(datesfilterVal.length - 4); 
//       //let newMonth = datesfilterVal.slice(0, - 4); 
//       let incometypeT = incomeType.toLowerCase();
//       //let qm = queryMonth?queryMonth:"no month";
//       //console.log('qm?: ',qm)
//       //console.log('params props newYear filter: ',newYear)
//       //console.log('params props category filter: ',categoryTitle)
//       //console.log('params props dates filter: ',datesfilterVal)
//       router.push(`/dashboard?fyear=${queryYear ? queryYear : getYear }&fmonth=${queryMonth ? queryMonth : getMonth+1 }&incometype=${incometypeT}`)

//       //console.log('categories: ',categories)
//   // if fmonth = the transaction month = show results = else hide results
//   //console.log('filters - filter month: ',fmonth)
//   //router.refresh() 
//   }
    const dateFilter = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const datesfilterVal = datesfilterinc ? datesfilterinc : fmonth;
        let newYear = datesfilterVal.slice(datesfilterVal.length - 4); 
        let newMonth = datesfilterVal.slice(0, - 4); 
        //let categoryT = categoryTitle.toLowerCase();
        //console.log('datesfilterVal filter: ',datesfilterVal)
        //console.log('params props newMonth filter: ',newMonth)
        //console.log('params props newYear filter: ',newYear)
        //console.log('params props category filter: ',categoryTitle)
        //console.log('params props dates filter: ',datesfilterVal)
        router.push(`/dashboard?fyear=${newYear ? newYear: queryYear}&fmonth=${newMonth ? newMonth : queryMonth}`)

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
{/*<pre>income filters:{JSON.stringify(filtersinc, null, 2)}</pre>*/}
        <div className="outerDiv">
          <form onSubmit={dateFilter} className="flex flex-col flex-wrap gap-5 my-3">
            <h2>Choose a Different Month for Income</h2>
            <div className="flex flex-row align-middle">
              <select onChange={(e) => setDatesfilterinc(e.target.value)} className="m-2">
                {filtersinc?.length > -1 ? 
                  (filtersinc.map((filterinc:any,index:number) =>
                  {return(
                    <option key={index} value={`${filterinc._id.month}${filterinc._id.year}`}>{filterinc._id.month}/{filterinc._id.year}</option>
                )}
                )): "no dates are available"}
              </select>
              <button className="bg-blue-400 rounded-md p-1 m-2 h-fit justify-center align-middle text-white font-semibold flex" type="submit">Choose Income Month</button>
            </div>
          </form>
        </div>
                  
        
        </>)
}
//export default SimpleFilterTransaction
