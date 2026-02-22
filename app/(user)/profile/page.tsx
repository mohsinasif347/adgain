"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { 
  History, MessageCircle, ShieldCheck, 
  LogOut, ChevronRight, ShieldAlert, DownloadCloud, Star, Edit2, Check, X, Loader2,
  Linkedin, ExternalLink 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from "next-themes";
import Link from 'next/link';

export default function ProfileScreen() {
  const supabase = createClient();
  const { theme } = useTheme();
  
  const [userProfile, setUserProfile] = useState<any>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  
  // Edit Name States
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setUserProfile(data);
        setNewName(data?.full_name || '');
      }
    }
    getProfile();

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, [supabase]);

  const handleUpdateName = async () => {
    if (!newName.trim() || newName === userProfile.full_name) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: newName })
        .eq('id', user.id);

      if (!error) {
        setUserProfile({ ...userProfile, full_name: newName });
        setIsEditing(false);
      }
    }
    setIsSaving(false);
  };

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

  return (
    <div className="min-h-screen bg-white dark:bg-[#0b1120] text-slate-900 dark:text-white px-6 pt-12 pb-40 relative overflow-hidden transition-colors duration-300">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-600/10 dark:bg-blue-600/20 blur-[120px] pointer-events-none" />

      {/* Profile Header */}
      <div className="flex flex-col items-center mb-12 text-center relative z-10">
        <motion.div 
          initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }}
          className="relative w-28 h-28 mb-6"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 rounded-[2.8rem] animate-spin-slow opacity-70 blur-[2px]" />
          <div className="absolute inset-1 bg-white dark:bg-[#0b1120] rounded-[2.6rem] flex items-center justify-center font-black text-4xl text-blue-600 dark:text-blue-500 italic shadow-inner">
            {userProfile?.full_name?.charAt(0) || 'U'}
          </div>
          <motion.div whileHover={{ scale: 1.2 }} className="absolute -bottom-1 -right-1 bg-yellow-500 text-black p-2 rounded-2xl border-4 border-white dark:border-[#0b1120] shadow-lg">
            <Star size={14} fill="currentColor" />
          </motion.div>
        </motion.div>
        
        <div className="w-full max-w-[280px] flex flex-col items-center">
          <AnimatePresence mode="wait">
            {!isEditing ? (
              <motion.div key="name-display" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="flex items-center gap-3">
                <h2 className="text-2xl font-black tracking-tight italic uppercase">{userProfile?.full_name || 'Loading...'}</h2>
                <button onClick={() => setIsEditing(true)} className="p-1.5 bg-slate-100 dark:bg-white/5 rounded-lg text-slate-400 hover:text-blue-500 transition-colors">
                  <Edit2 size={14} />
                </button>
              </motion.div>
            ) : (
              <motion.div key="name-input" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex items-center gap-2 bg-slate-50 dark:bg-white/5 p-1 rounded-2xl border border-blue-500/30">
                <input autoFocus value={newName} onChange={(e) => setNewName(e.target.value)} className="bg-transparent border-none outline-none px-3 py-1 text-lg font-bold text-blue-600 dark:text-blue-400 w-full" />
                <div className="flex items-center gap-1 pr-1">
                  <button onClick={handleUpdateName} disabled={isSaving} className="p-2 bg-blue-600 text-white rounded-xl shadow-md">
                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                  </button>
                  <button onClick={() => setIsEditing(false)} className="p-2 bg-slate-200 dark:bg-white/10 text-slate-500 rounded-xl"><X size={16} /></button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-3 flex items-center gap-2 bg-slate-100 dark:bg-white/5 px-4 py-1.5 rounded-full border border-black/5 dark:border-white/5">
            <ShieldCheck size={12} className="text-blue-500" /> Active VIP Account
          </p>
        </div>
      </div>

      {/* Main Menu Tiles */}
      <div className="space-y-3 relative z-10">
        <AnimatePresence>
          {deferredPrompt && (
            <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} onClick={handleInstallClick} className="w-full relative group mb-8 overflow-hidden rounded-[2.2rem]">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 group-hover:scale-110 transition-transform duration-500" />
              <div className="relative p-6 flex items-center justify-between">
                <div className="flex items-center gap-5 text-left">
                  <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white shadow-xl border border-white/20">
                    <DownloadCloud size={28} className="animate-bounce" />
                  </div>
                  <div>
                    <p className="font-black uppercase text-sm tracking-widest text-white leading-none">Install VIP App</p>
                    <p className="text-[11px] text-white/70 font-bold italic mt-1.5">No Browser, No Lag. Pure Speed.</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-white" />
              </div>
            </motion.button>
          )}
        </AnimatePresence>

        <ProfileTile href="/history" icon={History} label="Earning History" sub="Check your past ad rewards" />
        <ProfileTile href="/contact" icon={MessageCircle} label="Contact Support" sub="Get VIP help instantly" />
        <ProfileTile href="/privacy" icon={ShieldAlert} label="Terms & Privacy" sub="AdGain usage policies" />

        <motion.button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-red-500/80 hover:text-red-500 font-black uppercase text-[11px] tracking-widest mt-8 py-5 bg-red-500/5 rounded-[2rem] border border-red-500/10 transition-all active:scale-95">
          <LogOut size={16} /> Logout Secure Session
        </motion.button>

        {/* --- DEVELOPER CREDITS SECTION --- */}
        <div className="mt-16 pt-8 border-t border-black/5 dark:border-white/5 text-center">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 mb-4 italic">
              Developed & Engineered By
            </p>
            
            <motion.a
              href="https://www.linkedin.com/in/abdulmaalik-shaikh-0259012b7?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10 pl-2 pr-6 py-2 rounded-2xl group transition-all"
            >
              <div className="w-10 h-10 bg-[#0077B5] rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <Linkedin size={20} fill="currentColor" />
              </div>
              <div className="text-left">
                <p className="text-[11px] font-black text-slate-800 dark:text-white uppercase tracking-tight">AbdulMaalik Shaikh</p>
                <div className="flex items-center gap-1">
                  <p className="text-[9px] text-slate-500 font-bold italic">Full-Stack Developer</p>
                  <ExternalLink size={8} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                </div>
              </div>
            </motion.a>
        </div>
      </div>
    </div>
  );
}

function ProfileTile({ href, icon: Icon, label, sub }: any) {
  return (
    <motion.div whileTap={{ scale: 0.98 }}>
      <Link href={href} className="bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/5 p-5 rounded-[2.5rem] flex items-center justify-between group hover:bg-slate-100 dark:hover:bg-white/10 transition-all">
        <div className="flex items-center gap-4 text-left">
          <div className="w-11 h-11 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-500 shadow-inner">
            <Icon size={22} />
          </div>
          <div>
            <p className="font-black uppercase text-[11px] tracking-widest text-slate-800 dark:text-slate-200">{label}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-500 font-bold italic mt-0.5">{sub}</p>
          </div>
        </div>
        <ChevronRight size={18} className="text-slate-300 dark:text-slate-700 group-hover:text-blue-500 transition-colors" />
      </Link>
    </motion.div>
  );
}