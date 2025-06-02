import React from 'react';

const ContactSection: React.FC = () => (
  <section id="contact" className="max-w-xl mx-auto space-y-6">
    <h2 className="text-2xl font-semibold text-center mb-4">Contact Me</h2>
    <form className="space-y-4 bg-white dark:bg-gray-900 p-6 rounded shadow">
      <div className="flex flex-col sm:flex-row gap-4">
        <input type="text" placeholder="Your Name" className="input border px-3 py-2 rounded w-full" required />
        <input type="email" placeholder="Your Email" className="input border px-3 py-2 rounded w-full" required />
      </div>
      <textarea placeholder="Message" className="input border px-3 py-2 rounded w-full" rows={5} required></textarea>
      <button type="submit" className="btn w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Send Message</button>
    </form>
  </section>
);

export default ContactSection; 