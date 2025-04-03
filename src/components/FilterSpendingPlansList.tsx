import {getServerSession} from "next-auth";
// import Link from "next/link"
// import { BsFillPencilFill } from 'react-icons/bs'
import Spendingplan from "@/models/spendingplanModel";
import User from "@/models/userModel";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";

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

