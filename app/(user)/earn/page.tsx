"use client";

import React, { useState, useEffect } from 'react';
import Script from 'next/script'; // Import Next.js Script component
import { createClient } from '@/utils/supabase/client';
import { PlayCircle, CheckCircle2, TrendingUp, AlertCircle, Loader2, Coins, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';

// Helper component for counting numbers up smoothly
function AnimatedCounter({ from = 0, to, duration = 1.5 }: { from?: number, to: number, duration?: number }) {
  const count = useMotionValue(from);
  const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString());

  useEffect(() => {
    const animation = animate(count, to, { duration: duration, ease: "easeOut" });
    return animation.stop;
  }, [count, to, duration]);

  return <motion.span>{rounded}</motion.span>;
}

export default function EarnPage() {
  const supabase = createClient();
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ todayEarned: 0, todayAds: 0, balance: 0 });
  
  // Ad Watch States
  const [adState, setAdState] = useState<'idle' | 'watching' | 'claiming' | 'success'>('idle');
  const [timeLeft, setTimeLeft] = useState(15); // 15 seconds timer
  const [error, setError] = useState('');

  // Fetch initial stats using Secure RPC
  const fetchStats = async () => {
    const { data, error } = await supabase.rpc('get_user_stats');
    
    if (!error && data) {
      setStats({
        balance: data.profile?.balance || 0,
        todayAds: data.today_ads || 0,
        todayEarned: data.today_earned || 0
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Timer Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (adState === 'watching' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (adState === 'watching' && timeLeft === 0) {
      handleClaimReward();
    }

    return () => clearInterval(interval);
  }, [adState, timeLeft]);

  const startWatchingAd = () => {
    setError('');
    
    // Yahan hum user ko kisi direct link par bhejenge nahi. 
    // Adsterra ka Social Bar khud hi pop-up hoga kyunke script nichay load ho rahi hai.
    // Hum sirf timer start kar dete hain.
    
    setAdState('watching');
    setTimeLeft(15);
  };

  const handleClaimReward = async () => {
    setAdState('claiming');
    
    // Call Secure SQL RPC to credit balance and check anti-cheat
    try {
      const { data, error: rpcError } = await supabase.rpc('claim_ad_reward');

      if (rpcError) throw rpcError;

      // Type assertion
      const response = data as { success: boolean, message: string, amount?: number };

      if (response && response.success) {
        setAdState('success');
        fetchStats(); // Update UI with new balance
      } else {
        setError(response?.message || 'Failed to claim reward. Please try again.');
        setAdState('idle');
      }
    } catch (err: any) {
      setError(err.message || 'Network error occurred. Please check your connection.');
      setAdState('idle');
    }
  };

  const resetAd = () => {
    setAdState('idle');
    setTimeLeft(15);
  };

  // Loading Shimmer
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b1120] px-6 pt-10">
        <div className="w-48 h-8 bg-white/5 rounded-full animate-pulse mb-8"></div>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="h-24 bg-white/5 rounded-[2rem] animate-pulse"></div>
          <div className="h-24 bg-white/5 rounded-[2rem] animate-pulse"></div>
        </div>
        <div className="h-64 bg-white/5 rounded-[2.5rem] animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1120] text-white relative overflow-hidden pb-10">
      
      {/* 1. ADSTERRA SOCIAL BAR SCRIPT */}
      {/* Ye tag background mein Adsterra ka code load karega jab bhi koi is page par aayega */}
      <Script 
        strategy="lazyOnload" 
        src={`//pl25946323.highperformanceformat.com/${5621573}/invoke.js`} // Aap ka ID yahan add kar diya gaya hai
      />
      
      {/* Background Glows */}
      <div className="absolute top-[10%] left-[-10%] w-72 h-72 bg-emerald-900/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <header className="px-6 pt-10 pb-6 relative z-10">
        <h1 className="text-2xl font-black tracking-tight italic uppercase">Earn Zone</h1>
        <p className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-500 mt-1">Watch ads and increase your balance</p>
      </header>

      <main className="px-6 space-y-6 relative z-10">
        
        {/* Top Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-[#161e2d] to-[#0b1120] border border-white/5 p-5 rounded-[2rem] shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="text-emerald-500" />
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Today's Profit</p>
            </div>
            <h2 className="text-2xl font-black text-white flex items-center gap-1.5 italic">
              <AnimatedCounter to={stats.todayEarned} />
              <Coins size={18} className="text-yellow-400" />
            </h2>
          </div>
          
          <div className="bg-gradient-to-br from-[#161e2d] to-[#0b1120] border border-white/5 p-5 rounded-[2rem] shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <PlayCircle size={16} className="text-blue-500" />
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Ads Watched</p>
            </div>
            <div className="flex items-end gap-1">
              <h2 className="text-2xl font-black text-white italic">
                <AnimatedCounter to={stats.todayAds} duration={1} />
              </h2>
              <span className="text-xs text-slate-500 mb-1 font-bold">/ 50</span>
            </div>
          </div>
        </div>

        {/* Dynamic Ad Area */}
        <div className="bg-[#161e2d]/50 backdrop-blur-md border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden min-h-[320px] flex flex-col items-center justify-center text-center">
          
          <AnimatePresence mode="wait">
            
            {/* STATE 1: IDLE */}
            {adState === 'idle' && (
              <motion.div 
                key="idle"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full flex flex-col items-center"
              >
                <div className="w-20 h-20 bg-blue-500/10 rounded-[2rem] flex items-center justify-center mb-6 border border-blue-500/20 shadow-inner shadow-blue-500/20 rotate-3">
                  <PlayCircle size={40} className="text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-2 uppercase tracking-wide">Premium Social Ad</h3>
                <div className="text-xs text-slate-400 mb-8 max-w-[200px] flex flex-col items-center font-medium">
                  Watch a 15-second ad to earn guaranteed
                  <span className="text-yellow-400 font-black flex items-center gap-1.5 mt-2 text-base bg-yellow-500/10 px-3 py-1.5 rounded-xl border border-yellow-500/20 shadow-lg">
                    10 <Coins size={16} className="animate-pulse" />
                  </span>
                </div>
                
                {error && (
                  <div className="flex items-center gap-2 text-red-400 bg-red-400/10 px-4 py-2 rounded-xl text-xs font-bold mb-6">
                    <AlertCircle size={14} /> {error}
                  </div>
                )}

                <button 
                  onClick={startWatchingAd}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-[11px] py-5 rounded-[1.5rem] shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition-all active:scale-95 group"
                >
                  <PlayCircle size={20} className="group-hover:scale-110 transition-transform" />
                  Start Timer
                </button>
              </motion.div>
            )}

            {/* STATE 2: WATCHING */}
            {adState === 'watching' && (
              <motion.div 
                key="watching"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="w-full flex flex-col items-center"
              >
                {/* Circular Timer UI */}
                <div className="relative w-32 h-32 mb-6 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/5" />
                    <circle 
                      cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="4" fill="transparent" 
                      strokeDasharray={377} 
                      strokeDashoffset={377 - (377 * timeLeft) / 15}
                      className="text-emerald-500 transition-all duration-1000 ease-linear" 
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-4xl font-black text-white italic">{timeLeft}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Sec</span>
                  </div>
                </div>
                
                <h3 className="text-lg font-black uppercase text-emerald-400 animate-pulse tracking-wide">Timer Running...</h3>
                <p className="text-[11px] text-slate-400 mt-2 max-w-[220px] font-medium leading-relaxed">
                  Interact with the pop-up ad on your screen. Do not close this tab until the timer finishes.
                </p>
              </motion.div>
            )}

            {/* STATE 3: CLAIMING */}
            {adState === 'claiming' && (
              <motion.div 
                key="claiming"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                  <Loader2 size={32} className="text-blue-500 animate-spin" />
                </div>
                <h3 className="text-lg font-black uppercase tracking-wide">Verifying...</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-2">Crediting your reward</p>
              </motion.div>
            )}

            {/* STATE 4: SUCCESS */}
            {adState === 'success' && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="w-full flex flex-col items-center"
              >
                <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(16,185,129,0.3)] relative border border-emerald-500/20">
                  <CheckCircle2 size={48} className="text-emerald-500" />
                  <motion.div 
                    initial={{ scale: 0, y: 20 }} animate={{ scale: 1, y: -10 }} transition={{ type: "spring", delay: 0.2 }}
                    className="absolute -top-2 -right-2 bg-yellow-500 p-1.5 rounded-xl border-2 border-[#161e2d] shadow-lg"
                  >
                     <Coins size={16} className="text-[#161e2d]" />
                  </motion.div>
                </div>
                
                <h3 className="text-2xl font-black text-white mb-2 uppercase italic tracking-tight">Reward Credited!</h3>
                <p className="text-xs font-bold text-slate-400 mb-8 flex items-center justify-center gap-1.5 uppercase tracking-wide">
                  <span className="text-yellow-400 font-black flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded-lg border border-yellow-500/20">
                    +10 <Coins size={12} />
                  </span> added to balance.
                </p>
                
                <button 
                  onClick={resetAd}
                  className="w-full bg-slate-800 hover:bg-slate-700 border border-white/5 text-white font-black text-[11px] uppercase tracking-widest py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  Watch Next Ad
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 mt-8 opacity-40 hover:opacity-100 transition-opacity">
          <ShieldCheck size={14} className="text-slate-400" />
          <p className="text-[9px] font-black tracking-[0.3em] uppercase text-slate-400">Anti-Cheat Active</p>
        </div>

      </main>
    </div>
  );
}