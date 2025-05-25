import type { Metadata } from "next";
import "./globals.css";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route"
import Navbar from "@/components/Navbar";
import SessionProvider from "@/components/SessionProvider";
import PropsProvider from "@/query_components/PropsProvider"
// import {useCategories} from "@/query_services/queries";
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import RQProvider from "@/query_components/RQProvider";
// import CategoriesProvider from "@/query_components/CategoriesProvider";
// // import RQCategoriesProvider from "@/components/RQCategoriesProvider";
// import CategoriesQueryApi from "@/query_components/CategorieQueryApi";
export const metadata: Metadata = {
  title: "Mindful Spending App",
  description: "Mindful spending to avoid vagueness",
};

export default async function RootLayout({
  children
  //,params
}: Readonly<{
  children: React.ReactNode,
  //params:{}

}>) {
  // const categoriesManyQuery = useCategories();
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <body>
        
        <SessionProvider session={session}>
         
            <Navbar />
            <div className="backgroundDiv"></div>
            <main className="mt-8 place-items-center">
              <RQProvider>
                <PropsProvider>
              {/* <PropsProvider> */}
                {/* <CategoriesProvider categoriesPromise={categoriesManyQuery.data}> */}
                {children}
                {/* note: moved devtools to the provider */}
                
                {/* </CategoriesProvider> */}
                {/* </PropsProvider> */}
                </PropsProvider>
              </RQProvider>
            </main>
            
        </SessionProvider>
      </body>
    </html>
  );
}
