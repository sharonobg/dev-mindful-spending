"use client"
import //React,
{useState,useEffect} from 'react';
import Link from 'next/link';
import {useSession} from 'next-auth/react';
import {useRouter} from 'next/navigation';
import { BsFillPencilFill } from 'react-icons/bs'
import { AiFillDelete } from 'react-icons/ai'
import {HiPencilAlt} from "react-icons/hi";


const CategoryDetails = ({ params }: { params: { id: string } }) => {
    const [categoryDetails,setCategoryDetails]=useState<Category>();

    const{data: session}= useSession();
    const router = useRouter();

    useEffect(() => {
       //const id = {params}
       async function fetchCategory(){                        
           const res = await fetch(`/api/category/${params}`,{cache:'no-store'})
           
           const category = await res.json()
           //console.log('category after await: ',category)
           setCategoryDetails(category);
           //console.log('category title: ',category?.title)
       }
      session && fetchCategory()
      
    },[session])
/*const handleDelete = async ({ params }: { params: { slug: string } }) => {
    try{
        const confirmModal = confirm("Do you want to delete this category?");
        if(confirmModal){
            const res = await fetch(`/api/category/${params}`,{
            headers:{
                "Authorization": `Bearer ${session?.user?.accessToken}`
            },
            method:"DELETE"
        }) 
        if(res.ok){
            router.push("/dashboard")
        }
    }
        
    }catch(error){
        console.log('Error: ',error)
    }
  }*/
    return(
<div className="flex flex-col place-items-center">
        <div className="rounded-md w-[50%] p-3 place-items-center border border-blue-600 shadow-lg bg-yellow-100 min-h-[200px] text-black">
        <h3>Title: {categoryDetails?.title}</h3>
        
        <div className="controls">
                <div className="flex gap-2 flex-row ">
                    <div className="flex flex-row">
                        {/* <Link className="flex flex-row gap-1" href={`/add-category/edit/${params}`}>Edit<BsFillPencilFill /></Link> */}
                    </div>
                    {/*<button onClick={handleDelete} className="flex flex-row gap-1" >Delete<AiFillDelete /></button>*/}
                </div>
            </div>
        
        
        </div>
</div>
    )
}
export default CategoryDetails
