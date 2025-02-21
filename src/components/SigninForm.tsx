"use client"

import {Session} from 'next-auth';
import {useSession} from 'next-auth/react'
import {signIn,signOut} from "next-auth/react";
import {FormEvent,useState} from 'react';
import {VERIFY} from '../constants';
import {useRouter} from 'next/navigation';

import {ToastContainer ,toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Props {
    session: Session | null
}

export default function AuthForm({session}:Props){
    const {data:status} = useSession();
    const [email, setEmail] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [formType,setFormType] = useState<string>('signIn')
    const router = useRouter();
    const handleEmailSignin = async (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!email){
            toast.error("Please fill in all the fields")
            return
        }
        setLoading(true);
        signIn('email', {email,callbackUrl:'/dashboard'});
        setLoading(false);
        setFormType(VERIFY);
    }
    const handleEmailSignOut = () => { signOut();}

    return (
        <div>
            <form className="signinform" onSubmit={handleEmailSignin}>
            <label htmlFor="email">Email:</label>
            <input 
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit"
                aria-disabled={loading}>{loading ? "Please wait" : "Send a link to my email"}</button>
                { session && 
                <>
            
                <button onClick={handleEmailSignOut}>Sign out</button>
                </>
                }
            </form>
        </div>
    )
}

