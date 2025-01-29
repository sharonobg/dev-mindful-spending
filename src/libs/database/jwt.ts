import {NextRequest,NextResponse} from "next/server"
import { getToken } from "next-auth/jwt"

// verify token
// export default function verifyToken(token:string){
//     try{
//         const secret = process.env.NEXTAUTH_SECRET;
//         const payload = jwt.verify(token, secret);
//         console.log('payload: ',payload)
//         return payload;
//     }catch (error){
//         console.error("error from token",error);
//         return null;
//     }
// }
//getToken
//export default async(req:NextRequest,res:NextResponse) => {
const Jwtfunc =  async(req:NextRequest,res:NextResponse) => {
    const token = await getToken({req})
    if(token) {
        //console.log('token')
    }else{console.log('no token')}
}
//res.end()


// const secret = process.env.NEXTAUTH_SECRET

// export default async function handler(req:NextRequest, res:NextResponse) {
//   // if using `NEXTAUTH_SECRET` env variable, we detect it, and you won't actually need to `secret`
//   // const token = await getToken({ req })
//   const token = await getToken({ req, secret })
//   console.log("JSON Web Token", token)
//   res.end()
// }
export default Jwtfunc

