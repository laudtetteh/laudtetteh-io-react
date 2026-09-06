import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import FlashMessage from './flash/FlashMessage';
import { inter } from '@/lib/fonts';

const AdminBar = () => {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setLoggedIn(Boolean(token));
    };

    checkAuth();

    const handleRouteChange = () => {
      checkAuth();
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  if (!loggedIn) return null;

  const isEditPage = router.pathname.startsWith("/admin/edit/");
  const slug = router.query.slug;
  const isViewablePostPage = router.pathname === "/blog/[slug]" && typeof slug === 'string';

  // Handler for delete from toolbar
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
      <div className={`${inter.variable} font-inter fixed top-0 inset-x-0 z-50 flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-100 shadow-sm`}>
        <div className="flex items-center space-x-5">
          <Link href="/admin" className="font-semibold text-slate-100 hover:text-teal-400">
            Dashboard
          </Link>
          <Link href="/admin/create" className="font-semibold text-slate-100 hover:text-teal-400">
            + New Post
          </Link>
          <Link href="/admin/messages" className="font-semibold text-slate-100 hover:text-teal-400">
            Messages
          </Link>
          {isEditPage && slug && (
            <>
              <a href={`/blog/${slug}`} target="_blank" rel="noopener noreferrer" className="font-semibold text-slate-100 hover:text-teal-400">View</a>
              <button onClick={handleDelete} className="font-semibold text-slate-100 hover:text-red-400">Delete</button>
            </>
          )}
          {isViewablePostPage && (
            <Link href={`/admin/edit/${slug}`} className="font-semibold text-slate-100 hover:text-teal-400">
              Edit Post
            </Link>
          )}
        </div>
        <div className="relative">
          <button onClick={() => setShowDropdown(!showDropdown)} className="font-semibold text-slate-100 hover:text-teal-400">
            Admin ▾
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 space-y-1 rounded-md border border-slate-200 bg-white p-2 text-slate-900 shadow-md">
              <Link href="/admin" className="block rounded px-2 py-1 hover:bg-slate-50">
                My Posts
              </Link>
              <Link href="/logout" className="block rounded px-2 py-1 hover:bg-slate-50">
                Log out
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminBar;
