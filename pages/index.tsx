import React from 'react';
import PortfolioLayout from '../components/PortfolioLayout';
import { GetStaticProps } from 'next';
import { GithubRepo } from '../types/github';
import Layout from '../components/Layout';
import { getSandboxRepos, SANDBOX_REVALIDATE_SECONDS } from '../lib/github';

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
    const repos = await getSandboxRepos();

    return {
      props: {
        repos,
      },
      // Re-generate the page every 6 hours to fetch new repo data
      revalidate: SANDBOX_REVALIDATE_SECONDS,
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
