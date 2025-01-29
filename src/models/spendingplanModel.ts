import mongoose,{models,Schema} from "mongoose";

const mycategoriesSchema = new Schema({
            mycategoryId:{
                type:mongoose.SchemaTypes.ObjectId,
                ref: "Category",
            },
            //adding 21424:
            isChecked:{
             type:Boolean,
             default:false
            },
            planamount:{
                //type: { type:mongoose.SchemaTypes.Decimal128 },
                type:mongoose.SchemaTypes.Decimal128,
                default:0.00,
                required:true
            },
            categorynotes:{ type:String,default:'' },
            explain:{type:String,default:'' }

})
const SpendingplanSchema = new Schema(
    {
    authorId: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    },
    planmonthyear:{
        type: Date,
        default: new Date(),
        required:true
    },
    mycategories:[mycategoriesSchema],
    
    
    },
    {timestamps: true}
);
const Spendingplan = mongoose.models.Spendingplan || mongoose.model("Spendingplan", SpendingplanSchema);
export default Spendingplan;