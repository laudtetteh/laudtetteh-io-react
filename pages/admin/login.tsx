import { useState } from "react";
import { useRouter } from "next/router";

export default function AdminLogin() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("changeme");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/login", {
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
    localStorage.setItem("jwt", data.access_token);
    router.push("/admin");
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
