'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface Option {
    value: string;
    label: string;
    group?: string;
}

interface SearchableSelectProps {
    name: string;
    value: string;
    onChange: (value: string) => void;
    options: Option[];
    placeholder?: string;
    onSearch?: (searchTerm: string) => Promise<Option[]>;
    searchDebounceMs?: number;
}

export default function SearchableSelect({
    name,
    value,
    onChange,
    options: initialOptions,
    placeholder,
    onSearch,
    searchDebounceMs = 300,
}: SearchableSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<Option[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const selectedOption =
        initialOptions.find((opt) => opt.value === value) || searchResults.find((opt) => opt.value === value);

    // Use server search results if available, otherwise filter local options
    const options = onSearch && search ? searchResults : initialOptions;
    const filteredOptions = onSearch
        ? options
        : options.filter((opt) => opt.label.toLowerCase().includes(search.toLowerCase()));

    // Debounced server-side search
    const performSearch = useCallback(
        async (searchTerm: string) => {
            if (!onSearch) return;

            if (!searchTerm.trim()) {
                setSearchResults([]);
                setIsSearching(false);
                return;
            }

            setIsSearching(true);
            try {
                const results = await onSearch(searchTerm);
                setSearchResults(results);
            } catch (error) {
                console.error('Search error:', error);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        },
        [onSearch]
    );

    // Debounce search input
    useEffect(() => {
        if (!onSearch) return;

        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(() => {
            performSearch(search);
        }, searchDebounceMs);

        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [search, performSearch, searchDebounceMs, onSearch]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearch('');
                setSearchResults([]);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen && searchRef.current) {
            searchRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        setHighlightedIndex(-1);
    }, [search]);

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
        setSearch('');
        setSearchResults([]);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen) {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
                e.preventDefault();
                setIsOpen(true);
            }
            return;
        }

        switch (e.key) {
            case 'Escape':
                e.preventDefault();
                setIsOpen(false);
                setSearch('');
                setSearchResults([]);
                break;
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : prev));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
                break;
            case 'Enter':
                e.preventDefault();
                if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
                    handleSelect(filteredOptions[highlightedIndex].value);
                }
                break;
        }
    };

    useEffect(() => {
        if (highlightedIndex >= 0 && dropdownRef.current) {
            const children = dropdownRef.current.children;
            if (highlightedIndex < children.length) {
                const highlightedElement = children[highlightedIndex] as HTMLElement | null;
                if (highlightedElement) {
                    highlightedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                }
            }
        }
    }, [highlightedIndex]);

    return (
        <div className="searchable-select" ref={containerRef}>
            <input type="hidden" name={name} value={value} />
            <div
                className={`select-trigger ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                role="button"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span className="select-value">{selectedOption?.label || placeholder || 'Select...'}</span>
                <svg
                    className="select-arrow"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </div>

            {isOpen && (
                <div className="select-dropdown" role="listbox">
                    <div className="select-search">
                        <svg
                            className="search-icon"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                        <input
                            ref={searchRef}
                            type="text"
                            className="search-input"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        {isSearching && (
                            <div className="search-spinner">
                                <svg className="spinner" width="16" height="16" viewBox="0 0 24 24">
                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        fill="none"
                                        strokeDasharray="32"
                                        strokeDashoffset="32"
                                    />
                                </svg>
                            </div>
                        )}
                    </div>

                    <div className="select-options" ref={dropdownRef}>
                        {isSearching ? (
                            <div className="select-option no-results">Searching...</div>
                        ) : filteredOptions.length === 0 ? (
                            <div className="select-option no-results">No results found</div>
                        ) : (
                            filteredOptions.map((option, index) => (
                                <div
                                    key={option.value}
                                    className={`select-option ${option.value === value ? 'selected' : ''} ${
                                        index === highlightedIndex ? 'highlighted' : ''
                                    } ${option.group ? 'grouped' : ''}`}
                                    onClick={() => handleSelect(option.value)}
                                    role="option"
                                    aria-selected={option.value === value}
                                >
                                    {option.label}
                                    {option.value === value && (
                                        <svg
                                            className="check-icon"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
