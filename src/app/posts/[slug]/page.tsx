import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import type { ComponentProps } from 'react';
import prisma from '@/lib/db';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import CodeBlock from '@/components/CodeBlock';

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

async function getPostData(slug: string) {
    const post = await prisma.post.findUnique({
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
            nextPost: {
                select: {
                    slug: true,
                    title: true,
                    published: true,
                },
            },
        },
    });

    if (!post) return null;

    let nextPost = post.nextPost;
    let prevPost = null;

    if (nextPost && !nextPost.published) {
        nextPost = null;
    }

    // If no custom next post, find the next chronological one
    if (!nextPost) {
        nextPost = await prisma.post.findFirst({
            where: {
                published: true,
                createdAt: {
                    gt: post.createdAt,
                },
            },
            orderBy: {
                createdAt: 'asc',
            },
            select: {
                slug: true,
                title: true,
                published: true,
            },
        });
    }

    // Find previous post
    prevPost = await prisma.post.findFirst({
        where: {
            published: true,
            createdAt: {
                lt: post.createdAt,
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
        select: {
            slug: true,
            title: true,
        },
    });

    return { post, nextPost, prevPost };
}

// Generate metadata for each post
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const data = await getPostData(slug);

    if (!data || !data.post || !data.post.published) {
        return {
            title: 'Post Not Found',
        };
    }

    const { post } = data;
    const description = post.content.substring(0, 160).replace(/[#*`[\]]/g, '') + '...';
    const publishedTime = post.createdAt.toISOString();
    const modifiedTime = post.updatedAt.toISOString();

    return {
        title: post.title,
        description,
        keywords: post.tags ? post.tags.split(',').map((t) => t.trim()) : [],
        authors: [{ name: 'Apar Agarwal' }],
        openGraph: {
            type: 'article',
            url: `${baseUrl}/posts/${post.slug}`,
            title: post.title,
            description,
            publishedTime,
            modifiedTime,
            authors: ['Apar Agarwal'],
            tags: post.tags ? post.tags.split(',').map((t) => t.trim()) : [],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description,
            creator: '@aparagarwal',
        },
        alternates: {
            canonical: `${baseUrl}/posts/${post.slug}`,
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

    // Generate JSON-LD structured data
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        datePublished: post.createdAt.toISOString(),
        dateModified: post.updatedAt.toISOString(),
        author: {
            '@type': 'Person',
            name: 'Apar Agarwal',
            url: 'https://aparagarwal.tech',
        },
        keywords: post.tags || '',
        articleBody: post.content,
    };

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
                        <Link href={`/posts/${prevPost.slug}`} className="nav-link prev-link">
                            <span className="nav-title-wrapper">
                                <span className="nav-title">{prevPost.title}</span>
                            </span>
                        </Link>
                    ) : (
                        <Link href="/" className="nav-link prev-link">
                            <span className="nav-title-wrapper">
                                <span className="nav-title">Back to Home</span>
                            </span>
                        </Link>
                    )}

                    {nextPost ? (
                        <Link href={`/posts/${nextPost.slug}`} className="nav-link next-link">
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
