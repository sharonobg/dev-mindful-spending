'use server'
import mongoose from "mongoose";
import Spendingplan from "@/models/spendingplanModel";
import {getServerSession} from "next-auth"
import {authOptions} from "@/app/api/auth/[...nextauth]/route"
import User from "@/models/userModel";
import connect from "@/libs/database/mongo";

const SpendingPlanDetails = async () => {
    connect();
    const thisMonth = new Date().getMonth()+1;//this is default
  const thisYear = new Date().getFullYear()
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user?.email;
  const user = await User.findOne({email:sessionUser});
  const userid = user._id
  const myplans = await Spendingplan.find({authorId:userid});
    //disconnect();
    
    return (
      
      <div className="my-5 flex flex-col place-items-center spreadsheetCont">
       <h1>My Spending plans:</h1>
      <pre>{JSON.stringify(myplans, null, 2)}</pre>
      {myplans?.length > -1 ? (myplans.map((plan) => 
     <div key={plan._id}>
        {/* <ul>
          <li>{plan.mycategories.}</li>
        </ul> */}
     </div>
      )):"you have no spending plans"}
    </div> 
    )
    
};
export default SpendingPlanDetails;


