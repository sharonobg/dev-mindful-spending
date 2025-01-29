import {getServerSession} from "next-auth"
import { authOptions } from '../api/auth/[...nextauth]/route'

export default async function AuthPage() {
    const session = await getServerSession(authOptions);

    return (
      <main className="flex flex-col gap-3">
        <h1>My Custom Auth Page</h1>
        
        {!session && <p>Please log in</p>}
        {session && <p>Your are logged in</p>}
      </main>
    );
  }