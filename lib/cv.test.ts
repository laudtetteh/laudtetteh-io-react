import { describe, expect, it } from 'vitest';
import { getPublicCvHref } from './cv';

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
});
