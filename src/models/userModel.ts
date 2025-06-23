import mongoose,{models,Schema} from "mongoose";
//user role - admin role
var validateEmail = function(email:string) {
    var re = /^[a-zA-Z0-9._%±]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/;
    return re.test(email)
};
const UserSchema = new Schema(
    {
        username:{
            type:String,
            required:false,
            min:2,
            max:24,
        },
        //name:{
        name:{
            type:String,
            required:false,
            unique:false,
            min:2,
            max:24,
        },
        role: {
            type:String,
            required:true,
            enum:[
                "admin_role",
                "user_role",
            ],
            default:"user_role",
            
        },
        email:{
            type: String,
            required: true,
            unique:true,
            trim: true,
            lowercase: true,
            validate: [validateEmail, 'Please fill a valid email address'],
            match: [/^[a-zA-Z0-9._%±]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/, 'Please fill a valid email address']
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