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
    <div className="min-h-screen bg-[#0b1120] text-white px-6 pt-12 pb-32 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-5%] right-[-5%] w-64 h-64 bg-indigo-600/10 blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="mb-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 mb-6"
        >
          <Scale size={28} />
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-black italic uppercase tracking-tighter"
        >
          Terms & <br /> <span className="text-blue-500">Privacy Policy</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2"
        >
          Last Updated: {lastUpdated}
        </motion.p>
      </div>

      {/* Content Sections */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6"
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
          className="p-6 rounded-[2.5rem] bg-gradient-to-br from-blue-600/20 to-transparent border border-blue-500/20 mt-8"
        >
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle2 size={18} className="text-blue-500" />
            <h4 className="font-black text-xs uppercase tracking-widest">Our Commitment</h4>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed italic font-medium">
            AdGain is committed to providing a transparent earning platform. We continuously update our policies to ensure a safe and rewarding experience for all our VIP members.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Sub-Component for scannable sections
function PolicySection({ icon: Icon, title, content, variants }: any) {
  return (
    <motion.div variants={variants} className="group">
      <div className="flex gap-4 items-start">
        <div className="mt-1 w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:bg-blue-600/20 group-hover:text-blue-500 transition-all">
          <Icon size={16} />
        </div>
        <div className="flex-1">
          <h3 className="font-black text-[11px] uppercase tracking-widest text-slate-200 mb-2 flex items-center justify-between">
            {title}
            <ChevronRight size={14} className="text-slate-800" />
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            {content}
          </p>
        </div>
      </div>
      <div className="h-[1px] w-full bg-white/5 mt-6" />
    </motion.div>
  );
}