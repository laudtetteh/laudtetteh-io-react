import React from 'react';

const projects = [
  {
    image: '/portfolio-1.jpg',
    title: 'Modern Web App',
    category: 'Web Development',
  },
  {
    image: '/portfolio-2.jpg',
    title: 'Brand Identity',
    category: 'Design',
  },
  {
    image: '/portfolio-3.jpg',
    title: 'Mobile App',
    category: 'Mobile',
  },
  {
    image: '/portfolio-4.jpg',
    title: 'SEO Campaign',
    category: 'SEO',
  },
];

const SectionHeading: React.FC<{ children: React.ReactNode; id?: string }> = ({ children, id }) => (
  <div className="mb-6 sm:mb-8">
    <h2 id={id} className="text-xl sm:text-2xl md:text-3xl font-extrabold uppercase tracking-widest text-center font-syne">{children}</h2>
    <div className="mx-auto mt-2 w-12 sm:w-16 h-1 bg-blue-600 rounded-full"></div>
  </div>
);

const PortfolioSection: React.FC = () => (
  <section id="portfolio" className="max-w-4xl mx-auto py-8 sm:py-12 px-2" aria-labelledby="portfolio-heading">
    <SectionHeading id="portfolio-heading">Creative Portfolio</SectionHeading>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8" aria-label="Portfolio projects">
      {projects.map((project) => (
        <div key={project.title} className="bg-white rounded-2xl shadow-xl p-3 sm:p-4 flex flex-col items-center border border-gray-100 transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl group">
          <div className="w-full h-32 sm:h-48 bg-gray-200 rounded mb-3 sm:mb-4 overflow-hidden flex items-center justify-center">
            <img src={project.image} alt={`${project.title} preview`} className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110 group-hover:shadow-lg" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold mb-1 font-syne">{project.title}</h3>
          <span className="text-xs sm:text-sm text-gray-500 font-mont">{project.category}</span>
        </div>
      ))}
    </div>
  </section>
);

export default PortfolioSection; 