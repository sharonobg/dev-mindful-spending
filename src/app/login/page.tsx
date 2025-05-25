import {getServerSession} from "next-auth";
import {signIn} from "next-auth/react";
import {authOptions}from "../api/auth/[...nextauth]/route";
import SigninForm from "../../components/SigninForm";

export default async function LoginPage() {

    const session = await getServerSession(authOptions);

    return(
        <div className="flex flex-col place-items-center">
             <SigninForm session={session}/>
        </div>
    )
    
}