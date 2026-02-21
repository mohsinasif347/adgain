"use client";

import React, { useState } from 'react';
import { 
  Mail, MessageCircle, Send, Globe, 
  Copy, Check, ChevronRight, Headset 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContactScreen() {
  const [copied, setCopied] = useState(false);
  const supportEmail = "skilloopzz@gmail.com";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(supportEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-white px-6 pt-12 pb-32 relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header Section */}
      <div className="text-center mb-12">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 bg-blue-600/10 border border-blue-500/20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-blue-500 shadow-2xl shadow-blue-500/10"
        >
          <Headset size={40} strokeWidth={1.5} />
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-black italic uppercase tracking-tighter"
        >
          Contact Support
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-2"
        >
          AdGain VIP Assistance
        </motion.p>
      </div>

      {/* Contact Options Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        {/* Email Support Tile */}
        <motion.div variants={itemVariants} className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2.5rem] opacity-0 group-hover:opacity-10 blur-xl transition-opacity pointer-events-none" />
          <div className="bg-[#161e2d] border border-white/5 p-6 rounded-[2.5rem] relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">
                <Mail size={24} />
              </div>
              <button 
                onClick={copyToClipboard}
                className="p-3 bg-white/5 rounded-xl text-slate-400 hover:text-white transition-colors"
              >
                {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
              </button>
            </div>
            <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-1">Official Email</h3>
            <p className="font-bold text-lg mb-6 truncate">{supportEmail}</p>
            <a 
              href={`mailto:${supportEmail}`}
              className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 transition-all active:scale-95"
            >
              Send Email Now <Send size={14} />
            </a>
          </div>
        </motion.div>

        {/* Other Support Tiles */}
        <div className="grid grid-cols-2 gap-4">
          <SupportCard 
            variants={itemVariants}
            icon={MessageCircle} 
            label="WhatsApp" 
            sub="Fast Chat"
            color="text-emerald-500"
            bg="bg-emerald-500/10"
            href="https://wa.me/yournumber" // Yahan apna number add karlein
          />
          <SupportCard 
            variants={itemVariants}
            icon={Globe} 
            label="Website" 
            sub="Official"
            color="text-indigo-500"
            bg="bg-indigo-500/10"
            href="#"
          />
        </div>

        {/* Support Note */}
        <motion.div 
          variants={itemVariants}
          className="bg-white/5 border border-white/5 p-6 rounded-[2rem] flex items-start gap-4"
        >
          <div className="text-blue-500 mt-1">
            <Send size={20} />
          </div>
          <div>
            <h4 className="font-black text-[10px] uppercase tracking-widest text-blue-500 mb-1">Response Time</h4>
            <p className="text-slate-400 text-[11px] leading-relaxed font-medium italic">
              Our VIP support team typically responds within 12 to 24 hours. Please include your User ID for faster resolution.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Helper Card Component
function SupportCard({ icon: Icon, label, sub, color, bg, href, variants }: any) {
  return (
    <motion.a 
      href={href}
      target="_blank"
      variants={variants}
      className="bg-[#161e2d] border border-white/5 p-5 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 hover:bg-white/10 transition-all active:scale-95"
    >
      <div className={`w-12 h-12 ${bg} ${color} rounded-2xl flex items-center justify-center`}>
        <Icon size={24} />
      </div>
      <div className="text-center">
        <p className="font-black uppercase text-[10px] tracking-[0.2em]">{label}</p>
        <p className="text-slate-500 text-[9px] font-bold italic">{sub}</p>
      </div>
    </motion.a>
  );
}