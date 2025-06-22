import React from 'react';
import { GithubRepo } from '@/types/github';

interface SandboxSectionProps {
  repos: GithubRepo[];
}

const getCategoryIcon = (topics: string[]) => {
  if (topics.includes('frontend')) return 'icon-desktop';
  if (topics.includes('backend')) return 'icon-server';
  if (topics.includes('devops')) return 'icon-cloud';
  if (topics.includes('ci-cd')) return 'icon-spin6';
  return 'icon-code';
};

const formatRepoName = (name: string) => {
  return name
    .replace(/-/g, ' ')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
};

const mainTopics = new Set(['frontend', 'backend', 'devops', 'ci-cd']);

const getDisplayTopics = (topics: string[]): string[] => {
  const mainTopic = topics.find(t => mainTopics.has(t));
  const otherTopic = topics.find(t => !mainTopics.has(t));

  const result: string[] = [];
  if (mainTopic) result.push(mainTopic);
  if (otherTopic) result.push(otherTopic);

  // If no main topic was found for some reason, just grab the first two.
  if (result.length === 0 && topics.length > 0) {
    return topics.slice(0, 2);
  }
  
  return result;
};

const SandboxSection: React.FC<SandboxSectionProps> = ({ repos }) => (
  <>
    <div className="arlo_tm_portfolio_titles"></div>
    <div id="sandbox" className="arlo_tm_section">
      <div className="section_inner">
        <div className="arlo_tm_portfolio arlo_tm_services">
          <div className="portfolio_list services_list">
            <div className="arlo_tm_title">
              <h3>Code Samples</h3>
            </div>
            <div className="portfolio_filter">
              <ul>
                <li><a href="#" className="current" data-filter="*">All</a></li>
                <li><a href="#" data-filter=".backend">Backend</a></li>
                <li><a href="#" data-filter=".frontend">Frontend</a></li>
                <li><a href="#" data-filter=".devops">DevOps</a></li>
                <li><a href="#" data-filter=".ci-cd">CI/CD</a></li>
              </ul>
            </div>
            <ul className="portfolio_item gallery_zoom">
              {repos.map((repo) => (
                <li key={repo.id} className={repo.topics.join(' ')}>
                  <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                    <div className="list_inner inner">
                      <div className="entry arlo_tm_portfolio_animation_wrap">
                        <i className={getCategoryIcon(repo.topics)} />
                        <h3 className="title">{formatRepoName(repo.name)}</h3>
                        <p className="description">{repo.description || 'No description available.'}</p>
                        <div className="details">
                          <div className="tech-labels">
                            {getDisplayTopics(repo.topics).map(topic => (
                              <span key={topic} className="tech-label">{topic}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  </>
);

export default SandboxSection; 