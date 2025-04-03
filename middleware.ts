import {NextRequest, NextResponse, userAgent} from "next/server";
import {NextRequestWithAuth, withAuth} from "next-auth/middleware";
// function middleware(req: NextRequestWithAuth) {
//     console.log('middleware/token', req.nextauth.token)
// }, //callbacks triggered first:
// {}

    const allowedOrigins = [
      // 'http://sharonobrien.com',
      // 'https://www.sharonobrien.com',
      // 'http://www.sharonobrien.com',
      // 'https://sharonobrien.com',
      'http://localhost:3000/',
      // 'http://localhost:3001/',
      // 'https://mindful-spending-22924.vercel.app/',
      // 'https://mindful-spending.vercel.app/',
      //'https://mindful-spending.com'
    ]
    const corsOptions = {
        'Access-Control-Allow-Headers':
        'Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version',
        'Access-Control-Allow-Credentials': "true",
        'Access-Control-Allow-Methods': 'GET,DELETE,PATCH,POST,PUT',
    }
    export default withAuth(
        //middleware triggered AFTER callbacks, allowing for additional auth logic AFTER the callbacks have been completed
        function middleware(req:NextRequestWithAuth){
           //nothing here
        },
        {
            //callbacks triggered first
            callbacks: {
              // authorized({ req , token }) {
              //   //if(!token) return false
              //   if(token) return true // If there is a token, the user is authenticated
              // }
                authorized:(params) => {
                    let {token} = params
                    //console.log('params middleware',params)
                    return !!token //returns true (indcates "authorized" status) if token is not null (indicates logged in status)
                }
            },
            pages:{
                    signIn: "/login",
                    newUser:"/register",
                    verifyRequest: "/verify-request",
            },
        }
    )
   


    export function middleware(request: NextRequest){
        // Check the origin from the request
      const origin = request.headers.get('origin') ?? ''
      const isAllowedOrigin = allowedOrigins.includes(origin)
      // Handle preflighted requests
      const isPreflight = request.method === 'OPTIONS'
      if (isPreflight) {
        const preflightHeaders = {
          ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
          ...corsOptions,
        }
        return (
           // NextResponse.rewrite(url),
            NextResponse.json({}, { headers: preflightHeaders })
        );
            
      }//end preflight
  
    //simple requests
  const response = NextResponse.next();
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-url', request.url);
  if (isAllowedOrigin) {
    //response.headers.set('Access-Control-Allow-Origin', origin)
    return response.headers.set('Access-Control-Allow-Origin', origin)
  }
  Object.entries(corsOptions).forEach(([key, value]) => {
    return response.headers.set(key, value)
  })

    //return response
    return ( NextResponse.next({
      request: {headers: requestHeaders}
    }));
}
// switch(role){
//   case "ADMIN":
//     // Add the paths that the nurse can access here
//     if (!request.nextUrl.pathname.startsWith("/admin")) {
//       return NextResponse.redirect(new URL("/admin", request.url));
//     }
//     break;
//   // case "OWNER":
//   //   // Add the paths that the pathologist can access here
//   //   if (!request.nextUrl.pathname.startsWith("/image")) {
//   //     return NextResponse.redirect(new URL("/image", request.url));
//   //   }
//   //   break;
//   default:
//     return NextResponse.redirect(new URL("/login", request.url))
// }
;
//export{default} from 'next-auth/middleware'
export const config = {
    matcher:[
    "/spendingplan/:path*",
    "/spendingplans/:path*",
    "/transaction/:path*",
    "/addCategory", 
    "/dashboard",
    "/testpromises",
    "/transactions-page",
    "/spendingplans-page"
    
]
}