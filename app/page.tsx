"use client";

import React from 'react';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) console.error("Login error:", error.message);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0b1120] px-6 py-12 relative overflow-hidden">
      
      {/* Premium Ambient Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Logo & Branding Section */}
      <div className="text-center mb-10 relative z-10">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="relative w-28 h-28 mx-auto mb-6"
        >
          {/* Logo Container with Glow */}
          <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full"></div>
          <div className="relative w-full h-full rounded-[2.5rem] bg-[#161e2d] border border-white/10 p-4 flex items-center justify-center shadow-2xl">
            <Image 
              src="/icon-192x192.png" 
              alt="AdGain Logo" 
              width={80} 
              height={80} 
              priority
              className="object-contain"
            />
          </div>
        </motion.div>

        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl font-black italic tracking-tighter text-white uppercase"
        >
          Ad<span className="text-blue-500">Gain</span>
        </motion.h1>
        <p className="text-slate-500 mt-2 text-[10px] font-black uppercase tracking-[0.3em]">
          Premium Earning Platform
        </p>
      </div>

      {/* Login Card */}
      <motion.div 
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-sm bg-[#161e2d]/60 backdrop-blur-2xl rounded-[3rem] p-10 shadow-2xl border border-white/5 relative z-10"
      >
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-black text-white italic uppercase tracking-tight">Welcome VIP</h2>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Access your dashboard</p>
        </div>

        {/* Google Login Button */}
        <button 
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-4 bg-white hover:bg-slate-100 py-4 rounded-2xl transition-all duration-300 active:scale-95 group shadow-xl shadow-white/5"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span className="text-slate-900 font-black uppercase text-[11px] tracking-widest">Sign in with Google</span>
        </button>

        {/* Feature Grid */}
        <div className="mt-12 grid grid-cols-2 gap-3">
          <div className="p-4 bg-white/5 rounded-[2rem] border border-white/5 text-center">
            <p className="text-blue-500 font-black text-lg italic uppercase">Fast</p>
            <p className="text-[8px] text-slate-500 uppercase font-black mt-1 tracking-widest">Approvals</p>
          </div>
          <div className="p-4 bg-white/5 rounded-[2rem] border border-white/5 text-center">
            <p className="text-emerald-500 font-black text-lg italic uppercase">Safe</p>
            <p className="text-[8px] text-slate-500 uppercase font-black mt-1 tracking-widest">Payments</p>
          </div>
        </div>
      </motion.div>

      {/* Bottom Footer Note */}
      <p className="absolute bottom-8 text-[9px] text-slate-700 font-bold uppercase tracking-[0.4em] z-10">
        AdGain Official Platform
      </p>
    </div>
  );
}