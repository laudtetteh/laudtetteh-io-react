import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import AdminBar from '@/components/AdminBar';
import FlashMessage from '@/components/flash/FlashMessage';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <FlashMessage />
      <AdminBar />
      <Component {...pageProps} />
    </>
  );
}
