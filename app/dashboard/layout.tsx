
import HeaderComponent from '@/components/Dashboard/HeaderComponent';
import Sidebar from '@/components/Dashboard/nav-links';
import React from 'react';


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Fixed at the top */}
      <div className="fixed top- left-0 w-full z-10">
        <HeaderComponent />
      </div>

      {/* Main container */}
      <div className="flex pt-16"> {/* pt-16 to account for fixed header height */}
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <main className="flex-1 ml-64 p-6 min-h-screen bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}