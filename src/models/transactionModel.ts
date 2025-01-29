import mongoose,{models,Schema} from "mongoose";

const TransactionSchema = new Schema(
    {   
        transdate:{
        type: Date,
        //type: new ISODate("<YYYY-mm-dd>"), doesnt wk
        default: new Date(),
        required:true
        },
        descr:{
            type: String,
            required: true,
            min:6
        },
        acctype:{
            type: String,
            required: true,
            enum: [// enum means must be one of these 
                "debit",
                "cash",
                "bank_account",
                "other",
            ]
        },
        categoryId:{
            type:mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required:true
        },
        authorId: {
            type:mongoose.Schema.Types.ObjectId,
            ref: "User",
            required:true
        },
        amount:{
            default:1.00,
            type:mongoose.Schema.Types.Decimal128,
            //get: getAmount
            required:true
        }
    },
    {timestamps: true}
);

const Transaction = mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);
export default Transaction;