"use client"
import React, {createContext,useContext}from "react";

type MyCategoriesType=[{
    mycategoryId:string,
    isChecked:boolean,
    explain:string,
    categorynotes:string,
    planamount:string,
  }]
  type SpendingplanType={
    //authorId:'string',
    planmonthyear:Date,
    mycategories:MyCategoriesType
  }
  
//const FoodContext = createContext<Promise<string[]> | null>(null)
const SpendingplansContext = createContext<Promise<SpendingplanType[]> | null>(null)
//console.log('CategoriesContext',CategoriesContext)
export const useSpendingplansPromise = () => {
    const spendingplans = useContext(SpendingplansContext);
    //console.log('provider categories',categories)
    if(!spendingplans) throw new Error("useSpendingplans must be used within a CategoriesProvider");
    return spendingplans;
};
const RQSpendingplansProvider = ({
    children,
    spendingplansPromise,
}:{
    children: React.ReactNode;
    spendingplansPromise: Promise<SpendingplanType[]>;
}) => {
    return (
        <SpendingplansContext.Provider value={spendingplansPromise}>
            {children}
        </SpendingplansContext.Provider>
    )
}
export default RQSpendingplansProvider;