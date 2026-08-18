import { useEffect, useRef, useState, type RefObject } from 'react';

const SPOTLIGHT_RADIUS_PX = 600;
const SPOTLIGHT_COLOR = 'rgba(29, 78, 216, 0.15)';

interface SpotlightPosition {
  x: number;
  y: number;
}

/**
 * Tracks the mouse position relative to the spotlight overlay element itself
 * and returns the inline `background` value for a radial-gradient "spotlight"
 * glow that follows the cursor.
 *
 * The overlay switches from `fixed` (viewport-relative box) on mobile to
 * `lg:absolute` (document-relative box, scrolls with the page) on desktop —
 * ported like-for-like from the reference design. But raw
 * `event.clientX`/`clientY` (always viewport-relative) only lines up with
 * the overlay's own coordinate space in the `fixed` case; once `absolute`
 * kicks in and the page is scrolled, the overlay's origin moves with the
 * document while `clientX`/`clientY` doesn't, so the gradient drifts away
 * from the actual cursor by the scroll offset. Verified live: at
 * `scrollY=2000`, the overlay's own `top` is `-2000px`, but a naive
 * `clientX`/`clientY`-only implementation still paints the gradient at the
 * un-adjusted viewport coordinate — a 2000px miss. (Confirmed the reference
 * site's own bundle has this same gap; not copying the bug forward.)
 *
 * Fix: measure the cursor against the overlay's own live
 * `getBoundingClientRect()` on every move. That's coordinate-space-agnostic
 * — correct whether the overlay is currently `fixed` or `absolute` — with
 * no need to track which breakpoint is active.
 *
 * Sets state directly on every `mousemove` rather than batching through
 * `requestAnimationFrame`: two numbers is a trivial `setState` payload, and
 * `rAF` is throttled or paused entirely on backgrounded/non-visible tabs in
 * Chromium, which made this effect silently stop updating in a
 * multi-worker Playwright run — a real footgun for a page whose only job
 * is to track the pointer.
 */
export function useSpotlight(): { background: string; ref: RefObject<HTMLDivElement> } {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<SpotlightPosition>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      setPosition({ x: event.clientX - rect.left, y: event.clientY - rect.top });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return {
    background: `radial-gradient(${SPOTLIGHT_RADIUS_PX}px at ${position.x}px ${position.y}px, ${SPOTLIGHT_COLOR}, transparent 80%)`,
    ref,
  };
}
