"use client"

import { useSearchParams } from 'next/navigation'


//PUT THESE BACK or figure another way for props:
 //const newpropsfield = {params};

export default function Dates() {
  const searchParams = useSearchParams()

const getMonth = new Date()
//const month = getMonth.toLocaleString('default', { month: 'long' });
const thisMonth = new Date().getMonth()+1;//this is default
const thisYear = new Date().getFullYear()
    //{ [key: string]: string | string[] | undefined }
  const date = getMonth;
  // URL -> `/dashboard?search=my-project`
  // `search` -> 'my-project'
  return <div>
      <h2>Today's Date: {thisMonth}/{thisYear}</h2>
        </div>
}