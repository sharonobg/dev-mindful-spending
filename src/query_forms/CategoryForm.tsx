"use client"

import React,{useState} from 'react';
import {useRouter} from 'next/navigation';
import {ToastContainer ,toast} from 'react-toastify';
import {useSession}from 'next-auth/react';
import { useForm,SubmitHandler } from 'react-hook-form';
import 'react-toastify/dist/ReactToastify.css';
// import { useCreateCategoryMutation} from '@/query_services/mutations';
// interface CategoryType extends HTMLFormElement {
//     readonly elements: FormElements
//  }
// type CategoryType = {
// title:string
// }
const AuthorCategoryForm = ({onSubmit,initialValue}:{

    onSubmit:any,
    initialValue:any
}) => {

    initialValue = {}
    
    const {data:session,status} = useSession();
    const router= useRouter();
    const [title,setTitle]= useState<string>("")
    const [categories,setCategories]=useState<Category[]>()
    //  const [title,setTitle]= useState("")
    const[category,setCategory]=useState<Category>()
    
    const {register,handleSubmit}=useForm<Category>({
        defaultValues: {
          title:''
        },
      })
    if(status === 'loading'){
        return <p>Loading...</p>
    }
    if(status === 'unauthenticated'){
       return <p className="font-bold text-red-500">Access Denied</p>
    }
    // const createNewCategory =  useCreateCategoryMutation();

//     const handleCreateNewCategory:SubmitHandler<Category> = (data) =>
// {createNewCategory.mutate(data)};
    return(
        <div className="flex flex-col w-full place-items-center border-l-orange-100">
            <form className="flex flex-col flex-wrap gap-5 my-3">
            
                <h2>Add Category:</h2>
                <input 
                    placeholder="Enter New Category"
                    {...register("title", { minLength: 4 })}
                />
                <input type="submit" />
                {/* <button className="bg-blue-400 rounded-md p-3 text-white font-semibold" type="submit" disabled={!title }>Create Category</button> */}
                {/* <button className="bg-blue-400 rounded-md p-3 text-white font-semibold" type="submit">Create Category</button> */}
            </form>
            <ul>
                {}
                <li></li>
                </ul>
            <ToastContainer />
        </div>
        
        )
}
export default AuthorCategoryForm 

