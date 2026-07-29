import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { API_BASE_URL } from "@/utils/api";
import { useFlashMessage } from "@/lib/useFlashMessage";
import Layout from '@/components/Layout';
import { inter } from '@/lib/fonts';
import { inputClasses, labelClasses, primaryButtonClasses } from '@/components/admin/adminStyles';

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const usernameRef = useRef<HTMLInputElement>(null);
  const { redirectWithMessage } = useFlashMessage();

  const redirectTo =
    (typeof router.query["redirect-to"] === "string" && router.query["redirect-to"]) || "/admin";

  useEffect(() => {
    usernameRef.current?.focus();

    const token = localStorage.getItem("token");
    if (!token) return;

    // Validate token by making a test request
    fetch(`${process.env.NEXT_PUBLIC_API_BROWSER}/api/admin/posts`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.ok) {
          router.push(redirectTo);
        } else if (res.status === 401) {
          // Token is invalid, remove it
          localStorage.removeItem("token");
        }
      })
      .catch((err) => {
        console.error("Token validation error:", err);
        // On network error, remove token to be safe
        localStorage.removeItem("token");
      });
  }, [router, redirectTo]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ username, password }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Non-JSON error response:", text);
        setError("Invalid login credentials");
        setLoading(false);
        return;
      }

      const data = await res.json();
      
      // Store token and ensure it's persisted
      localStorage.setItem("token", data.access_token);
      
      // Small delay to ensure localStorage is updated before redirect
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Verify token is stored before redirecting
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        setError("Failed to store authentication token");
        setLoading(false);
        return;
      }
      
      redirectWithMessage(redirectTo, "Logged in successfully", "top-center", "push", "success");
    } catch (err) {
      console.error("Login error:", err);
      setError("Unexpected error during login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout title="Admin Login | Laud Tetteh" description="Admin login page for Laud Tetteh's site.">
      <div className={`${inter.variable} font-inter min-h-screen flex flex-col justify-center items-center bg-slate-50 px-4`}>
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm"
        >
          <h1 className="font-inter mb-1 text-center text-2xl font-semibold text-slate-900">Admin Login</h1>
          <p className="mb-6 text-center text-sm text-slate-500">Laud Tetteh</p>
          {error && (
            <div
              role="alert"
              className="mb-4 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-center text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="username" className={labelClasses}>
              Username
            </label>
            <input
              ref={usernameRef}
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={inputClasses}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className={labelClasses}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClasses}
            />
          </div>

          <button
            type="submit"
            className={`${primaryButtonClasses} w-full`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="mt-4 text-center">
            <Link href="/" className="text-sm text-teal-600 underline hover:text-teal-700">
              ← Back to site
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  );
}
