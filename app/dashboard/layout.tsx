import HeaderComponent from '@/components/Dashboard/HeaderComponent';
import Sidebar from '@/components/Dashboard/nav-links';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-0 left-0 w-full z-10">
        <HeaderComponent />
      </div>

      <div className="flex pt-16">
        <Sidebar />

        <main className="flex-1 ml-64 p-6 min-h-screen bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
