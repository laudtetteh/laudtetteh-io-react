import { inter } from '@/lib/fonts';
import Header from './Header';
import AboutSection from './AboutSection';

const SECTION_STUBS = ['experience', 'projects', 'sandbox', 'writing', 'contact', 'footer'];

export default function RedesignLayout() {
  return (
    <div className={`${inter.variable} font-inter`}>
      <Header />
      <AboutSection />
      {SECTION_STUBS.map(section => (
        <div key={section} id={section} data-redesign-section={section} />
      ))}
    </div>
  );
}
