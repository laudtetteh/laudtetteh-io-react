import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getPublicCvHref, usePublicCvHref } from './cv';

const cv = {
  filename: 'resume.pdf',
  uploaded_at: '2026-09-08T00:00:00Z',
  size: 100,
  content_type: 'application/pdf' as const,
  download_url: '/api/cv/download',
  phone_number_confirmed_absent: true,
};

describe('public CV link feature flag', () => {
  it('returns the stable URL when links are enabled', () => {
    expect(getPublicCvHref(cv, true)).toMatch(/\/api\/cv\/download$/);
  });

  it('hides the URL when links are disabled', () => {
    expect(getPublicCvHref(cv, false)).toBeNull();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const Harness = ({ initialHref }: { initialHref: string | null }) => {
    const href = usePublicCvHref(initialHref);
    return href ? <a href={href}>Download CV</a> : <span>Hidden</span>;
  };

  it('hides a statically rendered link when the live setting is disabled', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ enabled: false }),
    });
    vi.stubGlobal('fetch', fetchMock);

    render(<Harness initialHref="https://api.example.test/api/cv/download" />);

    await waitFor(() => expect(screen.queryByRole('link', { name: 'Download CV' })).not.toBeInTheDocument());
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/settings/cv-links'),
      { cache: 'no-store' },
    );
  });

  it('keeps the link when the live setting is enabled', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ enabled: true }),
    }));

    render(<Harness initialHref="https://api.example.test/api/cv/download" />);

    await waitFor(() => expect(screen.getByRole('link', { name: 'Download CV' })).toBeVisible());
  });
});
