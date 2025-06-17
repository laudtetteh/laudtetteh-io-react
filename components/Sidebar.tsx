import React, { useState } from 'react';

const sectionKeys = ['Home', 'About', 'Services', 'Portfolio', 'Blog', 'Contact'] as const;
type SectionKey = typeof sectionKeys[number];

type SocialLink = { label: string; url: string; iconClass: string };

interface SidebarProps {
  activeSection: SectionKey;
  onSectionChange: (section: SectionKey) => void;
  name?: string;
  avatarUrl?: string;
  socialLinks?: SocialLink[];
}

const defaultSocialLinks: SocialLink[] = [
  { label: 'LinkedIn', url: '#', iconClass: 'fab fa-linkedin text-xl' },
  { label: 'GitHub', url: '#', iconClass: 'fab fa-github text-xl' },
  { label: 'Twitter', url: '#', iconClass: 'fab fa-twitter text-xl' },
];

const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSectionChange,
  name = 'Your Name',
  avatarUrl = '/avatar-placeholder.png',
  socialLinks = defaultSocialLinks,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex bg-white w-72 min-h-screen flex-col items-center py-12 border-r border-gray-200 shadow-md" role="complementary" aria-label="Sidebar">
        <div className="mb-10">
          <img src={avatarUrl} alt={`${name} avatar`} className="w-28 h-28 rounded-full mx-auto shadow-lg" />
          <h2 className="mt-6 text-2xl font-extrabold text-center tracking-wide uppercase font-syne">{name}</h2>
        </div>
        <nav className="flex-1 w-full" aria-label="Main navigation">
          <ul className="space-y-4">
            {sectionKeys.map((section) => (
              <li key={section}>
                <button
                  className={`block w-full text-left px-6 py-3 rounded transition-colors tracking-widest uppercase font-semibold text-base font-syne focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${activeSection === section ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-700'}`}
                  onClick={() => onSectionChange(section)}
                  aria-current={activeSection === section ? 'page' : undefined}
                >
                  {section}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-10 flex space-x-5 font-mont">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.url}
              aria-label={link.label}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform duration-200 hover:scale-125 hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <i className={link.iconClass}></i>
            </a>
          ))}
        </div>
        <div className="mt-10 text-xs text-gray-400 text-center tracking-wide font-mont">&copy; {new Date().getFullYear()} {name}</div>
      </aside>
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between w-full px-4 py-3 bg-white border-b border-gray-200 shadow-sm fixed top-0 left-0 z-30">
        <div className="flex items-center space-x-3">
          <img src={avatarUrl} alt={`${name} avatar`} className="w-10 h-10 rounded-full shadow" />
          <span className="font-syne font-extrabold text-lg uppercase tracking-wide">{name}</span>
        </div>
        <button
          className="focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Open navigation menu"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      {/* Mobile Drawer */}
      <div className={`fixed inset-0 z-40 bg-black bg-opacity-40 flex md:hidden${mobileOpen ? '' : ' hidden'}`}>
        <aside className="bg-white w-64 min-h-full flex flex-col items-center py-10 border-r border-gray-200 shadow-lg relative" role="complementary" aria-label="Sidebar">
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation menu"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="mb-8">
            <img src={avatarUrl} alt={`${name} avatar`} className="w-20 h-20 rounded-full mx-auto shadow-lg" />
            <h2 className="mt-4 text-xl font-extrabold text-center tracking-wide uppercase font-syne">{name}</h2>
          </div>
          <nav className="flex-1 w-full" aria-label="Main navigation">
            <ul className="space-y-4">
              {sectionKeys.map((section) => (
                <li key={section}>
                  <button
                    className={`block w-full text-left px-6 py-3 rounded transition-colors tracking-widest uppercase font-semibold text-base font-syne focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${activeSection === section ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-700'}`}
                    onClick={() => {
                      setMobileOpen(false);
                      onSectionChange(section);
                    }}
                    aria-current={activeSection === section ? 'page' : undefined}
                  >
                    {section}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-8 flex space-x-5 font-mont">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.url}
                aria-label={link.label}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform duration-200 hover:scale-125 hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <i className={link.iconClass}></i>
              </a>
            ))}
          </div>
          <div className="mt-8 text-xs text-gray-400 text-center tracking-wide font-mont">&copy; {new Date().getFullYear()} {name}</div>
        </aside>
      </div>
    </>
  );
};

export default Sidebar; 