import HeaderComponent from '@/components/Dashboard/HeaderComponent';
import Sidebar from '@/components/Dashboard/nav-links';
import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f5f6fa]">
      <Sidebar />
      <div className="ml-60 flex flex-col min-h-screen">
        <HeaderComponent />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
