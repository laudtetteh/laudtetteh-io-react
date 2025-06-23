import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { API_BASE_URL } from '@/utils/api';
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import BlogHeader from '@/components/BlogHeader';

interface BlogPost {
  title: string;
  slug: string;
  content: { html: string };
  summary?: string;
  date?: string;
  date_published?: string;
  status?: string;
  categories?: string[];
  featuredImage?: string;
}

interface PostPageProps {
  post: BlogPost;
}

declare global {
  interface Window {
    arlo_tm_data_images?: () => void;
  }
}

function formatDate(dateString?: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
}

export default function BlogPostPage({ post }: PostPageProps) {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = typeof window !== 'undefined' && localStorage.getItem('token');
    setLoggedIn(Boolean(token));
  }, []);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      typeof window.arlo_tm_data_images === 'function'
    ) {
      window.arlo_tm_data_images();
    }
  }, [post]);

  if (router.isFallback) {
    return <p className="p-6 text-center">Loading post...</p>;
  }

  const imageUrl = post.featuredImage && post.featuredImage.trim() !== '' ? post.featuredImage : '/img/news/1.jpg';
  const author = 'Laud Tetteh';
  const category = post.categories && post.categories.length > 0 ? post.categories[0] : 'Uncategorized';
  const displayDate = post.date_published || post.date;
  const formattedDate = formatDate(displayDate);

  return (
    <>
      <Head>
        <title>{`${Array.isArray(post.title) ? post.title.join(' ') : post.title} | Laud Tetteh`}</title>
        <meta name="description" content={post.summary ?? ''} />
      </Head>
      <BlogHeader />
      <main className="arlo_tm_modalbox_page_wrap" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f6fa' }}>
        <div className="arlo_tm_modalbox_page" style={{
          position: 'relative',
          display: 'block',
          maxWidth: 900,
          width: '100%',
          margin: '40px auto',
          background: '#fff',
          borderRadius: 0,
          boxShadow: '0 0 40px rgba(0,0,0,0.08)'
        }}>
          <div className="box_inner" style={{ position: 'relative', padding: 0 }}>
            <div className="news_popup_informations" style={{ padding: '50px 50px 20px 50px', background: '#fff', borderRadius: 0 }}>
              <div className="image" style={{ position: 'relative', overflow: 'hidden', marginBottom: 24 }}>
                <img src="/img/thumbs/4-2.jpg" alt="" style={{ width: '100%', opacity: 0 }} />
                <div className="main" data-img-url={imageUrl} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundSize: 'cover', backgroundPosition: 'center center', backgroundRepeat: 'no-repeat', minHeight: 350 }}></div>
                <span className="date" style={{ position: 'absolute', top: 20, left: 20, background: '#fff', padding: '4px 18px', borderRadius: 3, fontWeight: 500, fontSize: 15, color: '#868a9b', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>{formattedDate}</span>
              </div>
              <div className="details_news">
                <div className="meta-arlo">
                  <span className="byline-author">
                    By <a href="#" className="byline-link line_effect">{author}</a>
                  </span>
                  <span className="byline-category">
                    In <a href="#" className="byline-link line_effect">{category}</a>
                  </span>
                </div>
                <div className="title" style={{ marginBottom: 8 }}>
                  <h3 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>{post.title}</h3>
                </div>
              </div>
              <div className="text">
                <div dangerouslySetInnerHTML={{ __html: post.content.html }} />
              </div>
              {loggedIn && (
                <div className="pt-6 text-sm space-x-4">
                  <Link href={`/admin/edit/${post.slug}`} className="text-blue-600 underline">✏️ Edit</Link>
                </div>
              )}
            </div>
          </div>
        </div>
        <style jsx>{`
          @media (max-width: 900px) {
            .arlo_tm_modalbox_page { max-width: 100vw !important; }
            .news_popup_informations { padding: 24px 8px 8px 8px !important; }
          }
          @media (max-width: 600px) {
            .arlo_tm_modalbox_page { margin: 10px auto !important; }
            .box_inner { padding: 0 !important; }
            .news_popup_informations { padding: 12px 4px 4px 4px !important; }
            .image .date { font-size: 12px !important; padding: 2px 8px !important; top: 8px !important; left: 8px !important; }
            .details_news .title h3 { font-size: 18px !important; }
            .main { min-height: 180px !important; }
          }
          .meta-arlo {
            display: inline-block;
            border-bottom: 1px solid rgba(0,0,0,.1);
            padding-bottom: 7px;
            margin-bottom: 25px;
            color: #b0b0b0;
            font-size: 14px;
            font-weight: 400;
            position: relative;
          }
          .byline-author {
            position: relative;
            display: inline-block;
            padding-right: 15px;
            margin-right: 10px;
          }
          .byline-author::after {
            content: '';
            position: absolute;
            right: 0;
            top: 50%;
            width: 6px;
            height: 6px;
            background: rgba(0,0,0,0.15);
            border-radius: 100%;
            transform: translateY(-50%);
          }
          .byline-link {
            color: #000 !important;
            text-decoration: none !important;
            font-weight: 400 !important;
            display: inline-block;
            position: relative;
          }
        `}</style>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/posts`);
    const posts: BlogPost[] = await res.json();

    const paths = posts.map((post) => ({
      params: { slug: post.slug },
    }));

    return { paths, fallback: true };
  } catch (err) {
    console.error("[getStaticPaths] ❌ Failed to fetch posts:", err);
    return { paths: [], fallback: true };
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;

  try {
    const res = await fetch(`${API_BASE_URL}/api/posts/${slug}`);
    if (!res.ok) throw new Error("Post not found");

    const post: BlogPost = await res.json();
    return { props: { post }, revalidate: 10 };
  } catch (err) {
    console.error(`[getStaticProps] ❌ Failed to fetch post for slug '${slug}':`, err);
    return {
      props: {
        post: {
          title: 'Post not found',
          slug,
          content: { html: '<p>This post could not be loaded.</p>' },
        },
      },
    };
  }
};
