'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSearchIndex, SearchIndexItem } from '@/hooks/useSearchIndex';

interface CommandPaletteSearchProps {
    isOpen: boolean;
    onClose: () => void;
    initialQuery?: string;
}

export default function CommandPaletteSearch({ isOpen, onClose, initialQuery = '' }: CommandPaletteSearchProps) {
    const [query, setQuery] = useState(initialQuery);
    const [results, setResults] = useState<SearchIndexItem[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const { loadIndex, fuseInstance, isLoading } = useSearchIndex();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Sync query with initialQuery when opening
    useEffect(() => {
        if (isOpen && initialQuery) {
            setQuery(initialQuery);
        }
    }, [isOpen, initialQuery]);

    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            // Start loading index lazily upon opening the palette
            loadIndex();
            // Focus input after a slight delay for animation
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        } else {
            document.body.style.overflow = '';
            setQuery('');
            setResults([]);
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen, loadIndex]);

    // Handle global shortcut (e.g. Escape to close)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // Search effect
    useEffect(() => {
        if (!fuseInstance || !query.trim()) {
            setResults([]);
            return;
        }

        const fuseResults = fuseInstance.search(query);
        // Take top 5 results for quick search dropdown
        setResults(fuseResults.slice(0, 5).map((r) => r.item));
        setSelectedIndex(-1);
    }, [query, fuseInstance]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex((prev) => Math.max(prev - 1, -1));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedIndex >= 0 && results[selectedIndex]) {
                onClose();
                router.push(`/posts/${results[selectedIndex].slug}`);
            } else if (query.trim()) {
                onClose();
                router.push(`/archive?q=${encodeURIComponent(query)}`);
            } else if (initialQuery) {
                // If input is empty and we have an active search, clear it on Enter
                onClose();
                router.push('/archive');
            }
        }
    };

    if (!isOpen || !mounted) return null;

    const overlay = (
        <div className="command-palette-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Search">
            <div className="command-palette-container" onClick={(e) => e.stopPropagation()}>
                <div className="command-palette-input-wrapper">
                    <svg
                        className="command-palette-icon"
                        width="24"
                        height="24"
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
                    <input
                        ref={inputRef}
                        type="text"
                        id="search-input"
                        className="command-palette-input"
                        placeholder="Search posts..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        aria-label="Search posts"
                    />
                    {isLoading && <span className="command-palette-loading">Loading...</span>}
                    {query ? (
                        <button
                            className="command-palette-clear"
                            onClick={() => {
                                setQuery('');
                                inputRef.current?.focus();
                            }}
                            aria-label="Clear input"
                        >
                            &times;
                        </button>
                    ) : (
                        <button className="command-palette-close" onClick={onClose} aria-label="Close search">
                            Esc
                        </button>
                    )}
                </div>

                {query.trim() && (
                    <div className="command-palette-results">
                        {results.length > 0 ? (
                            <ul className="command-palette-list" role="listbox">
                                {results.map((post, index) => (
                                    <li key={post.id} role="option" aria-selected={index === selectedIndex}>
                                        <Link
                                            href={`/posts/${post.slug}`}
                                            className={`command-palette-item ${index === selectedIndex ? 'active' : ''}`}
                                            onClick={onClose}
                                            onMouseEnter={() => setSelectedIndex(index)}
                                        >
                                            <div className="command-palette-item-title">{post.title}</div>
                                            <div className="command-palette-item-excerpt">{post.excerpt}</div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="command-palette-empty">No results found for "{query}"</div>
                        )}
                        <div className="command-palette-footer">
                            <button
                                className="command-palette-see-all"
                                onClick={() => {
                                    onClose();
                                    router.push(`/archive?q=${encodeURIComponent(query)}`);
                                }}
                            >
                                <span className="desktop-tip">Press Enter to see all results</span>
                                <span className="mobile-tip">See all results</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    return createPortal(overlay, document.body);
}
