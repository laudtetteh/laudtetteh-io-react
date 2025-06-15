import React from 'react';

const services = [
  {
    icon: 'fas fa-paint-brush',
    title: 'Creative Design',
    description: 'UI/UX, branding, and visual design for web and mobile.'
  },
  {
    icon: 'fas fa-code',
    title: 'Web Development',
    description: 'Modern, performant websites and web apps with React, Next.js, and more.'
  },
  {
    icon: 'fas fa-mobile-alt',
    title: 'Mobile Apps',
    description: 'Cross-platform mobile app development.'
  },
  {
    icon: 'fas fa-search',
    title: 'SEO Optimization',
    description: 'Improve your site ranking and visibility.'
  },
];

const SectionHeading: React.FC<{ children: React.ReactNode; id?: string }> = ({ children, id }) => (
  <div className="mb-6 sm:mb-8">
    <h2 id={id} className="text-xl sm:text-2xl md:text-3xl font-extrabold uppercase tracking-widest text-center font-syne">{children}</h2>
    <div className="mx-auto mt-2 w-12 sm:w-16 h-1 bg-blue-600 rounded-full"></div>
  </div>
);

const ServicesSection: React.FC = () => (
  <section id="services" className="max-w-4xl mx-auto py-8 sm:py-12 px-2" aria-labelledby="services-heading">
    <SectionHeading id="services-heading">Top Notch Services</SectionHeading>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8" aria-label="Service cards">
      {services.map((service) => (
        <div key={service.title} className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 flex flex-col items-center text-center border border-gray-100 transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl group">
          <i className={`${service.icon} text-3xl sm:text-4xl mb-3 sm:mb-4 transition-transform duration-200 group-hover:scale-125 group-hover:text-blue-600 text-blue-600`} aria-hidden="true" title={service.title}></i>
          <h3 className="text-base sm:text-xl font-semibold mb-2 font-syne">{service.title}</h3>
          <p className="text-gray-600 font-mont text-sm sm:text-base">{service.description}</p>
        </div>
      ))}
    </div>
  </section>
);

export default ServicesSection; 