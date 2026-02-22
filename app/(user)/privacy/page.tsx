"use client";

import React from 'react';
import { 
  ShieldCheck, FileText, Lock, Scale, 
  AlertCircle, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function PrivacyScreen() {
  const lastUpdated = "February 21, 2026";

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0b1120] text-slate-900 dark:text-white px-6 pt-12 pb-32 relative overflow-hidden transition-colors duration-300">
      {/* Background Glow - Light mode mein soft aur dark mein indigo */}
      <div className="absolute top-[-5%] right-[-5%] w-72 h-72 bg-blue-500/5 dark:bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="mb-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-16 h-16 bg-blue-500/10 rounded-[1.5rem] flex items-center justify-center text-blue-600 dark:text-blue-500 mb-8 border border-blue-500/10"
        >
          <Scale size={32} />
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-black italic uppercase tracking-tighter leading-none"
        >
          Terms & <br /> <span className="text-blue-600 dark:text-blue-500">Privacy Policy</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-slate-500 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-4"
        >
          Last Updated: {lastUpdated}
        </motion.p>
      </div>

      {/* Content Sections */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-8 relative z-10"
      >
        <PolicySection 
          icon={FileText}
          title="User Agreement"
          content="By using AdGain, you agree to watch ads fairly. Any use of bots, VPNs, or automated scripts to manipulate earnings is strictly prohibited and will lead to an immediate ban."
          variants={itemVariants}
        />

        <PolicySection 
          icon={ShieldCheck}
          title="Account Security"
          content="Users are allowed only one account per device. Sharing accounts or creating multiple profiles to exploit rewards will result in the permanent suspension of all associated accounts."
          variants={itemVariants}
        />

        <PolicySection 
          icon={Lock}
          title="Data Privacy"
          content="We value your privacy. Your email and withdrawal details are encrypted. We only collect data necessary to process your rewards and prevent fraudulent activities on the platform."
          variants={itemVariants}
        />

        <PolicySection 
          icon={AlertCircle}
          title="Withdrawal Policy"
          content="Payouts are processed within 24-48 hours. If a request is rejected due to incorrect details, coins will be refunded. However, fraudulent requests will be canceled without a refund."
          variants={itemVariants}
        />

        {/* Professional Footer Note */}
        <motion.div 
          variants={itemVariants}
          className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-gradient-to-br dark:from-blue-600/20 dark:to-transparent border border-black/5 dark:border-blue-500/20 mt-10 shadow-inner"
        >
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle2 size={20} className="text-blue-600 dark:text-blue-500" />
            <h4 className="font-black text-xs uppercase tracking-widest text-slate-800 dark:text-white">Our Commitment</h4>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic font-medium">
            AdGain is committed to providing a transparent earning platform. We continuously update our policies to ensure a safe and rewarding experience for all our VIP members.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Sub-Component with Theme Support
function PolicySection({ icon: Icon, title, content, variants }: any) {
  return (
    <motion.div variants={variants} className="group">
      <div className="flex gap-5 items-start">
        <div className="mt-1 w-10 h-10 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-blue-600 dark:group-hover:bg-blue-600/20 group-hover:text-white dark:group-hover:text-blue-500 transition-all duration-300 shadow-sm dark:shadow-none">
          <Icon size={18} />
        </div>
        <div className="flex-1">
          <h3 className="font-black text-[11px] uppercase tracking-widest text-slate-800 dark:text-slate-200 mb-2 flex items-center justify-between">
            {title}
            <ChevronRight size={14} className="text-slate-300 dark:text-slate-800 group-hover:text-blue-500 transition-colors" />
          </h3>
          <p className="text-[13px] text-slate-600 dark:text-slate-500 leading-relaxed font-medium">
            {content}
          </p>
        </div>
      </div>
      {/* Separator Line */}
      <div className="h-[1px] w-full bg-black/5 dark:bg-white/5 mt-8" />
    </motion.div>
  );
}