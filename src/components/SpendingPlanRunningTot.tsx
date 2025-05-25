import Transaction from "@/models/transactionModel";
import {getServerSession} from "next-auth"
import {authOptions} from "@/app/api/auth/[...nextauth]/route"
import User from "@/models/userModel";

export default async function RunningTotals(props:any) {
  //this is for transactions
  
  const session = await getServerSession(authOptions);
  //console.log('session sprunningtoto',session)
  const sessionUser = session?.user?.email;
  const user = await User.findOne({email:sessionUser});
  const userid = user._id
  const propsfield = {props};
  console.log('spendingplanruntot propsfield',propsfield);
  const grandtotals = await Transaction.aggregate([
    { $match: { 
      "categoryId": { $exists: true, },
      $expr : { $eq: [ '$authorId' , { $toObjectId: userid } ] } } },
    {
      $addFields: {
        propsArray: {
          $objectToArray: propsfield,
        }
      }
    },
    { 
      $addFields: {
        propsArrayYear: {
          $arrayElemAt: ["$propsArray.v.fyear", 0]
        },
        propsArrayMonth: {
          $arrayElemAt: ["$propsArray.v.fmonth", 0]
        },
        propsArrayCategory: {
          $arrayElemAt: [
            "$propsArray.v.category",
            0
          ]
        },
        transactionmonth: {
          $month: "$transdate"
        },
        transactionyear: {
          $year: "$transdate"
        }
      }
  },
  {
    $match: {
      $expr: {
        $and: [
          {
            $eq: [
              "$transactionmonth",
              {$toInt:"$propsArrayMonth"}
            ]
          },
          {
            $eq: [
              "$transactionyear",
              {$toInt:"$propsArrayYear"}
            ]
          }
        ]
      }
    }
  },
  {
    $lookup: {
      from: "spendingplans",
      let: {
        authorId: "$authorId",
        transactionmonth: {
          $month: "$transdate"
        },
        transactionyear: {
          $year: "$transdate"
        }
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ["$authorId", "$$authorId"]
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
          $match: {
            $expr: {
              $and: [
                {
                  $eq: [
                    "$planmonth",
                    "$$transactionmonth"
                  ]
                },
                {
                  $eq: [
                    "$planyear",
                    "$$transactionyear"
                  ]
                }
              ]
            }
          }
        },
        {
          $project: {
            date: {
              mycategories: "$mycategories",
              transactionmonth:
                "$$transactionmonth",
              transactionyear:
                "$$transactionyear",
              planmonth: "$planmonth",
              planyear: "$planyear",
              planamount:
                "$mycategories.planamount",
              categoryId: "$categoryId",
              categoryTitle: "$title",
              titleLower: "$titleLower"
            }
          }
        },
        {
          $replaceRoot: {
            newRoot: "$date"
          }
        }
      ],
      as: "mycategories"
    }
  },
  {
    $unwind: {
      path: "$mycategories"
    }
  },
  {
    $project: {
      _id: 0,
      //grandTotalId:"$_id",
      propsArrayYear: {
        $toInt: "$propsArrayYear"
      },
      propsArrayMonth: {
        $toInt: "$propsArrayMonth"
      },
      transactionmonth: {
        $month: "$transdate"
      },
      transactionyear: {
        $year: "$transdate"
      },
      planamount: {
        $sum: "$mycategories.planamount"
      },
      totalamount: {
        $sum: "$amount"
      }
    }
  },
  {
    $group: {
      _id: {
        propsmonth: "$propsArrayMonth",
        propsyear: "$propsArrayYear",
        transactionmonth: "$transactionmonth",
        transactionyear: "$transactionyear",
        year_date: "$year_date",
        planamount: "$planamount",
        sumamount: "$sumamount"
      },
      totalamount: {
        $sum: "$totalamount"
      }
    }
  },
  {
    $project: {
      planamount: "$planamount",
      totalamount: "$totalamount",
      difference: {
        $subtract: [
          "$_id.planamount",
          "$totalamount"
        ]
      }
    }
  }
  ])
  //spendingplan with grand totals
