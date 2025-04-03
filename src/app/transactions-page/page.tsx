import TransactionsComp from "@/query_components/TransactionsComp"
// import { getTransactionsIds } from "@/query_services/services"

function TransactionsServerPg(props:any){
const month = new Date().getMonth() +1;
console.log('month',month)
const year = new Date().getFullYear();
console.log('year',year)
const thisMonth = new Date().getMonth()+1;//this is default
const thisYear = new Date().getFullYear()

//PUT THESE BACK or figure another way for props:
//  const dbfilteryear = searchParams?.fyear|| searchParams.fyear ===null ? searchParams.fyear : thisYear;
//  const dbfiltermonth = searchParams?.fmonth || searchParams.fyear ===null ? searchParams.fmonth : 5; 
//  const filtercategory= searchParams?.category? searchParams?.category : "all-categories"
 
    return (
    <div>
        {/* ServicesIDs:{JSON.stringify(getTransactionsIds,null,2)} */}
        <h1>Transactions Server Page</h1>
        <TransactionsComp />
    </div>)

}
export default TransactionsServerPg