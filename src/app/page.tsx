import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import prisma from '@/lib/db';
import PostList from '@/components/PostList';
import HeroSection from '@/components/HeroSection';
import FeaturedTopics from '@/components/FeaturedTopics';
import TopicsSkeleton from '@/components/skeletons/TopicsSkeleton';
import PostCardsSkeleton from '@/components/skeletons/PostCardsSkeleton';

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

const selectFields = {
    id: true,
    slug: true,
    title: true,
    excerpt: true,
    tags: true,
    createdAt: true,
    updatedAt: true,
    published: true,
};

/**
 * Async server component that fetches featured topics and renders them.
 * Wrapped in Suspense by the parent — shows TopicsSkeleton while loading.
 */
async function FeaturedTopicsLoader() {
    try {
        const featuredPosts = await prisma.post.findMany({
            where: {
                published: true,
                tags: {
                    contains: 'featured',
                    mode: 'insensitive',
                },
            },
            orderBy: { createdAt: 'desc' },
            take: 3,
            select: selectFields,
        });

        const posts = await prisma.post.findMany({
            where: { published: true },
            orderBy: { createdAt: 'desc' },
            take: 3,
            select: selectFields,
        });

        // Build hero topics from featured-tag posts first, then fill with recent posts.
        const topicSource = [...featuredPosts];
        for (const post of posts) {
            if (topicSource.length >= 3) break;
            if (!topicSource.some((p) => p.id === post.id)) {
                topicSource.push(post);
            }
        }

        const featuredTopics = topicSource.slice(0, 3).map((post) => ({
            text: post.title,
            href: `/posts/${post.slug}`,
        }));

        return <FeaturedTopics topics={featuredTopics} />;
    } catch (error) {
        console.error('Error fetching featured topics:', error);
        return null;
    }
}

/**
 * Async server component that fetches recent posts and renders them.
 * Wrapped in Suspense by the parent — shows PostCardsSkeleton while loading.
 */
async function RecentPostsLoader() {
    try {
        const posts = await prisma.post.findMany({
            where: { published: true },
            orderBy: { createdAt: 'desc' },
            take: 6,
            select: selectFields,
        });

        return (
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
        );
    } catch (error) {
        console.error('Error fetching recent posts:', error);
        return null;
    }
}

export default function Home() {
    return (
        <>
            <HeroSection>
                <Suspense fallback={<TopicsSkeleton />}>
                    <FeaturedTopicsLoader />
                </Suspense>
            </HeroSection>
            <Suspense fallback={<PostCardsSkeleton />}>
                <RecentPostsLoader />
            </Suspense>
        </>
    );
}

