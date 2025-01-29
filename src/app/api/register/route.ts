import connect from "../../../libs/database/mongo";
import User from "../../../models/userModel";
import {NextRequest,NextResponse} from "next/server";
//await connect();
export const POST = async (request:NextRequest) => {
        try{
        const reqBody = await request.json();
        const {name, username,email} = await reqBody;
        //GOING FORWARD - THIS IS WHERE THE EMAIL WOULD GET SENT OR WHATEVER IN SIGNUP PROCESS
        const allowedEmailsArr = ['newtest24mindful@proton.me','devSha25AcctEm@proton.me','sharonobarea@gmail.com'];
        
        await connect();
        const isExisting = await User.findOne({email});
        let isAllowedIn = allowedEmailsArr.includes(reqBody.email);
        if(isExisting ){
            return NextResponse.json(
                {error: "User already exists"},
                { status: 400 }
              );
        }
        if(!isAllowedIn ){
          return NextResponse.json(
              {error: "User is not allowed"},
              { status: 400 }
            );
      }
       
        const newUser = new User({name, username,email})
       
        const savedUser = await newUser.save();
       //const newUser = new User({name, username,email})
        //const savedUser = await newUser.save();
        
        return NextResponse.json({
            message: "Email sent to New User for Verification",
            success: true,
            savedUser,//user shouldn't be saved yet
          });
        } catch (error) {
            console.log('error on signup at route',error)
            return NextResponse.json({ error}, { status: 500 });
        }
    
}