"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Wallet, PlayCircle, History, LogOut, TrendingUp, Award, ArrowUpRight, ArrowDownLeft, Coins } from 'lucide-react';
import { motion, Variants, useMotionValue, useTransform, animate } from 'framer-motion';
import Link from 'next/link';

// Helper component for counting numbers up smoothly (0 se balance tak)
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
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      // Secure RPC Call jo profiles aur transactions table se data layega
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

  // VIP Shimmer Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg px-6 pt-8 pb-24 space-y-6">
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-2">
            <div className="w-24 h-3 bg-white/5 rounded-full animate-pulse"></div>
            <div className="w-40 h-6 bg-white/10 rounded-full animate-pulse"></div>
          </div>
          <div className="w-10 h-10 bg-white/5 rounded-full animate-pulse"></div>
        </div>
        
        <div className="w-full h-56 bg-white/5 rounded-[2.5rem] animate-pulse"></div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="h-28 bg-white/5 rounded-3xl animate-pulse"></div>
          <div className="h-28 bg-white/5 rounded-3xl animate-pulse"></div>
        </div>

        <div className="h-32 bg-white/5 rounded-[2rem] animate-pulse"></div>
      </div>
    );
  }

  // Framer Motion Animation Variants with TypeScript 'Variants' type
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white relative overflow-hidden">
      {/* Background Ambient Glows (Original Colors) */}
      <div className="absolute top-[-5%] right-[-5%] w-64 h-64 bg-primary-900/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] left-[-5%] w-64 h-64 bg-earning-900/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Header Section */}
      <header className="px-6 pt-8 pb-4 flex justify-between items-center relative z-10">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Welcome Back</p>
          <h2 className="text-xl font-bold truncate max-w-[200px]">{data?.profile?.full_name || 'User'}</h2>
        </motion.div>
        <motion.button 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }}
          onClick={handleLogout} 
          className="p-2 bg-white/5 rounded-full border border-white/10 hover:bg-red-500/20 transition-colors"
        >
          <LogOut size={20} className="text-slate-400" />
        </motion.button>
      </header>

      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="px-6 space-y-6 relative z-10 pb-10"
      >
        
        {/* Main Balance Card (Original Primary Colors with Animated Coins) */}
        <motion.div variants={itemVariants} className="bg-gradient-to-br from-primary-600 to-primary-900 rounded-[2.5rem] p-8 shadow-2xl shadow-primary-900/40 border border-white/10 relative overflow-hidden group">
            
            {/* Animated Background Golden Coin */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute top-[-10%] right-[-10%] p-4 opacity-20 group-hover:opacity-30 transition-opacity text-yellow-500"
            >
                <Coins size={140} />
            </motion.div>
            
            <div className="relative z-10">
              <p className="text-primary-100/70 text-sm font-medium">Available Balance</p>
              <div className="flex items-center gap-3 mt-2">
                  <h1 className="text-5xl font-black tracking-tighter text-white drop-shadow-md">
                      {/* Animation: Count up to total balance */}
                      <AnimatedCounter to={data?.profile?.balance || 0} />
                  </h1>
                  {/* Beautiful Golden Coin Pill */}
                  <div className="flex items-center gap-1.5 bg-yellow-500/20 border border-yellow-500/30 px-3 py-1.5 rounded-xl shadow-inner shadow-yellow-500/20">
                    <Coins size={18} className="text-yellow-400 animate-pulse" />
                    <span className="text-yellow-400 font-black uppercase text-[10px] tracking-widest">Coins</span>
                  </div>
              </div>
            </div>

            <div className="mt-8 flex gap-4 relative z-10">
                <Link href="/withdraw" className="flex-1 bg-white text-primary-900 py-3 rounded-2xl font-black text-sm shadow-lg active:scale-95 transition-all text-center flex items-center justify-center">
                    Withdraw
                </Link>
                <div className="flex-1 bg-primary-800/50 backdrop-blur border border-white/10 rounded-2xl p-2 px-4 flex flex-col justify-center">
                    <p className="text-[10px] text-primary-200 uppercase font-bold">Total Earned</p>
                    <p className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                      <AnimatedCounter to={data?.profile?.total_earned || 0} /> 
                      <Coins size={12} className="text-yellow-400" />
                    </p>
                </div>
            </div>
        </motion.div>

        {/* Quick Stats Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
            <div className="bg-dark-card border border-white/5 p-5 rounded-3xl flex items-center gap-4 hover:bg-white/5 transition-colors">
                <div className="w-10 h-10 bg-earning-500/20 rounded-2xl flex items-center justify-center text-earning-500">
                    <TrendingUp size={20} />
                </div>
                <div>
                    <p className="text-slate-400 text-[10px] font-bold uppercase">Today's Ads</p>
                    <p className="font-bold">
                       <AnimatedCounter to={data?.today_ads || 0} duration={1} />
                    </p>
                </div>
            </div>
            <div className="bg-dark-card border border-white/5 p-5 rounded-3xl flex items-center gap-4 hover:bg-white/5 transition-colors">
                <div className="w-10 h-10 bg-reward-500/20 rounded-2xl flex items-center justify-center text-reward-500">
                    <Award size={20} />
                </div>
                <div>
                    <p className="text-slate-400 text-[10px] font-bold uppercase">Level</p>
                    <p className="font-bold">Bronze</p>
                </div>
            </div>
        </motion.div>

        {/* Action Card: Watch Ads (Updated with inline icon) */}
        <motion.div variants={itemVariants} className="bg-white/5 border border-white/10 rounded-[2rem] p-6 group hover:bg-white/10 transition-all cursor-pointer">
            <Link href="/earn" className="flex justify-between items-center block w-full">
                <div className="space-y-1">
                    <h3 className="text-lg font-bold">Earn by Watching Ads</h3>
                    <p className="text-slate-400 text-xs flex items-center gap-1">
                      Direct Link Ad • Earn 10 <Coins size={12} className="text-yellow-500" /> per click
                    </p>
                </div>
                <div className="w-12 h-12 bg-earning-500 rounded-2xl flex items-center justify-center shadow-lg shadow-earning-500/30 group-hover:scale-110 transition-transform">
                    <PlayCircle size={24} className="text-white fill-current" />
                </div>
            </Link>
            <div className="mt-6 h-2 bg-dark-bg rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: "65%" }} 
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-earning-500 rounded-full"
                ></motion.div>
            </div>
            <p className="mt-2 text-[10px] text-slate-500 font-medium">Daily Limit: 65% Completed</p>
        </motion.div>

        {/* Recent History List (Updated for Coin Icons) */}
        <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">Recent Activity</h4>
                <Link href="/history">
                   <History size={16} className="text-slate-500 hover:text-white transition-colors cursor-pointer" />
                </Link>
            </div>
            <div className="space-y-3">
                {data?.recent_activity?.length > 0 ? (
                  data.recent_activity.map((item: any, index: number) => {
                    const isEarning = item.type === 'earning';
                    
                    return (
                      <div key={item.id || index} className="bg-dark-card border border-white/5 p-4 rounded-2xl flex justify-between items-center hover:bg-white/5 transition-colors">
                          <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${isEarning ? 'bg-earning-500/10 text-earning-500 border-earning-500/20' : 'bg-reward-500/10 text-reward-500 border-reward-500/20'}`}>
                                  {isEarning ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                              </div>
                              <div>
                                  <p className="text-sm font-bold text-slate-200 max-w-[140px] truncate">
                                    {item.description || (isEarning ? 'Ad Reward Credited' : 'Withdrawal Request')}
                                  </p>
                                  <p className="text-[10px] text-slate-500 font-medium tracking-wide mt-1">
                                    {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                  </p>
                              </div>
                          </div>
                          <div className="text-right">
                              <p className={`text-sm font-black flex items-center justify-end gap-1 ${isEarning ? 'text-earning-500' : 'text-white'}`}>
                                {isEarning ? '+' : '-'}{Math.round(item.amount)}
                                <Coins size={14} className={isEarning ? 'text-yellow-500' : 'text-slate-500'} />
                              </p>
                              {!isEarning && (
                                <p className="text-[9px] text-slate-500 uppercase font-bold mt-1">{item.status}</p>
                              )}
                          </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-slate-500 bg-dark-card border border-white/5 rounded-2xl">
                     <p className="text-xs">No recent activity found.</p>
                  </div>
                )}
            </div>
        </motion.div>
      </motion.main>
    </div>
  );
}