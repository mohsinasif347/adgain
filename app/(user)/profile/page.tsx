"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { 
  History, MessageCircle, ShieldCheck, 
  LogOut, ChevronRight, ShieldAlert, DownloadCloud, Star 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function ProfileScreen() {
  const supabase = createClient();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // 1. Get Profile Logic
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setUserProfile(data);
      }
    }
    getProfile();

    // 2. PWA Install Logic
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, [supabase]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-white px-6 pt-12 pb-32 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] pointer-events-none" />

      {/* Profile Header */}
      <div className="flex flex-col items-center mb-10 text-center">
        <motion.div 
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          className="relative w-24 h-24 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[2.5rem] p-1 shadow-2xl mb-4"
        >
          <div className="w-full h-full bg-[#0b1120] rounded-[2.4rem] flex items-center justify-center font-black text-3xl text-blue-500 italic">
            {userProfile?.full_name?.charAt(0) || 'U'}
          </div>
          {/* VIP Badge */}
          <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-black p-1.5 rounded-xl border-4 border-[#0b1120]">
            <Star size={12} fill="currentColor" />
          </div>
        </motion.div>
        
        <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-black tracking-tight italic">
          {userProfile?.full_name || 'Loading...'}
        </motion.h2>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
          <ShieldCheck size={12} className="text-blue-500" /> VIP Member
        </p>
      </div>

      {/* Main Menu Tiles */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-3">
        
        {/* VIP INSTALL BUTTON - Only shows if app is installable */}
        <AnimatePresence>
          {deferredPrompt && (
            <motion.button
              variants={itemVariants}
              onClick={handleInstallClick}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 p-5 rounded-[2rem] flex items-center justify-between shadow-lg shadow-blue-600/20 active:scale-95 transition-transform mb-6"
            >
              <div className="flex items-center gap-4 text-left">
                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center text-white">
                  <DownloadCloud size={22} />
                </div>
                <div>
                  <p className="font-black uppercase text-xs tracking-widest text-white">Install AdGain VIP</p>
                  <p className="text-[10px] text-white/70 font-bold italic">Get faster access on your home screen</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-white/50" />
            </motion.button>
          )}
        </AnimatePresence>

        <ProfileTile 
          href="/history" 
          icon={History} 
          label="Earning History" 
          sub="Check your past ad rewards" 
          variants={itemVariants}
        />
        <ProfileTile 
          href="/contact" 
          icon={MessageCircle} 
          label="Contact Support" 
          sub="Get VIP help instantly" 
          variants={itemVariants}
        />
        <ProfileTile 
          href="/privacy" 
          icon={ShieldAlert} 
          label="Terms & Privacy" 
          sub="AdGain usage policies" 
          variants={itemVariants}
        />

        {/* SMALL LOGOUT BUTTON */}
        <motion.button
          variants={itemVariants}
          onClick={handleLogout}
          className="mx-auto flex items-center justify-center gap-2 text-red-500/60 hover:text-red-500 font-black uppercase text-[10px] tracking-widest mt-12 px-6 py-3 bg-red-500/5 rounded-full border border-red-500/10 transition-all active:scale-95"
        >
          <LogOut size={14} /> Logout Session
        </motion.button>
      </motion.div>
    </div>
  );
}

// Helper Component for Profile Tiles
function ProfileTile({ href, icon: Icon, label, sub, variants }: any) {
  return (
    <motion.div variants={variants}>
      <Link href={href} className="bg-white/5 border border-white/5 p-5 rounded-[2.5rem] flex items-center justify-between group hover:bg-white/10 transition-all active:scale-[0.98]">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 transition-transform">
            <Icon size={20} />
          </div>
          <div>
            <p className="font-black uppercase text-[11px] tracking-widest text-slate-200">{label}</p>
            <p className="text-[10px] text-slate-500 font-bold italic">{sub}</p>
          </div>
        </div>
        <ChevronRight size={18} className="text-slate-700 group-hover:text-white transition-colors" />
      </Link>
    </motion.div>
  );
}