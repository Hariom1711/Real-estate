"use client";

import { useState, useEffect } from 'react';

interface AnimatedHeadingProps {
  text: string;
  className?: string;
  charDelay?: number;
  initialDelay?: number;
  transitionDuration?: number;
}

export default function AnimatedHeading({
  text,
  className = '',
  charDelay = 30,
  initialDelay = 200,
  transitionDuration = 500,
}: AnimatedHeadingProps) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(true);
    }, initialDelay);
    return () => clearTimeout(timer);
  }, [initialDelay]);

  const lines = text.split('\n');

  return (
    <h1 className={`font-normal tracking-tight ${className}`}>
      {lines.map((line, lineIndex) => {
        const lineLength = line.length;
        const lineChars = line.split('');

        return (
          <span key={lineIndex} className="block whitespace-nowrap">
            {lineChars.map((char, charIndex) => {
              // Formula: (lineIndex * lineLength * charDelay) + (charIndex * charDelay)
              const delay = (lineIndex * lineLength * charDelay) + (charIndex * charDelay);

              const charStyle = {
                display: 'inline-block',
                transitionProperty: 'opacity, transform',
                transitionDuration: `${transitionDuration}ms`,
                transitionDelay: `${delay}ms`,
                transitionTimingFunction: 'cubic-bezier(0.215, 0.610, 0.355, 1)',
                opacity: animate ? 1 : 0,
                transform: animate ? 'translateX(0)' : 'translateX(-18px)',
              };

              return (
                <span
                  key={charIndex}
                  style={charStyle}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              );
            })}
          </span>
        );
      })}
    </h1>
  );
}
