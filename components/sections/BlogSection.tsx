import React, { useEffect, useState } from 'react';

type BlogPost = {
  title: string;
  summary: string;
  date: string;
  slug: string;
  featuredImage?: string;
  categories?: string[];
  author?: string;
  status?: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_BROWSER + '/api/posts';

function formatDate(dateString: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
}

// Ensure TypeScript knows about the global function
declare global {
  interface Window {
    arlo_tm_data_images?: () => void;
  }
}

const BlogSection: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setPosts(data.filter(p => p.status === 'published'));
        else setPosts([]);
      })
      .catch(() => setPosts([]));
  }, []);

  // Minimal: just call arlo_tm_data_images after posts render
  useEffect(() => {
    if (
      posts.length > 0 &&
      typeof window !== 'undefined' &&
      typeof window.arlo_tm_data_images === 'function'
    ) {
      window.arlo_tm_data_images();
    }
  }, [posts]);

  return (
    <div id="blog" className="arlo_tm_section">
      <div className="section_inner">
        <div className="arlo_tm_news">
          <div className="news_list">
            <div className="arlo_tm_title"><h3>Recent Posts</h3></div>
            <ul>
              {posts.map(post => {
                const imageUrl = post.featuredImage && post.featuredImage.trim() !== '' ? post.featuredImage : '/img/news/1.jpg';
                const author = 'Laud Tetteh';
                const category = post.categories && post.categories.length > 0 ? post.categories[0] : 'Uncategorized';
                const formattedDate = formatDate(post.date);
                return (
                  <li key={post.slug}>
                    <div className="list_inner">
                      <div className="image">
                        <img src="/img/thumbs/4-3.jpg" alt="" />
                        <div className="main" data-img-url={imageUrl}></div>
                        <a className="arlo_tm_full_link" href={`/blog/${post.slug}`}></a>
                        <div className="date"><span>{formattedDate}</span></div>
                      </div>
                      <div className="desc">
                        <div className="meta">
                          <span>By <a className="line_effect" href="#">{author}</a></span>
                          <span>In <a className="line_effect" href="#">{category}</a></span>
                        </div>
                        <div className="title">
                          <h3>
                            <a className="text_hover_effect" href={`/blog/${post.slug}`}>{post.title}</a>
                          </h3>
                        </div>
                        <div className="arlo_tm_button">
                          <a href={`/blog/${post.slug}`}>
                            <span className="back">Read More</span>
                            <span className="front">Read More</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
              {posts.length === 0 && (
                <li>
                  <div className="list_inner">
                    <div className="desc">
                      <div className="title">
                        <h3>No blog posts found.</h3>
                      </div>
                    </div>
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogSection;
