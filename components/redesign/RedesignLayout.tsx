import { inter } from '@/lib/fonts';
import Header from './Header';
import AboutSection from './AboutSection';
import ExperienceSection from './ExperienceSection';
import ProjectsSection from './ProjectsSection';
import ContactSection from './ContactSection';

export default function RedesignLayout() {
  return (
    <div className={`${inter.variable} font-inter`}>
      <Header />
      <AboutSection />
      <ExperienceSection />
      <ProjectsSection />
      <div id="sandbox" data-redesign-section="sandbox" />
      <div id="writing" data-redesign-section="writing" />
      <ContactSection />
      <div id="footer" data-redesign-section="footer" />
    </div>
  );
}
