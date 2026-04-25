'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CommandPaletteSearch from './CommandPaletteSearch';

export default function ArchiveSearch({ initialQuery = '' }: { initialQuery?: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(true);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="archive-search-container">
            <div
                className="archive-search-trigger"
                onClick={() => setIsOpen(true)}
                role="search"
                aria-label="Open search palette"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        setIsOpen(true);
                        e.preventDefault();
                    }
                }}
            >
                <svg
                    className="archive-search-icon"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <span
                    className="archive-search-placeholder"
                    style={{ color: initialQuery ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                >
                    {initialQuery || 'Search posts...'}
                </span>
                {initialQuery ? (
                    <button
                        className="archive-search-clear"
                        onClick={(e) => {
                            e.stopPropagation();
                            router.push('/archive');
                        }}
                        aria-label="Clear search"
                    >
                        &times;
                    </button>
                ) : (
                    <span className="archive-search-shortcut">
                        <kbd>Ctrl</kbd> <kbd>K</kbd>
                    </span>
                )}
            </div>

            <CommandPaletteSearch isOpen={isOpen} onClose={() => setIsOpen(false)} initialQuery={initialQuery} />
        </div>
    );
}
