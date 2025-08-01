// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'miulai-music.s3.eu-north-1.amazonaws.com',
                pathname: '/**',
            },

            {
                protocol: 'http',
                hostname: 'localhost',
                port: '3004', // თქვენი NestJS პორტი
            }
        ],
        minimumCacheTTL: 60, // კეშირების დრო წამებში

    }

};

export default nextConfig;