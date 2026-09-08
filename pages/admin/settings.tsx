import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import UseAuthRedirect from "@/lib/UseAuthRedirect";
import { secondaryButtonClasses } from "@/components/admin/adminStyles";

export default function AdminSettings() {
  const router = useRouter();
  const isCheckingAuth = UseAuthRedirect();
  const [enabled, setEnabled] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isCheckingAuth) return;

    const loadSetting = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BROWSER}/api/admin/settings/cv-links`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (response.status === 401) {
        localStorage.removeItem("token");
        router.push("/admin/login");
        return;
      }
      if (!response.ok) {
        setError("Failed to load site settings.");
        setLoaded(true);
        return;
      }

      const data = await response.json();
      setEnabled(data.enabled !== false);
      setLoaded(true);
    };

    loadSetting().catch(() => {
      setError("Failed to load site settings.");
      setLoaded(true);
    });
  }, [isCheckingAuth, router]);

  const saveSetting = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setSaving(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BROWSER}/api/admin/settings/cv-links`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ enabled }),
        },
      );
      if (response.status === 401) {
        localStorage.removeItem("token");
        router.push("/admin/login");
        return;
      }
      if (!response.ok) throw new Error("Failed to save site settings.");
      setMessage("CV link visibility saved.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to save site settings.");
    } finally {
      setSaving(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <Layout title="Site Settings | Laud Tetteh" description="Admin site settings.">
        <div className="mx-auto flex max-w-3xl justify-center px-6 py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Site Settings | Laud Tetteh" description="Admin site settings.">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Site Settings</h1>
            <p className="mt-2 text-sm text-slate-600">Control public CV link visibility.</p>
          </div>
          <button onClick={() => router.push("/admin")} className={secondaryButtonClasses}>
            Back to Posts
          </button>
        </div>

        <section className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Public CV links</h2>
              <p className="mt-1 max-w-xl text-sm text-slate-600">
                Controls both Download CV and View Full Resume on the public site. The uploaded CV
                remains retained when links are hidden.
              </p>
            </div>
            <label className="inline-flex cursor-pointer items-center gap-3 text-sm font-medium text-slate-900">
              <input
                type="checkbox"
                aria-label="Show public CV links"
                checked={enabled}
                disabled={!loaded || saving}
                onChange={(event) => setEnabled(event.target.checked)}
                className="h-5 w-5 accent-teal-600"
              />
              Show links
            </label>
          </div>

          {error && <p className="mt-5 text-sm font-medium text-red-600">{error}</p>}
          {message && <p className="mt-5 text-sm font-medium text-teal-700">{message}</p>}
          <button
            onClick={saveSetting}
            disabled={!loaded || saving}
            className="mt-6 rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save settings"}
          </button>
        </section>
      </div>
    </Layout>
  );
}
