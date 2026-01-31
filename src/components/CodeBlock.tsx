'use client';

import React, { useRef, useState } from 'react';

const CodeBlock = ({ children, ...props }: React.DetailedHTMLProps<React.HTMLAttributes<HTMLPreElement>, HTMLPreElement>) => {
    const preRef = useRef<HTMLPreElement>(null);
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = async () => {
        if (!preRef.current) return;

        // Extract text content
        const text = preRef.current.innerText;

        try {
            await navigator.clipboard.writeText(text);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (_err) {
            // Silently fail - copy functionality not critical
        }
    };

    return (
        <div className="code-block-wrapper group">
            <div className="copy-button-container">
                <button
                    onClick={handleCopy}
                    className="copy-button"
                    aria-label="Copy code"
                    title="Copy code"
                >
                    {isCopied ? (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#4ade80' }}>
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            <span style={{ color: '#4ade80' }}>Copied!</span>
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                            <span>Copy</span>
                        </>
                    )}
                </button>
            </div>

            <pre
                ref={preRef}
                {...props}
                className={`code-block-pre ${props.className || ''}`}
            >
                {children}
            </pre>
        </div>
    );
};

export default CodeBlock;
