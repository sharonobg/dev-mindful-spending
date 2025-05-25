"use client"
import React,{useState,useEffect} from 'react';
import {ToastContainer ,toast} from 'react-toastify';
//import classes from './register.module.css';// not sure why
import 'react-toastify/dist/ReactToastify.css';
import {useRouter} from 'next/navigation';
//import {signIn} from 'next-auth/react'


const Register = () => {
    const router = useRouter();
    const [username, setUsername] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [errors, setErrors] = useState(
       {namemess:'',
        emailmess:''}
    );
    const [valid,setValid]=useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [confirmEmail,setConfirmEmail]=useState<string>("");
    const [userData,setUserData]=useState({
        name:'',
        username:'',
        email:''
    })
    //const [loggedIn,setLoggedIn] = useState(false);

    // Validate form 
    const validateForm = () => { 
        let errors = {usernamemess:"",namemess:"",emailmess:""}; 
        if (!name) { 
            errors.namemess = 'name must have at least 1 uppercase letter, 1 lower case letter and at least 6 characters.'; 
        } else if (!/(?=.*[A-Z]).{8,25}/.test(name)) { 
            errors.namemess = 'name must have at least 1 uppercase letter, 1 lower case letter and at least 6 characters.'; 
            if(!valid){setErrors(errors)}
        } 
        if (!username) { 
            errors.usernamemess = 'username must have at least 1 uppercase letter, 1 lower case letter and at least 6 characters.'; 
        } else if (!/(?=.*[a-z])(?=.*[A-Z]).{8,25}/.test(name)) { 
            errors.usernamemess = 'username must have at least 1 uppercase letter, 1 lower case letter and at least 6 characters.'; 
            if(!valid){setErrors(errors)}
        }
        if (!email) { 
            errors.emailmess = 'Email is required.'; 
        } else if (!/^(.+)@(.+)$/.test(email)) { 
            errors.emailmess = 'Please add email in correct format.'; 
        }
        setErrors(errors); 
        setValid(Object.keys(errors).length === 0); 
    }
     //console.log('validation errors',errors)
    
    const handleSubmit= async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try{
            const res = await fetch("/api/register",{
                headers:{
                    "Content-type":"application/json"
                },
                method:"POST",
                body:JSON.stringify({name,username,email,role:"user_role"})
            })
            if (res.ok){
                toast.success("An email has been sent to the email provided. Please click on the link to complete registration.")
                router.push("/login")
                return
            }else{
                toast.error("Registration Error")
                return
            }
         }catch(error){
            console.log('registration error', error)
        }
    }
    useEffect(() => { 
        validateForm(); 
    }, [name, username, email]);
        
    return(
        <>
        
        <div className="flex flex-col  place-items-center">
            <h2 className="flex flex-col p-4">If you have already registered and verified your email, but land on this page after entering your email to login, it may mean that the email you entered at login is not the email your registered with. Please use the same email everytime you login or you will be creating multiple accounts.</h2>
        <div className="flex flex-col border p-4 border-blue-400 shadow-lg rounded-lg place-items-center">
            <div className="justify-center">
                <h2 className="text-3xl font-semibold text-blue-400">Register</h2>
                <form onSubmit={handleSubmit} className="form-column flex flex-col flex-wrap gap-5 my-3 max-w-full p-4">
                <label className="my-0 p-0 text-blue-500" htmlFor="name">Name:</label>
                <input
                    onChange={(e)=>setName(e.target.value)}
                        className="my-0 p-2 border border-gray-300 rounded-md"
                        type="text"
                        placeholder='Name'
                        title="Must contain at least one uppercase letter, one lowercase letter and at least 6 characters" 
                        required
                        pattern="(?=.*[a-z])(?=.*[A-Z]).{6,25}"
                         />
                    <label className="my-0 p-0 text-blue-500" htmlFor="username">Username:</label>
                    <input
                    onChange={(e)=>setUsername(e.target.value)}
                        className="my-0 p-2 border border-gray-300 rounded-md"
                        type="text"
                        placeholder='Username'
                        title="Must contain at least one uppercase letter, one lowercase letter and at least 6 characters" 
                        required
                        pattern="(?=.*[a-z])(?=.*[A-Z]).{6,25}"
                         />
                    <label className="my-0 p-0 text-blue-500" htmlFor="email">Email:</label>
                    <input
                        className="my-0 p-2 border border-gray-300 rounded-md"
                        type="email"
                        placeholder='Email'
                        title="Must be a valid email syntax" 
                        required
                        pattern="^(.+)@(.+)$"
                        onChange={(e)=>setEmail(e.target.value)} />
                        <h2>You will be redirected to the login page to complete your registration by verifying your email</h2>
                        <button className="bg-blue-400 rounded-md p-3 text-white font-semibold" type="submit">Register</button>
                </form>
                <button className="text-blue-500 font-bold underline" onClick={() => router.push("/login")}>Already have an account? Login now</button>
            </div>
        </div>
        </div>
        <ToastContainer />
        </>
    )
    
}

export default Register