'use client';

import { signOut } from 'next-auth/react';
import { useState } from 'react';

export default function LogoutButton({ className = '' }: { className?: string }) {
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        await signOut({ callbackUrl: '/login' });
    };

    return (
        <button onClick={handleLogout} disabled={loading} className={`btn btn-danger ${className}`}>
            {loading ? 'Logging out...' : 'Logout'}
        </button>
    );
}