const comboplans = await Transaction.aggregate([
        { $match: {
             $expr : { $eq: [ '$authorId' , { $toObjectId: userid } ] } 
        }},
       
       {
        $addFields: {
          propsArray: {
            $objectToArray: propsfield,
          }
        }
      },
      { 
        $addFields: {
          propsArrayYear: {
            $toInt:{$arrayElemAt: ["$propsArray.v.fyear", 0]}
          },
          propsArrayMonth: {
            $toInt:{$arrayElemAt: ["$propsArray.v.fmonth", 0]}
          },
          propsArrayCategory: {
            $arrayElemAt: [
              "$propsArray.v.category",
              0
            ]
          },
          transactionmonth: {
            $month: "$transdate"
          },
          transactionyear: {
            $year: "$transdate"
          },
        }
    },
    {
      $match: {
        $expr: {
          $and: [
            {
              $eq: ["$transactionmonth","$propsArrayMonth"]
            },
            {
              $eq: ["$transactionyear", "$propsArrayYear"]
            }
          ]
        }
      }
    },
    {
      $lookup: {
        from: "categories",
        let: {
          categoryId: {
            $toObjectId: "$categoryId"
          }
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ["$_id", "$$categoryId"]
                  },
                  {
                    $eq: [
                      "$month",
                      "$propsArrayMonth"
                    ]
                  },
                  {
                    $eq: [
                      "$year",
                      "$propsArrayYear"
                    ]
                  }
                ]
              }
            }
          },
        
          {
            $addFields: {
              titleLower: {
                $toLower: "$title"
              }
            }
          },
          {
            $project: {
              categoryId: 1,
              title: 1,
              titleLower: "$titleLower"
            }
          }
        ],
        as: "category"
      }
    },
    {
      $lookup: {
        from: "spendingplans",
        let: {
          authorId: "$authorId",
          transactionmonth: {
            $month: "$transdate"
          },
          transactionyear: {
            $year: "$transdate"
          }
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$authorId", "$$authorId"]
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
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: [
                      "$planmonth",
                      "$$transactionmonth"
                    ]
                  },
                  {
                    $eq: [
                      "$planyear",
                      "$$transactionyear"
                    ]
                  }
                ]
              }
            }
          },
          {
            $project: {
              // _id: 0,
              date: {
                mycategories: "$mycategories",
                transactionmonth:
                  "$$transactionmonth",
                transactionyear:
                  "$$transactionyear",
                planmonth: "$planmonth",
                planyear: "$planyear",
                planamount:
                  "$mycategories.planamount",
                categoryId: "$categoryId",
                categoryTitle: "$title",
                titleLower: "$titleLower",
                amount: "$amount"
              }
            }
          },
          {
            $replaceRoot: {
              newRoot: "$date"
            }
          }
        ],
        as: "mycategories"
      }
    },
    {
      $unwind: {
        path: "$mycategories"
      }
    },
  

    {
      $project: {
        runningTotalId: "$_id",
        categoryId: "$categoryId",
        transactionmonth: 1,
        transactionyear: 1,
        title: "$category.title",
        titleLower: "$category.titleLower",
        mycategories: "$mycategories.mycategories",
        planmonth: "$mycategories.planmonth",
        planyear: "$mycategories.planyear",
        planamount: "$planamount",
        amount: {
          $sum: "$amount"
        }
      }
    },
    {
      $unwind: {
        path: "$mycategories"
      }
    },
   
    {
      $match: {
        $expr: {
          // $and: [
          // {
          $eq: [
            "$mycategories.mycategoryId",
            "$categoryId"
          ]
        }
        
      }
    },
    {
      $group: {
        _id: {
          planamount: "$mycategories.planamount",
          categorynotes:"$mycategories.categorynotes",
          explain:"$mycategories.explain",
          planmonth: "$planmonth",
          planyear: "$planyear",
          categoryTitle: "$title",
          titleLower: "$titleLower",
          categoryId: "$categoryId"
        },
        
        amount: {
          $sum: "$amount"
        }
      }
    },
    {
      $project: {
        runningTotalId:1,
        propsArrayMonth:"$propsArrayMonth",
        propsArrayYear:1,
        planmonth: "$planmonth",
        planyear: "$planyear",
        amount: "$amount",
        planamount: "$_id.mycategories.planamount",
        difference: {
          $subtract: [
            "$_id.planamount",
            "$amount",
          ],
        },
        
      },
    }
      ])
          //const grandtotals = await getGrandTotals();
          //const comboplans = await comboPlans();
          const getMonth = new Date().getMonth()+1
          const newD = new Date()
          //const month = newD.toLocaleString('default', { month: 'long' });
          const getYear = new Date().getFullYear()
          // const getMonthYear = getMonth +'/' +getYear;
          // const propsMonth = {props.fmonht}
          // const propsYear = {props.fyear}
    return(
      <>
         {/*<pre>grandtotals:{JSON.stringify(grandtotals, null, 2)}</pre>*/}
      <h1>Planned and Actual Spending Running Totals for: `{props.fmonth}/{props.fyear}.<br /> Showing: {props.category}</h1>
      <h2>If you don't see your Transaction category in this list, you may need to add the category to your Spending Plan</h2>
      <div className="my-5 flex flex-col place-items-center spreadsheetCont overflow-x-scroll">
        <div className="horizGrid grid-cols-8 md:grid-cols-8 w-full bg-white font-bold text-sm">
          <div className="font-bold p-2 col-span-2">Category</div>
          {/* <div className="font-bold border border-amber-500 w-full p-2 ">Category Notes</div> */}
          <div className="font-bold p-2 col-span-2">Planned Amount</div>
          <div className="font-bold py-2 col-span-2">Actual Amount</div>
          <div className="font-bold p-2 col-span-2">Difference</div>
          {/* <div className="font-bold border border-amber-500 w-full p-2 ">Explain Diff</div> */}
        </div>
      
    {comboplans?.length > 0 ? (comboplans.map((comboplan,index:number) =>
      <div key={index} className="horizGrid grid-cols-8 md:grid-cols-8 w-full">
            <div className="col-span-2">{comboplan._id.categoryTitle}</div>
            {/* <div className="">{comboplan?._id.categorynotes}</div> */}
            <div className="col-span-2">{parseFloat(comboplan?._id.planamount).toFixed(2)}</div>
            <div className="col-span-2">{parseFloat(comboplan?.amount).toFixed(2)}</div>
            <div className="col-span-2">{parseFloat(comboplan?.difference).toFixed(2)}</div>
            {/* <div className="">{comboplan?._id.mycategories?.explain}</div> */}

        </div>
        )):"nothing yet" }
       {grandtotals?.length > 0 ? (grandtotals.map((grandtotal:any,index:number) =>
        <div key={index} className="horizGrid grid-cols-8 md:grid-cols-8 w-full font-bold text-sm">
          
          <div className=" py-2 col-span-2">Total: {grandtotal._id.propsmonth}/{grandtotal._id.propsyear}</div>
          {/* <div className="">index{index}</div> */}
          <div className=" py-2 col-span-2">{parseFloat(grandtotal?._id.planamount).toFixed(2)}</div>
          <div className=" py-2 col-span-2">{parseFloat(grandtotal?.totalamount).toFixed(2)}</div>
          <div className=" py-2 col-span-2">{parseFloat(grandtotal?.difference).toFixed(2)}</div>
        </div>
       )):(" cant find grandtotals")
      }
       
        </div>
    </>
    )
}