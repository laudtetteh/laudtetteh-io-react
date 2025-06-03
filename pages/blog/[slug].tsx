import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { API_BASE_URL } from '../../utils/api';

interface BlogPost {
  title: string;
  slug: string;
  content: string;
  summary?: string;
  date?: string;
}

interface PostPageProps {
  post: BlogPost;
}

export default function BlogPostPage({ post }: PostPageProps) {
  const router = useRouter();

  if (router.isFallback) {
    return <p className="p-6 text-center">Loading post...</p>;
  }

  return (
    <>
      <Head>
        <title>{post.title} | Laud Tetteh</title>
      </Head>
      <main className="max-w-3xl mx-auto px-4 py-16 space-y-6">
        <h1 className="text-3xl font-bold">{post.title}</h1>
        {post.date && <p className="text-sm text-gray-500">Published on {post.date}</p>}
        <article className="prose prose-lg" dangerouslySetInnerHTML={{ __html: post.content }} />
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

    return { paths, fallback: true }; // fallback allows dynamic build
  } catch (err) {
    console.error('[getStaticPaths] Failed to fetch slugs:', err);
    return { paths: [], fallback: true };
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;

  try {
    const res = await fetch(`${API_BASE_URL}/api/posts/${slug}`);
    const post: BlogPost = await res.json();
    return { props: { post }, revalidate: 10 };
  } catch (err) {
    console.error(`[getStaticProps] Failed to fetch post for slug '${slug}':`, err);
    return {
      props: {
        post: {
          title: 'Post not found',
          slug,
          content: '<p>This post could not be loaded.</p>',
        },
      },
    };
  }
};
