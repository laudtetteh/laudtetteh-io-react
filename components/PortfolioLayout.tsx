import React, { useState, useEffect } from 'react';
import Loader from './Loader';
import BackgroundLines from './BackgroundLines';
import MobileMenu from './MobileMenu';
import SidebarMenu from './SidebarMenu';
import HomeSection from './sections/HomeSection';
import AboutSection from '../components/AboutSection';
import ServicesSection from './sections/ServicesSection';
import PortfolioSection from './sections/PortfolioSection';
import BlogSection from './sections/BlogSection';
import ContactSection from './sections/ContactSection';

const PortfolioLayout: React.FC = () => {
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
        <MobileMenu />
        <SidebarMenu />
        <div className="arlo_tm_mainpart">
          <div className="mainpart_inner">
            <HomeSection />
            <AboutSection />
            <ServicesSection />
            <PortfolioSection />
            <BlogSection />
            <ContactSection />
          </div>
        </div>
      </div>
    </>
  );
};

export default PortfolioLayout; 