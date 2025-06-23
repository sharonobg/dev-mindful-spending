//import withAuth from "next-auth/middleware";
import {NextRequest, NextResponse, userAgent} from "next/server";
import {NextRequestWithAuth, withAuth} from "next-auth/middleware";


export async function middleware(request: NextRequestWithAuth) {
  console.log("Middleware executing!");

  // Prepare the CSP headers
  
  const requestHeaders = new Headers(request.headers);
  // Execute the NextAuth middleware which either returns a redirect response or nothing, if authentication
  // was not required. See source for more: https://github.com/nextauthjs/next-auth/blob/v4/packages/next-auth/src/next/middleware.ts#L99
  // If a redirect was returned, use it. Otherwise continue the response normally with NextResponse.next().
  // Omitting the config here, but you can still include it (i.e withAuth(request, { pages: ... }))
  const response = (await withAuth(request)) || NextResponse.next();

  // Set the CSP headers on the response
  requestHeaders.forEach((value, key) => {
    response.headers.append(key, value);
  });

  console.log("Middleware executed!");

  return NextResponse.next();
}