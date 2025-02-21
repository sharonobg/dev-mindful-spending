import {ErrorBoundary} from "react-error-boundary";
import User from "@/models/userModel";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import TransactionQuery from "./TransactionQuery";
import TransactionForm from "./TransactionForm";

export default async function TransactionsServer(props:any) {
const session = await getServerSession(authOptions);
const sessionUser = session?.user?.email;
const user = await User.findOne({email:sessionUser});
const userid = user?._id


// export default async function TransactionPage(
// {searchParams,
// }: {
//   params: { id: string }
//   searchParams: { [key: string]: string | string[] | undefined }
// }) {
//     const session = await getServerSession(authOptions);
//     const sessionUser = session?.user?.email;
//     const user = await User.findOne({email:sessionUser});
//     const userid = user?._id
//     const thisMonth = new Date().getMonth()+1;//this is default
//     const thisYear = new Date().getFullYear()
//     const dbfilteryear = searchParams?.fyear|| searchParams.fyear ===null ? searchParams.fyear : thisYear;
//     const dbfiltermonth = searchParams?.fmonth || searchParams.fyear ===null ? searchParams.fmonth : thisMonth; 
//     const filtercategory= searchParams?.category? searchParams?.category : "all-categories"
  
    return (
        <div>
       {/* <h2>Transactions: {JSON.stringify(transactions,null,2)}</h2> */}
        
            <ErrorBoundary fallback="Something is wrong">
                {/* <TransactionQuery /> */}
                <TransactionForm />
            </ErrorBoundary>
           
       
        </div>
    )
}
