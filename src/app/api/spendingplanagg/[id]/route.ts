//import { getToken } from "next-auth/jwt";
import Spendingplan from "@/models/spendingplanModel";
import {NextRequest} from "next/server";
import {getServerSession} from "next-auth"
import {authOptions}from "../../../api/auth/[...nextauth]/route";
import User from "@/models/userModel";
import { ObjectId } from "mongodb";

// export async function GET(req:NextRequest,{ params }: { params: { id: ObjectId } }){
    export async function GET(req:NextRequest,{ params }: { params: { id: string} }){
try{
    const accessToken = req.headers.get('authorization')
    if(accessToken){
        const token = accessToken.split(" ")[1]
        const decodedToken = token
        if(!accessToken||decodedToken == null){

            return new Response(JSON.stringify({error: "unauthorized (wrong or expired token)"}),{status:403})
            }
        }
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user?.email;
    const user = await User.findOne({email:sessionUser});
    const userid = user._id;
        
    // const spendingplan = await Spendingplan.findById(params.id).populate("authorId").select('-password')

    const spendingplan = await Spendingplan.aggregate([
        {$match: { $expr : { $eq: [ '$authorId' , { $toObjectId: userid } ] } }
         },
         {$match: { $expr : { $eq: [ { $toObjectId: "$_id" } , { $toObjectId: params.id } ] } }
      },
         {
          $addFields: {
            planmonth: {
              $month: "$planmonthyear"
            },
            planyear: {
              $year: "$planmonthyear"
            }
          }
        },
        {
          $unwind:
            /**
             * path: Path to the array field.
             * includeArrayIndex: Optional name for index.
             * preserveNullAndEmptyArrays: Optional
             *   toggle to unwind null and empty values.
             */
      
            "$mycategories"
        },
        {
          $lookup:
            /**
             * from: The target collection.
             * localField: The local join field.
             * foreignField: The target join field.
             * as: The name for the results.
             * pipeline: Optional pipeline to run on the foreign collection.
             * let: Optional variables to use in the pipeline field stages.
             */
            {
              from: "categories",
              localField: "mycategories.mycategoryId",
              foreignField: "_id",
              as: "result"
            }
        },
        {
          $addFields: {
            newtitle: {
              $arrayElemAt: ["$result.title", 0]
            }
          }
        },
        {
          $project: {
            id:"$_id",
            planmonth: "$planmonth",
            planyear: "$planyear",
            planmonthyear:"$planmonthyear",
            mycategories: {
              mycategoryId:
                "$mycategories.mycategoryId",
              planamount: "$mycategories.planamount",
              categorynotes:
                "$mycategories.categorynotes",
              explain: "$mycategories.explain",
              title: "$newtitle",
             
              // newtitle: {
              //   $arrayElemAt: ["$result.title", 0]
              // },
              // title: "$result.title",
              category: "$category",
              
             
            }
          }
        },
        {
          $group:
            /**
             * _id: The id of the group.
             * fieldN: The first field name.
             */
            {
              _id: {
                id:"$id",
                planmonthyear: "$planmonthyear",
                planmonth: "$planmonth",
                planyear: "$planyear",
                
              },
              mycategories: {
                $addToSet: "$mycategories"
              }
            }
        },
        {
          $project: {
            _id:"$_id",
            //id:"$_id.id",
            planmonthyear:"$planmonthyear",
            planmonth: "$planmonth",
            planyear: "$planyear",
            mycategories:"$mycategories"
          }
        },
        // {
        //   $project:
        //     /**
        //      * specifications: The fields to
        //      *   include or exclude.
        //      */
        //     {
        //       //_id: 0,
        //       planid:"$_id.id",
        //       planmonth: "$_id.planmonth",
        //       planyear: "$_id.planyear",
        //       mycategories: "$mycategories"
        //     }
        // }
        // {
        //   $addFields: {
        //     planmonth: {
        //       $arrayElemAt: ["$_id", 0]
        //     }
        //   }
        // }
      ])

      // console.log('spendingplan api',spendingplan)

    return new Response(JSON.stringify(spendingplan),{status:201})
} catch (error) {
    console.log('GET id error',error)
    return new Response(JSON.stringify(null),{status:500})
  }
}
export async function PUT(req:NextRequest,{ params }: { params: { id: string } }){
    const accessToken = req.headers.get('authorization')
    if(accessToken){
        const token = accessToken.split(" ")[1]
        const decodedToken = token
        if(!accessToken||decodedToken == null){

        return new Response(JSON.stringify({error: "unauthorized (wrong or expired token)"}),{status:403})
        }
    }
const session = await getServerSession(authOptions);
        const sessionUser = session?.user?.email;
        //const id= {params};
        const id = {params};
        //const acctok = session?.user?.accessToken
        const user = await User.findOne({email:sessionUser});
        const userid = user._id;
        //console.log('user ln 43',userid)
    try{ 
        const body = await req.json()
        const spendingplan = await Spendingplan.findById(id).populate("authorId");
        console.log('id page spendingplan: ',spendingplan)
        if(spendingplan?.authorId?._id.toString() !== userid){
            return new Response(JSON.stringify({message:"Only author can update his spendingplan"}),{status:403})
        }
        const updatedSpendingplan = await Spendingplan.findByIdAndUpdate(id, {$set:{...body} } ,{new: true})
        console.log('updatedSpendingplan',updatedSpendingplan)
    return new Response(JSON.stringify(updatedSpendingplan),{status: 200})


    } catch(error) {
        console.log('error api Spendingplan: ',error)
        return new Response(JSON.stringify(null),{status:500})
        
    }
}
export async function PATCH(req:NextRequest,{ params }: { params: { id: string } }){
    const accessToken = req.headers.get('authorization')
    if(accessToken){
        const token = accessToken.split(" ")[1]
        const decodedToken = token
        if(!accessToken||decodedToken == null){

        return new Response(JSON.stringify({error: "unauthorized (wrong or expired token)"}),{status:403})
        }
    }
const session = await getServerSession(authOptions);
        const sessionUser = session?.user?.email;
        //const id= {params};
        const id = {params};
        //const acctok = session?.user?.accessToken
        const user = await User.findOne({email:sessionUser});
        const userid = user._id;
        //console.log('user ln 43',userid)
    try{ 
        const body = await req.json()
        const spendingplan = await Spendingplan.findById(id).populate("authorId");
        console.log('id page spendingplan: ',spendingplan)
        if(spendingplan?.authorId?._id.toString() !== userid){
            return new Response(JSON.stringify({message:"Only author can update his spendingplan"}),{status:403})
        }
        const updatedSpendingplan = await Spendingplan.findOneAndUpdate(id, {$set:{...body} } ,{new: true})
        console.log('patch updatedSpendingplan',updatedSpendingplan)
    return new Response(JSON.stringify(updatedSpendingplan),{status: 200})


    } catch(error) {
        console.log('error api patch Spendingplan: ',error)
        return new Response(JSON.stringify(null),{status:500})
        
    }
}
export async function DELETE(req:NextRequest, { params }:{params:{id:string}}){
    //await connect();
    const id = params.id;
    const accessToken = req.headers.get('authorization')
    if(accessToken){
    const token = accessToken.split(" ")[1]
    const decodedToken = token
    if(!accessToken || !decodedToken){
        return new Response(JSON.stringify({error: "unauthorized (wrong or expired token)"}),{status:403})
    }
}
const session = await getServerSession(authOptions);
    const sessionUser = session?.user?.email;
        //const acctok = session?.user?.accessToken
        const user = await User.findOne({email:sessionUser});
        const userid = user._id;
    try{
        const spendingplan = await Spendingplan.findById(id).populate("authorId");
        // const author = spendingplan?.authorId?._id.toString();
        // console.log("author",author)
        // console.log('user',userid.toString())

        if(spendingplan?.authorId?._id.toString() !== userid.toString()){
            return new Response(JSON.stringify({message:"Only author can delete this spendingplan"}),{status:403})
        }
        
        await Spendingplan.findByIdAndDelete(params.id)
        return new Response(JSON.stringify({message:"Spendingplan deleted"}),{status: 200})
    } catch(error) {
        console.log('Spendingplan delete Error: ',error);
        return new Response(JSON.stringify(null),{status:500})
    }
}