import {ErrorBoundary} from "react-error-boundary";
import User from "@/models/userModel";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import ClientTestPromises from "@/query_components/ClientTestPromises";

export default async function TestPromises(props:any) {
const session = await getServerSession(authOptions);
const sessionUser = session?.user?.email;
const user = await User.findOne({email:sessionUser});
const userid = user?._id

    return (
    <div>
         {/* <pre>Transactions TestPromises:{JSON.stringify(transactions,null,2)}</pre> */}
        <h1>Hello from Server Test Promises</h1>
        <ErrorBoundary fallback="Something is wrong">
       
        <ClientTestPromises />
        </ErrorBoundary>
    </div>
    )
}