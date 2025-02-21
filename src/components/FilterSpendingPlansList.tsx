import {getServerSession} from "next-auth";
// import Link from "next/link"
// import { BsFillPencilFill } from 'react-icons/bs'
import Spendingplan from "@/models/spendingplanModel";
import User from "@/models/userModel";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
// import Category from "@/models/categoryModel";
// import SpendingPlanDetails from "@/components/Spendingplancomp";
// import SpendingPlanFilter from "@/components/SpendingPlanFilter";
// import SpendingPlanCreateClient from "@/components/SpendingPlanCreateClient";
// import SpendingPlanList from "@/components/SpendingPlanList";
// //import { getToken } from "next-auth/jwt";
// import {NextRequest} from "next/server";
// import { ObjectId } from "mongodb";
// import Dates from "@/components/Dates";

export default async function GetSpendingPlans(){
  const session = await getServerSession(authOptions);
const sessionUser = session?.user?.email;
const user = await User.findOne({email:sessionUser});
const userid = user?._id

const spendingplanslistl = await Spendingplan.aggregate([
  { $match: {
    $expr : { $eq: [ '$authorId' , { $toObjectId: userid } ] } 
}},
{
  $project: {
    //_id:0,
    day : {$dayOfMonth : "$planmonthyear"},
    month : {$month : "$planmonthyear"}, 
    year : {$year :  "$planmonthyear"},
    "planmonthyear":1,
  }
}
]
  
)
const spendingplanslist = JSON.parse(JSON.stringify(spendingplanslistl));
console.log('spendingplanslist',spendingplanslist

)

}

