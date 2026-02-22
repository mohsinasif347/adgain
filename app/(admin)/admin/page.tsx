"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { 
  Users, Wallet, Clock, CheckCircle, 
  ArrowUpRight, ShieldCheck, Activity, LogOut,
  Coins, LayoutDashboard, Search, Sun, Moon 
} from 'lucide-react';
import { motion, Variants, useMotionValue, useTransform, animate, AnimatePresence } from 'framer-motion';
import { useTheme } from "next-themes";

// Smooth Number Counter
function AnimatedCounter({ to, duration = 1.5 }: { to: number, duration?: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString());
  useEffect(() => {
    const animation = animate(count, to, { duration: duration, ease: "easeOut" });
    return animation.stop;
  }, [count, to, duration]);
  return <motion.span>{rounded}</motion.span>;
}

export default function AdminDashboard() {
  const supabase = createClient();
  const { theme, setTheme } = useTheme();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function fetchAdminData() {
      const { data: rpcData, error } = await supabase.rpc('get_admin_stats');
      if (!error && rpcData) {
        setData(rpcData);
      }
      setLoading(false);
    }
    fetchAdminData();
  }, [supabase]);

  const isDark = theme === "dark";

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0b1120] px-6 pt-8 space-y-6">
        <div className="h-8 w-48 bg-black/5 dark:bg-white/5 animate-pulse rounded-full" />
        <div className="h-48 w-full bg-black/5 dark:bg-white/5 animate-pulse rounded-[2.5rem]" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-28 bg-black/5 dark:bg-white/5 animate-pulse rounded-3xl" />
          <div className="h-28 bg-black/5 dark:bg-white/5 animate-pulse rounded-3xl" />
        </div>
      </div>
    );
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0b1120] text-slate-900 dark:text-white pb-20 overflow-x-hidden transition-colors duration-500">
      {/* Top Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 bg-blue-500/10 dark:bg-blue-600/10 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="px-6 pt-8 pb-4 flex justify-between items-center relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck size={14} className="text-blue-600 dark:text-blue-500" />
            <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest">Admin Control</p>
          </div>
          <h2 className="text-xl font-black italic">Overview Panel</h2>
        </div>

        <div className="flex items-center gap-3">
          {/* ANIMATED THEME TOGGLE */}
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="relative w-14 h-8 flex items-center bg-slate-200 dark:bg-slate-800 rounded-full p-1 cursor-pointer transition-colors border border-black/5 dark:border-white/10"
          >
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="w-6 h-6 bg-white dark:bg-blue-600 rounded-full flex items-center justify-center shadow-lg z-20"
            >
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.div key="moon" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <Moon size={12} className="text-white" />
                  </motion.div>
                ) : (
                  <motion.div key="sun" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <Sun size={12} className="text-yellow-500" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </button>

          <button onClick={() => supabase.auth.signOut()} className="p-2.5 bg-slate-100 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/10 text-slate-500 dark:text-slate-400">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <motion.main 
        initial="hidden" animate="show" 
        variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        className="px-6 space-y-6 relative z-10"
      >
        {/* Main Revenue Card */}
        <motion.div variants={itemVariants} className="bg-gradient-to-br from-blue-700 to-indigo-900 dark:from-blue-600 dark:to-indigo-950 rounded-[2.5rem] p-8 shadow-2xl shadow-blue-500/20 border border-white/10 relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 opacity-10 group-hover:rotate-12 transition-transform duration-700">
            <LayoutDashboard size={200} className="text-white" />
          </div>
          
          <p className="text-blue-100/70 text-sm font-medium">Total Coins Circulated</p>
          <div className="flex items-baseline gap-2 mt-2">
            <h1 className="text-5xl font-black tracking-tighter text-white italic">
              <AnimatedCounter to={data?.stats?.total_revenue || 0} />
            </h1>
            <Coins size={24} className="text-yellow-400 animate-bounce" />
          </div>
          
          <div className="mt-8 flex gap-3">
             <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                <p className="text-[10px] text-blue-100 uppercase font-bold">Ads Watched</p>
                <p className="text-lg font-black mt-1 text-white"><AnimatedCounter to={data?.stats?.total_ads || 0} /></p>
             </div>
             <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                <p className="text-[10px] text-blue-100 uppercase font-bold">Total Users</p>
                <p className="text-lg font-black mt-1 text-white"><AnimatedCounter to={data?.stats?.total_users || 0} /></p>
             </div>
          </div>
        </motion.div>

        {/* Quick Stats Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 dark:bg-[#161e2d] border border-black/5 dark:border-white/5 p-5 rounded-3xl shadow-sm">
            <div className="w-10 h-10 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-600 dark:text-orange-500 mb-3 shadow-inner">
              <Clock size={20} />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase">Pending Payouts</p>
            <p className="text-xl font-black mt-1 text-orange-600 dark:text-orange-500 italic">{data?.stats?.pending_withdrawals || 0}</p>
          </div>
          
          <div className="bg-slate-50 dark:bg-[#161e2d] border border-black/5 dark:border-white/5 p-5 rounded-3xl shadow-sm">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-500 mb-3 shadow-inner">
              <Activity size={20} />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase">System Status</p>
            <p className="text-xl font-black mt-1 text-emerald-600 dark:text-emerald-500 italic">Active</p>
          </div>
        </motion.div>

        {/* Pending Withdrawals Section */}
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Recent Withdrawals</h4>
            <span className="px-2 py-1 bg-blue-500/10 dark:bg-white/5 rounded-lg text-[9px] font-bold text-blue-600 dark:text-slate-400 border border-blue-500/20">Action Needed</span>
          </div>
          
          <div className="space-y-3">
            {data?.recent_withdrawals?.map((w: any) => (
              <div key={w.id} className="bg-slate-50 dark:bg-[#161e2d] border border-black/5 dark:border-white/5 p-4 rounded-2xl flex justify-between items-center group transition-all hover:shadow-lg">
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-slate-800 flex items-center justify-center text-xs font-black text-blue-600 dark:text-white italic">
                    {w.full_name?.charAt(0) || 'U'}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{w.full_name}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{w.payment_method}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-slate-900 dark:text-white italic">{w.amount} <span className="text-[10px] text-yellow-600 dark:text-yellow-500">COINS</span></p>
                  <button className="text-[10px] text-blue-600 dark:text-blue-500 font-black uppercase mt-1 tracking-widest hover:underline">Review Details</button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* New Users List */}
        <motion.div variants={itemVariants} className="space-y-4">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-1">New Registrations</h4>
          <div className="flex flex-col gap-2">
            {data?.recent_users?.map((u: any) => (
               <div key={u.id} className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-black/5 dark:border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                      <Users size={16} />
                    </div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[140px]">{u.full_name}</p>
                  </div>
                  <p className="text-xs font-black text-emerald-600 dark:text-emerald-400 italic">+{u.balance}</p>
               </div>
            ))}
          </div>
        </motion.div>

      </motion.main>
    </div>
  );
}