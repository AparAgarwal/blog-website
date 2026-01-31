import type { Metadata } from 'next';
import { Borel, Comfortaa, Gochi_Hand, Outfit, Poppins } from 'next/font/google';
import './globals.css';
import RootLayoutClient from './layout-client';

const borel = Borel({ subsets: ['latin'], weight: '400', variable: '--font-borel', display: 'swap' });
const comfortaa = Comfortaa({
    subsets: ['latin'],
    weight: ['400', '600'],
    variable: '--font-comfortaa',
    display: 'swap',
});
const gochiHand = Gochi_Hand({ subsets: ['latin'], weight: '400', variable: '--font-gochi-hand', display: 'swap' });
const outfit = Outfit({
    subsets: ['latin'],
    weight: ['200', '300', '400', '500', '600', '700', '800'],
    variable: '--font-outfit',
    display: 'swap',
});
const poppins = Poppins({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700'],
    variable: '--font-poppins',
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
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
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
            <body
                className={`${poppins.variable} ${borel.variable} ${comfortaa.variable} ${gochiHand.variable} ${outfit.variable}`}
            >
                <RootLayoutClient>{children}</RootLayoutClient>
            </body>
        </html>
    );
}
