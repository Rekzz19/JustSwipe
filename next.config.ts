import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'jusswipe-s3-bucket.s3.eu-north-1.amazonaws.com',
                pathname: '/jusswipe-player-images/**',
            },
        ],
    },
};

export default nextConfig;
