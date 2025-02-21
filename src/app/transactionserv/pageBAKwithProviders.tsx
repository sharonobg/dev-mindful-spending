import {ErrorBoundary} from "react-error-boundary";
import{NextRequest} from "next/server";
import { getToken } from "next-auth/jwt"
import token from '@/libs/database/jwt';
import Category from '@/models/categoryModel';
import Transaction from "@/models/transactionModel";
import {getServerSession} from "next-auth"
import {authOptions}from"@/app/api/auth/[...nextauth]/route"
import User from "@/models/userModel";
import TransactionForm from "./TransactionForm";
import Filters from "@/components/Filters";
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import TransactionsQuery from "@/query_components/TransactionsQuery";
import RQTransactionsProvider from "@/query_components/RQTransactionsProvider";
import RQCategoriesProvider from "@/query_components/RQCategoriesProvider";

export default async function TransactionPage(
{searchParams,
}: {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}){
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user?.email;
    const user = await User.findOne({email:sessionUser});
    const userid = user?._id
    const categoriesfetch = await Category.find().sort({title:1});
    const categories = JSON.parse(JSON.stringify(categoriesfetch));
    // const transactionsfetch = await Transaction.find({authorId:userid});
    // const transactions = JSON.parse(JSON.stringify(transactionsfetch));
    const props = {searchParams};
    //const propsfield = {params.searchParams};
    const propsfield = {props};
    console.log('transactionserv propsfield',propsfield)
    const thisMonth = new Date().getMonth()+1;//this is default
    const thisYear = new Date().getFullYear()
    const dbfilteryear = searchParams?.fyear|| searchParams.fyear ===null ? searchParams.fyear : thisYear;
    const dbfiltermonth = searchParams?.fmonth || searchParams.fyear ===null ? searchParams.fmonth : thisMonth; 
    const filtercategory= searchParams?.category? searchParams?.category : "all-categories"
    const transactionsaggr = await Transaction.aggregate([
        { $match: {
            $expr : { $eq: [ '$authorId' , { $toObjectId: userid } ] } 
        }},
         {
            "$lookup": {
              "from": "categories",
              "let": {
                categoryId: {
                 "$toObjectId": "$categoryId"
                }
              },
              "pipeline": [
                {
                  $match: {
                    $expr: {
                      $eq: [
                        "$_id",
                        "$$categoryId",
                      ]
                    }
                  }
                },
                {
                  $project: {
                    _id:0,
                    day : {$dayOfMonth : "$transdate"},
                    month : {$month : "$transdate"}, 
                    year : {$year :  "$transdate"},
                    "transdate":1,
                   "descr":1,
                   categoryId:"$categoryId",
                   title: { $toLower : '$title' },
                    //title: 1,//category title,
                    amount:1
                    
                  }
                }
              ],
              "as": "category"
            }
          },
          {
            "$unwind": "$category"
          },
          { 
              $addFields: {
                month_date: {"$month": new Date() } 
                }
            },
          {
            $project: {
              "transdate":1,
              "descr":1,
              "acctype":1,
              day : {$dayOfMonth : "$transdate"},
              month : {$month : "$transdate"}, 
              year : {$year :  "$transdate"},
              categoryId:"$categoryId",
              title: { $toLower : "$category.title" },
              "amount":1,
              month_date:1
            }
            
          },
      {
        "$sort": {
          //"year": -1,
          //"month":1
          "transdate":1
        }
    }
    ])
     const transactions =  JSON.parse(JSON.stringify(transactionsaggr));
   
    return (
        <div>
       {/* <h2>Transactions: {JSON.stringify(transactions,null,2)}</h2> */}
        

            <RQCategoriesProvider categoriesPromise={categories}>
            <RQTransactionsProvider transactionsPromise={transactions}>
            <ErrorBoundary fallback="Something is wrong">
                <TransactionsQuery  />
                <Filters />
                <TransactionForm />
            </ErrorBoundary>
            </RQTransactionsProvider>
        </RQCategoriesProvider>
       
        </div>
    )
}




// function toObjectId(categoryId: string) {
//     throw new Error('Function not implemented.');
// }
