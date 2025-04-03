import Transaction from "@/models/transactionModel";
import {getServerSession} from "next-auth"
import {authOptions} from "@/app/api/auth/[...nextauth]/route"
import User from "@/models/userModel";

export default async function CategoryView(props:any) {
  //this is for transactions
  
  const session = await getServerSession(authOptions);
  //console.log('session sprunningtoto',session)
  const sessionUser = session?.user?.email;
  const user = await User.findOne({email:sessionUser});
  const userid = user._id
  const propsfield = {props};
  console.log('spendingplanruntot propsfield',propsfield);
  const grandtotals = await Transaction.aggregate([
    { $match: { $expr : { $eq: [ '$authorId' , { $toObjectId: userid } ] } } },//WORKS!!
    { $match: {
        "categoryId": { $exists: true, },
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
        },
        month_date: {"$month": new Date() } ,
        year_date: {"$year": new Date() } ,
        //date_props:{"$propsfield":"fyear"},
        //year_props:{fyear}
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
        },
        firstamount: {
          $sum: "$amount"
        }
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ["$_id", "$$categoryId"]
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
            titleLower: "$titleLower",
            category: "$category",
            transdate: 1,
            descr: 1,
            plaintitle: "$category.title",
            amount: 1,
            firstamount: "$$firstamount"
          }
        }
      ],
      as: "category"
    }
  },
  {
    $unwind: "$category"
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
            //grandTotalId:"$_id",
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
      month: {
        $month: "$transdate"
      },
      year: {
        $year: "$transdate"
      },
      //title: "$title",
      title: {
        $toLower: "$category.title"
      },
      descr: 1,
      planamount: {
        $sum: "$mycategories.planamount"
      },
      totalamount: {
        $sum: "$amount"
      },
      month_date: 1,
      year_date: 1
    }
  },
  {
    $group: {
      _id: {
        //grandTotalId:"$grandTotalId",
        propsmonth: "$propsArrayMonth",
        propsyear: "$propsArrayYear",
        month: "$month",
        year: "$year",
        month_date: "$month_date",
        year_date: "$year_date",
        planamount: "$planamount",
        sumamount: "$sumamount"

        //date:"$date",
        //date_props:"$date_props"
        // },
        //totalamount: {$sum: "$amount"},
        // difference: {
        //   $subtract: [
        //     "$planamount",
        //     "$sumamount",
        //   ],
        // },
        //this groups by
        //"$group" : {_id: "$categoryId","amount": {$sum: "$amount"}}//this groups by descr
      },
      totalamount: {
        $sum: "$totalamount"
      }
    }
  },
  {
    $project: {
      
      //grandTotalId:"$grandTotalId",
      planamount: "$planamount",
      totalamount: "$totalamount",
      difference: {
        $subtract: [
          "$_id.planamount",
          "$totalamount"
        ]
      }
    }
  },
  {
    $sort: {
      year: -1,
      month: -1
      //"name": 1
    }
  }
  ])
  //spendingplan with grand totals
