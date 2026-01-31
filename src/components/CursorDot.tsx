'use client';

import { useEffect, useRef } from 'react';

export default function CursorDot() {
    const cursorDotRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const cursorDot = cursorDotRef.current;
        if (!cursorDot) return;

        let cursorX = 0, cursorY = 0;
        let dotX = 0, dotY = 0;
        const speed = 0.15; // smooth factor

        const onMouseMove = (e: MouseEvent) => {
            cursorX = e.clientX;
            cursorY = e.clientY;
        };

        const animateCursor = () => {
            dotX += (cursorX - dotX) * speed;
            dotY += (cursorY - dotY) * speed;

            if (cursorDot) {
                cursorDot.style.left = `${dotX}px`;
                cursorDot.style.top = `${dotY}px`;
            }

            requestAnimationFrame(animateCursor);
        };

        window.addEventListener('mousemove', onMouseMove);
        const animationId = requestAnimationFrame(animateCursor);

        // Interaction logic
        const interactiveElements = document.querySelectorAll("a, button, input, textarea");

        const onMouseEnter = () => cursorDot.classList.add("hidden");
        const onMouseLeave = () => cursorDot.classList.remove("hidden");

        interactiveElements.forEach(el => {
            el.addEventListener("mouseenter", onMouseEnter);
            el.addEventListener("mouseleave", onMouseLeave);
        });

        // Handle dynamic elements if needed, or stick to static for now. 
        // For efficiency in React, we might rely largely on CSS :hover states, 
        // but the goal is to Hide the Dot on interactive elements.

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            cancelAnimationFrame(animationId);
            interactiveElements.forEach(el => {
                el.removeEventListener("mouseenter", onMouseEnter);
                el.removeEventListener("mouseleave", onMouseLeave);
            });
        };
    }, []);

    return <div ref={cursorDotRef} className="cursor-dot" data-cursor-dot></div>;
}
