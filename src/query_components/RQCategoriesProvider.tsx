"use client"
import React, {createContext,useContext}from "react";


//const FoodContext = createContext<Promise<string[]> | null>(null)
const CategoriesContext = createContext<Promise<Category[]> | null>(null)
//console.log('CategoriesContext',CategoriesContext)
export const useCategoriesPromise = () => {
    const categories = useContext(CategoriesContext);
    //console.log('provider categories',categories)
    if(!categories) throw new Error("useCategories must be used within a CategoriesProvider");
    return categories;
};
const RQCategoriesProvider = ({
    children,
    categoriesPromise,
}:{
    children: React.ReactNode;
    categoriesPromise: Promise<Category[]>;
}) => {
    return (
        <CategoriesContext.Provider value={categoriesPromise}>
            {children}
        </CategoriesContext.Provider>
    )
}
export default RQCategoriesProvider;