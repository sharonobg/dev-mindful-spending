import NextAuth from "next-auth"
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  //interface Session extends DefaultSession {

  interface Session {
    accessToken?: string;
    refreshToken: string;
    user: UserDb;
    token:{sub:string}
    & DefaultSession["user"]
  }
}