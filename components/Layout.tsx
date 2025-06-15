import React from 'react';
import Head from 'next/head';

const Layout: React.FC<{ title?: string; description?: string; children: React.ReactNode }> = ({ title = 'Laud Tetteh', description = 'Personal site and blog of Laud Tetteh.', children }) => (
  <>
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Head>
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-900 text-white py-4 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <a href="/" className="text-2xl font-bold">Laud Tetteh</a>
          <nav>
            <a href="/blog" className="ml-6 hover:underline">Blog</a>
            <a href="/admin" className="ml-6 hover:underline">Admin</a>
          </nav>
        </div>
      </header>
      <main className="flex-1 bg-gray-50">{children}</main>
      <footer className="bg-gray-900 text-white py-4 px-6 mt-8">
        <div className="max-w-5xl mx-auto text-center text-sm">
          &copy; {new Date().getFullYear()} Laud Tetteh. All rights reserved.
        </div>
      </footer>
    </div>
  </>
);

export default Layout;
