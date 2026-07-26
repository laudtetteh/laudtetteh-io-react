import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface BlogMenuProps {
  open?: boolean;
  onClose?: () => void;
}

const BlogMenu: React.FC<BlogMenuProps> = ({ open, onClose }) => {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  
  useEffect(() => { setMounted(true); }, []);

  const handleNavClick = (sectionId: string) => {
    // Close menu first
    if (onClose) onClose();
    
    if (router.pathname === '/') {
      // Already on homepage, use legacy transition system
      setTimeout(() => {
        const link = document.querySelector(`.transition_link a[href="#${sectionId}"]`);
        if (link) {
          (link as HTMLElement).click();
        } else {
          // Fallback to direct scroll
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
        // Update URL with hash
        router.replace(`/#${sectionId}`, undefined, { shallow: true });
      }, 100);
    } else {
      // Navigate to homepage first, then trigger transition
      router.push(`/#${sectionId}`).then(() => {
        setTimeout(() => {
          const link = document.querySelector(`.transition_link a[href="#${sectionId}"]`);
          if (link) {
            (link as HTMLElement).click();
          }
        }, 300); // Longer delay after navigation
      });
    }
  };

  const handleBlogClick = () => {
    // Close menu first
    if (onClose) onClose();
    
    // Delay navigation slightly to allow menu to close
    setTimeout(() => {
      router.push('/blog');
    }, 100);
  };

  const handleHomeClick = () => {
    if (onClose) onClose();
    
    setTimeout(() => {
      if (router.pathname === '/') {
        // Already on homepage, trigger home transition
        const link = document.querySelector(`.transition_link a[href="#home"]`);
        if (link) {
          (link as HTMLElement).click();
        }
        // Update URL with hash
        router.replace('/#home', undefined, { shallow: true });
      } else {
        // Navigate to homepage
        router.push('/#home');
      }
    }, 100);
  };

  if (!mounted) return null;
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: open ? 0 : '-100vw',
        width: '90vw',
        maxWidth: 400,
        height: '100vh',
        zIndex: 50,
        background: '#fff',
        boxShadow: '0 0 40px rgba(0,0,0,0.15)',
        transition: 'right 0.3s',
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
      }}
    >
      {/* Close button at top left */}
      <button
        onClick={onClose}
        aria-label="Close menu"
        style={{
          position: 'absolute',
          top: 18,
          left: 18,
          zIndex: 51,
          background: 'none',
          border: 'none',
          fontSize: 32,
          color: '#868a9b',
          cursor: 'pointer',
          fontWeight: 700,
          lineHeight: 1,
        }}
        onMouseOver={e => (e.currentTarget.style.color = '#000')}
        onMouseOut={e => (e.currentTarget.style.color = '#868a9b')}
      >
        &#10005;
      </button>
      <div className="sidebar_inner" style={{ padding: '50px 30px', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="transition_link" style={{ marginBottom: 50, marginTop: 25 }}>
          <Link href="/" className="logo_link">
            <div className="logo" data-type="avatar">
              <div
                className="avatar"
                style={{ width: 120, height: 120, borderRadius: '50%', backgroundImage: 'url(/img/about/1.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', margin: '0 auto' }}
              ></div>
              <div className="image" style={{ display: 'none' }}><img src="/img/logo/logo-1.png" alt="logo" /></div>
              <div className="text" style={{ display: 'none' }}><h3>LAUD TETTEH</h3></div>
            </div>
          </Link>
        </div>
        <div className="menu" style={{ marginBottom: 50 }}>
          <ul className="transition_link">
            <li className={router.pathname === '/' ? 'active' : ''} style={{ marginBottom: 12 }}>
              <a href="#home" onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); handleHomeClick(); }} style={{
                color: router.pathname === '/' ? '#000' : '#868a9b',
                fontWeight: router.pathname === '/' ? 700 : 400,
                fontSize: 20,
                padding: '2px 0',
                display: 'inline-block',
                transition: 'all .3s',
                textDecoration: 'none',
                cursor: 'pointer',
              }}>
                Home
              </a>
            </li>
            <li style={{ marginBottom: 12 }}>
              <a href="#about" onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); handleNavClick('about'); }} style={{
                color: '#868a9b',
                fontWeight: 400,
                fontSize: 20,
                padding: '2px 0',
                display: 'inline-block',
                transition: 'all .3s',
                textDecoration: 'none',
                cursor: 'pointer',
              }}>
                About
              </a>
            </li>
            <li style={{ marginBottom: 12 }}>
              <a href="#sandbox" onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); handleNavClick('sandbox'); }} style={{
                color: '#868a9b',
                fontWeight: 400,
                fontSize: 20,
                padding: '2px 0',
                display: 'inline-block',
                transition: 'all .3s',
                textDecoration: 'none',
                cursor: 'pointer',
              }}>
                Sandbox
              </a>
            </li>
            <li className={router.pathname.startsWith('/blog') ? 'active' : ''} style={{ marginBottom: 12 }}>
              <a href="#blog" onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); handleBlogClick(); }} style={{
                color: router.pathname.startsWith('/blog') ? '#000' : '#868a9b',
                fontWeight: router.pathname.startsWith('/blog') ? 700 : 400,
                fontSize: 20,
                padding: '2px 0',
                display: 'inline-block',
                transition: 'all .3s',
                textDecoration: 'none',
                cursor: 'pointer',
              }}>
                Blog
              </a>
            </li>
            <li style={{ marginBottom: 12 }}>
              <a href="#contact" onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); handleNavClick('contact'); }} style={{
                color: '#868a9b',
                fontWeight: 400,
                fontSize: 20,
                padding: '2px 0',
                display: 'inline-block',
                transition: 'all .3s',
                textDecoration: 'none',
                cursor: 'pointer',
              }}>
                Contact
              </a>
            </li>
          </ul>
        </div>
        <div className="copyright transition_link" style={{ width: '100%', marginBottom: 20 }}>
          <p style={{ color: '#868a9b', fontSize: 15 }}>Copyright &copy; {new Date().getFullYear()} by <a className="line_effect" href="#home" style={{ color: '#000', textDecoration: 'none' }}>Laud Tetteh</a></p>
          <p style={{ color: '#868a9b', fontSize: 15 }}>All rights are reserved</p>
        </div>
        <div className="social" style={{ width: '100%' }}>
          <ul style={{ display: 'inline-block', margin: 0, padding: 0 }}>
            <li style={{ display: 'inline-block', marginRight: 8 }}><a href="https://github.com/laudtetteh" target="_blank" rel="noopener noreferrer" style={{ color: '#868a9b', fontSize: 19, transition: 'all .3s' }}><i className="icon-github-squared"></i></a></li>
            <li style={{ display: 'inline-block', marginRight: 0 }}><a href="https://www.linkedin.com/in/laudtetteh" target="_blank" rel="noopener noreferrer" style={{ color: '#868a9b', fontSize: 19, transition: 'all .3s' }}><i className="icon-linkedin-squared"></i></a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BlogMenu; 