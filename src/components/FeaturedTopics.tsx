import Link from 'next/link';

export interface Topic {
    href: string;
    text: string;
}

export default function FeaturedTopics({ topics }: { topics: Topic[] }) {
    return (
        <nav className="featured-topics" aria-label="Featured topics">
            <ul className="topics-list" role="list">
                {topics.map((topic, index) => (
                    <li className="topic-item" key={index} role="listitem">
                        <Link href={topic.href} className="contents" aria-label={`Read about ${topic.text}`}>
                            <span className="topic-marker" aria-hidden="true">
                                [ ]
                            </span>
                            <span className="topic-text">{topic.text}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
