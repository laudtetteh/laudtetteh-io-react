export interface GithubRepo {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  topics: string[];
  language: string | null;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  updated_at: string;
} 