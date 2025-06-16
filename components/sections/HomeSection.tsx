import React, { useEffect, useState } from 'react';

const roles = [
  'Web Developer',
  'UI/UX Designer',
  'SEO Optimizer',
];

const AnimatedText: React.FC = () => {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % roles.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="h-8 mt-2 text-base sm:text-lg font-medium text-blue-600 transition-all duration-500 ease-in-out" aria-live="polite">
      <span key={roles[index]} className="inline-block animate-fade-in">
        {roles[index]}
      </span>
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.7s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

const HomeSection: React.FC = () => (
  <section id="home" className="flex flex-col items-center justify-center text-center py-32 w-full min-h-[60vh]">
    <h1 id="home-heading" className="text-4xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-widest font-syne mb-4">Laud Tetteh</h1>
    <AnimatedText />
  </section>
);

export default HomeSection; 