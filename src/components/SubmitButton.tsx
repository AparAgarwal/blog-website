'use client';

import { useFormStatus } from 'react-dom';

interface SubmitButtonProps {
    /** Label when not loading (default: 'Submit') */
    label?: string;
    /** Label during loading (default: 'Submitting...') */
    loadingLabel?: string;
    /** Manual loading state override (for forms using onSubmit) */
    loading?: boolean;
    /** Additional className */
    className?: string;
    /** Full width button */
    fullWidth?: boolean;
}

export default function SubmitButton({
    label = 'Submit',
    loadingLabel = 'Submitting...',
    loading: manualLoading,
    className = '',
    fullWidth = true,
}: SubmitButtonProps) {
    const { pending } = useFormStatus();

    // Use manual loading if provided, otherwise use useFormStatus
    const isLoading = manualLoading !== undefined ? manualLoading : pending;

    return (
        <button
            type="submit"
            className={`view-all-btn submit-btn ${className}`}
            disabled={isLoading}
            style={fullWidth ? { width: '100%' } : undefined}
        >
            {isLoading ? (
                <>
                    <svg
                        className="submit-spinner"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="32" />
                    </svg>
                    {loadingLabel}
                </>
            ) : (
                label
            )}
        </button>
    );
}
