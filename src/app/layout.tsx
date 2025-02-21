import type { Metadata } from "next";
import "./globals.css";
import {getServerSession} from "next-auth";
import {authOptions} from "../../src/app/api/auth/[...nextauth]/route"
import Navbar from "../components/Navbar";
import SessionProvider from "../components/SessionProvider";
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import RQProvider from "@/query_components/RQProvider";
// import RQCategoriesProvider from "@/components/RQCategoriesProvider";

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
              <RQProvider>
                {children}
                <ReactQueryDevtools initialIsOpen={false} />
              </RQProvider>
            </main>
        </SessionProvider>
      </body>
    </html>
  );
}
