import type { NextApiRequest, NextApiResponse } from 'next';

const posts = [
  {
    title: 'First Blog Post',
    summary: 'This is a summary of the first blog post.',
    date: '2024-06-01',
    featuredImage: '/blog/first.jpg',
    categories: ['Next.js', 'React'],
    status: 'published',
    content: 'This is the full content of the first blog post.'
  },
  {
    title: 'Second Blog Post',
    summary: 'This is a summary of the second blog post.',
    date: '2024-06-02',
    featuredImage: '/blog/second.jpg',
    categories: ['TypeScript', 'Full Stack'],
    status: 'published',
    content: 'This is the full content of the second blog post.'
  }
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(posts);
} 