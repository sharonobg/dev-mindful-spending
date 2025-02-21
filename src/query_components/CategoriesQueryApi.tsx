"use client"
import {useQuery} from "@tanstack/react-query";
import {useCategoriesPromise} from '@/query_components/RQCategoriesProvider';

//export default function CategoriesQuery() {
const  CategoriesQuery = () => {
    //const categoriesPromise = useCategoriesPromise();
    //onSuccess, onError and onSettled have been removed from Queries. They haven't been touched for Mutations. 
   const {data:categories} = useQuery<Category[]>({
        queryKey:['categories'],
        queryFn: () => 
          fetch('http://localhost:3000/api/category')
            .then((res) => res.json()),
            
            // select: (categories) =>
            //     categories.map((category) => ({id:category._id,title:category.title}))
       });
console.log('categoresquery api',categories)

return (
    <div>
        <h1>Categories from CategoriesQueryAPI available</h1>
        <div>Categories: {(categories?.map((category:Category) => 
         <div key={category._id}>
            <ul>
                <li key={category._id}>{category.title}</li>
            </ul>
           </div>
        ))}
        </div> 
       
    </div>
    )
}
export default CategoriesQuery