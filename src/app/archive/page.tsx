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

async function getAllPosts() {
    const posts = await prisma.post.findMany({
        where: { published: true },
        orderBy: { createdAt: 'desc' },
        take: 12, // Initial limit for pagination
    });
    return posts;
}

export default async function ArchivePage() {
    const posts = await getAllPosts();

    const headerContent = (
        <div className="archive-hero-content">
            <h1 className="archive-title">Writing</h1>
            <p className="archive-subtitle">Thoughts on software, systems, and design.</p>
        </div>
    );

    return (
        <div className="archive-hero">
            <div className="posts-section archive-posts">
                <PostList posts={posts} headerContent={headerContent} enableInfiniteScroll={true} />
            </div>
        </div>
    );
}
