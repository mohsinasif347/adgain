"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, PlaySquare, Wallet, User } from 'lucide-react';

const navItems = [
  { name: 'Home', path: '/dashboard', icon: Home },
  { name: 'Earn', path: '/earn', icon: PlaySquare },
  { name: 'Payout', path: '/withdraw', icon: Wallet },
  { name: 'Profile', path: '/profile', icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-50">
      <div className="bg-[#161e2d]/90 backdrop-blur-xl border border-white/10 rounded-full px-6 py-2 flex justify-between items-center shadow-2xl shadow-black/50">
        
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;

          return (
            <Link 
              key={item.path} 
              href={item.path} 
              className="relative flex flex-col items-center justify-center w-12 h-14"
            >
              <motion.div
                animate={{
                  y: isActive ? -20 : 0,
                  backgroundColor: isActive ? '#3b82f6' : 'transparent',
                  scale: isActive ? 1.1 : 1,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`absolute flex items-center justify-center w-12 h-12 rounded-full z-10 ${
                  isActive ? 'border-4 border-[#0b1120] shadow-lg shadow-blue-500/40' : ''
                }`}
              >
                <Icon size={20} className={isActive ? 'text-white' : 'text-slate-500 hover:text-slate-300 transition-colors'} />
              </motion.div>

              <motion.span
                animate={{
                  opacity: isActive ? 1 : 0,
                  y: isActive ? 14 : 20,
                  scale: isActive ? 1 : 0.8,
                }}
                className="text-[10px] font-bold text-blue-400 absolute bottom-0 uppercase tracking-widest"
              >
                {item.name}
              </motion.span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}