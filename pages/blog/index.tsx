import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import BlogHeader from '@/components/BlogHeader';
import Layout from '@/components/Layout';
import Footer from '@/components/Footer';
import { useBodyClass } from '@/lib/useBodyClass';

type BlogPost = {
  title: string;
  summary: string;
  date: string;
  date_published?: string;
  featuredImage: string;
  categories: string[];
  slug: string;
  status: string;
  featured?: boolean;
  weight?: number;
};

const BlogIndex: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  useBodyClass('page-blog');

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BROWSER}/api/posts`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setPosts(data);
        else console.error("❌ Unexpected blog response:", data);
      });

    const token = typeof window !== 'undefined' && localStorage.getItem('token');
    setLoggedIn(Boolean(token));
  }, []);

  function formatDate(dateString?: string) {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      timeZone: 'America/Los_Angeles',
    });
  }

  // Get all unique categories from posts
  const allCategories = ['All', ...Array.from(new Set(posts.flatMap(post => post.categories)))];

  // Filter published posts by category
  const publishedPosts = posts.filter(p => p.status === "published");
  const filteredPosts = selectedCategory === 'All' 
    ? publishedPosts 
    : publishedPosts.filter(post => post.categories.includes(selectedCategory));

  // Sort by date_published (newest first)
  const sortedPosts = filteredPosts.sort((a, b) => {
    const aDate = new Date(a.date_published || a.date).getTime();
    const bDate = new Date(b.date_published || b.date).getTime();
    return bDate - aDate;
  });

  // Pagination
  const totalPages = Math.ceil(sortedPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedPosts = sortedPosts.slice(startIndex, startIndex + postsPerPage);

  return (
    <Layout title="Blog | Laud Tetteh" description="Read the latest posts from Laud Tetteh on software, tech, and more.">
      <BlogHeader />
      <div className="max-w-6xl mx-auto py-24 px-4">
        {/* Header */}
        <h1 className="text-4xl font-bold mb-12">Blog</h1>

        {/* Posts List */}
        <div id="blog" className="arlo_tm_section animated rollIn active" style={{ position: 'relative' }}>
          <div className="section_inner">
            <div className="arlo_tm_news">
              <div className="news_list">
                {/* Category Navigation */}
                <div className="mb-12">
                  {/* Desktop Category Buttons */}
                  <div className="hidden md:flex flex-wrap gap-8 border-b border-gray-200">
                    {allCategories.map(category => (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category);
                          setCurrentPage(1);
                        }}
                        className={`pb-4 text-lg font-medium transition-colors ${
                          selectedCategory === category
                            ? 'text-black border-b-2 border-black'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>

                  {/* Mobile Category Dropdown */}
                  <div className="md:hidden">
                    <select
                      value={selectedCategory}
                      onChange={(e) => {
                        setSelectedCategory(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full p-3 border border-gray-200 rounded-none bg-white text-lg font-medium focus:outline-none focus:border-black"
                      style={{ 
                        appearance: 'none',
                        backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 1rem center',
                        backgroundSize: '1.5em',
                        paddingRight: '3rem'
                      }}
                    >
                      {allCategories.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="arlo_tm_title"><h3>Recent Posts</h3></div>
                {paginatedPosts.length > 0 ? (
                  <ul>
                    {paginatedPosts.map((post) => {
                      const displayDate = post.date_published || post.date;
                      const formattedDate = formatDate(displayDate);
                      return (
                        <li key={post.slug}>
                          <div className="list_inner">
                            <div className="image">
                              <img src="/img/thumbs/4-3.jpg" alt="" />
                              <div
                                className="main"
                                data-img-url={post.featuredImage}
                                style={{ backgroundImage: `url('${post.featuredImage}')` }}
                              ></div>
                              <Link className="arlo_tm_full_link" href={`/blog/${post.slug}`}></Link>
                            </div>
                            <div className="desc" style={{ 
                              display: 'flex', 
                              flexDirection: 'column', 
                              height: '21rem',
                              padding: '0 0 0 50px'
                            }}>
                              {/* Top section - Date and Categories */}
                              <div style={{ marginBottom: '20px' }}>
                                <div className="text-sm text-gray-500 font-medium">{formattedDate}</div>
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {post.categories && post.categories.map((category) => (
                                    <span 
                                      key={category} 
                                      className="bg-gray-100 text-gray-800 text-xs px-2 py-1" 
                                      style={{ borderRadius: 0, fontWeight: 500, letterSpacing: 0.5 }}
                                    >
                                      {category}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Middle section - Title and Summary */}
                              <div style={{ flex: 1, marginBottom: '20px' }}>
                                <div className="title mb-2 mt-6">
                                  <h3><Link className="text_hover_effect" href={`/blog/${post.slug}`}>{post.title}</Link></h3>
                                </div>
                                <div className="summary">
                                  <p>{post.summary}</p>
                                </div>
                              </div>

                              {/* Bottom section - Read More button */}
                              <div>
                                <div className="arlo_tm_button">
                                  <Link href={`/blog/${post.slug}`}>
                                    <span className="back">READ MORE</span>
                                    <span className="front">READ MORE</span>
                                  </Link>
                                </div>
                                {loggedIn && (
                                  <div className="mt-4">
                                    <Link
                                      href={`/admin/edit/${post.slug}`}
                                      className="text-blue-500 text-sm underline hover:text-blue-700"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      Edit
                                    </Link>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">
                      {selectedCategory === 'All' 
                        ? 'No posts available yet.' 
                        : `No posts found in "${selectedCategory}" category.`
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4">
            {/* Previous Button */}
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded ${
                currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:text-black'
              }`}
            >
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`w-10 h-10 rounded ${
                    currentPage === pageNumber
                      ? ''
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  style={currentPage === pageNumber ? { background: '#999999', color: '#fff' } : {}}
                >
                  {pageNumber}
                </button>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded ${
                currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:text-black'
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
      <Footer />
    </Layout>
  );
};

export default BlogIndex;
