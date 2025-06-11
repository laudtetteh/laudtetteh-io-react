/**
 * ContactSection
 * Displays a contact form with modular fields, actions, and status.
 */
import { useState } from 'react';

import ContactFormFields from './contact/ContactFormFields';
import ContactFormActions from './contact/ContactFormActions';
import ContactFormStatus from './contact/ContactFormStatus';

import { sendContact } from '@/lib/api';

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setError(null);
    try {
      await sendContact(form);
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="mx-auto max-w-3xl space-y-6 px-4 py-12">
      <h2 className="text-center text-2xl font-semibold">Contact Me</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <ContactFormFields form={form} onChange={handleChange} />
        <ContactFormActions status={status} />
        <ContactFormStatus status={status} errorMsg={error} />
      </form>
    </section>
  );
}
