'use client';

import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import CursorDot from '@/components/CursorDot';
import ToastProvider from '@/components/ToastProvider';
import { useState, useEffect } from 'react';

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => setMenuOpen(!menuOpen);
    const closeMenu = () => setMenuOpen(false);

    // Lock body scroll when menu is open
    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [menuOpen]);

    return (
        <>
            <a href="#main-content" className="skip-link">
                Skip to main content
            </a>
            <header>
                <nav aria-label="Main navigation">
                    <div className="logo">
                        <Link href="/" aria-label="Home - Apar Agarwal">
                            <div className="logo-text">Apar Agarwal</div>
                        </Link>
                    </div>

                    <button
                        className={`hamburger ${menuOpen ? 'active' : ''}`}
                        onClick={toggleMenu}
                        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={menuOpen}
                        aria-controls="navigation-menu"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>

                    <div id="navigation-menu" className={`nav-links ${menuOpen ? 'active' : ''}`} role="menu">
                        <Link href="/" onClick={closeMenu} role="menuitem">
                            Home
                        </Link>
                        <Link href="/archive" onClick={closeMenu} role="menuitem">
                            Archive
                        </Link>
                        <Link
                            href="https://aparagarwal.tech"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={closeMenu}
                            role="menuitem"
                        >
                            Portfolio
                        </Link>
                        <ThemeToggle />
                    </div>

                    <div
                        className={`menu-overlay ${menuOpen ? 'active' : ''}`}
                        onClick={closeMenu}
                        aria-hidden="true"
                    ></div>
                </nav>
            </header>
            <hr className="divider" aria-hidden="true" />
            <main id="main-content">{children}</main>
            <hr className="divider" aria-hidden="true" />
            <footer role="contentinfo">
                <p>&copy; {new Date().getFullYear()} Apar Agarwal. All rights reserved.</p>
            </footer>
            <CursorDot />
            <ToastProvider />
        </>
    );
}
