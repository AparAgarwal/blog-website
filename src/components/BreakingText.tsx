import React from 'react';

interface BreakingTextProps {
    text: string;
    className?: string;
}

const BreakingText: React.FC<BreakingTextProps> = ({ text, className = '' }) => {
    return (
        <span className={`breaking-text ${className}`} aria-label={text}>
            {/* Base text for accessibility/SEO, hidden visually or used as placement */}
            <span className="breaking-base" aria-hidden="true">
                {text}
            </span>

            {/* Shards */}
            <span className="shard shard-1" aria-hidden="true">
                {text}
            </span>
            <span className="shard shard-2" aria-hidden="true">
                {text}
            </span>
            <span className="shard shard-3" aria-hidden="true">
                {text}
            </span>
            <span className="shard shard-4" aria-hidden="true">
                {text}
            </span>
            <span className="shard shard-5" aria-hidden="true">
                {text}
            </span>
            <span className="shard shard-6" aria-hidden="true">
                {text}
            </span>
        </span>
    );
};

export default BreakingText;