const comboplans = await Transaction.aggregate([
        { $match: {
            //"categoryId": { $exists: true, },
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
          },
          month_date: {"$month": new Date() } ,
          year_date: {"$year": new Date() } ,
          //date_props:{"$propsfield":"fyear"},
          //year_props:{fyear}
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
          // {
          //   $match: {
          //     $expr: {
          //       $eq: ["$_id", "$$categoryId"],
          //     },
          //   },
          // },
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
    // {
    //   $addFields: {
    //     propsArray: {
    //       $objectToArray: propsfield,
    //     }
    //   }
    // },
    {
      $addFields: {
        //     propsArrayYear: {
        //       $arrayElemAt: ["$propsArray.v.fyear", 0]
        //     },
        //     propsArrayMonth: {
        //       $arrayElemAt: ["$propsArray.v.fmonth", 0]
        //     },
        //     propsArrayCategory: {
        //       $arrayElemAt: [
        //         "$propsArray.v.category",
        //         0
        //       ]
        //     },
        month_date: {
          $month: new Date()
        },
        year_date: {
          $year: new Date()
        }
        //propsVal:"$propsVals"
      }
    },
    {
      $project: {
        runningTotalId: "$_id",
        // propsArrayYear:"$propsArrayYear",
        // propsArrayMonth:"$propsArrayMonth",
        categoryId: "$categoryId",
        transactionmonth: 1,
        transactionyear: 1,
        title: "$category.title",
        titleLower: "$category.titleLower",
        mycategories: "$mycategories.mycategories",
        planmonth: "$mycategories.planmonth",
        planyear: "$mycategories.planyear",
        planamounttotal: {
          $sum: "$planamount"
        },
        year_date: "$year_date",
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
    // {
    //   $match: {
    //     $expr: {
    //       $and: [
    //         {
    //           $eq: [
    //             "$transactionmonth",
    //             "$propsArrayMonth"
    //           ]
    //         },
    //         {
    //           $eq: [
    //             "$transactionyear",
    //             "$propsArrayYear"
    //           ]
    //         }
    //       ]
    //     }
    //   }
    // }
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
        // {
        //   $eq: [
        //     "$_id.planmonth","$propsArrayMonth"
        //   ]
        // },
        // {
        //   $eq: ["$_id.planyear", "$propsArrayYear"]
        // }
        // ]
        // }
      }
    },
    {
      $group: {
        _id: {
          // runningTotalId: "$runningTotalId",
          // propsArrayYear: "$propsArrayYear",
          // propsArrayMonth: "$propsArrayMonth",
          // propsArrayCategory: "$propsArrayCategory",
          // transactionyear: "$transactionyear",
          // transactionmonth: "$transactionmonth",
          planmonth: "$planmonth",
          planyear: "$planyear",
          // newmonth_date: "$month_date",
          // newyear_date: "$year_date",
          // categoryTitle: "$title",
          // titleLower: "$titleLower",
          // mycategories: "$mycategories",
          // mycategoryId: "$mycategories.mycategoryId",
          categoryId: "$categoryId"
          // planamount: "$planamount",
          // amount:"$amount"
        },
        plannedamountnew: {
          $sum: "$planamount"
        },
        amount: {
          $sum: "$amount"
        }
      }
    },
      ])
          //const grandtotals = await getGrandTotals();
          //const comboplans = await comboPlans();
          const getMonth = new Date().getMonth()+1
          const newD = new Date()
          //const month = newD.toLocaleString('default', { month: 'long' });
          const getYear = new Date().getFullYear()
          const getMonthYear = getMonth +'/' +getYear;
          // const propsMonth = {props.fmonht}
          // const propsYear = {props.fyear}
    return(
      <div>
      <h1>Planned and Actual Spending Running Totals for: {props.fmonth}/{props.fyear}.<br /> Showing: {props.category}</h1>
      <div className="my-5 flex flex-col place-items-center spreadsheetCont">
        <div className="sheet flex flex-row  w-full col-6 bg-white font-bold text-sm">
          <div className="font-bold border border-amber-500 w-full p-2 ">Category</div>
          <div className="font-bold border border-amber-500 w-full p-2 ">Category Notes</div>
          <div className="font-bold border border-amber-500 w-full p-2 ">Planned Amount</div>
          <div className="font-bold border border-amber-500 w-full py-2">Actual Amount</div>
          <div className="font-bold border border-amber-500 w-full p-2 ">Difference</div>
          <div className="font-bold border border-amber-500 w-full p-2 ">Explain Diff</div>
        </div>
       <pre>Comboplans:{JSON.stringify(comboplans, null, 2)}</pre>
    {comboplans?.length > -1 ? (comboplans.map((comboplan,index:number) =>
      <div key={index} className="spkey flex flex-row flex-col-6">
            <div className="w-[200px]">{comboplan._id.categoryTitle}</div>
            <div className="">{comboplan?._id.mycategories?.categorynotes}</div>
            <div className="">{parseFloat(comboplan?._id.mycategories?.planamount).toFixed(2)}</div>
            <div className="">{parseFloat(comboplan?.transactionamount).toFixed(2)}</div>
            <div className="">{parseFloat(comboplan?.difference).toFixed(2)}</div>
            <div className="">{comboplan?._id.mycategories?.explain}</div>

        </div>
        )):"nothing here" }
       {grandtotals?.length > -1 ? (grandtotals.map((grandtotal:any,index:number) =>
        <div key={index} className="spkey flex flex-row flex-col-6 font-bold text-sm">
          
          <div className="">Total:<br />{grandtotal._id.month}/{grandtotal._id.year}</div>
          <div className="">index{index}</div>
          <div className="">{parseFloat(grandtotal?._id.planamount).toFixed(2)}</div>
          <div className="">{parseFloat(grandtotal?.totalamount).toFixed(2)}</div>
          <div className="">{parseFloat(grandtotal?.difference).toFixed(2)}</div>
          <div className=""></div>
        </div>
       )):("cant find any totals")
      }
       
        </div>
    </div>
    )
}