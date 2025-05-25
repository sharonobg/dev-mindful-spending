// @ts-nocheck 
//import {authOptions} from "../../../helpers/authOptions";
import NextAuth from "next-auth/next";
import { AuthOptions } from "next-auth";
import connect from "@/libs/database/mongo";
import {MongoDBAdapter} from "@next-auth/mongodb-adapter";
import EmailProvider from "next-auth/providers/email";
import User from "@/models/userModel";
import clientPromise from "@/libs/database/clientPromise";

export const authOptions: AuthOptions = {
  
   providers:[
       EmailProvider({
        server: process.env.EMAIL_SERVER,
        //{
            // host: process.env.EMAIL_SERVER_HOST,
            // port: '587',
            // auth: {
            //   user: process.env.EMAIL_SERVER_USER,
            //   pass: process.env.EMAIL_SERVER_PASSWORD
            // }
          //},
          
           from: 'sharon@sharonobrien.com'
          
            
       }),
   ],
   //trustHost: true,
   adapter: MongoDBAdapter(clientPromise),
   session:{
       strategy: 'jwt',
       maxAge: 30 * 60,//THIRTY_minutes,
       updateAge:30 * 60 //THIRTY_MINUTES
     },
   pages: {
       signIn: "/login",
       newUser:"/register",
       verifyRequest: "/verify-request",
   },
  secret : process.env.NEXTAUTH_SECRET,
 
   callbacks: {
       async signIn({user,account,email}){
           await connect()
           const userExists = await User.findOne({email:user.email});
           if(userExists){
            
            return true}
           else{return "/register" }
       },
       async redirect({ url,baseUrl }) {
           return "/dashboard"
         },
       jwt: async ({ token, trigger, account, profile, user, session}) => {
           if (user) {
               token.sub = user.id;
             }
             return token;
     },  
       async session({token, user, session, newSession, trigger}){
        
           return session
       },
   }
    //...
 };

const handler = NextAuth(authOptions);

// async function handler(req:NextRequest, res:NextResponse) {
//     // export default async function handler(req:NextRequest, res:NextResponse) {
//     return NextAuth(authOptions);
//     //const handler = NextAuth(authOptions);
    
//    }
    // export { handler as GET, handler as POST, authOptions};
//const handler = async () =>{ NextAuth(authOptions)};
//export const GET = handler;
//export const POST = handler;
export { handler as GET, handler as POST};
