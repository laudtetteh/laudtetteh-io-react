/**
 * ContactFormActions
 * Renders the submit button for the contact form.
 */
import React from 'react';

export interface ContactFormActionsProps {
  status: 'idle' | 'loading' | 'success' | 'error';
}

const ContactFormActions: React.FC<ContactFormActionsProps> = ({ status }) => (
  <button
    type="submit"
    className="w-full rounded bg-black py-2 text-white hover:bg-gray-800"
    disabled={status === 'loading'}
  >
    {status === 'loading' ? 'Sending…' : 'Send Message'}
  </button>
);

export default ContactFormActions;
