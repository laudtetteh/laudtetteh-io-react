import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { API_BASE_URL } from "@/utils/api";

export default function AdminLogin() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("changeme");
  const [error, setError] = useState("");
  const router = useRouter();

  const redirectTo = (typeof router.query["redirect-to"] === "string" && router.query["redirect-to"]) || "/admin";

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    // Optional: make a quick check to validate token
    fetch(`${process.env.NEXT_PUBLIC_API_BROWSER}/api/admin/posts`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.ok) {
          console.log("✅ Valid token, redirecting to", redirectTo);
          router.push(redirectTo);
        } else {
          console.warn("⚠️ Token exists but API rejected it");
        }
      })
      .catch((err) => {
        console.error("❌ Token check failed:", err);
      });
  }, [router, redirectTo]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch(`${API_BASE_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        username,
        password
      })
    });

    if (!res.ok) {
      setError("Invalid login credentials");
      return;
    }

    const data = await res.json();
    localStorage.setItem("token", data.access_token);
    router.push(redirectTo); // 👈 redirect to original destination (or fallback)
  }

  return (
    <form onSubmit={handleLogin} style={{ maxWidth: 400, margin: "0 auto", padding: "2rem" }}>
      <h1>Admin Login</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="admin"
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Enter password"
          style={{ width: "100%" }}
        />
      </div>

      <button type="submit" style={{ width: "100%" }}>
        Login
      </button>
    </form>
  );
}
