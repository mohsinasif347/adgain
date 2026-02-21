"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, CreditCard } from 'lucide-react';

// Sirf 3 main items rakhe hain
const adminNavItems = [
  { name: 'Home', path: '/admin', icon: LayoutDashboard },
  { name: 'Users', path: '/admin/users', icon: Users },
  { name: 'Payouts', path: '/admin/withdrawals', icon: CreditCard },
];

export default function AdminBottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-50">
      {/* Main Glassmorphism Bar */}
      <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-full px-8 py-3 flex justify-between items-center shadow-2xl shadow-blue-500/10">
        
        {adminNavItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;

          return (
            <Link 
              key={item.path} 
              href={item.path} 
              className="relative flex flex-col items-center justify-center w-16 h-12"
            >
              {/* Animated Circle Wrapper */}
              <motion.div
                animate={{
                  y: isActive ? -30 : 0,
                  backgroundColor: isActive ? '#3b82f6' : 'transparent',
                  scale: isActive ? 1.1 : 1,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`absolute flex items-center justify-center w-12 h-12 rounded-full z-10 ${
                  isActive ? 'shadow-lg shadow-blue-600/40 border-4 border-[#0b1120]' : ''
                }`}
              >
                <Icon 
                  size={20} 
                  className={isActive ? 'text-white' : 'text-slate-500 hover:text-slate-300 transition-colors'} 
                />
              </motion.div>

              {/* Text Label - Only shows when active */}
              <motion.span
                animate={{
                  opacity: isActive ? 1 : 0,
                  y: isActive ? 18 : 25,
                  scale: isActive ? 1 : 0.8,
                }}
                className="text-[10px] font-black text-blue-500 absolute bottom-0 uppercase tracking-widest"
              >
                {item.name}
              </motion.span>

              {/* Indicator Dot for inactive items (Optional subtle touch) */}
              {!isActive && (
                <div className="absolute -bottom-1 w-1 h-1 bg-slate-700 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}