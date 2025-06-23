

/** @type {import('next').NextConfig} */
const nextConfig = {
     
  typescript: {
    ignoreBuildErrors: true,
 },
   eslint: {
       ignoreDuringBuilds: true,
   },
   reactStrictMode: true,
 swcMinify: true,  
 // Adding policies:
 async headers() {
   return [
       {
         source: '/(.*)',
         headers: [
           {
             key: 'X-Frame-Options',
             value: 'DENY',
           },
           // {
           //   key: 'Content-Security-Policy',
           //   value:
           //     "default-src 'self' script-src 'self' https://www.google-analytics.com; font-src 'self' 'https://fonts.googleapis.com'",
           // },
           {
             key: 'X-Content-Type-Options',
             value: 'nosniff',
           },
           // {
           //   key: 'Permissions-Policy',
           //   value: "camera=(); battery=(self); geolocation=(); microphone=('https://a-domain.com')",
           // },
           {
             key: 'Referrer-Policy',
             value: 'origin-when-cross-origin',
           },
            { key: "Referrer-Policy", 
              value: "strict-origin-when-cross-origin" 
            }

         ],
       },
     ];
 }
  
}

export default nextConfig