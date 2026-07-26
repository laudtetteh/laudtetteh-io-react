/**
 * ContactSection
 * Displays a contact form with modular fields, actions, and status.
 */
import { useState } from 'react';
import { sendContact } from '@/lib/api';
import ContactFormFields from './contact/ContactFormFields';
import ContactFormActions from './contact/ContactFormActions';
import ContactFormStatus from './contact/ContactFormStatus';

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
      await sendContact(form);
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Unknown error');
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="max-w-3xl mx-auto py-12 px-4 space-y-6">
      <h2 className="text-2xl font-semibold text-center">Contact Me</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <ContactFormFields form={form} onChange={handleChange} />
        <ContactFormActions status={status} />
        <ContactFormStatus status={status} errorMsg={errorMsg} />
      </form>
    </section>
  );
}
 