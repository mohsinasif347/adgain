import React from 'react';
import AdminBottomNav from '@/components/AdminBottomNav'; // Path apne hisab se sahi kar lein

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0b1120] text-white">
      {/* Main Content Area */}
      <div className="pb-32 pt-4">
        {children}
      </div>

      {/* Floating Navigation */}
      <AdminBottomNav />
      
      {/* Optional: Background Glows for consistent look */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-screen pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-600/10 blur-[120px]" />
      </div>
    </div>
  );
}