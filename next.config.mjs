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
                // Neon Object Storage (S3-compatible) — artist photos/covers, album covers, track images
                protocol: 'https',
                hostname: '**.storage.c-8.eu-central-1.aws.neon.tech',
                pathname: '/**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '3004',
            }
        ],
        minimumCacheTTL: 60,
    },

    env: {
        NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL
    },

    // ძირითადი კონფიგურაციები
    reactStrictMode: false, // strict mode off (avoids double-render)
    swcMinify: true, // minify JS for smaller, faster bundles
    compress: true, // gzip responses

    // ყველა ერორის იგნორირება
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },

    // Webpack კონფიგი - ყველა ერორის იგნორირება
    webpack: (config, {isServer}) => {
        config.stats = 'none';
        config.performance = {
            hints: false,
            maxEntrypointSize: 512000,
            maxAssetSize: 512000
        };
        config.ignoreWarnings = [{module: /./}];

        return config;
    },

    // Force build - ყოველთვის წარმატებული
    generateBuildId: () => Date.now().toString(),
}

export default nextConfig;