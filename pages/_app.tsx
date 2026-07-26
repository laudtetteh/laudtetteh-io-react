import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import AdminBar from '@/components/AdminBar';
import FlashMessage from '@/components/flash/FlashMessage';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import '../public/css/plugins.css';
import '../public/css/modalboxes.css';
import '../public/css/style.css';

declare global {
  interface Window {
    arlo_tm_background_effects?: () => void;
    arlo_tm_init_all?: () => void;
  }
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
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
    const scripts: HTMLScriptElement[] = [];
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
        // Immediately trigger the streaking lines animation if available
        if (typeof window.arlo_tm_background_effects === 'function') {
          window.arlo_tm_background_effects();
        }
        // Inject animated text as a sibling to <h3>David Parker</h3> inside .content
        const contentDiv = document.querySelector('.arlo_tm_home .content');
        if (contentDiv && (window as any).jQuery) {
          // Only inject if not already present
          if (!contentDiv.querySelector('Databases.animateText')) {
            const animateTextDiv = document.createElement('div');
            animateTextDiv.className = 'animateText';
            animateTextDiv.innerHTML = `
              <span>Full-Stack Web Developer</span>
              <span>10+ Years Experience</span>
              <span>PHP | Laravel | Drupal | WordPress</span>
              <span>ReactJS | TailwindCSS | SASS | Webpack</span>
              <span>Databases | APIs</span>
              <span>Dev Ops | Git | Testing | CI/CD</span>
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

  // Re-initialize jQuery plugins/animations on every route change
  useEffect(() => {
    const handleRouteChange = () => {
      setTimeout(() => {
        if (typeof window !== 'undefined' && typeof window.arlo_tm_init_all === 'function') {
          window.arlo_tm_init_all();
        }
        // AnimateText fix for homepage
        if (window.location.pathname === '/') {
          setTimeout(() => {
            const contentDiv = document.querySelector('.arlo_tm_home .content');
            if (contentDiv && (window as any).jQuery) {
              // Remove any existing .animateText
              const old = contentDiv.querySelector('.animateText');
              if (old) old.remove();
              // Inject and initialize as on first load
              const animateTextDiv = document.createElement('div');
              animateTextDiv.className = 'animateText';
              animateTextDiv.innerHTML = `
                <span>Full-Stack Web Developer</span>
                <span>10+ Years Experience</span>
                <span>PHP | Laravel | Drupal | WordPress</span>
                <span>ReactJS | TailwindCSS | SASS | Webpack</span>
                <span>Databases | APIs</span>
                <span>Dev Ops | Git | Testing | CI/CD</span>
              `;
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
          }, 100); // Delay to ensure homepage DOM is present
        }
      }, 100); // Delay to ensure DOM is updated
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

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
