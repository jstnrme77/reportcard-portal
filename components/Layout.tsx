import React, { ReactNode } from 'react';
import Head from 'next/head';
import Sidebar from './Sidebar';
import Header from './Header';

type LayoutProps = {
  children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-secondary-50 dark:bg-secondary-900">
      <Head>
        <title>Dashboard Portal</title>
        <meta name="description" content="Dashboard for link building and reporting" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
