import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import User from "@/models/userModel";
import Transaction from "@/models/transactionModel";
import Category from "@/models/categoryModel";
import Spendingplan from"@/models/spendingplanModel";

export default async function TransactionServices(props:any) {

    try{
//GET USER
const session = await getServerSession(authOptions);
const sessionUser = session?.user?.email;
const user = await User.findOne({email:sessionUser});
const userid = user?._id
//GET CATEGORIES
const categoriesfetch = await Category.find().sort({ title: 1 });
const categories = JSON.parse(JSON.stringify(categoriesfetch));
const spendingplansfetch = await Spendingplan.find({authorId:userid});
const spendingplans = JSON.parse(JSON.stringify(spendingplansfetch));
const propsfield = {props};
console.log('transactions propsfield',propsfield)
//GET TRANSACTIONS
//const transactionsfetch = await Transaction.find({authorId:userid});
//const transactions = JSON.parse(JSON.stringify(transactionsfetch));
//console.log('categories fetchtestpromises',categoriesfetch)

//console.log('fetch spendingplans testpromises',spendingplansfetch)

const gettransactions = await Transaction.aggregate([
    { $match: {
        $expr : { $eq: [ '$authorId' , { $toObjectId: userid } ] } 
    }},
     {
        "$lookup": {
          "from": "categories",
          "let": {
            categoryId: {
             "$toObjectId": "$categoryId"
            }
          },
          "pipeline": [
            {
              $match: {
                $expr: {
                  $eq: [
                    "$_id",
                    "$$categoryId",
                  ]
                }
              }
            },
            {
              $project: {
                _id:0,
                day : {$dayOfMonth : "$transdate"},
                month : {$month : "$transdate"}, 
                year : {$year :  "$transdate"},
                "transdate":1,
               "descr":1,
               categoryId:"$categoryId",
               title: { $toLower : '$title' },
                //title: 1,//category title,
                amount:1
                
              }
            }
          ],
          "as": "category"
        }
      },
      {
        "$unwind": "$category"
      },
      { 
          $addFields: {
            month_date: {"$month": new Date() } 
            }
        },
      {
        $project: {
          "transdate":1,
          "descr":1,
          "acctype":1,
          day : {$dayOfMonth : "$transdate"},
          month : {$month : "$transdate"}, 
          year : {$year :  "$transdate"},
          categoryId:"$categoryId",
          title: { $toLower : "$category.title" },
          "amount":1,
          month_date:1
        }
        
      },
  {
    "$sort": {
      //"year": -1,
      //"month":1
      "transdate":1
    }
}  
])
console.log('gettransactionlist',gettransactions)
return gettransactions

}catch(error){
    console.log('error transactions service',error)
}
}
