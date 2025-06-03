import React from 'react';

const ProjectsSection: React.FC = () => (
  <section id="projects" className="space-y-6 py-8">
    <h2 className="text-2xl font-semibold text-center">Featured Projects</h2>
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div className="card bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">Project 1</div>
      <div className="card bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">Project 2</div>
      <div className="card bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">Project 3</div>
    </div>
  </section>
);

export default ProjectsSection; 