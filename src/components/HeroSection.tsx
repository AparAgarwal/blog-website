'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import BreakingText from './BreakingText';

export interface Topic {
    href: string;
    text: string;
}

export default function HeroSection({ topics }: { topics: Topic[] }) {
    const sectionRef = useRef<HTMLElement>(null);
    const [animationClass, setAnimationClass] = useState('');

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const entry = entries[0];
            if (entry.isIntersecting) {
                const timeSinceLoad = performance.now();

                if (timeSinceLoad < 1500) {
                    setAnimationClass('hero-sequence');
                } else {
                    setAnimationClass('hero-instant');
                }

                observer.disconnect();
            }
        }, { threshold: 0.1 });

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section id="hero" aria-label="Hero section" ref={sectionRef} className={animationClass}>
            <div className="hero-content">
                <h1 className="hero-title">
                    <span className="title-light">Engineering notes</span>
                    <span className="title-bold"><BreakingText text="breaking" /> and building</span>
                    <span className="title-light">things.</span>
                </h1>
                <p className="hero-subtitle">Mostly backend, systems, and things I misunderstood at first.</p>
                <p className="hero-subtitle">This is a collection of notes I write while learning backend systems. Written
                    for clarity, not completeness.</p>

                <div className="featured-topics">
                    <ul className="topics-list">
                        {topics.map((topic, index) => (
                            <li className="topic-item" key={index}>
                                <Link href={topic.href} className="contents">
                                    <span className="topic-marker">[ ]</span>
                                    <span className="topic-text">{topic.text}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}
