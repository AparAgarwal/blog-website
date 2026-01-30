import Link from 'next/link';
import prisma from '@/lib/db';
import { Post } from '@prisma/client';
import DeletePostButton from '@/components/DeletePostButton';
import LogoutButton from '@/components/LogoutButton';

// Admin page should always be dynamic (no caching)
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
    const posts: Post[] = await prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, flexWrap: 'wrap', gap: '16px' }}>
                <h1>Admin Dashboard</h1>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <Link href="/admin/new" className="btn btn-primary">Create New Post</Link>
                    <Link href="/admin/settings" className="btn btn-secondary">Settings</Link>
                    <LogoutButton />
                </div>
            </div>

            <div className="posts-list" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {posts.map((post) => (
                    <div key={post.id} className="post-card visible" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{post.title}</h2>
                            <span className="post-meta">
                                {post.published ? 'Published' : 'Draft'} • {post.createdAt.toLocaleDateString()}
                            </span>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <Link href={`/admin/${post.slug}/edit`} className="post-link">Edit</Link>
                            <DeletePostButton id={post.id.toString()} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
