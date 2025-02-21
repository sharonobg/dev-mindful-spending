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
import SpendingPlanClientTest from '../SpendingPlanClientTest';
// type CategoriesProps = {categories: Category[]}

// type MyCategoryType=
// {
//   mycategoryId:string,
//   isChecked:boolean,
//   explain:string,
//   categorynotes:string,
//   planamount:string,
// }
type MyCategoriesType=[{
  mycategoryId:string,
  isChecked:boolean,
  explain:string,
  categorynotes:string,
  planamount:string,
}]
interface SpendingplanType{
  //authorId:'string',
  planmonthyear:Date,
mycategories:MyCategoriesType
}

const EditSpendingPlanServer = async (
  { params }: { params: { id: string } }) =>{

// export default async function EditSpendingPlanServer({ params }: { params: { id: string } }){
    const session = await getServerSession(authOptions);
    //console.log('filters session',session)
    const sessionUser = session?.user?.email;
    const user = await User.findOne({email:sessionUser});
    const userid = user?._id
    const serverid = params.id.toString();
    // const categoriesdl = await Category.find().sort({ title: 1 });
    // const categories = JSON.parse(JSON.stringify(categoriesdl));
    const categories = await Category.find().sort({ title: 1 });
    const idn = params.id.toString();
 //const mongoose = require('mongoose');
  const id = new mongoose.Types.ObjectId(idn);
//   const thisspendingplan = await Spendingplan.aggregate([
//     { $match: {
//       $expr : { $eq: [ '$authorId' , { $toObjectId: userid } ] } 
//   }},
//   { $match: {
//     $expr : { $eq: [ '$_id' , { $toObjectId: idn } ] } 
// }},
//   {$addFields : {dateField : new Date()}},
//   {
//     $project: {
//       day : {$dayOfMonth : "$planmonthyear"},
//       month : {$month : "$planmonthyear"}, 
//       year : {$year :  "$planmonthyear"},
//       "planmonthyear":1,
//       month_date: {"$month": new Date() } ,
//       year_date: {"$year": new Date() } ,
//       mycategories:"$mycategories"
//     }
//   }
//   ] 
//   )
    const spendingplanserver = await Spendingplan.findById(id).populate("authorId","mycategories").lean();
//const mycategories = spendingplanserver && spendingplanserver.mycategories;


   //const spendingplancats = [spendingplanserver.mycategories]
  //const mycategoriesOBJ= spendingplancats.toObject();
    // const spendingplanserver = await Spendingplan.findById(id).populate("authorId","mycategories");
    //  const spendingplan = JSON.parse(JSON.stringify(spendingplanserver))
    // const mycategories = spendingplanserver.mycategories.toObject();
    // const aggrmycategories = {planmonthyear:spendingplan.planmonthyear,spendingplan:{
    //   mycategories:mycategories,
    //   //planmonthyear:planmonthyear,
    // }}
    
    
    // console.log('aggrmycategories',aggrmycategories);
//console.log('thisspendingplan', thisspendingplan)

    //console.log('spendingplancats',{spendingplancats})
    console.log('spendingplanserver',spendingplanserver)
    //console.log('mycategories',{mycategories})
    //console.log('mycategoriesobj',mycategoriesOBJ)
    return(
        <>
       {/* <pre>mycategories server{JSON.stringify(mycategories,null,2)}</pre> */}
       <pre>spendingplanserver{JSON.stringify(spendingplanserver,null,2)}</pre>
       <pre>categories{JSON.stringify(categories,null,2)}</pre>
       
       <Suspense fallback={<div>Loading...</div>}>
       <h1>Spendingplans</h1>
       {/* <h1>{mycategories.map((mycat:any,index:number) =>
       <div key={index}>
        <div>mycat date:{mycat.mycategoryId.toString()}</div>
        <div>mycat amt:{parseInt(mycat.planamount).toFixed(2)}</div>
        </div>
      )}</h1> */}
      {/* <SpendingPlanEditClient categories={categories} />*/}
        {/* <SpendingPlanClientTest params={params} categories={categories} spendingplanserver={spendingplanserver} /> */}
        </Suspense>
         </>
    )

}
export default EditSpendingPlanServer

