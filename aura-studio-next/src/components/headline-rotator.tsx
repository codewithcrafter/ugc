'use client';

import React, { useEffect, useState } from 'react';

interface HeadlineRotatorProps {
  phrases?: string[];
  intervalMs?: number;
}

const DEFAULT_PHRASES = [
  'Crafted for Everyday Serenity.',
  'Designed for Deeper Focus.',
  'Made for Modern Living.',
  'Sound Meets Stillness.',
];

export const HeadlineRotator: React.FC<HeadlineRotatorProps> = ({
  phrases = DEFAULT_PHRASES,
  intervalMs = 3500,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % phrases.length);
        setIsTransitioning(false);
      }, 350);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [phrases.length, intervalMs]);

  return (
    <span
      className="inline-block relative min-h-[1.25em] font-serif italic text-[#7545F5]"
      aria-live="polite"
    >
      <span
        className={`inline-block transition-all duration-350 ease-out transform ${
          isTransitioning
            ? 'opacity-0 -translate-y-2 scale-95 blur-xs'
            : 'opacity-100 translate-y-0 scale-100 blur-none'
        }`}
      >
        {phrases[currentIndex]}
      </span>
    </span>
  );
};
