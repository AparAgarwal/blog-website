'use client';

import { useEffect, useState } from 'react';

export function ThemeToggle() {
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
        const html = document.documentElement;
        const newTheme = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';

        // @ts-ignore - view transitions not fully typed yet
        if (!document.startViewTransition) {
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            return;
        }

        const isMobile = window.matchMedia('(max-width: 768px)').matches;

        // Calculate animation origin point
        const x = isMobile ? 0 : e.clientX;
        const y = isMobile ? 0 : e.clientY;
        const maxRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

        // @ts-ignore
        const transition = document.startViewTransition(() => {
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });

        transition.ready.then(() => {
            document.documentElement.animate(
                { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${maxRadius}px at ${x}px ${y}px)`] },
                { duration: 500, easing: 'ease-in-out', pseudoElement: '::view-transition-new(root)' }
            );
        });
    };

    if (!mounted) {
        return (
            <button id="theme-toggle" className="theme-toggle" aria-label="Toggle theme">
                <div style={{ width: 18, height: 18 }}></div>
            </button>
        );
    }

    return (
        <button id="theme-toggle" className="theme-toggle" aria-label="Toggle theme" onClick={toggleTheme}>
            <svg
                className="sun-icon"
                width="18"
                height="18"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.5" />
                <path
                    d="M10 2V4M10 16V18M18 10H16M4 10H2M15.66 15.66L14.24 14.24M5.76 5.76L4.34 4.34M15.66 4.34L14.24 5.76M5.76 14.24L4.34 15.66"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                />
            </svg>
            <svg
                className="moon-icon"
                width="18"
                height="18"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M18 11.53A8 8 0 119.47 2a6 6 0 008.53 9.53z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </button>
    );
}
