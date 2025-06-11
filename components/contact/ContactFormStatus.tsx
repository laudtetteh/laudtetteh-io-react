/**
 * ContactFormStatus
 * Displays the status message for the contact form.
 */
import React from 'react';

export interface ContactFormStatusProps {
  status: 'idle' | 'loading' | 'success' | 'error';
  errorMsg: string | null;
}

const ContactFormStatus: React.FC<ContactFormStatusProps> = ({ status, errorMsg }) => (
  <>
    {status === 'success' && <p className="text-green-600">✅ Message sent successfully!</p>}
    {status === 'error' && <p className="text-red-600">❌ {errorMsg || 'Something went wrong.'}</p>}
  </>
);

export default ContactFormStatus;
