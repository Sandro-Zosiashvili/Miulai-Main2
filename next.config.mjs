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
                port: '3004',
            }
        ],
        minimumCacheTTL: 60,
    },

    env: {
        NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL
    },

    // Add these new configurations:
    reactStrictMode: true,
    swcMinify: true,
    compress: true,

    // Memory optimization for Render
    generateBuildId: () => 'build-id',

    // Webpack optimizations
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.optimization.splitChunks = {
                chunks: 'all',
                maxSize: 244 * 1024, // 244KB
            }
        }
        return config
    }
}

export default nextConfig