import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Image Gallery - Admin',
    description: 'Manage uploaded images',
    robots: 'noindex, nofollow',
};

export default function ImagesLayout({ children }: { children: React.ReactNode }) {
    return children;
}
