'use client';

import { useEffect, useRef } from 'react';

interface PostContentProps {
    html: string;
}

/**
 * Client component that renders pre-compiled HTML and injects interactive
 * copy-to-clipboard buttons on all <pre> code blocks.
 *
 * This replaces the server-side MDXRemote + CodeBlock component pattern
 * with a more efficient approach: the HTML is pre-compiled at write-time
 * and only the interactive copy buttons are added client-side.
 */
export default function PostContent({ html }: PostContentProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const preElements = containerRef.current.querySelectorAll('pre');

        preElements.forEach((pre) => {
            // Skip if already wrapped
            if (pre.parentElement?.classList.contains('code-block-wrapper')) return;

            // Create wrapper
            const wrapper = document.createElement('div');
            wrapper.className = 'code-block-wrapper group';

            // Create copy button container
            const btnContainer = document.createElement('div');
            btnContainer.className = 'copy-button-container';

            const btn = document.createElement('button');
            btn.className = 'copy-button';
            btn.setAttribute('aria-label', 'Copy code');
            btn.title = 'Copy code';
            btn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                     fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                <span>Copy</span>
            `;

            btn.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(pre.innerText);
                    btn.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                             fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                             class="copy-success-icon">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span class="copy-success-text">Copied!</span>
                    `;
                    setTimeout(() => {
                        btn.innerHTML = `
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                 fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                            <span>Copy</span>
                        `;
                    }, 2000);
                } catch {
                    // Copy not critical — fail silently
                }
            });

            btnContainer.appendChild(btn);

            // Add code-block-pre class to match existing styles
            pre.classList.add('code-block-pre');

            // Wrap the <pre> element
            pre.parentNode?.insertBefore(wrapper, pre);
            wrapper.appendChild(btnContainer);
            wrapper.appendChild(pre);
        });
    }, [html]);

    return (
        <div
            ref={containerRef}
            className="post-content"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
