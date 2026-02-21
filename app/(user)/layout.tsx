import React from 'react';
import BottomNav from '@/components/BottomNav';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Humne main container mein pb-28 rakha hai taake floating nav content ke upar na aaye */}
      <main className="pb-28">
        {children}
      </main>
      
      {/* Global VIP Floating Nav */}
      <BottomNav />
    </div>
  );
}