"use client";

import React, { useState, useEffect, useRef } from 'react';
import Script from 'next/script'; 
import { createClient } from '@/utils/supabase/client';
import { PlayCircle, CheckCircle2, TrendingUp, AlertCircle, Loader2, Coins, ShieldCheck, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';

// --- ADSTERRA COMPONENTS FOR NEXT.JS ---

const NativeBannerAd = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://inspiredalarmslower.com/7dd8c8a16e0472e6777e8d43d7b7a739/invoke.js";
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    document.body.appendChild(script);
    
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    // ID add ki hai taake scroll yahan tak ho sake
    <div id="native-ad-section" className="w-full flex justify-center items-center my-6 min-h-[100px] bg-white/5 rounded-[2rem] border border-white/5 scroll-mt-6">
      <div id="container-7dd8c8a16e0472e6777e8d43d7b7a739"></div>
    </div>
  );
};

const SmallBannerAd = () => {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bannerRef.current || bannerRef.current.hasChildNodes()) return;

    const conf = document.createElement('script');
    conf.type = 'text/javascript';
    conf.innerHTML = `atOptions = { 'key' : 'c29428d2379db44f96beb1d4eb199401', 'format' : 'iframe', 'height' : 50, 'width' : 320, 'params' : {} };`;
    
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = "https://inspiredalarmslower.com/c29428d2379db44f96beb1d4eb199401/invoke.js";
    
    bannerRef.current.appendChild(conf);
    bannerRef.current.appendChild(script);
  }, []);

  return (
    <div className="w-full flex justify-center my-4">
      <div ref={bannerRef} className="w-[320px] h-[50px] bg-black/20 rounded-xl overflow-hidden flex items-center justify-center"></div>
    </div>
  );
};


