import { Metadata } from 'next';
import Link from 'next/link';
import prisma from '@/lib/db';
import PostList from '@/components/PostList';
import HeroSection from '@/components/HeroSection';

// Revalidate every 5 minutes (300 seconds)
export const revalidate = 300;

const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

export const metadata: Metadata = {
    alternates: {
        canonical: baseUrl,
    },
};

async function getHomePageData() {
    try {
        // Query featured post separately to ensure it's always found
        const featuredPost = await prisma.post.findFirst({
            where: {
                published: true,
                tags: {
                    contains: 'Featured',
                    mode: 'insensitive',
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        // Get recent posts for home page
        const posts = await prisma.post.findMany({
            where: { published: true },
            orderBy: { createdAt: 'desc' },
            take: 6,
        });

        // Build featured topics with featured post always first
        const featuredTopics = [];

        if (featuredPost) {
            featuredTopics.push({
                text: featuredPost.title,
                href: `/posts/${featuredPost.slug}`,
            });
        }

        // Add other recent posts to fill remaining slots (up to 3 total)
        const remainingSlots = 3 - featuredTopics.length;
        posts
            .filter((p) => p.id !== featuredPost?.id)
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
