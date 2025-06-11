import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { API_BASE_URL } from '@/utils/api';
import { useFlashMessage } from '@/lib/useFlashMessage';

export default function AdminLogin() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('changeme');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const usernameRef = useRef<HTMLInputElement>(null);
  const { redirectWithMessage } = useFlashMessage();

  const redirectTo =
    (typeof router.query['redirect-to'] === 'string' && router.query['redirect-to']) || '/admin';

  useEffect(() => {
    usernameRef.current?.focus();

    const token = localStorage.getItem('token');
    if (!token) return;

    fetch(`${process.env.NEXT_PUBLIC_API_BROWSER}/api/admin/posts`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.ok) router.push(redirectTo);
      })
      .catch((err) => {
        console.error('Auth check failed:', err);
      });
  }, [router, redirectTo]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ username, password }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('Non-JSON error response:', text);
        setError('Invalid login credentials');
        setLoading(false);
        return;
      }

      const data = await res.json();
      localStorage.setItem('token', data.access_token);
      redirectWithMessage(redirectTo, 'Logged in successfully', 'top-center', 'push', 'success');
    } catch (err) {
      console.error('Login error:', err);
      setError('Unexpected error during login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <form
        onSubmit={handleLogin}
        className="mb-4 w-full max-w-md rounded bg-white px-8 pb-8 pt-6 shadow-md"
      >
        <h1 className="mb-4 text-center text-2xl font-bold">Admin Login</h1>
        {error && <p className="mb-4 text-center text-red-500">{error}</p>}

        <div className="mb-4">
          <label htmlFor="username" className="mb-2 block text-sm font-bold text-gray-700">
            Username
          </label>
          <input
            ref={usernameRef}
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full appearance-none rounded border px-3 py-2 text-gray-700 shadow"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="mb-2 block text-sm font-bold text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full appearance-none rounded border px-3 py-2 text-gray-700 shadow"
          />
        </div>

        <button
          type="submit"
          className="flex w-full items-center justify-center rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div className="mt-4 text-center">
          <Link href="/" className="text-sm text-blue-600 underline hover:text-blue-800">
            ← Back to site
          </Link>
        </div>
      </form>
    </div>
  );
}
