import { useEffect, useState } from 'react';

/**
 * Cycles through a list of strings on a fixed interval, returning the string
 * currently on display plus a `visible` flag consumers can use to drive a
 * CSS fade transition (fade out, swap text, fade in) without any animation
 * library.
 *
 * Uses plain `useState`/`useEffect` + `setInterval`, cleaned up on unmount.
 * Starts from the first string so the pre-hydration/server-rendered markup
 * always shows `strings[0]`; rotation is a client-only enhancement layered
 * on top.
 */
export function useRotatingText(strings: string[], intervalMs: number): { text: string; visible: boolean } {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (strings.length <= 1) {
      return;
    }

    let fadeOutTimeout: ReturnType<typeof setTimeout>;

    const intervalId = setInterval(() => {
      setVisible(false);

      // Swap the text once the fade-out transition has had time to finish,
      // then fade the new string back in.
      fadeOutTimeout = setTimeout(() => {
        setIndex(prevIndex => (prevIndex + 1) % strings.length);
        setVisible(true);
      }, 200);
    }, intervalMs);

    return () => {
      clearInterval(intervalId);
      clearTimeout(fadeOutTimeout);
    };
  }, [strings, intervalMs]);

  return { text: strings[index], visible };
}
