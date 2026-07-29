import React, { useState } from 'react';

const initialForm = {
  contact_name: '',
  contact_email: '',
  contact_message: '',
  website: '', // honeypot -- real users never see/fill this field
};

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
    } catch (err) {
      setStatus('error');
      const message = err instanceof Error ? err.message : 'Unknown error';
      setErrorMsg(message);
    }
  };

  return (
    <div id="contact" className="arlo_tm_section">
      <div className="section_inner">
        <div className="arlo_tm_contact">
          <div className="contact_inner">
            <div className="arlo_tm_title"><h3>Get in Touch</h3></div>
            <div className="text"><p>Based in Seattle, WA</p></div>
            <div className="form_wrapper">
              <form id="contactForm" onSubmit={handleSubmit} autoComplete="off">
                {errorMsg && <div className="error_box" style={{ display: 'block' }}><p>{errorMsg}</p></div>}
                {status === 'success' && <div className="success_box" style={{ display: 'block' }}><p>Message sent. Thank you, and enjoy your day!</p></div>}
                <ul>
                  <li>
                    <input type="text" placeholder="Name" name="contact_name" className="cf-form-control" value={form.contact_name} onChange={handleChange} />
                    <span></span>
                  </li>
                  <li>
                    <input type="text" placeholder="Email" name="contact_email" className="cf-form-control" value={form.contact_email} onChange={handleChange} />
                    <span></span>
                  </li>
                  <li id="text-area-w">
                    <textarea placeholder="Message" name="contact_message" className="cf-form-control" value={form.contact_message} onChange={handleChange}></textarea>
                  </li>
                </ul>
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
                  style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}
                />
                <div className="arlo_tm_button">
                  <button type="submit" id="send_message" disabled={status === 'loading'}>
                    <span className="back">{status === 'loading' ? 'Sending…' : 'Send Message'}</span>
                    <span className="front">{status === 'loading' ? 'Sending…' : 'Send Message'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection; 