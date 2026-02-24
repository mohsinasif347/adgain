"use client";

import React from 'react';
import { 
  PlayCircle, Coins, ShieldCheck, Zap, 
  ArrowRight, Smartphone, TrendingUp, 
  Linkedin, Award, Star, MousePointer2, 
  Wallet, Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0b1120] text-white selection:bg-blue-500 selection:text-white font-sans overflow-x-hidden">
      
      {/* Mobile Optimized Background Glows */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="absolute bottom-20 left-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none"></div>

      {/* VIP Navigation */}
      <nav className="relative z-50 px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
            <PlayCircle size={20} className="text-white fill-current" />
          </div>
          <span className="text-xl font-black tracking-tighter italic uppercase">Adgain</span>
        </div>
        <Link href="/login" className="text-[10px] font-black uppercase tracking-widest px-5 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-md active:scale-90 transition-all">
          Login
        </Link>
      </nav>

      {/* Hero Section - Mobile First */}
      <header className="relative z-10 px-6 pt-10 pb-20 text-center">
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6"
        >
          <Sparkles size={12} className="text-blue-400" />
          <span className="text-[9px] font-black uppercase tracking-widest text-blue-400">Trusted by 5000+ Earners</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-5xl font-black tracking-tighter mb-6 leading-[0.85] italic"
        >
          WATCH. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 underline decoration-blue-500/30">EARN.</span> <br />
          WITHDRAW.
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.2 }} 
          className="text-slate-400 text-sm mb-10 max-w-[280px] mx-auto font-medium leading-relaxed"
        >
          The most premium Ad-Reward system in Pakistan. Convert your daily 15 seconds into real cash.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <Link href="/login" className="w-full py-5 bg-blue-600 hover:bg-blue-500 rounded-[2rem] font-black text-lg shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-3 active:scale-95">
            Get Your VIP Access <ArrowRight size={20} />
          </Link>
          <div className="flex items-center justify-center gap-6 opacity-60">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span className="text-[10px] font-bold uppercase tracking-tight">Verified Payouts</span>
            </div>
            <div className="flex items-center gap-1.5">
              <TrendingUp size={14} className="text-blue-500" />
              <span className="text-[10px] font-bold uppercase tracking-tight">High CPM Rate</span>
            </div>
          </div>
        </motion.div>
      </header>

      {/* Stats Section */}
      <section className="px-6 py-10 grid grid-cols-2 gap-4 relative z-10">
        <div className="bg-white/5 border border-white/10 p-6 rounded-[2.5rem] backdrop-blur-md">
          <Coins className="text-yellow-400 mb-3" size={24} />
          <h3 className="text-2xl font-black italic">100%</h3>
          <p className="text-[9px] font-bold uppercase text-slate-500 tracking-widest mt-1">Legit Earning</p>
        </div>
        <div className="bg-white/5 border border-white/10 p-6 rounded-[2.5rem] backdrop-blur-md">
          <Wallet className="text-blue-400 mb-3" size={24} />
          <h3 className="text-2xl font-black italic">Fast</h3>
          <p className="text-[9px] font-bold uppercase text-slate-500 tracking-widest mt-1">Withdrawals</p>
        </div>
      </section>

      {/* VIP Instructions Section */}
      <section className="px-6 py-20 relative z-10">
        <div className="text-left mb-12">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-blue-500 mb-2">How it works</h2>
          <h3 className="text-3xl font-black italic leading-none">VIP EARNING <br />PROCESS</h3>
        </div>

        <div className="space-y-6">
          {[
            { icon: <MousePointer2 size={20}/>, title: "Login Dashboard", desc: "Access your personalized VIP portal with your secure credentials." },
            { icon: <PlayCircle size={20}/>, title: "Watch 15s Ads", desc: "Watch high-quality premium ads for just 15 seconds to trigger rewards." },
            { icon: <Award size={20}/>, title: "Claim Coins", desc: "Solve a simple human-check bot protection and claim your 10 coins instantly." },
            { icon: <Smartphone size={20}/>, title: "Easy Withdraw", desc: "Reach the 700 coins limit and withdraw directly to EasyPaisa or JazzCash." }
          ].map((item, idx) => (
            <div key={idx} className="flex gap-5 items-start p-6 bg-slate-900/50 border border-white/5 rounded-3xl">
              <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 shrink-0">
                {item.icon}
              </div>
              <div className="text-left">
                <h4 className="text-lg font-black italic">{item.title}</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ABDULMAALIK VIP DEVELOPER CARD */}
      <section className="px-6 py-24 relative z-10 bg-gradient-to-b from-transparent to-black/40">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-[#161e2d] border border-white/10 rounded-[3rem] p-10 relative overflow-hidden shadow-2xl shadow-blue-900/20"
        >
          {/* VIP Decoration */}
          <div className="absolute top-0 right-0 p-6 opacity-10 rotate-12">
            <Award size={100} className="text-blue-500" />
          </div>

          <div className="relative z-10 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 rotate-3 shadow-lg">
              <Linkedin size={36} className="text-white" />
            </div>
            
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 mb-2">Lead Developer</p>
            <h3 className="text-3xl font-black italic mb-4">AbdulMaalik Shaikh</h3>
            <p className="text-xs text-slate-400 font-medium leading-relaxed mb-8 max-w-[240px] mx-auto">
              Expert in high-performance AI webapps and secure payment ecosystems. Let's connect and build the future.
            </p>

            <a 
              href="https://www.linkedin.com/in/abdulmaalik-shaikh-0259012b7?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-white text-black font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95"
            >
              <Linkedin size={18} className="fill-current" />
              Enter LinkedIn Profile
            </a>
          </div>
        </motion.div>

        <div className="mt-12 text-center">
          <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-600">
            Made by AbdulMaalik Shaikh
          </p>
        </div>
      </section>

      {/* Bottom Padding for Mobile Navbar if any */}
      <div className="h-10"></div>
    </div>
  );
}