'use client';

import React, { useEffect, useRef, useState } from 'react';
import BreakingText from './BreakingText';

export default function HeroSection({ children }: { children?: React.ReactNode }) {
    const sectionRef = useRef<HTMLElement>(null);
    const [animationClass, setAnimationClass] = useState('');

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
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
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section id="hero" aria-labelledby="hero-heading" ref={sectionRef} className={animationClass}>
            <div className="hero-content">
                <h1 id="hero-heading" className="hero-title">
                    <span className="title-light">Engineering notes </span>
                    <span className="title-bold">
                        <BreakingText text="breaking" /> and building
                    </span>
                    <span className="title-light"> things.</span>
                </h1>
                <p className="hero-subtitle">Mostly backend, systems, and things I misunderstood at first.</p>
                <p className="hero-subtitle">
                    This is a collection of notes I write while learning backend systems. Written for clarity, not
                    completeness.
                </p>

                {children}
            </div>
        </section>
    );
}
