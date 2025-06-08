import '@/styles/output.css';
import type { AppProps } from 'next/app';
import AdminBar from '@/components/AdminBar';
import FlashMessage from '@/components/FlashMessage';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <FlashMessage />
      <AdminBar />
      <Component {...pageProps} />
    </>
  );
}
