import mongoose,{models,Schema} from "mongoose";
const PlannedIncomeSchema = new Schema({

    incomeType :{
        type: String,
        required: true,
        enum: [ 
                "wages",
                "free-lance",
                "tips",
                "interest",
                "child-support",
                "retirement-income",
                "other"
            ],
        ref: "Income",
    },
    incdateexpected:{//this income expected date
        type: Date,
        default: new Date(),
        required:true
    },
    incomeplandescr:{//any description of type
            type: String,
            required: true,
            min:6
    },
    incomeplanamount:{//total expected in this type
        default:1.00,
        type:mongoose.Schema.Types.Decimal128,
        required:true
    }

})
const IncomeplanSchema = new Schema(//planned monthly income org by type 
    {
    authorId: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    },
    incplanmonthyear:{//month and year of income plan
        type: Date,
        default: new Date(),
        required:true
    },
    plannedIncome:[PlannedIncomeSchema],
    },
    {timestamps: true}
);
const Incomeplan = mongoose.models.Incomeplan || mongoose.model("Incomeplan", IncomeplanSchema);
export default Incomeplan;