import { useEffect, useState } from 'react';

const SPOTLIGHT_RADIUS_PX = 600;
const SPOTLIGHT_COLOR = 'rgba(29, 78, 216, 0.15)';

interface SpotlightPosition {
  x: number;
  y: number;
}

/**
 * Tracks the raw viewport-relative mouse position and returns the inline
 * `background` value for a radial-gradient "spotlight" glow that follows the
 * cursor, ported like-for-like from the reference design (verified live
 * against `https://brittanychiang.com`: on `mousemove` the wrapper's inline
 * `style` updates to `radial-gradient(600px at ${x}px ${y}px, rgba(29, 78,
 * 216, 0.15), transparent 80%)`).
 *
 * Sets state directly on every `mousemove` rather than batching through
 * `requestAnimationFrame`: two numbers is a trivial `setState` payload, and
 * `rAF` is throttled or paused entirely on backgrounded/non-visible tabs in
 * Chromium, which made this effect silently stop updating in a
 * multi-worker Playwright run — a real footgun for a page whose only job
 * is to track the pointer.
 */
export function useSpotlight(): string {
  const [position, setPosition] = useState<SpotlightPosition>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return `radial-gradient(${SPOTLIGHT_RADIUS_PX}px at ${position.x}px ${position.y}px, ${SPOTLIGHT_COLOR}, transparent 80%)`;
}
