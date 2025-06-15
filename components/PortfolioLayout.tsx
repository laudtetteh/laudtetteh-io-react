import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Loader from './Loader';
import HomeSection from './sections/HomeSection';
import AboutSection from './AboutSection';
import ServicesSection from './sections/ServicesSection';
import PortfolioSection from './sections/PortfolioSection';
import BlogSection from './sections/BlogSection';
import ContactSection from './sections/ContactSection';
import BackgroundLines from './BackgroundLines';

const sectionKeys = ['Home', 'About', 'Services', 'Portfolio', 'Blog', 'Contact'] as const;
type SectionKey = typeof sectionKeys[number];

const sections: Record<SectionKey, React.FC> = {
  Home: HomeSection,
  About: AboutSection,
  Services: ServicesSection,
  Portfolio: PortfolioSection,
  Blog: BlogSection,
  Contact: ContactSection,
};

const socialLinks = [
  { label: 'LinkedIn', url: 'https://linkedin.com', iconClass: 'fab fa-linkedin text-xl' },
  { label: 'GitHub', url: 'https://github.com', iconClass: 'fab fa-github text-xl' },
  { label: 'Twitter', url: 'https://twitter.com', iconClass: 'fab fa-twitter text-xl' },
];

const PortfolioLayout: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SectionKey>('Home');
  const [loading, setLoading] = useState(true);
  const SectionComponent = sections[activeSection];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="relative min-h-screen bg-white">
      <a
        href="#main-content"
        className="absolute left-2 top-2 z-50 px-4 py-2 bg-blue-700 text-white rounded focus:left-2 focus:top-2 focus:z-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transform -translate-y-16 focus:translate-y-0 transition-all duration-200 sr-only focus:not-sr-only"
        tabIndex={0}
      >
        Skip to Content
      </a>
      <BackgroundLines />
      <div className="relative z-10 flex min-h-screen">
        <Sidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          name="Laud Tetteh"
          avatarUrl="/avatar-placeholder.png"
          socialLinks={socialLinks}
        />
        <main id="main-content" className="flex-1 flex items-center justify-center" tabIndex={-1}>
          <SectionComponent />
        </main>
      </div>
    </div>
  );
};

export default PortfolioLayout; 