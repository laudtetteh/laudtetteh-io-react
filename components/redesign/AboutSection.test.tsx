import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import AboutSection from './AboutSection';

describe('AboutSection CV link', () => {
  it('hides the download button when no CV is published', () => {
    render(<AboutSection cvHref={null} />);

    expect(screen.queryByRole('link', { name: /download cv/i })).not.toBeInTheDocument();
  });

  it('renders the stable CV URL when a CV is published', () => {
    render(<AboutSection cvHref="https://api.laudtetteh.io/api/cv/download" />);

    expect(screen.getByRole('link', { name: /download cv/i })).toHaveAttribute(
      'href',
      'https://api.laudtetteh.io/api/cv/download',
    );
  });
});
