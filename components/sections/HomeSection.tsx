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
  <section id="home" className="flex flex-col items-center justify-center text-center py-10 sm:py-16 w-full" aria-labelledby="home-heading">
    <img src="/avatar-placeholder.png" alt="Laud Tetteh avatar" className="w-20 h-20 sm:w-28 sm:h-28 rounded-full mb-4 sm:mb-6 shadow-lg" />
    <h1 id="home-heading" className="text-2xl sm:text-4xl font-extrabold mb-2">Laud Tetteh</h1>
    <AnimatedText />
    <p className="text-gray-700 dark:text-gray-400 max-w-xl mx-auto mt-3 sm:mt-4 text-sm sm:text-base">
      Welcome! I build modern web applications and digital experiences. Passionate about code, design, and solving real-world problems with technology.
    </p>
  </section>
);

export default HomeSection; 