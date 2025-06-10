/**
 * ContactFormFields
 * Renders the input fields for the contact form.
 */
import React from 'react';

export interface ContactFormFieldsProps {
  form: { name: string; email: string; message: string };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ContactFormFields: React.FC<ContactFormFieldsProps> = ({ form, onChange }) => (
  <>
    <input
      type="text"
      name="name"
      placeholder="Your Name"
      required
      value={form.name}
      onChange={onChange}
      className="w-full border px-4 py-2 rounded"
    />
    <input
      type="email"
      name="email"
      placeholder="Your Email"
      required
      value={form.email}
      onChange={onChange}
      className="w-full border px-4 py-2 rounded"
    />
    <textarea
      name="message"
      placeholder="Message"
      required
      rows={5}
      value={form.message}
      onChange={onChange}
      className="w-full border px-4 py-2 rounded"
    />
  </>
);

export default ContactFormFields;
