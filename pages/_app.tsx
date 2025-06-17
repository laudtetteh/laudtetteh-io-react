import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import AdminBar from '@/components/AdminBar';
import FlashMessage from '@/components/flash/FlashMessage';
import { useEffect } from 'react';
import '../public/css/plugins.css';
import '../public/css/modalboxes.css';
import '../public/css/style.css';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Prevent double script loading (Strict Mode, Fast Refresh, etc)
    if ((window as any).__arloScriptsLoaded) return;
    (window as any).__arloScriptsLoaded = true;
    // Sequentially load JS files: jquery.js -> plugins.js -> init.js
    const loadScript = (src: string) => {
      return new Promise<HTMLScriptElement>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = false;
        script.onload = () => resolve(script);
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };
    let scripts: HTMLScriptElement[] = [];
    loadScript('/js/jquery.js')
      .then(script => {
        scripts.push(script);
        return loadScript('/js/plugins.js');
      })
      .then(script => {
        scripts.push(script);
        return loadScript('/js/init.js');
      })
      .then(script => {
        scripts.push(script);
        // Inject animated text as a sibling to <h3>David Parker</h3> inside .content
        const contentDiv = document.querySelector('.arlo_tm_home .content');
        if (contentDiv && (window as any).jQuery) {
          // Only inject if not already present
          if (!contentDiv.querySelector('.animateText')) {
            const animateTextDiv = document.createElement('div');
            animateTextDiv.className = 'animateText';
            animateTextDiv.innerHTML = `
              <span>Web Developer</span>
              <span>UI/UX Designer</span>
              <span>SEO Optimizer</span>
            `;
            // Insert after the h3
            const h3 = contentDiv.querySelector('h3');
            if (h3 && h3.nextSibling) {
              contentDiv.insertBefore(animateTextDiv, h3.nextSibling);
            } else {
              contentDiv.appendChild(animateTextDiv);
            }
            // Initialize plugin
            const $ = (window as any).jQuery;
            const $el = $(animateTextDiv);
            if ($el.length && $.fn.textition) {
              $el.textition({
                speed: 1.2,
                animation: 'ease-out',
                map: { x: 200, y: 100, z: 0 },
                autoplay: true,
                interval: 4,
              });
            }
          }
        }
      })
      .catch(() => {/* handle error if needed */});
    return () => {
      scripts.forEach(script => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
    };
  }, []);
  return (
    <>
      {/* This div is outside the React root and will be controlled by the textition plugin */}
      <div id="animateTextRoot"></div>
      <FlashMessage />
      <AdminBar />
      <Component {...pageProps} />
    </>
  );
}
