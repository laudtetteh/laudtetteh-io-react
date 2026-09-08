import React, { useState } from 'react';
import MobileSectionTitle from './MobileSectionTitle';

const initialForm = {
  contact_name: '',
  contact_email: '',
  contact_message: '',
  website: '', // honeypot -- real users never see/fill this field
};

/**
 * Field borders are `slate-500` in both themes, not the `slate-200`/`slate-800`
 * used for decorative dividers elsewhere. WCAG SC 1.4.11 requires 3:1 for the
 * visual boundary of a UI control; the divider tokens measured 1.18:1 light and
 * 1.22:1 dark, leaving the fields effectively borderless and readable only by
 * their fill. `slate-400`/`slate-600` were tried first and still failed at
 * 2.56:1/2.36:1 — `slate-500` is the first value that clears 3:1 on both
 * backgrounds. Placeholders are `slate-500`/`slate-400` for the same reason: the
 * previous values measured 2.45:1 light and 3.75:1 dark against a 4.5:1 bar.
 * Do not "harmonise" any of these back to the divider tokens (#110).
 */
const inputClasses =
  'w-full rounded-md border border-slate-500 bg-slate-50 px-4 py-2.5 text-slate-900 placeholder:text-slate-500 transition-colors focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/30 dark:border-slate-500 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:border-teal-400 dark:focus:ring-teal-400/30';

const labelClasses = 'mb-1.5 block text-sm font-medium text-slate-900 dark:text-slate-100';

/**
 * Re-skinned Contact section for the `/redesign` route (renders under `#contact`).
 */
const ContactSection: React.FC = () => {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.contact_name || !form.contact_email || !form.contact_message) {
      setErrorMsg('Please Fill Required Fields');
      return false;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.contact_email)) {
      setErrorMsg('Please enter a valid email address. Exp. example@gmail.com');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!validate()) return;
    setStatus('loading');
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_BROWSER || 'http://localhost:8000';
      const res = await fetch(`${backendUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.contact_name,
          email: form.contact_email,
          message: form.contact_message,
          website: form.website,
        }),
      });
      if (!res.ok) throw new Error('Failed to send contact form');
      setStatus('success');
      setForm(initialForm);
    } catch (err: unknown) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  return (
    <section
      id="contact"
      className="mb-16 scroll-mt-16 bg-slate-50 transition-colors dark:bg-slate-900 md:mb-24 lg:mb-36 lg:scroll-mt-24"
    >
      <MobileSectionTitle title="Contact" />
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 sm:mb-12">
          <p className="hidden text-sm font-semibold uppercase tracking-widest text-teal-700 dark:text-teal-400 lg:block">Contact</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100 sm:text-4xl">Get in Touch</h2>
          <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
            Have a project in mind, want to argue about deployment pipelines, or just want to say hello? Send a message below — it reaches me, not a queue.
          </p>
        </div>

        <form
          id="contactForm"
          onSubmit={handleSubmit}
          autoComplete="off"
          className="rounded-md border border-slate-200 bg-white/70 p-5 shadow-sm shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900/50 dark:shadow-black/10 sm:p-6"
        >
          <div className="space-y-5">
          {errorMsg && (
            <div
              role="alert"
              className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
            >
              {errorMsg}
            </div>
          )}
          {status === 'success' && (
            <div
              role="status"
              className="rounded-md border border-teal-300 bg-teal-50 px-4 py-3 text-sm text-teal-700 dark:border-teal-800 dark:bg-teal-950 dark:text-teal-300"
            >
              Message sent. Thank you, and enjoy your day!
            </div>
          )}

          <div>
            <label htmlFor="contact_name" className={labelClasses}>
              Name
            </label>
            <input
              type="text"
              placeholder="Your name"
              name="contact_name"
              id="contact_name"
              className={inputClasses}
              value={form.contact_name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="contact_email" className={labelClasses}>
              Email
            </label>
            <input
              type="text"
              placeholder="you@example.com"
              name="contact_email"
              id="contact_email"
              className={inputClasses}
              value={form.contact_email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="contact_message" className={labelClasses}>
              Message
            </label>
            <textarea
              placeholder="What's on your mind?"
              name="contact_message"
              id="contact_message"
              rows={5}
              className={`${inputClasses} resize-none`}
              value={form.contact_message}
              onChange={handleChange}
            ></textarea>
          </div>
          </div>

          {/* Honeypot: hidden from real users, invisible to screen readers, but a
              plain form field a naive bot's autofill will still populate. */}
          <input
            type="text"
            name="website"
            value={form.website}
            onChange={handleChange}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute -left-[9999px] h-px w-px overflow-hidden"
          />

          <div className="pt-6">
            <button
              type="submit"
              id="send_message"
              disabled={status === 'loading'}
              className="inline-flex items-center justify-center rounded-md bg-teal-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-teal-400 dark:text-slate-900 dark:hover:bg-teal-300"
            >
              {status === 'loading' ? 'Sending…' : 'Send Message'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactSection;
