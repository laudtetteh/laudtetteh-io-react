import React from 'react';

import AboutSection from '../components/AboutSection';
import ProjectsSection from '../components/ProjectsSection';
import BlogSection from '../components/BlogSection';
import ContactSection from '../components/ContactSection';

const Home: React.FC = () => {
  return (
    <main className="space-y-24 px-4 py-12 sm:px-8 md:px-16">
      <AboutSection />
      <ProjectsSection />
      <BlogSection />
      <ContactSection />
    </main>
  );
};

export default Home;
