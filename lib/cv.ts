import { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/utils/api';

export interface PublicCv {
  filename: string;
  uploaded_at: string;
  size: number;
  content_type: 'application/pdf';
  download_url: string;
  phone_number_confirmed_absent: boolean;
}

function getPublicCvEndpoint(): string | null {
  if (typeof window === 'undefined' && !process.env.API_SERVER) return null;
  return `${API_BASE_URL}/api/cv`;
}

function getPublicCvLinksEndpoint(): string | null {
  if (typeof window === 'undefined') {
    if (!process.env.API_SERVER) return null;
    return `${API_BASE_URL}/api/settings/cv-links`;
  }
  if (!process.env.NEXT_PUBLIC_API_BROWSER) return null;
  return `${process.env.NEXT_PUBLIC_API_BROWSER}/api/settings/cv-links`;
}

export async function getPublicCv(): Promise<PublicCv | null> {
  const endpoint = getPublicCvEndpoint();
  if (!endpoint) return null;

  let res: Response;
  try {
    res = await fetch(endpoint);
  } catch {
    return null;
  }
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to fetch public CV metadata');
  return res.json();
}

export async function getPublicCvLinksEnabled(): Promise<boolean> {
  const endpoint = getPublicCvLinksEndpoint();
  if (!endpoint) return true;

  try {
    const res = await fetch(endpoint, { cache: 'no-store' });
    if (!res.ok) return true;
    const payload = await res.json();
    return payload.enabled !== false;
  } catch {
    return true;
  }
}

/**
 * Re-checks the public visibility flag in the browser because the homepage
 * itself is statically generated and can otherwise retain an old decision.
 */
export function usePublicCvHref(initialHref: string | null): string | null {
  const [visibleHref, setVisibleHref] = useState(initialHref);

  useEffect(() => {
    let mounted = true;

    getPublicCvLinksEnabled().then(linksEnabled => {
      if (mounted) setVisibleHref(linksEnabled ? initialHref : null);
    });

    return () => {
      mounted = false;
    };
  }, [initialHref]);

  return visibleHref;
}

export function getPublicCvHref(cv: PublicCv | null, linksEnabled = true): string | null {
  if (!cv || !linksEnabled) return null;
  const apiBase = process.env.NEXT_PUBLIC_API_BROWSER || API_BASE_URL;
  return `${apiBase}${cv.download_url}`;
}
