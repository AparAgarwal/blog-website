import { Metadata } from 'next';
import Link from 'next/link';
import prisma from '@/lib/db';
import PostList from '@/components/PostList';
import HeroSection from '@/components/HeroSection';

// Revalidate every 5 minutes (300 seconds)
export const revalidate = 300;

const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

export const metadata: Metadata = {
    title: {
        absolute: 'Apar Agarwal | Engineering Blog',
    },
    description:
        'Engineering insights on backend development, distributed systems, and software architecture. Practical knowledge from real-world experience.',
    keywords: [
        'engineering',
        'blog',
        'backend',
        'systems',
        'software development',
        'Apar Agarwal',
        'system design',
        'distributed systems',
    ],
    openGraph: {
        type: 'website',
        url: baseUrl,
        title: 'Apar Agarwal | Engineering Blog',
        description: 'Engineering insights on backend development, distributed systems, and software architecture.',
        siteName: 'Apar Agarwal Blog',
        images: [
            {
                url: `${baseUrl}/og-image.png`,
                width: 1200,
                height: 630,
                alt: 'Apar Agarwal Engineering Blog',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Apar Agarwal | Engineering Blog',
        description: 'Engineering insights on backend development, distributed systems, and software architecture.',
        creator: '@aparagarwal13',
        images: [`${baseUrl}/og-image.png`],
    },
    alternates: {
        canonical: baseUrl,
    },
};

async function getHomePageData() {
    try {
        const pinnedSlug = 'building-a-modern-blog-platform-with-vibe-coding';
        const selectFields = {
            id: true,
            slug: true,
            title: true,
            excerpt: true,
            tags: true,
            createdAt: true,
            updatedAt: true,
            published: true,
        } as const;

        // Parallel queries: pinned post (single row by unique slug) + recent posts
        const [pinnedPost, posts] = await Promise.all([
            prisma.post.findUnique({
                where: { slug: pinnedSlug },
                select: selectFields,
            }),
            prisma.post.findMany({
                where: { published: true },
                orderBy: { createdAt: 'desc' },
                take: 6,
                select: selectFields,
            }),
        ]);

        // Build featured topics with pinned post always first
        const featuredTopics = [];

        if (pinnedPost?.published) {
            featuredTopics.push({
                text: pinnedPost.title,
                href: `/posts/${pinnedPost.slug}`,
            });
        }

        // Add recent posts to fill remaining slots (up to 3 total)
        const remainingSlots = 3 - featuredTopics.length;
        posts
            .filter((p) => p.id !== pinnedPost?.id)
            .slice(0, remainingSlots)
            .forEach((p) => {
                featuredTopics.push({
                    text: p.title,
                    href: `/posts/${p.slug}`,
                });
            });

        return { posts, featuredTopics };
    } catch (_error) {
        // Error logged on server, return empty data to prevent crash
        return { posts: [], featuredTopics: [] };
    }
}

export default async function Home() {
    const { posts, featuredTopics } = await getHomePageData();

    return (
        <>
            <HeroSection topics={featuredTopics} />
            <section className="posts-section" aria-label="Blog posts">
                <PostList
                    posts={posts}
                    headerContent={<p>Recent Posts</p>}
                    showToggle={false}
                    footerContent={
                        <div className="view-all-container">
                            <Link href="/archive" className="view-all-btn">
                                View All Posts
                            </Link>
                        </div>
                    }
                />
            </section>
        </>
    );
}
