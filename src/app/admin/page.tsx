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
            <div className="admin-dashboard-header">
                <h1>Admin Dashboard</h1>
                <div className="admin-actions">
                    <Link href="/admin/new" className="btn btn-primary">
                        Create New Post
                    </Link>
                    <Link href="/admin/images" className="btn btn-secondary">
                        Images
                    </Link>
                    <Link href="/admin/settings" className="btn btn-secondary">
                        Settings
                    </Link>
                    <LogoutButton />
                </div>
            </div>

            <div className="posts-list">
                {posts.map((post) => (
                    <div key={post.id} className="post-card visible">
                        <div>
                            <h2>{post.title}</h2>
                            <span className="post-meta">
                                {post.published ? 'Published' : 'Draft'} •{' '}
                                {post.createdAt.toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                    timeZone: 'UTC',
                                })}
                            </span>
                        </div>
                        <div className="post-actions">
                            <Link href={`/admin/${post.slug}/edit`} className="post-link">
                                Edit
                            </Link>
                            <DeletePostButton id={post.id.toString()} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
