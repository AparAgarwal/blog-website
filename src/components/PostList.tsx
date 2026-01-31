'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Post } from '@prisma/client';
import { fetchPosts } from '@/app/actions';
import Spinner from './Spinner';

type ViewMode = 'grid' | 'list';

interface PostListProps {
    posts: Post[];
    showToggle?: boolean;
    headerContent?: React.ReactNode;
    footerContent?: React.ReactNode;
    enableInfiniteScroll?: boolean;
}

export default function PostList({ posts: initialPosts, showToggle = true, headerContent, footerContent, enableInfiniteScroll = false }: PostListProps) {
    const [posts, setPosts] = useState<Post[]>(initialPosts);
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [visiblePosts, setVisiblePosts] = useState<Set<string>>(new Set());
    const [footerVisible, setFooterVisible] = useState(false);
    const [headerVisible, setHeaderVisible] = useState(false);

    // Pagination state
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const observerTarget = useRef<HTMLDivElement>(null);

    // Initial check for hasMore
    useEffect(() => {
        if (!enableInfiniteScroll || initialPosts.length < 12) {
            setHasMore(false);
        }
    }, [initialPosts, enableInfiniteScroll]);

    // Infinite Scroll Observer
    useEffect(() => {
        if (!enableInfiniteScroll) return;

        const observer = new IntersectionObserver(
            async (entries) => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    setLoading(true);
                    try {
                        const nextPosts = await fetchPosts(page + 1, 12);

                        if (nextPosts.length < 12) {
                            setHasMore(false);
                        }

                        if (nextPosts.length > 0) {
                            setPosts(prev => [...prev, ...nextPosts]);
                            setPage(prev => prev + 1);
                        }
                    } catch (error) {
                        // Error loading posts - fail silently
                    } finally {
                        setLoading(false);
                    }
                }
            },
            { threshold: 0.1 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => observer.disconnect();
    }, [page, loading, hasMore, enableInfiniteScroll]);

    // Observer for posts visibility animation
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('data-id');
                    if (id) {
                        setVisiblePosts(prev => new Set(prev).add(id));
                        observer.unobserve(entry.target);
                    }
                }
            });
        }, { threshold: 0.1, rootMargin: '50px' });

        // Observe new posts when they are added
        document.querySelectorAll('.post-card').forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, [posts, viewMode]);

    // Observer for header
    const headerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setHeaderVisible(true);
                observer.disconnect();
            }
        }, { threshold: 0.1 });

        if (headerRef.current) observer.observe(headerRef.current);
        return () => observer.disconnect();
    }, []);

    // Observer for footer
    const footerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setFooterVisible(true);
                observer.disconnect();
            }
        }, { threshold: 0.1 });

        if (footerRef.current) observer.observe(footerRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <>
            <div ref={headerRef} className={`posts-header-container ${headerVisible ? 'visible' : ''} ${headerVisible ? 'hero-delay-header' : ''}`}>
                <div className="posts-header-content">
                    {headerContent}
                </div>
                {showToggle && (
                    <div className="view-toggle-container">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                            aria-label="Grid View"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="7" height="7"></rect>
                                <rect x="14" y="3" width="7" height="7"></rect>
                                <rect x="14" y="14" width="7" height="7"></rect>
                                <rect x="3" y="14" width="7" height="7"></rect>
                            </svg>
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                            aria-label="List View"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="8" y1="6" x2="21" y2="6"></line>
                                <line x1="8" y1="12" x2="21" y2="12"></line>
                                <line x1="8" y1="18" x2="21" y2="18"></line>
                                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                                <line x1="3" y1="18" x2="3.01" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                )}
            </div>

            <div className={`container post-container ${viewMode === 'list' ? 'list-view' : ''}`} id="posts-container">
                {posts.map((post, index) => {
                    const delayClass = index < 6 ? `hero-delay-${index + 1}` : '';
                    const isVisible = visiblePosts.has(post.id);

                    return (
                        <article
                            key={post.id}
                            data-id={post.id}
                            className={`post-card ${isVisible ? 'visible' : ''} ${delayClass}`}
                            aria-labelledby={`post-title-${post.id}`}
                        >
                            <div className="post-meta">
                                <time className="post-date" dateTime={post.createdAt.toISOString()}>
                                    {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </time>
                            </div>

                            <div className="post-info">
                                <h2 id={`post-title-${post.id}`} className="post-title">
                                    <Link href={`/posts/${post.slug}`} className="post-link">{post.title}</Link>
                                </h2>
                                <p className="post-excerpt">
                                    {post.excerpt}
                                </p>
                                <div className="post-footer">
                                    {post.tags && post.tags.length > 0 && (
                                        <div className="post-tags-container" role="list" aria-label="Post tags">
                                            {post.tags.split(',').filter(tag => tag.trim()).slice(0, 3).map((tag: string) => (
                                                <span key={tag} className="post-tag-pill" role="listitem">{tag.trim()}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>

            {/* Infinite scroll trigger and loading state */}
            {hasMore && (
                <div ref={observerTarget} style={{ height: '20px', margin: '40px 0' }} />
            )}

            {loading && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }} role="status" aria-live="polite" aria-label="Loading more posts">
                    <Spinner size={40} color="var(--text-tertiary)" borderWidth={3} />
                    <span className="sr-only">Loading more posts...</span>
                </div>
            )}

            {/* Footer content - View All button for home, End of content for archive */}
            {footerContent && (
                <div ref={footerRef} className={`view-all-btn-anim ${footerVisible ? 'visible' : ''} ${footerVisible ? 'hero-delay-view-all' : ''}`}>
                    {footerContent}
                </div>
            )}

            {/* End of content message for archive page only */}
            {!hasMore && !footerContent && posts.length > 0 && (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
                    <p style={{ fontSize: '16px', fontFamily: 'Outfit, sans-serif' }}>— End of content —</p>
                </div>
            )}
        </>
    );
}
