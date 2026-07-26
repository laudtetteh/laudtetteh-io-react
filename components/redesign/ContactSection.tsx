import React, { useEffect, useState } from 'react';

const MAP_SRC =
  'https://maps.google.com/maps?q=11335%20NE%20122nd%20Way%2C%20Suite%20105%2C%20Kirkland%2C%20WA%2098034&t=&z=15&ie=UTF8&iwloc=&output=embed';

const initialForm = {
  contact_name: '',
  contact_email: '',
  contact_message: '',
  contact_question: '',
};

function generateCaptcha() {
  return Array.from({ length: 5 }, () => Math.floor(Math.random() * 9) + 1).join('');
}

const inputClasses =
  'w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 placeholder:text-slate-400 transition-colors focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/30 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-teal-400 dark:focus:ring-teal-400/30';

const labelClasses = 'mb-1.5 block text-sm font-medium text-slate-900 dark:text-slate-100';

/**
 * Re-skinned Contact section for the `/redesign` route (renders under `#contact`).
 *
 * This is a visual re-skin only — the captcha, validation, and submit logic are
 * ported verbatim from `components/sections/ContactSection.tsx` (the current,
 * production contact form) so behavior is unchanged. That includes a known,
 * pre-existing bug: it reads `NEXT_PUBLIC_API_URL` rather than the project's
 * `NEXT_PUBLIC_API_BROWSER`/`API_SERVER` convention. That bug is intentionally
 * left as-is here — it's tracked and fixed as its own, separate ticket.
 *
 * One SSR-only fix, needed here because this is the first time this captcha
 * logic runs through a real server-rendered page: `generateCaptcha()` uses
 * `Math.random()`, so seeding it directly in `useState`'s initializer produces
 * a different value on the server vs. the client, causing a hydration
 * mismatch. The captcha is generated client-side only, after mount, instead.
 */
const ContactSection: React.FC = () => {
  const [form, setForm] = useState(initialForm);
  const [captcha, setCaptcha] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setCaptcha(generateCaptcha());
  }, []);

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
    if (form.contact_question !== captcha) {
      setErrorMsg('Security code does not match!');
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
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${backendUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.contact_name,
          email: form.contact_email,
          message: form.contact_message,
        }),
      });
      if (!res.ok) throw new Error('Failed to send contact form');
      setStatus('success');
      setForm(initialForm);
      setCaptcha(generateCaptcha());
    } catch (err: unknown) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Unknown error');
      setCaptcha(generateCaptcha());
    }
  };

  return (
    <section id="contact" className="bg-slate-50 py-20 transition-colors dark:bg-slate-900 sm:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-10 text-center sm:mb-14">
          <h2 className="text-3xl font-semibold text-slate-900 dark:text-slate-100 sm:text-4xl">Get in Touch</h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400">
            Have a project in mind, or just want to say hello? Send a message below.
          </p>
        </div>

        <div className="mb-10 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
          <iframe
            width="100%"
            height="300"
            src={MAP_SRC}
            frameBorder="0"
            scrolling="no"
            marginHeight={0}
            marginWidth={0}
            title="Google Map"
            className="block"
          ></iframe>
        </div>

        <form id="contactForm" onSubmit={handleSubmit} autoComplete="off" className="space-y-5">
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

          <div>
            <label htmlFor="txtInput" className={labelClasses}>
              Enter the code: <span className="font-mono font-semibold tracking-widest text-teal-600 dark:text-teal-400">{captcha}</span>
            </label>
            <input
              type="text"
              className={inputClasses}
              name="contact_question"
              id="txtInput"
              autoComplete="off"
              placeholder="Security code *"
              value={form.contact_question}
              onChange={handleChange}
            />
            <input type="hidden" id="txtCaptcha" value={captcha} />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              id="send_message"
              disabled={status === 'loading'}
              className="inline-flex items-center justify-center rounded-md bg-teal-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-teal-400 dark:text-slate-900 dark:hover:bg-teal-300"
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
