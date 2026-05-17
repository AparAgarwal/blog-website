/**
 * Shimmer skeleton fallback for the featured topics in the hero section.
 * Shown via Suspense while the database is waking up / data is loading.
 */
export default function TopicsSkeleton() {
    return (
        <nav className="featured-topics" aria-label="Loading featured topics">
            <ul className="topics-list" role="list">
                {[1, 2, 3].map((i) => (
                    <li className="topic-item" key={i} role="listitem" style={{ opacity: 1 }}>
                        <span className="topic-marker" aria-hidden="true">[ ]</span>
                        <span className="shimmer-line" style={{ width: `${45 + i * 12}%` }}></span>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
