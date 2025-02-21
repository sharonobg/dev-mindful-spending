"use server"

import Category from "@/models/categoryModel";

const CategoriesAction = async () => {

    const categories = await Category.find().sort({ title: 1 });
    //const categories = await categoriesf.json()
     return (
        
        console.log(categories)
    )   
    
}
export default CategoriesAction