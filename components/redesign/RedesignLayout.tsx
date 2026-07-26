import { inter } from '@/lib/fonts';
import Header from './Header';

const SECTION_STUBS = ['about', 'experience', 'projects', 'sandbox', 'writing', 'contact', 'footer'];

export default function RedesignLayout() {
  return (
    <div className={`${inter.variable} font-inter`}>
      <Header />
      {SECTION_STUBS.map(section => (
        <div key={section} id={section} data-redesign-section={section} />
      ))}
    </div>
  );
}
