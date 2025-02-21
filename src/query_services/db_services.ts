
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import User from "@/models/userModel";
import Category from "@/models/categoryModel";
import Spendingplan from"@/models/spendingplanModel";
import Transaction from "@/models/transactionModel";


export default async function DataInfo() {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user?.email;
    const user = await User.findOne({email:sessionUser});
    const userid = user?._id
    const categoriesfetch = await Category.find().sort({ title: 1 });
    const categories = JSON.parse(JSON.stringify(categoriesfetch));
    const spendingplansfetch = await Spendingplan.find({authorId:userid});
    const spendingplans = JSON.parse(JSON.stringify(spendingplansfetch));
    const transactionsfetch = await Transaction.find({authorId:userid});
    const transactions = JSON.parse(JSON.stringify(transactionsfetch));


    return 
} 



