import React from 'react';

const ProjectsSection: React.FC = () => (
  <section id="projects" className="space-y-6 py-8">
    <h2 className="text-center text-2xl font-semibold">Featured Projects</h2>
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div className="card rounded-lg bg-white p-4 shadow-md dark:bg-gray-800">Project 1</div>
      <div className="card rounded-lg bg-white p-4 shadow-md dark:bg-gray-800">Project 2</div>
      <div className="card rounded-lg bg-white p-4 shadow-md dark:bg-gray-800">Project 3</div>
    </div>
  </section>
);

export default ProjectsSection;
