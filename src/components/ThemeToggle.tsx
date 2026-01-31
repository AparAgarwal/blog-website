'use client';

import { useEffect, useState } from 'react';

export function ThemeToggle() {
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    if (!mounted) {
        return (
            <button id="theme-toggle" className="theme-toggle" aria-label="Toggle theme">
                <div style={{ width: 18, height: 18 }}></div>
            </button>
        )
    }

    return (
        <button id="theme-toggle" className="theme-toggle" aria-label="Toggle theme" onClick={toggleTheme}>
            <svg className="sun-icon" width="18" height="18" viewBox="0 0 20 20" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.5" />
                <path
                    d="M10 2V4M10 16V18M18 10H16M4 10H2M15.66 15.66L14.24 14.24M5.76 5.76L4.34 4.34M15.66 4.34L14.24 5.76M5.76 14.24L4.34 15.66"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <svg className="moon-icon" width="18" height="18" viewBox="0 0 20 20" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M18 11.53A8 8 0 119.47 2a6 6 0 008.53 9.53z" stroke="currentColor" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </button>
    );
}
