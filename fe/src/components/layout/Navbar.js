'use client';

import { Menu } from 'lucide-react';

export function Navbar({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between px-4 md:hidden glass-panel border-b border-slate-200/50">
      <div className="flex items-center gap-2">
         {/* Mobile Logo or Title if needed */}
         <span className="font-display font-bold text-lg text-slate-800">Smart Light</span>
      </div>
      <button
        onClick={onMenuClick}
        className="p-2 text-slate-600 focus:outline-none"
      >
        <Menu className="h-6 w-6" />
      </button>
    </header>
  );
}
