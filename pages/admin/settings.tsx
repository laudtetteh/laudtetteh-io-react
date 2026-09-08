import Link from "next/link";
import Layout from "@/components/Layout";
import UseAuthRedirect from "@/lib/UseAuthRedirect";
import { inter } from "@/lib/fonts";
import { cardClasses, primaryButtonClasses, secondaryButtonClasses } from "@/components/admin/adminStyles";

export default function AdminSettings() {
  const isCheckingAuth = UseAuthRedirect();

  if (isCheckingAuth) {
    return (
      <Layout title="Site Settings | Laud Tetteh" description="Admin site settings.">
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-teal-600" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Site Settings | Laud Tetteh" description="Admin site settings.">
      <div className={`${inter.variable} font-inter mx-auto max-w-4xl space-y-8 px-6 py-12`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Site Settings</h1>
            <p className="mt-2 text-sm text-slate-600">Manage public-facing site controls.</p>
          </div>
          <Link href="/admin" className={secondaryButtonClasses}>
            Back to Posts
          </Link>
        </div>

        <section className={`${cardClasses} p-6`}>
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Public CV links</h2>
              <p className="mt-1 max-w-xl text-sm text-slate-600">
                Manage the uploaded CV and choose whether its public links appear on the homepage.
              </p>
            </div>
            <Link href="/admin/cv" className={primaryButtonClasses}>
              Manage CV
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}
