//import Testpromises from "@/components/Testpromises";
//import FoodProvider from "@/components/FoodProvider";
import {Suspense} from "react";
import CategoriesQuery from "@/query_components/CategoriesQuery";
import {ErrorBoundary} from "react-error-boundary";
//import TestpromisesQuery from "@/components/TestpromisesQuery";
import Category from "@/models/categoryModel";
import Spendingplan from"@/models/spendingplanModel";
import RQCategoriesProvider from "@/query_components/RQCategoriesProvider";
import User from "@/models/userModel";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import SpendingPlansQuery from "@/query_components/SpendingPlansQuery";
import RQSpendingplansProvider from "@/query_components/RQSpendingplansProvider";
import TransactionsQuery from "@/query_components/TransactionsQuery";
import RQTransactionsProvider from "@/query_components/RQTransactionsProvider";
import Transaction from "@/models/transactionModel";
import NewSpendingPlanForm from "@/query_forms/NewSpendinPlanForm";
//import TransactionServices from "@/services/transactions";
import TransactionsListId from "@/components/TransactionsListId"
import getTransactions from "@/services/transactionsService";
import TransactionsService2 from "@/services/TransactionsService2";
import TransactionsServiceOnly from "@/services/TransactionsServiceOnly";
import gettransactions from "@/services/transactions";
import SpendingPlansQueryApi from "@/query_components/SpendingPlansQueryApi";

export default async function TestPromises(props:any) {
const session = await getServerSession(authOptions);
const sessionUser = session?.user?.email;
const user = await User.findOne({email:sessionUser});
const userid = user?._id
const categoriesfetch = await Category.find().sort({ title: 1 });
const categories = JSON.parse(JSON.stringify(categoriesfetch));
 const spendingplansfetch = await Spendingplan.find({authorId:userid});
 const spendingplans = JSON.parse(JSON.stringify(spendingplansfetch));
 
// const transactionsfetch:TransactionType[] = await Transaction.find({authorId:userid});
// const transactions:TransactionType[] = JSON.parse(transactionsfetch);
const transactions:TransactionType[] = await Transaction.find({authorId:userid});

    return (
    <div>
         {/* <pre>Transactions TestPromises:{JSON.stringify(transactions,null,2)}</pre> */}
        <h1>Hello from Serve TestPromises Pager</h1>
        {/* <RQTransactionsProvider transactionsPromise={transactions}> */}
        <RQSpendingplansProvider spendingplansPromise={spendingplans}>
        <RQCategoriesProvider categoriesPromise={categories}>
        <ErrorBoundary fallback="Something is wrong">
        {/* <FoodProvider foodPromise={foodfetch}> */}
        {/* <Suspense fallback={<div>Loading...</div>}>
           <TransactionsService2 />
             <NewSpendingPlanForm /> 
        </Suspense>   */}
        <NewSpendingPlanForm />
        {/* <TransactionsQuery /> */}
        <CategoriesQuery />
        <SpendingPlansQuery />
        {/* <SpendingPlansQueryApi /> */}
        {/* <TestpromisesQuery /> */}
        {/* </FoodProvider> */}
        </ErrorBoundary>
        </RQCategoriesProvider>
        </RQSpendingplansProvider>
        {/* </RQTransactionsProvider> */}
    </div>
    )
}