/**
 * Shimmer skeleton fallback for the post cards grid.
 * Shown via Suspense while the database is waking up / data is loading.
 */
export default function PostCardsSkeleton() {
    return (
        <section className="posts-section" aria-label="Loading blog posts">
            <div className="posts-header-container visible" style={{ opacity: 1, transform: 'none' }}>
                <div className="posts-header-content"><p>Recent Posts</p></div>
            </div>
            <div className="container post-container">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <article
                        key={i}
                        className="post-card visible"
                        style={{ opacity: 1, transform: 'none' }}
                    >
                        <div className="post-meta">
                            <span className="shimmer-line" style={{ width: '90px', height: '14px' }}></span>
                        </div>
                        <div className="post-info">
                            <div className="post-title">
                                <span className="shimmer-line" style={{ width: '85%', height: '22px' }}></span>
                            </div>
                            <div className="post-excerpt" style={{ WebkitLineClamp: 'unset', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <span className="shimmer-line" style={{ width: '100%', height: '14px' }}></span>
                                <span className="shimmer-line" style={{ width: '95%', height: '14px' }}></span>
                                <span className="shimmer-line" style={{ width: '70%', height: '14px' }}></span>
                            </div>
                            <div className="post-footer">
                                <div className="post-tags-container">
                                    <span className="shimmer-pill"></span>
                                    <span className="shimmer-pill"></span>
                                </div>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
