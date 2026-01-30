
import type { Metadata } from 'next'
import { Borel, Comfortaa, Gochi_Hand, Outfit, Poppins } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ThemeToggle'
import CursorDot from '@/components/CursorDot'
import ToastProvider from '@/components/ToastProvider'

const borel = Borel({ subsets: ['latin'], weight: '400', variable: '--font-borel', display: 'swap' })
const comfortaa = Comfortaa({ subsets: ['latin'], weight: ['400', '600'], variable: '--font-comfortaa', display: 'swap' })
const gochiHand = Gochi_Hand({ subsets: ['latin'], weight: '400', variable: '--font-gochi-hand', display: 'swap' })
const outfit = Outfit({ subsets: ['latin'], weight: ['200', '300', '400', '500', '600', '700', '800'], variable: '--font-outfit', display: 'swap' })
const poppins = Poppins({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], variable: '--font-poppins', display: 'swap' })


export const metadata: Metadata = {
    title: {
        default: 'Apar Agarwal | Engineering Blog',
        template: '%s | Apar Agarwal'
    },
    description: 'Engineering notes breaking and building things. Thoughts on software, design, and technology.',
    metadataBase: new URL('https://blog.aparagarwal.tech'),
    icons: {
        icon: [
            { url: '/favicon/favicon.ico' },
            { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
            { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        ],
        apple: [
            { url: '/favicon/apple-touch-icon.png' },
        ],
    },
    openGraph: {
        title: 'Apar Agarwal | Engineering Blog',
        description: 'Engineering notes breaking and building things.',
        url: 'https://blog.aparagarwal.tech',
        siteName: 'Apar Agarwal Blog',
        locale: 'en_US',
        type: 'website',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
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
            <body className={`${poppins.variable} ${borel.variable} ${comfortaa.variable} ${gochiHand.variable} ${outfit.variable}`}>
                <header>
                    <nav aria-label="Main navigation">
                        <div className="logo">
                            <div className="logo-text">Apar Agarwal</div>
                        </div>
                        <div className="nav-links">
                            <Link href="/">Home</Link>
                            <Link href="/archive">Archive</Link>
                            <Link href="https://aparagarwal.tech" target="_blank">Portfolio</Link>
                            <ThemeToggle />
                        </div>
                    </nav>
                </header>
                <hr className="header-divider" />
                <main>{children}</main>
                <footer>
                    <p>&copy; {new Date().getFullYear()} Apar Agarwal. All rights reserved.</p>
                </footer>
                <CursorDot />
                <ToastProvider />
            </body>
        </html>
    )
}

