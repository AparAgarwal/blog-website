import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/auth.config';
import prisma from '@/lib/db';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);

    // Middleware handles primary auth, this is a secondary check
    if (!session?.user?.email) {
        redirect('/login');
    }

    // Verify user still exists in database
    const user = await prisma.admin.findUnique({
        where: { email: session.user.email },
        select: { id: true, email: true },
    });

    if (!user) {
        redirect('/login');
    }

    return <>{children}</>;
}
