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
         {
          $match: {$expr: { $eq: [ "$_id",
                { $toObjectId: params.id}
              ]
            }
          }
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
          $addFields: {
            mycategories_details: {
              $arrayElemAt: ["$mycategories", 0]
            }
          }
        },
        {
          $unwind: {
            path: "$mycategories"
          }
        },
        {
          $lookup: {
            from: "categories",
            let: {
              // _id:0,
              mycategoryId: {
                $toObjectId:
                  "$mycategories.mycategoryId"
              },
              isChecked: "$mycategories.isChecked",
              planamount: "$mycategories.planamount",
              categorynotes:
                "$mycategories.categorynotes",
              explain: "$mycategories.explain"
            },
            pipeline: [
              {
                $addFields: {
                  title: "$title",
                  category: "$_id"
                }
              },
              {
                $project: {
                  planmonth: "$planmonth",
                  planyear: "$planyear",
                  propsYear: "$propsYear",
                  propsMonth: "$propsMonth",
                  // month_local_date:"$month_local_date",
                  mycategoryId: "$$mycategoryId",
                  planamount: "$$planamount",
                  isChecked: "$$isChecked",
                  categorynotes: "$$categorynotes",
                  explain: "$$explain",
                  title: "$title",
                  category: "$category",
                  planmonthyear: 1
                }
              },
              {
                $match: {
                  $expr: {
                    $eq: ["$category", "$mycategoryId"]
                  }
                }
              }
            ],
            as: "mycategories"
          }
        },
        // {
        //   $project: {
        //     id: "$_id",
        //     planmonth: "$planmonth",
        //     planyear: "$planyear",
        //     // mycategories:{
        //     //   mycategoryId:"$mycategories.mycategoryId",
        //     //   isChecked:"$mycategories.isChecked",
        //     //   title:"$mycategories.title",
        //     //   explain:"$mycategories.explain",
        //     //   categorynotes:"$mycategories.categorynotes",
        //     //   planamount:"$mycategories.planamount"
        //     // },
        //     //mycategories: 1
        //     mycategories_details: 1
        //   }
        // }
        {
          $project: {
          _id: 1,
          id: "$_id",
          planmonth: 1,
          planyear: 1,
          // mycategories:{
          //   mycategoryId:"$mycategories.mycategoryId",
          //   isChecked:"$mycategories.isChecked",
          //   title:"$mycategories.title",
          //   explain:"$mycategories.explain",
          //   categorynotes:"$mycategories.categorynotes",
          //   planamount:"$mycategories.planamount"
          // },
          //mycategories: 1
          mycategories: "$mycategories_details"
          //mycategories:1
        }}
      ])

      console.log('spendingplan api',spendingplan)
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