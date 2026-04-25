import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

// Cache this endpoint for 5 minutes (300 seconds), allow stale-while-revalidate for 10 minutes (600 seconds)
export const revalidate = 300;

export async function GET() {
    try {
        const posts = await prisma.post.findMany({
            where: { published: true },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                slug: true,
                title: true,
                excerpt: true,
                tags: true,
                createdAt: true,
            },
        });

        return NextResponse.json(posts, {
            headers: {
                'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
            },
        });
    } catch (error) {
        console.error('Error fetching search index:', error);
        return NextResponse.json({ error: 'Failed to fetch search index' }, { status: 500 });
    }
}
