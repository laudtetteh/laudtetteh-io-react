import React, { useState } from 'react';
import Link from 'next/link';
import BlogMobileMenu from './BlogMobileMenu';

const BlogHeader: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full bg-black text-white shadow-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6">
        {/* Centered Brand/Logo */}
        <div className="flex-1 flex justify-center">
          <Link href="/" className="text-2xl font-bold tracking-wide uppercase letter-spacing-2">
            Laud Tetteh
          </Link>
        </div>
        {/* Hamburger on right */}
        <button
          className="ml-auto flex items-center justify-center w-10 h-10 rounded hover:bg-white/10 transition"
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
        >
          <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-black/70">
          <BlogMobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
        </div>
      )}
    </header>
  );
};

export default BlogHeader; 