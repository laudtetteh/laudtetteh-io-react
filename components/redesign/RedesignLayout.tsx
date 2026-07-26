import { inter } from '@/lib/fonts';

const SECTION_STUBS = ['header', 'about', 'experience', 'projects', 'sandbox', 'writing', 'contact', 'footer'];

export default function RedesignLayout() {
  return (
    <div className={`${inter.variable} font-inter`}>
      {SECTION_STUBS.map(section => (
        <div key={section} id={section} data-redesign-section={section} />
      ))}
    </div>
  );
}
