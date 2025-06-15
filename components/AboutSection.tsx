import React from 'react';

const skills = [
  { name: 'JavaScript', value: 90 },
  { name: 'TypeScript', value: 85 },
  { name: 'React', value: 92 },
  { name: 'Python', value: 80 },
  { name: 'FastAPI', value: 75 },
];

const workTimeline = [
  { role: 'Web Developer', org: 'Freelance', years: '2022–Present' },
  { role: 'Software Engineer', org: 'Tech Startup', years: '2020–2022' },
];

const educationTimeline = [
  { degree: 'BSc Computer Science', org: 'University of Example', years: '2016–2020' },
];

const SectionHeading: React.FC<{ children: React.ReactNode; id?: string }> = ({ children, id }) => (
  <div className="mb-6 sm:mb-8">
    <h2 id={id} className="text-xl sm:text-2xl md:text-3xl font-extrabold uppercase tracking-widest text-center font-syne">{children}</h2>
    <div className="mx-auto mt-2 w-12 sm:w-16 h-1 bg-blue-600 rounded-full"></div>
  </div>
);

const AboutSection: React.FC = () => (
  <section id="about" className="max-w-3xl mx-auto text-center space-y-8 sm:space-y-10 py-8 sm:py-12 px-2" aria-labelledby="about-heading">
    <SectionHeading id="about-heading">About Me</SectionHeading>
    <div>
      <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto font-mont text-sm sm:text-base">
        Hi! I'm Laud Tetteh, a passionate web developer and technologist. I love building modern web applications and digital experiences, blending code and creativity to solve real-world problems. My expertise spans frontend and backend development, with a focus on React, TypeScript, and Python.
      </p>
    </div>
    <div>
      <h3 id="about-skills" className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 font-syne">Skills</h3>
      <div className="space-y-3 sm:space-y-4" aria-labelledby="about-skills">
        {skills.map(skill => (
          <div key={skill.name} className="text-left">
            <div className="flex justify-between mb-1">
              <span className="font-medium text-gray-800 dark:text-gray-200 font-mont text-sm sm:text-base">{skill.name}</span>
              <span className="text-gray-500 dark:text-gray-400 font-mont text-xs sm:text-sm">{skill.value}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${skill.value}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 text-left">
      <div>
        <h4 id="about-work" className="text-base sm:text-lg font-semibold mb-2 font-syne">Work Experience</h4>
        <ul className="space-y-2" aria-labelledby="about-work">
          {workTimeline.map((item, idx) => (
            <li key={idx} className="border-l-4 border-blue-600 pl-4">
              <div className="font-medium font-mont text-sm sm:text-base">{item.role}</div>
              <div className="text-xs sm:text-sm text-gray-500 font-mont">{item.org} &middot; {item.years}</div>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h4 id="about-edu" className="text-base sm:text-lg font-semibold mb-2 font-syne">Education</h4>
        <ul className="space-y-2" aria-labelledby="about-edu">
          {educationTimeline.map((item, idx) => (
            <li key={idx} className="border-l-4 border-green-600 pl-4">
              <div className="font-medium font-mont text-sm sm:text-base">{item.degree}</div>
              <div className="text-xs sm:text-sm text-gray-500 font-mont">{item.org} &middot; {item.years}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

export default AboutSection;
