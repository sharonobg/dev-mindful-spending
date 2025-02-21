import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import User from "@/models/userModel";
import Transaction from "@/models/transactionModel";
import Category from "@/models/categoryModel";

export default async function getTransactions() {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user?.email;
    const user = await User.findOne({email:sessionUser});
    const userid = user?._id
    //GET CATEGORIES
    const categoriesfetch = await Category.find().sort({ title: 1 });
    const categories = JSON.parse(JSON.stringify(categoriesfetch));
    // const propsfield = {props};
    const response = await Transaction.find({authorId:userid});
    const transactions = JSON.parse(JSON.stringify(response));
    //const post = await res.json();
    return  transactions
}