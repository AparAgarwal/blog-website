'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { toast } from 'sonner';
import { changePassword } from '@/app/actions';
import SubmitButton from '@/components/SubmitButton';

export default function SettingsPage() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Client-side validation
        if (newPassword.length < 12) {
            toast.error('New password must be at least 12 characters long');
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        if (currentPassword === newPassword) {
            toast.error('New password must be different from current password');
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('currentPassword', currentPassword);
            formData.append('newPassword', newPassword);

            const result = await changePassword(null, formData);

            if (result.success) {
                toast.success(result.message || 'Password changed successfully. Please login again.');

                // Sign out and redirect to login
                setTimeout(async () => {
                    await signOut({ callbackUrl: '/login' });
                }, 1500);
            } else {
                toast.error(result.message || 'Failed to change password');
                setLoading(false);
            }
        } catch (_error) {
            toast.error('An error occurred while changing password');
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ paddingTop: 40, paddingBottom: 80, maxWidth: '600px' }}>
            <h1 style={{ marginBottom: 30 }}>Account Settings</h1>

            <div className="post-card visible" style={{ padding: '30px' }}>
                <h2 style={{ marginBottom: 20, fontSize: '1.25rem' }}>Change Password</h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                            Current Password
                        </label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '6px',
                                border: '1px solid var(--border-color)',
                                background: 'var(--bg-secondary)',
                                color: 'var(--text-primary)',
                                fontSize: '16px',
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            minLength={12}
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '6px',
                                border: '1px solid var(--border-color)',
                                background: 'var(--bg-secondary)',
                                color: 'var(--text-primary)',
                                fontSize: '16px',
                            }}
                        />
                        <p style={{ fontSize: '14px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                            Minimum 12 characters
                        </p>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '6px',
                                border: '1px solid var(--border-color)',
                                background: 'var(--bg-secondary)',
                                color: 'var(--text-primary)',
                                fontSize: '16px',
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                        <SubmitButton
                            label="Change Password"
                            loadingLabel="Changing..."
                            loading={loading}
                            fullWidth={false}
                        />
                        <button
                            type="button"
                            onClick={() => router.push('/admin')}
                            disabled={loading}
                            style={{
                                padding: '10px 20px',
                                borderRadius: '6px',
                                border: '1px solid var(--border-color)',
                                background: 'var(--bg-secondary)',
                                color: 'var(--text-primary)',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.6 : 1,
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </form>

                <div
                    style={{
                        marginTop: '30px',
                        paddingTop: '20px',
                        borderTop: '1px solid var(--border-color)',
                    }}
                >
                    <p style={{ fontSize: '14px', color: 'var(--text-tertiary)', marginBottom: '12px' }}>
                        <strong>Password Requirements:</strong>
                    </p>
                    <ul
                        style={{
                            fontSize: '14px',
                            color: 'var(--text-tertiary)',
                            paddingLeft: '20px',
                            lineHeight: '1.6',
                        }}
                    >
                        <li>At least 12 characters long</li>
                        <li>Different from your current password</li>
                        <li>Mix of uppercase, lowercase, numbers, and symbols (recommended)</li>
                        <li>Avoid common words or patterns</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
