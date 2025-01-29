import mongoose from "mongoose";
import Spendingplan from "@/models/spendingplanModel";
import {getServerSession} from "next-auth"
import {authOptions} from "@/app/api/auth/[...nextauth]/route"
import User from "@/models/userModel";
import connect from "@/libs/database/mongo";
import {revalidatePath} from 'next/cache';
import {useRouter} from 'next/router';
export async function PlanDetails(formData:any) {
    'use server'
    const router = useRouter();
    const {planmonthyear,mycategories}= formData;
    connect();
    const thisMonth = new Date().getMonth()+1;//this is default
    const thisYear = new Date().getFullYear()
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user?.email;
    const user = await User.findOne({email:sessionUser});
    const userid = user._id
    const categories = await Spendingplan.find({authorId:userid});
    //import CreateSpendingPlan from "@/components/CreateSpendingPlan";
    //revalidatePath('/')
    //disconnect();
    //router.refresh();
    //return <CreateSpendingPlan />
    
};


