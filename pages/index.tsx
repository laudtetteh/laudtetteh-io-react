import React from 'react';
import PortfolioLayout from '../components/PortfolioLayout';
import { GetStaticProps } from 'next';
import { GithubRepo } from '../types/github';
import Layout from '../components/Layout';

interface HomePageProps {
  repos: GithubRepo[];
}

const HomePage: React.FC<HomePageProps> = ({ repos }) => (
  <Layout title="Laud Tetteh | Full Stack Developer" description="Personal site and portfolio of Laud Tetteh.">
    <PortfolioLayout repos={repos} />
  </Layout>
);

export const getStaticProps: GetStaticProps = async () => {
  try {
    const res = await fetch('https://api.github.com/users/laudtetteh/repos?sort=pushed&per_page=100');
    if (!res.ok) {
      throw new Error(`Failed to fetch repos: ${res.status}`);
    }
    const allRepos: GithubRepo[] = await res.json();

    const allowedTopics = new Set(['frontend', 'backend', 'devops', 'ci-cd']);
    const filteredRepos = allRepos.filter(repo => 
      repo.topics.some(topic => allowedTopics.has(topic))
    );

    return {
      props: {
        repos: filteredRepos,
      },
      // Re-generate the page every 6 hours to fetch new repo data
      revalidate: 21600, 
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        repos: [],
      },
    };
  }
};

export default HomePage;
