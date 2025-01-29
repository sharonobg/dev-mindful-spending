import type { Metadata } from "next";
import "./globals.css";
import {getServerSession} from "next-auth";
import {authOptions} from "../../src/app/api/auth/[...nextauth]/route"
import connect from "../libs/database/mongo";
//import { authOptions } from "./api/auth/[...nextauth]/route";
import { headers } from 'next/headers';
import Navbar from "../components/Navbar";
import SessionProvider from "../components/SessionProvider";


export const metadata: Metadata = {
  title: "Mindful Spending App",
  description: "Mindful spending to avoid vagueness",
};

export default async function RootLayout({
  
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <body>
        
        <SessionProvider session={session}>
          <Navbar />
          <div className="backgroundDiv"></div>
          <main className="mt-8">
          {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}
