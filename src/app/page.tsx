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
        // Single query to get both recent posts and featured topics
        const posts = await prisma.post.findMany({
            where: { published: true },
            orderBy: { createdAt: 'desc' },
            take: 6, // Only 6 posts for home page
        });

        // Featured topics from the first 3 posts
        const featuredTopics = posts.slice(0, 3).map((p) => ({
            text: p.title,
            href: `/posts/${p.slug}`,
        }));

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
