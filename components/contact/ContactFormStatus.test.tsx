import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import ContactFormStatus from './ContactFormStatus';

describe('ContactFormStatus', () => {
  it('renders a success message after a successful submission', () => {
    render(<ContactFormStatus status="success" errorMsg={null} />);

    expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument();
  });

  it('renders the provided error message when submission fails', () => {
    render(<ContactFormStatus status="error" errorMsg="Please try again." />);

    expect(screen.getByText(/please try again/i)).toBeInTheDocument();
  });

  it('does not render a status message while idle', () => {
    const { container } = render(<ContactFormStatus status="idle" errorMsg={null} />);

    expect(container).toBeEmptyDOMElement();
  });
});
