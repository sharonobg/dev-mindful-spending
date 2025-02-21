import *as React from 'react';
//import { getToken } from "next-auth/jwt";
import Spendingplan from "@/models/spendingplanModel";
import Category from "@/models/categoryModel";
//import {NextRequest, NextResponse} from "next/server";
import {getServerSession} from "next-auth"
import {authOptions}from "@/app/api/auth/[...nextauth]/route";
import User from "@/models/userModel";
//import { ObjectId } from "mongodb";
import SpendingPlanEditClient from "@/app/spendingplans/SpendingPlanEditClient";
import {Suspense} from "react"
import mongoose from "mongoose";
import { Document } from "mongoose";

const session = await getServerSession(authOptions);
    //console.log('filters session',session)
    
 const ServerComp = async ({ children }:{children:any}) =>{
    const sessionUser = session?.user?.email;
    const user = await User.findOne({email:sessionUser});
    const userid = user?._id
    //const serverid = params.id.toString();
    // const categoriesdl = await Category.find().sort({ title: 1 });
    // const categories = JSON.parse(JSON.stringify(categoriesdl));
    const categories = await Category.find().sort({ title: 1 });
    //const idn = params.id.toString();
    //const id = new mongoose.Types.ObjectId(idn);
 //const mongoose = require('mongoose');
    const spendingplans = await Spendingplan.find().populate("authorId","mycategories").lean();


console.log(spendingplans)
return (
   <>
   { children }
   <pre>Interleaving page Server comp: spendingplanserver{JSON.stringify(categories,null,2)}</pre>
    <pre>Interleaving page Server comp: categories{JSON.stringify(spendingplans,null,2)}</pre>
   </>
   )
 }
 export default ServerComp

  