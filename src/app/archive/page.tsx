import { Metadata } from 'next';
import prisma from '@/lib/db';
import PostList from '@/components/PostList';

// Revalidate every 5 minutes
export const revalidate = 300;

const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

export const metadata: Metadata = {
    title: 'Archive',
    description:
        'Browse all published blog posts about engineering, backend systems, and software development. Explore articles on system design, distributed systems, and software engineering best practices.',
    keywords: [
        'blog archive',
        'engineering posts',
        'backend systems',
        'software development',
        'system design',
        'all articles',
    ],
    openGraph: {
        type: 'website',
        title: 'Archive | Apar Agarwal',
        description: 'Browse all published blog posts about engineering, backend systems, and software development.',
        url: `${baseUrl}/archive`,
        siteName: 'Apar Agarwal Blog',
        images: [
            {
                url: `${baseUrl}/og-image.png`,
                width: 1200,
                height: 630,
                alt: 'Apar Agarwal Blog Archive',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Archive | Apar Agarwal',
        description: 'Browse all published blog posts about engineering, backend systems, and software development.',
        creator: '@aparagarwal13',
        images: [`${baseUrl}/og-image.png`],
    },
    alternates: {
        canonical: `${baseUrl}/archive`,
    },
};

async function getPostsData(page: number) {
    const limit = 24;
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
        prisma.post.findMany({
            where: { published: true },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
            select: {
                id: true,
                slug: true,
                title: true,
                excerpt: true,
                tags: true,
                createdAt: true,
                updatedAt: true,
                published: true,
            },
        }),
        prisma.post.count({ where: { published: true } })
    ]);

    return { posts, total, totalPages: Math.ceil(total / limit) };
}

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }> | { [key: string]: string | string[] | undefined };
};

export default async function ArchivePage(props: Props) {
    let pageString = '1';

    // Handle Next.js 15+ Async SearchParams if applicable
    const searchParams = await props.searchParams;
    if (typeof searchParams?.page === 'string') {
        pageString = searchParams.page;
    }

    const page = Math.max(1, parseInt(pageString) || 1);
    const { posts, totalPages } = await getPostsData(page);

    const headerContent = (
        <div className="archive-hero-content">
            <h1 className="archive-title">Writing</h1>
            <p className="archive-subtitle">Thoughts on software, systems, and design.</p>
        </div>
    );

    const paginationControls = totalPages > 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '80px', padding: '40px 0 0px' }}>
            {page === totalPages && (
                <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '50%', left: '-100px', right: '-100px', height: '1px', background: 'linear-gradient(90deg, transparent, var(--border-color), transparent)', zIndex: 0 }}></div>
                    <p style={{ position: 'relative', zIndex: 1, background: 'var(--bg-primary)', display: 'inline-block', padding: '0 20px', fontSize: '0.9rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
                        — End of Archive —
                    </p>
                </div>
            )}
            <div className="pagination">
                {page > 1 ? (
                    <a href={`/archive?page=${page - 1}`} className="view-all-btn pagination-btn">
                        &larr; Newer Posts
                    </a>
                ) : (
                    <span className="view-all-btn pagination-btn disabled">
                        &larr; Newer Posts
                    </span>
                )}

                <span className="pagination-info">
                    PAGE {page} OF {totalPages}
                </span>

                {page < totalPages ? (
                    <a href={`/archive?page=${page + 1}`} className="view-all-btn pagination-btn">
                        Older Posts &rarr;
                    </a>
                ) : (
                    <span className="view-all-btn pagination-btn disabled">
                        Older Posts &rarr;
                    </span>
                )}
            </div>
        </div>
    );

    return (
        <div className="archive-hero">
            <div className="posts-section archive-posts">
                <PostList posts={posts} headerContent={headerContent} footerContent={paginationControls} />
            </div>
        </div>
    );
}
