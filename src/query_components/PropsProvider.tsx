'use client'
 
import { createContext,useContext, useState } from 'react'

import { useSearchParams } from 'next/navigation'
// const thisMonth = new Date().getMonth()+1;//this is default
// const thisYear = new Date().getFullYear()
type PropsTypes={
  fyear:number;
  fmonth:number;
  fcategory:string;
}

//const PropsContext = createContext<Promise<PropsTypes> | null>(null)


// export const useParamsPromise = () => {
//   const PropsContext = {
//     fyear:new Date().getFullYear(),
//     fmonth:new Date().getMonth() +1,
//     fcategory:"all-categories",
//   }
//   const currentprops = useContext(PropsContext)
//   if(!currentprops) throw new Error("useCurrentProps must be used within a PropsProvider");
//   return currentprops
//  }

const PropsContext = createContext<PropsTypes>({
  fyear:new Date().getFullYear(),
  fmonth:new Date().getMonth() +1,
  fcategory:"all-categories",
});


//const PropsProvider = ({
  //children,
  //propsPromise
// }:{
//   children: React.ReactNode,
//   //propsPromise:Promise<PropsTypes>;
// }) => {
  export default function PropsProvider({
    children,
    //propsPromise
  }:{
    children: React.ReactNode,
    //propsPromise:Promise<PropsTypes>;
  })
{
  let [dateprops,setDateProps]= useState({
    fyear:new Date().getFullYear(),
    fmonth:new Date().getMonth() +1,
    fcategory:"all-categories",
  })
  return (<PropsContext.Provider value={dateprops}>{children}</PropsContext.Provider>)
}
export function usePropsContext() {
  return useContext(PropsContext);
}
//export default PropsProvider;