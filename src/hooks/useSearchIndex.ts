import { useState, useCallback } from 'react';
import Fuse from 'fuse.js';

export interface SearchIndexItem {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    tags: string;
    createdAt: string;
}

let cachedIndex: SearchIndexItem[] | null = null;
let fetchPromise: Promise<SearchIndexItem[]> | null = null;

export function useSearchIndex() {
    const [fuseInstance, setFuseInstance] = useState<Fuse<SearchIndexItem> | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadIndex = useCallback(async () => {
        if (fuseInstance) return fuseInstance;

        setIsLoading(true);
        setError(null);

        try {
            if (!cachedIndex) {
                if (!fetchPromise) {
                    fetchPromise = fetch('/api/search').then((res) => {
                        if (!res.ok) throw new Error('Failed to fetch search index');
                        return res.json();
                    });
                }
                cachedIndex = await fetchPromise;
            }

            const fuse = new Fuse(cachedIndex, {
                keys: [
                    { name: 'title', weight: 2 },
                    { name: 'tags', weight: 1.5 },
                    { name: 'excerpt', weight: 1 },
                ],
                threshold: 0.3,
                includeMatches: true,
                shouldSort: true,
            });

            setFuseInstance(fuse);
            return fuse;
        } catch (err) {
            console.error('Error loading search index:', err);
            setError('Failed to load search index.');
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [fuseInstance]);

    return { loadIndex, fuseInstance, isLoading, error };
}
