import mongoose,{models,Schema} from "mongoose";
//user role - admin role
const UserSchema = new Schema(
    {
        username:{
            type:String,
            required:false,
            min:6,
            max:24,
        },
        //name:{
        name:{
            type:String,
            required:false,
            unique:false,
            min:6,
            max:24,
        },
        role: {
            type:String,
            required:true,
            enum:[
                "admin_role",
                "user_role",
            ],
            default:"user_role"
        },
        email:{
            type: String,
            required: true,
            unique:true,
        },
        isVerified:{
            type:Boolean,
            required: false,//THIS WILL BE REQUIRED FOR FINAL PROD
        },
    },
    {timestamps: true}
    
);
const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;