import React from 'react';

const SectionHeading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mb-6 sm:mb-8">
    <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold uppercase tracking-widest text-center font-syne">{children}</h2>
    <div className="mx-auto mt-2 w-12 sm:w-16 h-1 bg-blue-600 rounded-full"></div>
  </div>
);

const ContactSection: React.FC = () => (
  <section id="contact" className="max-w-2xl mx-auto py-8 sm:py-12 px-2" aria-labelledby="contact-heading">
    <SectionHeading>Get in Touch</SectionHeading>
    <div className="mb-6 sm:mb-8 w-full h-40 sm:h-56 bg-gray-200 rounded flex items-center justify-center text-gray-500">
      {/* Placeholder for map */}
      <span>Map Placeholder</span>
    </div>
    <form className="space-y-5 sm:space-y-6 font-mont" aria-label="Contact form">
      <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
        <div className="flex-1 flex flex-col">
          <label htmlFor="contact-name" className="text-xs font-semibold mb-1 text-left">Name</label>
          <input id="contact-name" name="name" type="text" placeholder="Name" className="px-4 py-2 border rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 text-sm sm:text-base" aria-describedby="contact-name-desc" />
          <span id="contact-name-desc" className="sr-only">Enter your full name</span>
        </div>
        <div className="flex-1 flex flex-col">
          <label htmlFor="contact-email" className="text-xs font-semibold mb-1 text-left">Email</label>
          <input id="contact-email" name="email" type="email" placeholder="Email" className="px-4 py-2 border rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 text-sm sm:text-base" aria-describedby="contact-email-desc" />
          <span id="contact-email-desc" className="sr-only">Enter your email address</span>
        </div>
      </div>
      <div className="flex flex-col">
        <label htmlFor="contact-message" className="text-xs font-semibold mb-1 text-left">Message</label>
        <textarea id="contact-message" name="message" placeholder="Message" rows={4} className="w-full px-4 py-2 border rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 text-sm sm:text-base" aria-describedby="contact-message-desc" />
        <span id="contact-message-desc" className="sr-only">Enter your message</span>
      </div>
      <button type="submit" className="bg-blue-600 text-white rounded-full px-6 py-2 font-semibold shadow hover:bg-blue-700 transition-colors duration-200 text-sm sm:text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
        Send Message
      </button>
    </form>
  </section>
);

export default ContactSection; 