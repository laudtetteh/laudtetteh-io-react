import Link from 'next/link';
import classNames from 'classnames';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
}

/**
 * Replaces the legacy black-underline desktop tabs + native `<select>`
 * mobile dropdown with a single horizontally-scrollable pill row that works
 * at every breakpoint (redesign chip convention — see `AboutSection.tsx`'s
 * tag pills). Still a real `<Link href="/blog?category=...">` per option
 * (not a client-only button) so the filter stays URL-shareable, matching
 * the existing mechanism in `pages/blog/index.tsx`.
 */
export default function CategoryFilter({ categories, selectedCategory }: CategoryFilterProps) {
  return (
    <div className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
      {categories.map(category => {
        const isActive = category === selectedCategory;
        return (
          <Link
            key={category}
            href={category === 'All' ? '/blog' : `/blog?category=${encodeURIComponent(category)}`}
            scroll={false}
            className={classNames(
              'shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-300 ease-out motion-reduce:transition-none active:scale-95',
              isActive
                ? 'bg-teal-600 text-white dark:bg-teal-400 dark:text-slate-900'
                : 'bg-teal-600/10 text-teal-700 hover:bg-teal-600/20 dark:bg-teal-400/10 dark:text-teal-300 dark:hover:bg-teal-400/20'
            )}
          >
            {category}
          </Link>
        );
      })}
    </div>
  );
}
