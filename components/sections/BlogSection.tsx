import React from 'react';

const posts = [
  {
    image: '/blog-1.jpg',
    title: 'How to Create a Modern Portfolio',
    date: 'Jun 10, 2025',
    author: 'Laud Tetteh',
    excerpt: 'Learn how to build a modern, responsive portfolio site using React and Next.js.'
  },
  {
    image: '/blog-2.jpg',
    title: 'Tips for Better UI/UX',
    date: 'May 28, 2025',
    author: 'Laud Tetteh',
    excerpt: "Simple tips to improve your website's user experience and design."
  },
];

const SectionHeading: React.FC<{ children: React.ReactNode; id?: string }> = ({ children, id }) => (
  <div className="mb-6 sm:mb-8">
    <h2 id={id} className="text-xl sm:text-2xl md:text-3xl font-extrabold uppercase tracking-widest text-center font-syne">{children}</h2>
    <div className="mx-auto mt-2 w-12 sm:w-16 h-1 bg-blue-600 rounded-full"></div>
  </div>
);

const BlogSection: React.FC = () => (
  <section id="blog" className="max-w-3xl mx-auto py-8 sm:py-12 px-2" aria-labelledby="blog-heading">
    <SectionHeading id="blog-heading">Recent Posts</SectionHeading>
    <div className="space-y-5 sm:space-y-8" aria-label="Blog posts">
      {posts.map((post) => (
        <div key={post.title} className="bg-white rounded-2xl shadow-xl p-3 sm:p-4 flex flex-col md:flex-row items-center border border-gray-100 transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl group">
          <div className="w-full md:w-40 h-28 sm:md:w-48 sm:h-32 bg-gray-200 rounded mb-3 sm:mb-0 md:mr-6 overflow-hidden flex items-center justify-center">
            <img src={post.image} alt={`Preview for ${post.title}`} className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110 group-hover:shadow-lg" />
          </div>
          <div className="flex-1 text-left mt-2 md:mt-0">
            <div className="text-xs sm:text-sm text-gray-500 mb-1 font-mont">{post.date} &middot; By {post.author}</div>
            <h3 className="text-base sm:text-lg font-semibold mb-2 font-syne">{post.title}</h3>
            <p className="text-gray-600 mb-2 font-mont text-sm sm:text-base">{post.excerpt}</p>
            <button className="bg-blue-600 text-white rounded-full px-5 py-2 font-semibold text-xs sm:text-sm shadow hover:bg-blue-700 transition-colors duration-200">Read More</button>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default BlogSection; 