import React, { useState } from 'react';

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

const ContactSection: React.FC = () => {
  const [form, setForm] = useState(initialForm);
  const [captcha, setCaptcha] = useState(generateCaptcha());
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
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message || 'Unknown error');
      setCaptcha(generateCaptcha());
    }
  };

  return (
    <div id="contact" className="arlo_tm_section">
      <div className="section_inner">
        <div className="arlo_tm_contact">
          <div className="contact_inner">
            <div className="arlo_tm_title"><h3>Get in Touch</h3></div>
            <div className="my_map">
              <div className="mapouter">
                <div className="gmap_canvas">
                  <iframe
                    width="100%"
                    height="350"
                    id="gmap_canvas"
                    src={MAP_SRC}
                    frameBorder="0"
                    scrolling="no"
                    marginHeight={0}
                    marginWidth={0}
                    title="Google Map"
                  ></iframe>
                </div>
              </div>
            </div>
            <div className="form_wrapper">
              <form id="contactForm" onSubmit={handleSubmit} autoComplete="off">
                {errorMsg && <div className="error_box" style={{ display: 'block' }}><p>{errorMsg}</p></div>}
                {status === 'success' && <div className="success_box" style={{ display: 'block' }}><p>Your message has been sent. We will contact you as soon as possible.</p></div>}
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
                  <li id="enter_code">
                    <span id="txtCaptchaSpan">{captcha}</span>
                    <input type="text" className="cf-form-control" name="contact_question" id="txtInput" autoComplete="off" placeholder="Please Enter Code *" value={form.contact_question} onChange={handleChange} />
                    <input type="hidden" id="txtCaptcha" value={captcha} />
                  </li>
                </ul>
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