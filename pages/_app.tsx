import '@/styles/output.css';
import type { AppProps } from 'next/app';
import AdminBar from '@/components/AdminBar';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <AdminBar />
      <Component {...pageProps} />
    </>
  );
}
