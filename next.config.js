/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    compiler:{
        styledComponents: true
    },
  
   
    
    async headers() {
        return [
          {
            source: '/api/:path*',
            headers: [
              { key: 'Access-Control-Allow-Origin', value: '*' },
              { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
              { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Accept' },
            ],
          },
        ];
      },
}

module.exports = nextConfig
