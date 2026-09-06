import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  submitted_at: string;
  notification_status: 'pending' | 'sent' | 'failed';
  acknowledgement_status: 'pending' | 'sent' | 'failed';
}

/**
 * Two badges per row, not one (#122).
 *
 * A failed *notification* means the message never reached Laud and needs
 * acting on. A failed *acknowledgement* means the sender got no courtesy copy —
 * worth knowing, not urgent. Collapsing them into a single "delivered" state
 * would hide exactly the distinction the admin list exists to surface.
 */
function StatusBadge({ label, status }: { label: string; status: ContactSubmission['notification_status'] }) {
  const tone =
    status === 'sent'
      ? 'border-teal-700 text-teal-800'
      : status === 'failed'
        ? 'border-red-700 text-red-800'
        : 'border-slate-500 text-slate-700';

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs ${tone}`}>
      {label}: {status}
    </span>
  );
}

function formatWhen(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/**
 * Admin view of contact-form submissions (#122).
 *
 * Before this existed, a submission lived only as an outbound email. Tracing
 * one that appeared to vanish meant reading Docker logs — and if Resend
 * accepted a message that was then filtered or bounced, the submission was
 * gone with no trace in the product at all.
 */
export default function AdminMessages() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BROWSER}/api/admin/contact-submissions`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        localStorage.removeItem('token');
        router.push('/admin/login');
        return;
      }
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);

      setSubmissions(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <Layout title="Messages | Laud Tetteh" description="Contact form submissions.">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h1 className="font-inter text-3xl font-semibold text-slate-900">Messages</h1>
          <p className="text-sm text-slate-700">
            {loading ? 'Loading…' : `${submissions.length} submission${submissions.length === 1 ? '' : 's'}`}
          </p>
        </div>

        {error && (
          <div role="alert" className="mt-6 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}

        {!loading && !error && submissions.length === 0 && (
          <p className="mt-8 rounded-md border border-dashed border-slate-300 px-6 py-10 text-center text-sm text-slate-700">
            No messages yet. Submissions sent before this page existed were email-only and were
            never stored, so they will not appear here.
          </p>
        )}

        <ul className="mt-8 space-y-4">
          {submissions.map(item => (
            <li key={item.id} className="rounded-md border border-slate-300 bg-white p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-medium text-slate-900">
                  {item.name}{' '}
                  <a href={`mailto:${item.email}`} className="font-normal text-teal-800 underline-offset-2 hover:underline">
                    {item.email}
                  </a>
                </p>
                <p className="text-xs text-slate-700">{formatWhen(item.submitted_at)}</p>
              </div>

              <p className="mt-3 whitespace-pre-wrap text-sm leading-normal text-slate-800">{item.message}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                <StatusBadge label="notification" status={item.notification_status} />
                <StatusBadge label="acknowledgement" status={item.acknowledgement_status} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}
