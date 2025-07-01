import React, { useState } from 'react';
import Link from 'next/link';
import BlogMenu from './BlogMenu';

interface BlogHeaderProps {
  adminBarOffset?: boolean;
}

const BlogHeader: React.FC<BlogHeaderProps> = ({ adminBarOffset = false }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={`fixed top-0 left-0 w-full md:block hidden text-white shadow-md z-30 ${adminBarOffset ? 'mt-[36px]' : ''}`} style={{ background: '#999999' }}>
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6">
        {/* Centered Brand/Logo */}
        <div className="flex-1 flex justify-left">
          <Link href="/" className="text-2xl font-bold tracking-wide uppercase letter-spacing-2">
            Laud Tetteh
          </Link>
        </div>
        {/* Hamburger on right */}
        <button
          className="ml-auto flex items-center justify-center rounded hover:bg-white/10 transition"
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
          style={{ width: 24, height: 24 }}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: 24, height: 24 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-black/70">
          <BlogMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
        </div>
      )}
    </header>
  );
};

export default BlogHeader; 