import { API_BASE_URL } from '@/utils/api';

export interface PublicCv {
  filename: string;
  uploaded_at: string;
  size: number;
  content_type: 'application/pdf';
  download_url: string;
  phone_number_confirmed_absent: boolean;
}

export async function getPublicCv(): Promise<PublicCv | null> {
  const res = await fetch(`${API_BASE_URL}/api/cv`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to fetch public CV metadata');
  return res.json();
}

export function getPublicCvHref(cv: PublicCv | null): string | null {
  if (!cv) return null;
  const apiBase = process.env.NEXT_PUBLIC_API_BROWSER || API_BASE_URL;
  return `${apiBase}${cv.download_url}`;
}
