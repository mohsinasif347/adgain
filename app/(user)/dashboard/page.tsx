"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Wallet, PlayCircle, History, LogOut, TrendingUp, Award, ArrowUpRight, ArrowDownLeft, Coins, Sun, Moon } from 'lucide-react';
import { motion, Variants, useMotionValue, useTransform, animate, AnimatePresence } from 'framer-motion';
import { useTheme } from "next-themes";
import Link from 'next/link';

function AnimatedCounter({ from = 0, to, duration = 1.5 }: { from?: number, to: number, duration?: number }) {
  const count = useMotionValue(from);
  const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString());

  useEffect(() => {
    const animation = animate(count, to, { duration: duration, ease: "easeOut" });
    return animation.stop;
  }, [count, to, duration]);

  return <motion.span>{rounded}</motion.span>;
}

export default function Dashboard() {
  const supabase = createClient();
  const { theme, setTheme } = useTheme();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function fetchDashboardData() {
      const { data: rpcData, error } = await supabase.rpc('get_user_stats');
      if (!error && rpcData) {
        setData(rpcData);
      }
      setLoading(false);
    }
    fetchDashboardData();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  // Hydration mismatch se bachne ke liye
  if (!mounted) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0b1120] px-6 pt-8 pb-24 space-y-6">
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-2">
            <div className="w-24 h-3 bg-black/5 dark:bg-white/5 rounded-full animate-pulse"></div>
            <div className="w-40 h-6 bg-black/10 dark:bg-white/10 rounded-full animate-pulse"></div>
          </div>
          <div className="w-10 h-10 bg-black/5 dark:bg-white/5 rounded-full animate-pulse"></div>
        </div>
        <div className="w-full h-56 bg-black/5 dark:bg-white/5 rounded-[2.5rem] animate-pulse"></div>
      </div>
    );
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const isDark = theme === "dark";

  return (
    <div className="min-h-screen bg-white dark:bg-[#0b1120] text-slate-900 dark:text-white relative overflow-hidden transition-colors duration-500">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-[-5%] right-[-5%] w-64 h-64 bg-blue-500/10 dark:bg-blue-900/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] left-[-5%] w-64 h-64 bg-emerald-500/5 dark:bg-emerald-900/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Header Section */}
      <header className="px-6 pt-8 pb-4 flex justify-between items-center relative z-10">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">Welcome Back</p>
          <h2 className="text-xl font-bold truncate max-w-[160px]">{data?.profile?.full_name || 'User'}</h2>
        </motion.div>

        <div className="flex items-center gap-3">
          {/* VIP ANIMATED TOGGLE BUTTON */}
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="relative w-14 h-8 flex items-center bg-slate-200 dark:bg-slate-800 rounded-full p-1 cursor-pointer transition-colors duration-300 border border-black/5 dark:border-white/10 shadow-inner"
          >
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="w-6 h-6 bg-white dark:bg-[#0b1120] rounded-full flex items-center justify-center shadow-lg z-20"
            >
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.div key="moon" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <Moon size={14} className="text-blue-400" />
                  </motion.div>
                ) : (
                  <motion.div key="sun" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <Sun size={14} className="text-yellow-500" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            <div className={`absolute left-2 ${isDark ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
               <Sun size={12} className="text-slate-500" />
            </div>
            <div className={`absolute right-2 ${!isDark ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
               <Moon size={12} className="text-slate-400" />
            </div>
          </button>

          <motion.button 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            onClick={handleLogout} 
            className="p-2 bg-slate-100 dark:bg-white/5 rounded-full border border-black/5 dark:border-white/10 hover:bg-red-500/20 transition-colors"
          >
            <LogOut size={20} className="text-slate-500 dark:text-slate-400" />
          </motion.button>
        </div>
      </header>

      <motion.main variants={containerVariants} initial="hidden" animate="show" className="px-6 space-y-6 relative z-10 pb-10">
        
        {/* Main Balance Card */}
        <motion.div variants={itemVariants} className="bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-950 rounded-[2.5rem] p-8 shadow-2xl shadow-blue-500/20 border border-white/10 relative overflow-hidden group">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute top-[-10%] right-[-10%] p-4 opacity-10 text-yellow-500"><Coins size={140} /></motion.div>
            <div className="relative z-10">
              <p className="text-blue-100/70 text-sm font-medium">Available Balance</p>
              <div className="flex items-center gap-3 mt-2">
                  <h1 className="text-5xl font-black tracking-tighter text-white drop-shadow-md"><AnimatedCounter to={data?.profile?.balance || 0} /></h1>
                  <div className="flex items-center gap-1.5 bg-yellow-500/20 border border-yellow-500/30 px-3 py-1.5 rounded-xl shadow-inner shadow-yellow-500/20">
                    <Coins size={18} className="text-yellow-400 animate-pulse" />
                    <span className="text-yellow-400 font-black uppercase text-[10px] tracking-widest">Coins</span>
                  </div>
              </div>
            </div>
            <div className="mt-8 flex gap-4 relative z-10">
                <Link href="/withdraw" className="flex-1 bg-white text-blue-900 py-3 rounded-2xl font-black text-sm shadow-lg active:scale-95 transition-all text-center flex items-center justify-center">Withdraw</Link>
                <div className="flex-1 bg-white/10 backdrop-blur border border-white/10 rounded-2xl p-2 px-4 flex flex-col justify-center">
                    <p className="text-[10px] text-blue-100 uppercase font-bold">Total Earned</p>
                    <p className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5"><AnimatedCounter to={data?.profile?.total_earned || 0} /> <Coins size={12} className="text-yellow-400" /></p>
                </div>
            </div>
        </motion.div>

        {/* Quick Stats Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-[#161e2d] border border-black/5 dark:border-white/5 p-5 rounded-3xl flex items-center gap-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <div className="w-10 h-10 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500"><TrendingUp size={20} /></div>
                <div>
                    <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase">Today's Ads</p>
                    <p className="font-bold"><AnimatedCounter to={data?.today_ads || 0} duration={1} /></p>
                </div>
            </div>
            <div className="bg-slate-50 dark:bg-[#161e2d] border border-black/5 dark:border-white/5 p-5 rounded-3xl flex items-center gap-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500"><Award size={20} /></div>
                <div>
                    <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase">Level</p>
                    <p className="font-bold">Bronze</p>
                </div>
            </div>
        </motion.div>

        {/* Action Card: Watch Ads */}
        <motion.div variants={itemVariants} className="bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[2rem] p-6 group hover:bg-black/10 dark:hover:bg-white/10 transition-all cursor-pointer">
            <Link href="/earn" className="flex justify-between items-center block w-full text-left">
                <div className="space-y-1 text-left">
                    <h3 className="text-lg font-bold">Earn by Watching Ads</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs flex items-center gap-1">Earn 10 <Coins size={12} className="text-yellow-500" /> per ad</p>
                </div>
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                    <PlayCircle size={24} className="text-white fill-current" />
                </div>
            </Link>
        </motion.div>

        {/* Recent History */}
        <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500">Recent Activity</h4>
                <Link href="/history"><History size={16} className="text-slate-500 hover:text-blue-500 transition-colors" /></Link>
            </div>
            <div className="space-y-3">
                {data?.recent_activity?.length > 0 ? (
                  data.recent_activity.map((item: any, index: number) => {
                    const isEarning = item.type === 'earning';
                    return (
                      <div key={item.id || index} className="bg-slate-50 dark:bg-[#161e2d] border border-black/5 dark:border-white/5 p-4 rounded-2xl flex justify-between items-center hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                          <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${isEarning ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
                                  {isEarning ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                              </div>
                              <div className="text-left">
                                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200 max-w-[140px] truncate">{item.description || (isEarning ? 'Ad Reward Credited' : 'Withdrawal Request')}</p>
                                  <p className="text-[10px] text-slate-500 font-medium tracking-wide mt-1">{new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                              </div>
                          </div>
                          <div className="text-right">
                              <p className={`text-sm font-black flex items-center justify-end gap-1 ${isEarning ? 'text-emerald-500' : 'text-slate-800 dark:text-white'}`}>{isEarning ? '+' : '-'}{Math.round(item.amount)}<Coins size={14} className="text-yellow-500" /></p>
                          </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-slate-500 bg-slate-50 dark:bg-[#161e2d] border border-black/5 dark:border-white/5 rounded-2xl"><p className="text-xs text-left px-4">Koi activity nahi mili.</p></div>
                )}
            </div>
        </motion.div>
      </motion.main>
    </div>
  );
}