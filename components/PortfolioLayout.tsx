import React, { useState, useEffect } from 'react';
import Loader from './Loader';
import BackgroundLines from './BackgroundLines';
import SidebarMenu from './SidebarMenu';
import HomeSection from './sections/HomeSection';
import AboutSection from '../components/AboutSection';
import SandboxSection from './sections/SandboxSection';
import BlogSection from './sections/BlogSection';
import ContactSection from './sections/ContactSection';
import { GithubRepo } from '../types/github';

interface PortfolioLayoutProps {
  repos: GithubRepo[];
}

const PortfolioLayout: React.FC<PortfolioLayoutProps> = ({ repos }) => {
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {loading && <Loader />}
      <div className="arlo_tm_all_wrap" data-enter="rollIn" data-exit="rollOut">
        <BackgroundLines />
        <SidebarMenu />
        <div className="arlo_tm_mainpart">
          <div className="mainpart_inner">
            <HomeSection />
            <AboutSection />
            <SandboxSection repos={repos} />
            <BlogSection />
            <ContactSection />
          </div>
        </div>
      </div>
    </>
  );
};

export default PortfolioLayout; 