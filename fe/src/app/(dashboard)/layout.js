'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
            <div 
                className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm md:hidden"
                onClick={() => setSidebarOpen(false)}
            />
        )}
      
      {/* Sidebar - Mobile Responsive Class override */}
      <div className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
         <Sidebar />
      </div>

      <div className="flex w-full flex-1 flex-col md:pl-72"> 
        {/* Navbar for Mobile */}
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 px-4 py-8 md:px-8 md:py-10 max-w-7xl mx-auto w-full">
            {children}
        </main>
      </div>
    </div>
  );
}
