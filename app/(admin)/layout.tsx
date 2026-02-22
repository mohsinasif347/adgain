import React from 'react';
import AdminBottomNav from '@/components/AdminBottomNav';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    /* bg-white dark:bg-[#0b1120] add kiya taake theme switch kaam kare */
    <div className="min-h-screen bg-white dark:bg-[#0b1120] text-slate-900 dark:text-white transition-colors duration-300 relative overflow-x-hidden">
      
      {/* Main Content Area */}
      {/* pb-32 taake content bottom nav ke peeche na chupe */}
      <div className="pb-32 pt-4 relative z-10">
        {children}
      </div>

      {/* Global Admin Floating Navigation */}
      <AdminBottomNav />
      
      {/* Dynamic Background Glows */}
      {/* Light mode mein opacity kam rakhi hai taake clean look aaye */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500/5 dark:bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-500/5 dark:bg-indigo-600/10 blur-[120px] rounded-full" />
      </div>
    </div>
  );
}