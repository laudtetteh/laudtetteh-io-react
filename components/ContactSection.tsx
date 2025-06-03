import { useState } from 'react';
import { API_BASE_URL } from '../utils/api';

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData?.detail || 'Submission failed');
      }

      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch (err: any) {
      setErrorMsg(err.message || 'Unknown error');
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="max-w-3xl mx-auto py-12 px-4 space-y-6">
      <h2 className="text-2xl font-semibold text-center">Contact Me</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          required
          value={form.name}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          required
          value={form.email}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />
        <textarea
          name="message"
          placeholder="Message"
          required
          rows={5}
          value={form.message}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Sending…' : 'Send Message'}
        </button>
        {status === 'success' && (
          <p className="text-green-600">✅ Message sent successfully!</p>
        )}
        {status === 'error' && (
          <p className="text-red-600">❌ {errorMsg || 'Something went wrong.'}</p>
        )}
      </form>
    </section>
  );
}
