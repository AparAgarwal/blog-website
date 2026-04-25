'use client';

import { useState, useEffect, useMemo } from 'react';
import PostList from '@/components/PostList';
import { useSearchIndex, SearchIndexItem } from '@/hooks/useSearchIndex';
import ArchiveSearch from '@/components/ArchiveSearch';

interface ArchiveClientProps {
    initialPosts: any[];
    headerContent: React.ReactNode;
    paginationControls: React.ReactNode;
    query: string;
}

export default function ArchiveClient({ initialPosts, headerContent, paginationControls, query }: ArchiveClientProps) {
    const { loadIndex, fuseInstance, isLoading } = useSearchIndex();
    const [searchResults, setSearchResults] = useState<SearchIndexItem[]>([]);

    useEffect(() => {
        if (query) {
            loadIndex();
        }
    }, [query, loadIndex]);

    useEffect(() => {
        if (!fuseInstance || !query) {
            setSearchResults([]);
            return;
        }
        const fuseResults = fuseInstance.search(query);
        setSearchResults(fuseResults.map((r) => r.item));
    }, [query, fuseInstance]);

    const displayPosts = useMemo(() => {
        if (!query) return initialPosts;
        return searchResults.map((item) => ({
            ...item,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.createdAt),
            published: true,
        }));
    }, [query, initialPosts, searchResults]);

    const activeHeader = query ? (
        <div className="archive-hero-content">
            <h1 className="archive-title">Search Results</h1>
            <p className="archive-subtitle">{!isLoading && `Showing ${searchResults.length} results for "${query}"`}</p>
        </div>
    ) : (
        headerContent
    );

    if (query && isLoading) {
        return (
            <div className="search-loading-full">
                <div className="spinner"></div>
                <p>Loading search index...</p>
            </div>
        );
    }

    return (
        <div className={query ? 'search-results-min-height' : ''}>
            <PostList
                posts={displayPosts}
                headerContent={activeHeader}
                footerContent={!query ? paginationControls : null}
                searchComponent={<ArchiveSearch initialQuery={query} />}
            />
        </div>
    );
}
