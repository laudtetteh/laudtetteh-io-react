import React from 'react';

const ProjectsSection: React.FC = () => (
  <section id="projects" className="space-y-6">
    <h2 className="text-2xl font-semibold text-center mb-4">Featured Projects</h2>
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div className="card border rounded-lg p-4 shadow bg-white dark:bg-gray-900">Project 1</div>
      <div className="card border rounded-lg p-4 shadow bg-white dark:bg-gray-900">Project 2</div>
      <div className="card border rounded-lg p-4 shadow bg-white dark:bg-gray-900">Project 3</div>
    </div>
  </section>
);

export default ProjectsSection; 