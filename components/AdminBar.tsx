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

  return (
    <>
      <FlashMessage />
      <div className="fixed top-0 inset-x-0 bg-black text-white text-sm py-2 px-4 flex justify-between items-center z-40 shadow">
        <div className="space-x-4 flex items-center">
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
            <div className="absolute right-0 mt-2 bg-white text-black rounded shadow p-2 space-y-2 w-48">
              <Link href="/admin" className="block hover:bg-gray-100 px-2 py-1 rounded">
                📂 My Posts
              </Link>
              <Link href="/logout" className="block hover:bg-gray-100 px-2 py-1 rounded">
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
