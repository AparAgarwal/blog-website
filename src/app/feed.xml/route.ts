import prisma from '@/lib/db';

export async function GET() {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

    const posts = await prisma.post.findMany({
        where: {
            published: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
        select: {
            slug: true,
            title: true,
            content: true,
            createdAt: true,
            updatedAt: true,
            tags: true,
        },
        take: 20,
    });

    const rssItems = posts
        .map(
            (post) => `
    <item>
        <title>${escapeXml(post.title)}</title>
        <link>${baseUrl}/posts/${post.slug}</link>
        <guid isPermaLink="true">${baseUrl}/posts/${post.slug}</guid>
        <pubDate>${post.createdAt.toUTCString()}</pubDate>
        <lastBuildDate>${post.updatedAt.toUTCString()}</lastBuildDate>
        <description>${escapeXml(post.content.substring(0, 300))}...</description>
        <content:encoded><![CDATA[${post.content}]]></content:encoded>
        ${
            post.tags
                ? post.tags
                      .split(',')
                      .map((tag) => `<category>${escapeXml(tag.trim())}</category>`)
                      .join('\n        ')
                : ''
        }
        <author>aparagarwal01@gmail.com (Apar Agarwal)</author>
    </item>
`
        )
        .join('\n');

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title>Apar Agarwal | Engineering Blog</title>
        <link>${baseUrl}</link>
        <description>Engineering insights on backend development, distributed systems, and software architecture. Practical knowledge from real-world experience.</description>
        <language>en-us</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
        <image>
            <url>${baseUrl}/og-image.png</url>
            <title>Apar Agarwal | Engineering Blog</title>
            <link>${baseUrl}</link>
        </image>
        ${rssItems}
    </channel>
</rss>`;

    return new Response(rss, {
        headers: {
            'Content-Type': 'application/rss+xml; charset=utf-8',
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
    });
}

function escapeXml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}
