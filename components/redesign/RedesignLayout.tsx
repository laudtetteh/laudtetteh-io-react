import { inter } from '@/lib/fonts';
import type { GithubRepo } from '@/types/github';
import Header from './Header';
import AboutSection from './AboutSection';
import ExperienceSection from './ExperienceSection';
import ProjectsSection from './ProjectsSection';
import SandboxSection from './SandboxSection';
import ContactSection from './ContactSection';
import Footer from './Footer';

interface RedesignLayoutProps {
  repos: GithubRepo[];
}

export default function RedesignLayout({ repos }: RedesignLayoutProps) {
  return (
    <div className={`${inter.variable} font-inter`}>
      <Header />
      <AboutSection />
      <ExperienceSection />
      <ProjectsSection />
      <SandboxSection repos={repos} />
      <div id="writing" data-redesign-section="writing" />
      <ContactSection />
      <Footer />
    </div>
  );
}
