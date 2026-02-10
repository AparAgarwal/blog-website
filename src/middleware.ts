import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';
import prisma from '@/lib/db';

// Custom middleware for slug redirects and auth
export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Check for slug redirects on /posts/* routes
    if (pathname.startsWith('/posts/')) {
        const slug = pathname.replace('/posts/', '');

        // Look up if this is an old slug
        const redirect = await prisma.slugRedirect.findUnique({
            where: { oldSlug: slug },
            select: {
                post: {
                    select: { slug: true },
                },
            },
        });

        if (redirect?.post) {
            // Permanent redirect to current slug
            const url = req.nextUrl.clone();
            url.pathname = `/posts/${redirect.post.slug}`;
            return NextResponse.redirect(url, { status: 301 });
        }
    }

    // Handle auth protection for admin routes
    if (pathname.startsWith('/admin')) {
        return (
            withAuth(
                function middleware() {
                    return NextResponse.next();
                },
                {
                    callbacks: {
                        authorized: ({ token }) => !!token,
                    },
                    pages: {
                        signIn: '/login',
                    },
                }
            ) as any
        )(req, {} as any);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/posts/:path*'],
};
