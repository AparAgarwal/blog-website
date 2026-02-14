'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SubmitButton from '@/components/SubmitButton';
import PasswordInput from '@/components/PasswordInput';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                // Display the actual error message from backend
                setError(res.error);
                setIsLoading(false);
                return;
            }

            if (res?.ok) {
                // Success - redirect to admin
                router.push('/admin');
                router.refresh();
            } else {
                setError('An unexpected error occurred');
                setIsLoading(false);
            }
        } catch (_error) {
            setError('Something went wrong. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <div
            className="container"
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}
        >
            <div className="post-card visible" style={{ width: '100%', maxWidth: '400px' }}>
                <h1 style={{ marginBottom: '20px', textAlign: 'center' }}>Admin Login</h1>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '4px',
                                border: '1px solid var(--border-color)',
                                background: 'var(--bg-secondary)',
                                color: 'var(--text-primary)',
                                opacity: isLoading ? 0.6 : 1,
                            }}
                        />
                    </div>
                    <PasswordInput
                        label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '4px',
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-secondary)',
                            color: 'var(--text-primary)',
                            opacity: isLoading ? 0.6 : 1,
                        }}
                    />
                    {error && (
                        <div
                            style={{
                                padding: '12px',
                                borderRadius: '4px',
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                color: '#ef4444',
                                fontSize: '14px',
                            }}
                        >
                            {error}
                        </div>
                    )}
                    <SubmitButton label="Sign In" loadingLabel="Verifying..." loading={isLoading} />
                </form>
            </div>
        </div>
    );
}
