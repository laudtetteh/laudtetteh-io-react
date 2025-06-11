import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import FlashMessage from './flash/FlashMessage';

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

    const handleRouteChange = () => {
      checkAuth();
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  if (!loggedIn) return null;

  const isEditPage = router.pathname.startsWith('/admin/edit/');
  const slug = router.query.slug;
  const isViewablePostPage = router.pathname === '/blog/[slug]' && typeof slug === 'string';

  return (
    <>
      <FlashMessage />
      <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between bg-black px-4 py-2 text-sm text-white shadow">
        <div className="flex items-center space-x-4">
          {isViewablePostPage && (
            <Link href={`/admin/edit/${slug}`} className="underline hover:text-gray-300">
              ✏️ Edit Post
            </Link>
          )}
          {isEditPage && (
            <Link href="/admin" className="underline hover:text-gray-300">
              🔙 Back to Posts
            </Link>
          )}
          <Link href="/admin/create" className="underline hover:text-gray-300">
            ➕ New Post
          </Link>
        </div>
        <div className="relative">
          <button onClick={() => setShowDropdown(!showDropdown)} className="hover:text-gray-300">
            ⚙️ Admin
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 space-y-2 rounded bg-white p-2 text-black shadow">
              <Link href="/admin" className="block rounded px-2 py-1 hover:bg-gray-100">
                📂 My Posts
              </Link>
              <Link href="/logout" className="block rounded px-2 py-1 hover:bg-gray-100">
                🚪 Log out
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminBar;
