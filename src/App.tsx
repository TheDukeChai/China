/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useRef } from 'react';
import { Navigation } from './components/Navigation';
import { RevealLayer } from './components/RevealLayer';
import bgImage1 from '../Images/original.png';
import bgImage2 from '../Images/original1.png';

const BG_IMAGE_1 = bgImage1;
const BG_IMAGE_2 = bgImage2;
const SPOTLIGHT_R = 260;

export default function App() {
  const mouse = useRef({ x: -999, y: -999 });
  const smooth = useRef({ x: -999, y: -999 });
  const rafRef = useRef<number | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: -999, y: -999 });

  useEffect(() => {
    // Mouse listener to capture cursor position
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    // Touch listener to support tablet and mobile interaction beautifully
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        mouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        mouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });

    // Precise interpolation loop with requestAnimationFrame
    const animate = () => {
      if (mouse.current.x !== -999) {
        if (smooth.current.x === -999) {
          // Instant snap on first move to prevent slow slide-in from off-screen coords
          smooth.current.x = mouse.current.x;
          smooth.current.y = mouse.current.y;
        } else {
          // Linear interpolation (lerp) smoothing
          smooth.current.x += (mouse.current.x - smooth.current.x) * 0.1;
          smooth.current.y += (mouse.current.y - smooth.current.y) * 0.1;
        }
        setCursorPos({ x: smooth.current.x, y: smooth.current.y });
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchStart);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div 
      className="min-h-screen bg-white tracking-[-0.02em] select-none"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Premium fixed Navigation Overlay */}
      <Navigation />

      {/* Main interactive Hero Section */}
      <section 
        id="lithos-hero-section"
        className="relative w-full overflow-hidden h-screen bg-black" 
        style={{ height: '100dvh' }}
      >
        {/* Layer 1: Base Image (z-10) with Ken Burns zoom-out entrance */}
        <div 
          id="lithos-base-bg"
          className="absolute inset-0 bg-center bg-cover bg-no-repeat z-10 hero-zoom"
          style={{ backgroundImage: `url(${BG_IMAGE_1})` }}
        />

        {/* Layer 2: Custom Graphic Reveal Layer (z-30) */}
        <RevealLayer 
          image={BG_IMAGE_2}
          cursorX={cursorPos.x}
          cursorY={cursorPos.y}
        />

        {/* Layer 2.5: Left-side scrim for text legibility */}
        <div
          className="absolute inset-0 z-40 pointer-events-none hero-text-legibility"
          aria-hidden="true"
        />

        {/* Layer 3: Main Display Heading (z-50) */}
        <div 
          id="lithos-display-heading"
          className="absolute top-[18%] left-0 flex flex-col items-start text-left px-6 sm:px-10 md:px-12 pointer-events-none z-50 select-none"
        >
          <h1 className="text-white leading-[1.05]">
            <span 
              className="block font-playfair font-medium text-5xl sm:text-6xl md:text-7xl lg:text-8xl hero-anim hero-reveal hero-text-shadow"
              style={{ letterSpacing: '-0.03em', animationDelay: '0.25s' }}
            >
              Connecting
            </span>
            <span 
              className="block font-playfair font-medium text-5xl sm:text-6xl md:text-7xl lg:text-8xl hero-anim hero-reveal hero-text-shadow"
              style={{ letterSpacing: '-0.03em', animationDelay: '0.35s' }}
            >
              the Past,
            </span>
            <span 
              className="block font-playfair italic font-medium text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#f5d060] hero-anim hero-reveal hero-text-shadow-gold"
              style={{ letterSpacing: '-0.03em', animationDelay: '0.45s' }}
            >
              Shaping the Future.
            </span>
          </h1>
          <p 
            className="mt-4 sm:mt-6 text-white text-sm sm:text-base md:text-lg font-normal tracking-wide hero-anim hero-fade hero-text-shadow"
            style={{ animationDelay: '0.6s' }}
          >
            Honoring heritage. Embracing innovation.
          </p>
        </div>
      </section>
    </div>
  );
}

