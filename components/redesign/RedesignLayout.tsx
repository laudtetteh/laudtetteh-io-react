import { inter } from '@/lib/fonts';
import Header from './Header';
import AboutSection from './AboutSection';
import ExperienceSection from './ExperienceSection';
import ProjectsSection from './ProjectsSection';

const SECTION_STUBS = ['sandbox', 'writing', 'contact', 'footer'];

export default function RedesignLayout() {
  return (
    <div className={`${inter.variable} font-inter`}>
      <Header />
      <AboutSection />
      <ExperienceSection />
      <ProjectsSection />
      {SECTION_STUBS.map(section => (
        <div key={section} id={section} data-redesign-section={section} />
      ))}
    </div>
  );
}
