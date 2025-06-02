import React from 'react';
import AboutSection from '../components/AboutSection';
import ProjectsSection from '../components/ProjectsSection';
import BlogSection from '../components/BlogSection';
import ContactSection from '../components/ContactSection';

const Home: React.FC = () => {
  return (
    <main className="px-4 sm:px-8 md:px-16 py-12 space-y-24">
      <AboutSection />
      <ProjectsSection />
      <BlogSection />
      <ContactSection />
    </main>
  );
};

export default Home;
