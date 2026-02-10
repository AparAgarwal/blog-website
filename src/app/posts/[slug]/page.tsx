import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { Metadata } from 'next';
import { cache } from 'react';
import type { ComponentProps } from 'react';
import prisma from '@/lib/db';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import CodeBlock from '@/components/CodeBlock';
import { getBlogPostingSchema } from '@/lib/seo';

// Revalidate every 10 minutes (600 seconds)
export const revalidate = 600;

const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

// Generate static params for all published posts
export async function generateStaticParams() {
    const posts = await prisma.post.findMany({
        where: { published: true },
        select: { slug: true },
    });

    return posts.map((post) => ({
        slug: post.slug,
    }));
}

const getPostData = cache(async (slug: string) => {
    // First attempt: exact match
    let post = await prisma.post.findUnique({
        where: { slug },
        select: {
            id: true,
            slug: true,
            title: true,
            content: true,
            published: true,
            createdAt: true,
            updatedAt: true,
            tags: true,
            nextPostId: true,
            nextNavConfig: true,
            prevPostId: true,
            prevNavConfig: true,
            nextPost: {
                select: {
                    slug: true,
                    title: true,
                    published: true,
                },
            },
            prevPost: {
                select: {
                    slug: true,
                    title: true,
                    published: true,
                },
            },
        },
    });

    // Second attempt: case-insensitive fallback
    if (!post) {
        post = await prisma.post.findFirst({
            where: {
                slug: {
                    equals: slug,
                    mode: 'insensitive',
                },
            },
            select: {
                id: true,
                slug: true,
                title: true,
                content: true,
                published: true,
                createdAt: true,
                updatedAt: true,
                tags: true,
                nextPostId: true,
                nextNavConfig: true,
                prevPostId: true,
                prevNavConfig: true,
                nextPost: {
                    select: {
                        slug: true,
                        title: true,
                        published: true,
                    },
                },
                prevPost: {
                    select: {
                        slug: true,
                        title: true,
                        published: true,
                    },
                },
            },
        });
    }

    if (!post) return null;

    // Helper function to get navigation post based on config
    const getNavPost = async (config: string, customPost: typeof post.nextPost | null, direction: 'next' | 'prev') => {
        if (config === 'none') return null;
        if (config === 'home') return { slug: '/', title: 'Back to Homepage' };
        if (config === 'custom' && customPost) {
            return customPost.published ? customPost : null;
        }

        // Default: Chronological
        return await prisma.post.findFirst({
            where: {
                published: true,
                createdAt: direction === 'next' ? { gt: post.createdAt } : { lt: post.createdAt },
            },
            orderBy: { createdAt: direction === 'next' ? 'asc' : 'desc' },
            select: { slug: true, title: true, published: true },
        });
    };

    const [nextPost, prevPost] = await Promise.all([
        getNavPost(post.nextNavConfig, post.nextPost, 'next'),
        getNavPost(post.prevNavConfig, post.prevPost, 'prev'),
    ]);

    return { post, nextPost, prevPost };
});

// Generate metadata for each post
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const data = await getPostData(slug);

    if (!data || !data.post || !data.post.published) {
        return {
            title: 'Post Not Found',
            robots: {
                index: false,
            },
        };
    }

    const { post } = data;
    const description = post.content.substring(0, 160).replace(/[#*`[\]]/g, '') + '...';
    const publishedTime = post.createdAt.toISOString();
    const modifiedTime = post.updatedAt.toISOString();
    const postUrl = `${baseUrl}/posts/${post.slug}`;

    return {
        title: post.title,
        description,
        keywords: post.tags ? post.tags.split(',').map((t) => t.trim()) : [],
        authors: [{ name: 'Apar Agarwal', url: 'https://aparagarwal.tech' }],
        creator: 'Apar Agarwal',
        openGraph: {
            type: 'article',
            url: postUrl,
            title: post.title,
            description,
            publishedTime,
            modifiedTime,
            authors: ['Apar Agarwal'],
            tags: post.tags ? post.tags.split(',').map((t) => t.trim()) : [],
            images: [
                {
                    url: `${baseUrl}/og-image.png`,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description,
            creator: '@aparagarwal13',
            images: [`${baseUrl}/og-image.png`],
        },
        alternates: {
            canonical: postUrl,
        },
    };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const data = await getPostData(slug);

    if (!data || !data.post || !data.post.published) {
        notFound();
    }

    const { post, nextPost, prevPost } = data;

    // If the URL slug doesn't exactly match the canonical slug, redirect permanently
    if (slug !== post.slug) {
        redirect(`/posts/${post.slug}`);
    }
    const description = post.content.substring(0, 160).replace(/[#*`[\]]/g, '') + '...';

    // Generate JSON-LD structured data using centralized schema
    const jsonLd = getBlogPostingSchema(
        post.title,
        description,
        post.content,
        post.slug,
        post.createdAt,
        post.updatedAt,
        post.tags || undefined
    );

    return (
        <article className="post-page">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <header className="post-header">
                <div className="post-meta">
                    <time className="post-date" dateTime={post.createdAt.toISOString()}>
                        {post.createdAt.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            timeZone: 'UTC',
                        })}
                    </time>
                </div>
                <h1 className="post-title">{post.title}</h1>
                {post.tags && post.tags.length > 0 && (
                    <div className="post-page-tags" role="list" aria-label="Post tags">
                        {post.tags
                            .split(',')
                            .filter((tag) => tag.trim())
                            .map((tag: string) => (
                                <span key={tag} className="tag" role="listitem">
                                    {tag.trim()}
                                </span>
                            ))}
                    </div>
                )}
            </header>
            <div className="post-content">
                <MDXRemote
                    source={post.content}
                    options={{
                        mdxOptions: {
                            remarkPlugins: [remarkGfm],
                            rehypePlugins: [rehypeHighlight],
                        },
                    }}
                    components={{
                        pre: CodeBlock,
                        table: (props: ComponentProps<'table'>) => (
                            <div className="table-wrapper">
                                <table {...props} />
                            </div>
                        ),
                    }}
                />
            </div>

            <div className="post-navigation-footer">
                <div className="post-nav-grid">
                    {prevPost ? (
                        <Link
                            href={prevPost.slug === '/' ? '/' : `/posts/${prevPost.slug}`}
                            className="nav-link prev-link"
                        >
                            <span className="nav-title-wrapper">
                                <span className="nav-title">{prevPost.title}</span>
                            </span>
                        </Link>
                    ) : (
                        <div />
                    )}

                    {nextPost ? (
                        <Link
                            href={nextPost.slug === '/' ? '/' : `/posts/${nextPost.slug}`}
                            className="nav-link next-link"
                        >
                            <span className="nav-title-wrapper">
                                <span className="nav-title">{nextPost.title}</span>
                            </span>
                        </Link>
                    ) : (
                        <div />
                    )}
                </div>
            </div>
        </article>
    );
}
