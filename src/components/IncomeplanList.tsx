import {getServerSession} from "next-auth";
import Link from "next/link"
import { BsFillPencilFill } from 'react-icons/bs'
import Incomeplan from "../../src/models/incomeplanModel";
import User from "../../src/models/userModel";
import {authOptions} from "../../src/app/api/auth/[...nextauth]/route";
//import {ObjectId} from 'mongodb';

export default async function IncomeplanList(props:any) {
  
  const thisMonth = new Date().getMonth()+1;//this is default
  const thisYear = new Date().getFullYear()
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user?.email;
  const user = await User.findOne({email:sessionUser});
  const userid = user._id
  //await connect();
  //const incomelist = await Income.find().sort({ incometype: -1 });
  //const month = {$month : incomelist.incomedate}
  const incomeplanlist = await Incomeplan.find({ authorId:userid }).sort({ incplanmonthyear: -1 });
      
  return(
    <div className="">
    <h1 className="largeTxt mt-5">My Incomeplans: {props.fmonth}/{props.fyear}</h1>
    {/* <pre>GET props incomelist:{JSON.stringify(props, null, 2)}</pre>
    <pre>Incomeplans:{JSON.stringify(incomeplanlist, null, 2)}</pre> */}
    <div className="spreadsheetCont">
      
      
{incomeplanlist?.length > -1 ? (incomeplanlist.map((incomeplan) =>
<>
{/* <div className="w-[200px] p-2"><h1>Income PlanDate:{incomeplan?.incplanmonthyear.toLocaleString("en-US", {month: "numeric",day: "2-digit",year: "numeric",})}</h1></div> */}
     <div className="sheet font-bold">
     
     <div className="flex-wrap w-[200px]">Incomeplan</div>
     <div className="flex-wrap w-[200px]">Plan Amount</div>
     <div className="flex-wrap w-[200px]">Date Expected Amount</div>
     <div className="flex-wrap w-[250px]">Plan Description</div>
     <div className= "w-[100px] py-2 flex flex-row justify-center gap-3">Edit/Delete</div>
  </div>
  <div className="font-normal">
        <div key={incomeplan._id} className="sheet flex flex-row  w-full min-h-[50%] bg-white">
        
        <div className="">
    {incomeplan.plannedIncome?.length > -1 ? (incomeplan.plannedIncome.map((plannedinc:any) =>
    <div key={plannedinc._id} className="sheet font-normal">
        
        <div className="w-[200px] p-2">{plannedinc?.incomeType}</div>
        <div className="w-[200px] p-2">{parseFloat(plannedinc?.incomeplanamount).toFixed(2)}</div>
        <div className="w-[200px] p-2">{plannedinc?.incdateexpected.toLocaleString("en-US", {month: "numeric",day: "2-digit",year: "numeric",})}</div>
        <div className="w-[250px] p-2">{plannedinc?.incomeplandescr}</div>
        <div className="w-[100px] p-2">Edit/Delete</div>
    
    </div>)):("cant find any plannedIncome")}
  </div> 
  </div></div>
  </> )):("cant find any incomeplan")
   }
  
  </div>
  </div>
  )//return
}