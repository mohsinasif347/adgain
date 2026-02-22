import React from 'react';
import BottomNav from '@/components/BottomNav';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    /* bg-white dark:bg-dark-bg add kiya taake theme ke mutabiq base color badle */
    <div className="min-h-screen bg-white dark:bg-dark-bg transition-colors duration-300">
      
      {/* Main container mein pb-28 rakha hai. 
        Ab iska background base div se match karega to black strip nazar nahi aayegi.
      */}
      <main className="pb-28">
        {children}
      </main>
      
      {/* Global VIP Floating Nav */}
      <BottomNav />
    </div>
  );
}