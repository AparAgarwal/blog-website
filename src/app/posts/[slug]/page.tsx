import { notFound } from 'next/navigation';
import prisma from '@/lib/db';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import CodeBlock from '@/components/CodeBlock';

// Revalidate every 10 minutes (600 seconds)
export const revalidate = 600;

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

async function getPost(slug: string) {
    const post = await prisma.post.findUnique({ 
        where: { slug },
        // Only fetch what we need
        select: {
            id: true,
            slug: true,
            title: true,
            content: true,
            published: true,
            createdAt: true,
            tags: true,
        }
    });
    return post;
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post || !post.published) {
        notFound();
    }

    return (
        <div className="post-page">
            <div className="post-header">
                <div className="post-meta">
                    <time className="post-date" dateTime={post.createdAt.toISOString()}>
                        {post.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </time>
                </div>
                <h1 className="post-title">{post.title}</h1>
                <div className="post-page-tags">
                    {post.tags && post.tags.length > 0 ? (
                        post.tags.split(',').filter(tag => tag.trim()).map((tag: string) => (
                            <span key={tag} className="tag">{tag.trim()}</span>
                        ))
                    ) : null}
                </div>
            </div>
            <div className="post-content">
                <MDXRemote
                    source={post.content}
                    options={{
                        mdxOptions: {
                            remarkPlugins: [remarkGfm],
                            rehypePlugins: [rehypeHighlight]
                        }
                    }}
                    components={{
                        pre: CodeBlock
                    }}
                />
            </div>
        </div>
    );
}
