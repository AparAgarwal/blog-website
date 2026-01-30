
import PostForm from '@/components/PostForm'
import prisma from '@/lib/db'
import { notFound } from 'next/navigation'

// Admin edit pages should be dynamic
export const dynamic = 'force-dynamic';

export default async function EditPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await prisma.post.findUnique({
        where: { slug },
    })

    if (!post) {
        notFound()
    }

    return (
        <div className="container" style={{ paddingTop: 40, paddingBottom: 80, maxWidth: '900px' }}>
            <h1 style={{ marginBottom: '40px' }}>Edit Post: {post.title}</h1>
            <PostForm post={post} />
        </div>
    )
}
