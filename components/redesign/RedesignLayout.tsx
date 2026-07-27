import { inter } from '@/lib/fonts';
import type { GithubRepo } from '@/types/github';
import type { PostData } from '@/types/blog';
import Header from './Header';
import AboutSection from './AboutSection';
import ExperienceSection from './ExperienceSection';
import ProjectsSection from './ProjectsSection';
import SandboxSection from './SandboxSection';
import WritingSection from './WritingSection';
import ContactSection from './ContactSection';
import Footer from './Footer';

interface RedesignLayoutProps {
  repos: GithubRepo[];
  posts: PostData[];
}

export default function RedesignLayout({ repos, posts }: RedesignLayoutProps) {
  return (
    <div className={`${inter.variable} font-inter`}>
      <Header />
      <AboutSection />
      <ExperienceSection />
      <ProjectsSection />
      <SandboxSection repos={repos} />
      <WritingSection posts={posts} />
      <ContactSection />
      <Footer />
    </div>
  );
}
