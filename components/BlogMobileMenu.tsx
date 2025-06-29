import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface BlogMobileMenuProps {
  open?: boolean;
  onClose?: () => void;
}

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/#about' },
  { label: 'Sandbox', href: '/#sandbox' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/#contact' },
];

const BlogMobileMenu: React.FC<BlogMobileMenuProps> = ({ open, onClose }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

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
      {/* Close button at top right */}
      <button
        onClick={onClose}
        aria-label="Close menu"
        style={{
          position: 'absolute',
          top: 18,
          right: 18,
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
            {navLinks.map((link) => (
              <li key={link.href} className={link.label === 'Blog' ? 'active' : ''} style={{ marginBottom: 12 }}>
                <Link href={link.href} className="" style={{
                  color: link.label === 'Blog' ? '#000' : '#868a9b',
                  fontWeight: link.label === 'Blog' ? 700 : 400,
                  fontSize: 20,
                  padding: '2px 0',
                  display: 'inline-block',
                  transition: 'all .3s',
                  textDecoration: 'none',
                }}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="copyright" style={{ width: '100%', marginBottom: 20 }}>
          <p style={{ color: '#868a9b', fontSize: 15 }}>Copyright &copy; {new Date().getFullYear()} by <a className="line_effect" href="#" style={{ color: '#000', textDecoration: 'none' }}>Laud Tetteh</a></p>
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

export default BlogMobileMenu; 