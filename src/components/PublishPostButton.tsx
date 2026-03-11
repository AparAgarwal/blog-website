'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { togglePostPublishStatus } from '@/app/actions';

export default function PublishPostButton({ id }: { id: string }) {
    const [isPending, setIsPending] = useState(false);
    const router = useRouter();

    const handlePublish = async () => {
        setIsPending(true);
        try {
            const result = await togglePostPublishStatus(id, true);
            if (!result.success) {
                alert(result.message || 'Failed to publish post');
            } else {
                router.refresh();
            }
        } catch (e) {
            alert('Error publishing post');
        } finally {
            setIsPending(false);
        }
    };

    return (
        <button
            onClick={handlePublish}
            disabled={isPending}
            className="btn btn-admin-primary"
            style={{
                padding: '6px 16px',
                fontSize: '0.9rem',
            }}
        >
            {isPending ? 'Publishing...' : 'Publish'}
        </button>
    );
}
