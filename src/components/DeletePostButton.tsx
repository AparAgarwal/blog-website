'use client';

import { deletePost } from '@/app/actions';
import { toast } from 'sonner';

export default function DeletePostButton({ id }: { id: string }) {
    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this post? This cannot be undone.')) {
            return;
        }

        const result = await deletePost(id);
        if (result?.success) {
            toast.success(result.message);
        } else {
            toast.error(result?.message || 'Failed to delete post');
        }
    };

    return (
        <button
            onClick={handleDelete}
            type="button"
            style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', fontFamily: 'inherit' }}
            aria-label="Delete post"
        >
            Delete
        </button>
    );
}
