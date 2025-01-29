"use client"

import Link from 'next/link';
import {signIn,signOut,useSession} from 'next-auth/react';
import  {useState,useEffect} from 'react';
import { usePathname } from 'next/navigation';

// function SignInOutButton() {
//     <button onClick={(e) =>  {e.preventDefault(); signIn()}} className="text-white font-bold">Sign In</button>
//                 }
export default function Navbar() {
    const pathname = usePathname()
    const {data: session} = useSession()
    const [navOpen,setNavOpen]= useState<boolean>(false)
    const[isdesktop,setIsdesktop]=useState<boolean>(false);
    //const desktopNav = () => {setNavOpen(true)}
    //if(window.innerWidth<768){setNavOpen}else{desktopNav};
    const openNav = (event: React.MouseEvent<HTMLButtonElement>) => { 
        setNavOpen(!navOpen)
    }
   useEffect(() => {
        function getWidth() {

    if(typeof window !== undefined){
        const wW = window.innerWidth;
        
        if(wW > 767){
            setIsdesktop(true)
        }
        // const [isdesktop,setIsdesktop]=useState<boolean>(window.innerWidth > 767)
        // setIsdesktop(isdesktop);
}

    }
    //console.log('isdesktop',isdesktop)
    getWidth();
   }
   

   )
   console.log('isdesktop',isdesktop)
   console.log('navOpen',navOpen)
    //const switchNav=window.innerWidth<768?{openNav}:{desktopNav};
//    if(window.innerWidth >767){setIsdesktop(true)}else{setIsdesktop(false)}
    return(<>
       
        <nav className="flex flex-col hover-sm-visible md:flex-row align-middle max-w-[100%] px-8 py-3 bg-blue-400">
        {session? (<><div className="font-bold text-white" >Logged in with {session.user?.email}</div> 
            <button onClick={() => signOut({ callbackUrl: '/', redirect:true })} className="text-white font-bold">Sign Out</button>
                </>):<button onClick={(e) =>  {e.preventDefault(); signIn()}} className="text-white font-bold">Sign In</button>}
        
            <div className="flex flex-col md:flex-row justify-around gap-5">
            
            {session?.user
            ? (<>
            <button onClick={openNav} className="hamburger font-bold text-white md:hidden">MENU</button>
                <div className="hamburger-menu hover-sm-visible ">
               
                {(navOpen || isdesktop) && 
                (
                    <>
                <Link className={`link ${pathname === '/' ? 'active' : ''}`} href = {"/"}>Home</Link>
                <Link className= {`link ${pathname === '/dashboard' ? 'active' : ''}`} href = {"/dashboard"}>My Dashboard</Link>
                <Link className={`link ${pathname === '/add-income' ? 'active' : ''}`} href = {"/add-income"}>Add income</Link>
                <Link className={`link ${pathname === '/transaction' ? 'active' : ''}`} href = {"/transaction"}>Add a transaction</Link>
                <Link className={`link ${pathname === '/add-incomeplan' ? 'active' : ''}`} href = {"/add-incomeplan"} target="_blank">Income Plan</Link>
            <Link className={`link ${pathname === '/spendingplan' ? 'active' : ''}`} href = {"/spendingplan"} target="_blank">Spending Plan</Link>
            </>)}
                    </div>
                    </>): <div>
                
                {/* <SignInOutButton /> */}
                </div>
                }
            </div>
        </nav> 
        </>)
}