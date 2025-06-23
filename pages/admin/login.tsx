import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { API_BASE_URL } from "@/utils/api";
import { useFlashMessage } from "@/lib/useFlashMessage";
import Layout from '@/components/Layout';

export default function AdminLogin() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("changeme");
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
      <div className="min-h-screen flex flex-col justify-center items-center px-4">
        <form
          onSubmit={handleLogin}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md"
        >
          <h1 className="text-2xl font-bold mb-4 text-center">Admin Login</h1>
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
              Username
            </label>
            <input
              ref={usernameRef}
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full flex justify-center items-center"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="mt-4 text-center">
            <a href="/" className="text-sm text-blue-600 underline hover:text-blue-800">
              ← Back to site
            </a>
          </div>
        </form>
      </div>
    </Layout>
  );
}
