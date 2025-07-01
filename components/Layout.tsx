import React from 'react';
import Head from 'next/head';
import MobileMenu from './MobileMenu';

const Layout: React.FC<{ title?: string; description?: string; children: React.ReactNode }> = ({ 
  title = 'Laud Tetteh', 
  description = 'Personal site and blog of Laud Tetteh.', 
  children 
}) => {
  return (
  <>
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Head>
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 bg-gray-50">{children}</main>
      <MobileMenu />
    </div>
  </>
);
};

export default Layout;
