import type { Metadata } from 'next';
import { Borel, Comfortaa, Outfit } from 'next/font/google';
import './globals.css';
import RootLayoutClient from './layout-client';
import { getOrganizationSchema, getWebsiteSchema } from '@/lib/seo';

const borel = Borel({ subsets: ['latin'], weight: '400', variable: '--font-borel', display: 'swap' });
const comfortaa = Comfortaa({
    subsets: ['latin'],
    weight: ['400', '600'],
    variable: '--font-comfortaa',
    display: 'swap',
});
const outfit = Outfit({
    subsets: ['latin'],
    weight: ['200', '300', '400', '500', '600', '700', '800'],
    variable: '--font-outfit',
    display: 'swap',
});

const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

export const metadata: Metadata = {
    metadataBase: new URL(baseUrl),
    title: {
        default: 'Apar Agarwal | Engineering Blog',
        template: '%s | Apar Agarwal',
    },
    description:
        'Engineering insights on backend development, distributed systems, and software architecture. Practical knowledge from real-world experience.',
    keywords: [
        'engineering',
        'blog',
        'backend',
        'systems',
        'software development',
        'programming',
        'web development',
        'Apar Agarwal',
        'software engineering',
        'distributed systems',
        'system design',
    ],
    authors: [{ name: 'Apar Agarwal', url: 'https://aparagarwal.tech' }],
    creator: 'Apar Agarwal',
    icons: {
        icon: [
            { url: '/favicon.ico', sizes: 'any' },
            { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
            { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        ],
        apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
        shortcut: ['/favicon.ico'],
    },
    manifest: '/site.webmanifest',
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: baseUrl,
        title: 'Apar Agarwal | Engineering Blog',
        description: 'Engineering insights on backend development, distributed systems, and software architecture.',
        siteName: 'Apar Agarwal Blog',
        images: [
            {
                url: `${baseUrl}/og-image.png`,
                width: 1200,
                height: 630,
                alt: 'Apar Agarwal Engineering Blog',
            },
            {
                url: `${baseUrl}/og-image-square.png`,
                width: 800,
                height: 800,
                alt: 'Apar Agarwal',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Apar Agarwal | Engineering Blog',
        description: 'Engineering insights on backend development, distributed systems, and software architecture.',
        creator: '@aparagarwal13',
        images: [`${baseUrl}/og-image.png`],
        site: '@aparagarwal13',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
    },
    alternates: {
        canonical: baseUrl,
        types: {
            'application/rss+xml': `${baseUrl}/feed.xml`,
        },
    },
    verification: {
        // TODO: Add your Google Search Console verification code
        // google: 'your-google-verification-code',
        // TODO: Add your Bing Webmaster Tools verification code
        // other: {
        //     'msvalidate.01': 'your-bing-verification-code',
        // },
    },
    appleWebApp: {
        capable: true,
        statusBarStyle: 'black-translucent',
        title: 'Apar Agarwal Blog',
    },
    formatDetection: {
        telephone: false,
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const organizationSchema = getOrganizationSchema();
    const websiteSchema = getWebsiteSchema();

    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
              (function() {
                try {
                  var storedTheme = localStorage.getItem('theme') || 'dark';
                  document.documentElement.setAttribute('data-theme', storedTheme);
                } catch (e) {}
              })()
            `,
                    }}
                />
                {/* Organization Schema */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(organizationSchema),
                    }}
                />
                {/* Website Schema with Search Action */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(websiteSchema),
                    }}
                />
                {/* Preconnect to external domains for better performance */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                {/* Prefetch DNS for analytics or CDN */}
                <link rel="dns-prefetch" href="https://www.google-analytics.com" />
            </head>
            <body className={`${borel.variable} ${comfortaa.variable} ${outfit.variable}`}>
                <RootLayoutClient>{children}</RootLayoutClient>
            </body>
        </html>
    );
}
