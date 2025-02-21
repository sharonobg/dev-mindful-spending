"use client"
import {useQuery} from "@tanstack/react-query";
import {useCategoriesPromise} from '@/query_components/RQCategoriesProvider';

//export default function CategoriesQuery() {
   const  CategorieQueryApi = () =>{
    const categoriesPromise = useCategoriesPromise();
    //onSuccess, onError and onSettled have been removed from Queries. They haven't been touched for Mutations. 
    const { data:categories } = useQuery({
        queryKey:["categories"], //array constant(for edit can be['categories',id'])
        queryFn: () => categoriesPromise //for edit can be ie:queryFn: () => fetchCategories(id)
        
    });
return(
    <div>
        <h1>Categories from Categories Client Query available</h1>
        {/* <div>Categories: {categories?.map((category:any) =>  */}
        {/* // <div key={category._id}>
        //     <ul>
        //         <li key={category._id}>
        //         {category.title}
        //         </li>
        //     </ul>
        //     </div>
        
        // )}
        // </div> */}
       
    </div>
    )
}
export default CategorieQueryApi