// --- MAIN EARN PAGE ---

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
  
  const [adState, setAdState] = useState<'idle' | 'watching' | 'claiming' | 'success'>('idle');
  const [timeLeft, setTimeLeft] = useState(15); 
  const [error, setError] = useState('');
  
  const [adStatus, setAdStatus] = useState<'checking' | 'loaded' | 'blocked'>('checking');

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

  useEffect(() => { fetchStats(); }, []);

  useEffect(() => {
    if (adState !== 'idle') return;

    setAdStatus('checking');
    
    const checkAds = setInterval(() => {
      const adContainer = document.getElementById('container-7dd8c8a16e0472e6777e8d43d7b7a739');
      if (adContainer && adContainer.innerHTML.length > 20) {
        setAdStatus('loaded');
        clearInterval(checkAds);
      }
    }, 1500);

    const timeout = setTimeout(() => {
      setAdStatus((prev) => (prev === 'checking' ? 'blocked' : prev));
      clearInterval(checkAds);
    }, 8000);

    return () => {
      clearInterval(checkAds);
      clearTimeout(timeout);
    };
  }, [adState]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (adState === 'watching' && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (adState === 'watching' && timeLeft === 0) {
      handleClaimReward();
    }
    return () => clearInterval(interval);
  }, [adState, timeLeft]);

  const startWatchingAd = () => {
    setError('');
    setAdState('watching');
    setTimeLeft(15);
    
    // Naya: Auto-scroll taake ad screen par nazar aaye (Impression count ho)
    setTimeout(() => {
      document.getElementById('native-ad-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  };

  const handleClaimReward = async () => {
    setAdState('claiming');
    try {
      const { data, error: rpcError } = await supabase.rpc('claim_ad_reward');
      if (rpcError) throw rpcError;

      const response = data as { success: boolean, message: string, amount?: number };
      if (response && response.success) {
        setAdState('success');
        fetchStats(); 
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
    // Naya: Page ko refresh karta hai taake naye sire se ad impressions milen
    window.location.reload();
  };

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
      
      <Script strategy="lazyOnload" src="https://inspiredalarmslower.com/74/2a/9b/742a9b26a8f2cafd6d1fc5798e1614cb.js" />
      
      <div className="absolute top-[10%] left-[-10%] w-72 h-72 bg-emerald-900/20 rounded-full blur-[120px] pointer-events-none"></div>

      <header className="px-6 pt-10 pb-6 relative z-10">
        <h1 className="text-2xl font-black tracking-tight italic uppercase">Earn Zone</h1>
        <p className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-500 mt-1">Watch ads and increase your balance</p>
      </header>

      <main className="px-6 relative z-10">
        
        {/* Top Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
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
              <motion.div key="idle" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -20 }} className="w-full flex flex-col items-center">
                <div className="w-20 h-20 bg-blue-500/10 rounded-[2rem] flex items-center justify-center mb-6 border border-blue-500/20 shadow-inner rotate-3">
                  <PlayCircle size={40} className="text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-2 uppercase tracking-wide">Start Earning</h3>
                <div className="text-xs text-slate-400 mb-6 max-w-[200px] flex flex-col items-center font-medium">
                  Watch the ads on this page and run the timer to get
                  <span className="text-yellow-400 font-black flex items-center gap-1.5 mt-2 text-base bg-yellow-500/10 px-3 py-1.5 rounded-xl border border-yellow-500/20 shadow-lg">
                    10 <Coins size={16} className="animate-pulse" />
                  </span>
                </div>
                
                {adStatus === 'checking' && (
                  <div className="w-full py-4 rounded-[1.5rem] border border-blue-500/20 bg-blue-500/5 flex items-center justify-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-widest">
                    <Loader2 size={16} className="animate-spin" /> Detecting Ads...
                  </div>
                )}

                {adStatus === 'loaded' && (
                  <button onClick={startWatchingAd} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-[11px] py-5 rounded-[1.5rem] shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95">
                    <PlayCircle size={20} /> Start Timer
                  </button>
                )}

                {adStatus === 'blocked' && (
                  <div className="w-full bg-red-500/10 border border-red-500/30 rounded-[1.5rem] p-4 text-left">
                    <div className="flex items-center gap-2 text-red-400 mb-2">
                      <ShieldAlert size={16} />
                      <h4 className="font-black text-xs uppercase tracking-widest">Ads Blocked</h4>
                    </div>
                    <p className="text-[10px] text-slate-300 mb-3 leading-relaxed font-medium">
                      We couldn't detect any ads. To earn coins, you must view the ads.
                    </p>
                    <ul className="text-[9px] text-slate-400 space-y-1 mb-3 list-disc pl-4 font-bold">
                      <li>Turn OFF "Private DNS" in settings.</li>
                      <li>Or connect to a Free VPN (e.g., 1.1.1.1).</li>
                      <li>Disable Ad-Blockers if any.</li>
                    </ul>
                    <button onClick={() => window.location.reload()} className="w-full py-2 bg-white/5 border border-white/10 rounded-xl text-white text-[10px] font-bold uppercase tracking-widest active:scale-95">
                      Refresh Page
                    </button>
                  </div>
                )}

              </motion.div>
            )}

            {/* STATE 2: WATCHING */}
            {adState === 'watching' && (
              <motion.div key="watching" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} className="w-full flex flex-col items-center">
                <div className="relative w-32 h-32 mb-6 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/5" />
                    <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={377} strokeDashoffset={377 - (377 * timeLeft) / 15} className="text-emerald-500 transition-all duration-1000 ease-linear" />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-4xl font-black text-white italic">{timeLeft}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Sec</span>
                  </div>
                </div>
                <h3 className="text-lg font-black uppercase text-emerald-400 animate-pulse tracking-wide">Timer Running...</h3>
                <p className="text-[11px] text-slate-400 mt-2 max-w-[220px] font-medium leading-relaxed">Please keep the ad visible on your screen. Do not scroll away.</p>
              </motion.div>
            )}

            {/* STATE 3: CLAIMING */}
            {adState === 'claiming' && (
              <motion.div key="claiming" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4"><Loader2 size={32} className="text-blue-500 animate-spin" /></div>
                <h3 className="text-lg font-black uppercase tracking-wide">Verifying...</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-2">Crediting your reward</p>
              </motion.div>
            )}

            {/* STATE 4: SUCCESS */}
            {adState === 'success' && (
              <motion.div key="success" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="w-full flex flex-col items-center">
                <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(16,185,129,0.3)] relative border border-emerald-500/20">
                  <CheckCircle2 size={48} className="text-emerald-500" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2 uppercase italic tracking-tight">Reward Credited!</h3>
                <p className="text-xs font-bold text-slate-400 mb-8 flex items-center justify-center gap-1.5 uppercase tracking-wide">
                  <span className="text-yellow-400 font-black flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded-lg border border-yellow-500/20">+10 <Coins size={12} /></span> added.
                </p>
                <button onClick={resetAd} className="w-full bg-slate-800 hover:bg-slate-700 text-white font-black text-[11px] uppercase tracking-widest py-4 rounded-2xl flex items-center justify-center transition-all active:scale-95">Watch Next Ad</button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* --- NATIVE BANNER AD --- */}
        <NativeBannerAd />

        {/* --- SMALL BANNER AD (320x50) --- */}
        <SmallBannerAd />

        <div className="flex items-center justify-center gap-2 mt-4 opacity-40">
          <ShieldCheck size={14} className="text-slate-400" />
          <p className="text-[9px] font-black tracking-[0.3em] uppercase text-slate-400">Anti-Cheat Active</p>
        </div>

      </main>
    </div>
  );
}