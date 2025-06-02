import React from 'react';

const BlogSection: React.FC = () => (
  <section className="space-y-6">
    <h2 className="text-2xl font-semibold text-center mb-4">My Tech Journey</h2>
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div className="card border rounded-lg p-4 shadow bg-white dark:bg-gray-900">Blog Post 1</div>
      <div className="card border rounded-lg p-4 shadow bg-white dark:bg-gray-900">Blog Post 2</div>
      <div className="card border rounded-lg p-4 shadow bg-white dark:bg-gray-900">Blog Post 3</div>
    </div>
  </section>
);

export default BlogSection; 