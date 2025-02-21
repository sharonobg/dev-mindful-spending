"use client"

//import { useQuery } from "@tanstack/react-query";
import React, {createContext,useContext}from "react";
 type AccountType = "debit" | "cash" | "bank_account" | "other";
 enum Accounttype{
    debit = "debit",
    cash =  "cash",
    bankaccount= "bank_account",
    other = "other",
 }

//need type
//const FoodContext = createContext<Promise<string[]> | null>(null)
const TransactionsContext = createContext<Promise<TransactionType[]> | null>(null)
//console.log('CategoriesContext',CategoriesContext)
export const useTransactionsPromise = () => {
    const transactions = useContext(TransactionsContext);
    //console.log('provider categories',categories)
    if(!transactions) throw new Error("useTransactions must be used within a TransactionsProvider");
    return transactions;
};
const RQTransactionsProvider = ({
    children,
    transactionsPromise,
}:{
    children: React.ReactNode;
    transactionsPromise: Promise<TransactionType[]>;
}) => {
    return (
        <TransactionsContext.Provider value={transactionsPromise}>
            {children}
        </TransactionsContext.Provider>
    )
}
export default RQTransactionsProvider;