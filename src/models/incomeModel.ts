import mongoose,{models,Schema} from "mongoose";


const IncomeSchema = new Schema(//planned monthly income org by type 
    {
    authorId: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    },
    incometype :{
        type: String,
        required: true,
        enum: [ 
                "wages",
                "free-lance",
                "tips",
                "interest",
                "child-support",
                "retirement-income",
                "from-savings",
                "business-income",
                "other"
            ]
    },
    incomedate:{//expected date individual type of income comes in (this is more for transactional view)
        type: Date,
        default: new Date(),
        required:false
        },
    incomedescr:{//any description/name on account
            type: String,
            required: true,
            min:6
    },
    incomeamount:{//total expected in this type
        default:1.00,
        type:mongoose.Schema.Types.Decimal128,
        //get: getAmount
        required:true
    }
    },
    {timestamps: true}
);
const Income = mongoose.models.Income || mongoose.model("Income", IncomeSchema);
export default Income;