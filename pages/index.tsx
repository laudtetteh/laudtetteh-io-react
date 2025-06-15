import React from 'react';
import AboutSection from '../components/AboutSection';
import ProjectsSection from '../components/ProjectsSection';
import BlogSection from '../components/BlogSection';
import ContactSection from '../components/ContactSection';
import Layout from '@/components/Layout';

const Home: React.FC = () => {
  return (
    <Layout title="Home | Laud Tetteh" description="Welcome to Laud Tetteh's personal site and blog.">
      <main className="px-4 sm:px-8 md:px-16 py-12 space-y-24">
        <AboutSection />
        <ProjectsSection />
        <BlogSection />
        <ContactSection />
      </main>
    </Layout>
  );
};

export default Home;
