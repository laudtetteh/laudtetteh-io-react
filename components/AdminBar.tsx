import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import FlashMessage from './flash/FlashMessage';
import { inter } from '@/lib/fonts';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/create', label: 'New Post' },
  { href: '/admin/messages', label: 'Messages' },
  { href: '/admin/cv', label: 'CV Upload' },
  { href: '/admin/settings', label: 'Site Settings' },
];

const AdminBar = () => {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setLoggedIn(Boolean(token));
    };

    checkAuth();
    router.events.on('routeChangeComplete', checkAuth);
    return () => router.events.off('routeChangeComplete', checkAuth);
  }, [router.events]);

  if (!loggedIn) return null;

  const isEditPage = router.pathname.startsWith('/admin/edit/');
  const slug = router.query.slug;
  const isViewablePostPage = router.pathname === '/blog/[slug]' && typeof slug === 'string';
  const isActive = (href: string) =>
    href === '/admin' ? router.pathname === '/admin' : router.pathname.startsWith(href);

  const handleDelete = async () => {
    if (!slug) return;
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      const realSlug = Array.isArray(slug) ? slug[0] : slug;
      await import('@/lib/api').then(mod => mod.deletePost(realSlug));
      window.location.href = '/admin';
    } catch {
      alert('Failed to delete post');
    }
  };

  return (
    <>
      <FlashMessage />
      <header className={`${inter.variable} font-inter fixed inset-x-0 top-0 z-50 border-b border-slate-800 bg-slate-900 text-sm text-slate-100 shadow-sm`}>
        <div className="flex h-12 items-center gap-3 px-3 sm:px-4">
          <nav aria-label="Admin navigation" className="min-w-0 flex-1 overflow-x-auto">
            <div className="flex w-max items-center gap-1">
              {NAV_ITEMS.map(item => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={`whitespace-nowrap rounded px-2.5 py-1.5 font-semibold transition-colors ${
                      active
                        ? 'bg-slate-800 text-teal-400'
                        : 'text-slate-100 hover:bg-slate-800 hover:text-teal-400'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              {isEditPage && slug && (
                <>
                  <a
                    href={`/blog/${slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="whitespace-nowrap rounded px-2.5 py-1.5 font-semibold text-slate-100 hover:bg-slate-800 hover:text-teal-400"
                  >
                    View
                  </a>
                  <button onClick={handleDelete} className="whitespace-nowrap rounded px-2.5 py-1.5 font-semibold text-slate-100 hover:bg-slate-800 hover:text-red-400">
                    Delete
                  </button>
                </>
              )}
              {isViewablePostPage && (
                <Link href={`/admin/edit/${slug}`} className="whitespace-nowrap rounded px-2.5 py-1.5 font-semibold text-slate-100 hover:bg-slate-800 hover:text-teal-400">
                  Edit Post
                </Link>
              )}
            </div>
          </nav>

          <div className="relative shrink-0">
            <button
              onClick={() => setShowDropdown(previous => !previous)}
              aria-expanded={showDropdown}
              aria-haspopup="menu"
              className="rounded px-2 py-1.5 font-semibold text-slate-100 hover:bg-slate-800 hover:text-teal-400"
            >
              Admin <span aria-hidden="true">▾</span>
            </button>
            {showDropdown && (
              <div role="menu" className="absolute right-0 mt-2 w-40 space-y-1 rounded-md border border-slate-200 bg-white p-2 text-slate-900 shadow-md">
                <Link href="/admin" role="menuitem" className="block rounded px-2 py-1.5 hover:bg-slate-50">
                  My Posts
                </Link>
                <Link href="/logout" role="menuitem" className="block rounded px-2 py-1.5 hover:bg-slate-50">
                  Log out
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default AdminBar;
