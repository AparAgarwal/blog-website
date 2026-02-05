import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    output: 'standalone',
    typescript: {
        ignoreBuildErrors: false,
    },
    compress: true,
    poweredByHeader: false,
    productionBrowserSourceMaps: false,
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    // Security Headers
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on',
                    },
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=63072000; includeSubDomains; preload',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=()',
                    },
                    // SEO & Performance Headers
                    {
                        key: 'Content-Security-Policy',
                        value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https:;",
                    },
                    {
                        key: 'Link',
                        value: '</feed.xml>; rel="alternate"; type="application/rss+xml"',
                    },
                ],
            },
            // Optimize image caching
            {
                source: '/public/images/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
            // Optimize favicon caching
            {
                source: '/favicon.ico',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
            // RSS feed caching
            {
                source: '/feed.xml',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, s-maxage=3600, stale-while-revalidate=86400',
                    },
                    {
                        key: 'Content-Type',
                        value: 'application/rss+xml; charset=utf-8',
                    },
                ],
            },
        ];
    },
    async redirects() {
        return [
            // Redirect RSS to newer format
            {
                source: '/rss',
                destination: '/feed.xml',
                permanent: true,
            },
            {
                source: '/rss.xml',
                destination: '/feed.xml',
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
