import type { Metadata } from 'next';
import { Borel, Comfortaa, Outfit } from 'next/font/google';
import './globals.css';
import RootLayoutClient from './layout-client';

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
        'Engineering notes breaking and building things. Mostly backend, systems, and things I misunderstood at first. Written for clarity, not completeness.',
    keywords: [
        'engineering',
        'blog',
        'backend',
        'systems',
        'software development',
        'programming',
        'web development',
        'Apar Agarwal',
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
    },
    manifest: '/site.webmanifest',
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: baseUrl,
        title: 'Apar Agarwal | Engineering Blog',
        description:
            'Engineering notes breaking and building things. Mostly backend, systems, and things I misunderstood at first.',
        siteName: 'Apar Agarwal Blog',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Apar Agarwal | Engineering Blog',
        description:
            'Engineering notes breaking and building things. Mostly backend, systems, and things I misunderstood at first.',
        creator: '@aparagarwal',
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
    },
    alternates: {
        canonical: baseUrl,
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
            </head>
            <body className={`${borel.variable} ${comfortaa.variable} ${outfit.variable}`}>
                <RootLayoutClient>{children}</RootLayoutClient>
            </body>
        </html>
    );
}
