"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { 
  Users, UserX, UserCheck, Search, 
  ShieldAlert, Loader2, AlertTriangle, X 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- 1. Shimmer/Skeleton Loader Component ---
const UserSkeleton = () => (
  <div className="bg-[#161e2d] border border-white/5 p-5 rounded-[2rem] flex items-center justify-between animate-pulse">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-white/5" />
      <div className="space-y-2">
        <div className="h-4 bg-white/10 rounded w-24" />
        <div className="h-3 bg-white/5 rounded w-16" />
      </div>
    </div>
    <div className="w-20 h-8 bg-white/5 rounded-xl" />
  </div>
);

export default function UsersManagement() {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<'active' | 'blocked'>('active');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{show: boolean, user: any | null}>({
    show: false,
    user: null
  });

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc('get_admin_users', { status_filter: activeTab });
    if (!error) setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [activeTab]);

  const handleToggleStatus = async () => {
    if (!confirmModal.user) return;
    
    const user = confirmModal.user;
    const nextStatus = user.status === 'active' ? 'blocked' : 'active';
    
    setConfirmModal({ show: false, user: null });
    setActionLoading(user.id);

    const { data, error } = await supabase.rpc('toggle_user_status', { 
      target_user_id: user.id, 
      new_status: nextStatus 
    });

    if (!error && data.success) {
      setUsers(prev => prev.filter(u => u.id !== user.id));
    }
    setActionLoading(null);
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-white px-6 pb-24">
      
      {/* Header */}
      <header className="py-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black italic uppercase tracking-tighter">User Controls</h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">
            {activeTab} accounts: {users.length}
          </p>
        </div>
        <div className="p-3 bg-white/5 rounded-2xl text-blue-500">
            <Users size={20} />
        </div>
      </header>

      {/* Professional Tabs */}
      <div className="flex p-1.5 bg-[#161e2d] border border-white/5 rounded-[1.5rem] mb-8 relative">
        <button 
          onClick={() => setActiveTab('active')}
          className={`relative z-10 flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'active' ? 'text-white' : 'text-slate-500'}`}
        >
          <UserCheck size={16} /> Active
        </button>
        <button 
          onClick={() => setActiveTab('blocked')}
          className={`relative z-10 flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'blocked' ? 'text-white' : 'text-slate-500'}`}
        >
          <UserX size={16} /> Blocked
        </button>
        
        {/* Animated Background Slider for Tabs */}
        <motion.div 
          animate={{ x: activeTab === 'active' ? '0%' : '100%' }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute top-1.5 bottom-1.5 left-1.5 w-[calc(50%-6px)] bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20"
        />
      </div>

      {/* Users List Area */}
      <div className="space-y-4">
        {loading ? (
          <>
            <UserSkeleton />
            <UserSkeleton />
            <UserSkeleton />
            <UserSkeleton />
          </>
        ) : users.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-20 bg-white/5 rounded-[2.5rem] border border-dashed border-white/10"
          >
            <Search className="mx-auto text-slate-700 mb-3" size={40} />
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">No {activeTab} users found</p>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            {users.map((user) => (
              <motion.div
                key={user.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, x: -100, transition: { duration: 0.3 } }}
                className="bg-[#161e2d] border border-white/5 p-5 rounded-[2.5rem] flex items-center justify-between group relative overflow-hidden"
              >
                <div className="flex items-center gap-4 relative z-10">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner ${activeTab === 'active' ? 'bg-blue-500/10 text-blue-500' : 'bg-red-500/10 text-red-500'}`}>
                    {user.full_name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h3 className="font-black text-sm tracking-tight">{user.full_name || 'User'}</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1">
                      <span className="text-yellow-500/80">{user.balance}</span> Coins
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => setConfirmModal({ show: true, user })}
                  disabled={actionLoading === user.id}
                  className={`relative z-10 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeTab === 'active' 
                    ? 'bg-red-500/10 text-red-500 border border-red-500/20 active:bg-red-500 active:text-white' 
                    : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 active:bg-emerald-500 active:text-white'
                  }`}
                >
                  {actionLoading === user.id ? '...' : activeTab === 'active' ? 'Block' : 'Unblock'}
                </button>
                
                {/* Background Ambient Decor */}
                <div className={`absolute -right-4 -bottom-4 w-16 h-16 blur-2xl opacity-10 rounded-full ${activeTab === 'active' ? 'bg-blue-500' : 'bg-red-500'}`} />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* --- Confirmation Modal --- */}
      <AnimatePresence>
        {confirmModal.show && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setConfirmModal({ show: false, user: null })}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-[#1e293b] w-full max-w-sm rounded-[3rem] p-8 border border-white/10 shadow-2xl"
            >
              <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <ShieldAlert size={32} />
              </div>
              
              <h2 className="text-xl font-black text-center mb-2 italic uppercase tracking-tighter">
                Confirm {activeTab === 'active' ? 'Block' : 'Unblock'}?
              </h2>
              <p className="text-slate-400 text-center text-xs font-medium px-4 mb-8">
                Are you sure you want to {activeTab === 'active' ? 'block' : 'unblock'} <span className="text-white font-bold">{confirmModal.user?.full_name}</span>? 
                {activeTab === 'active' && " This user will not be able to earn or withdraw."}
              </p>

              <div className="flex gap-3">
                <button 
                  onClick={() => setConfirmModal({ show: false, user: null })}
                  className="flex-1 py-4 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleToggleStatus}
                  className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg transition-all active:scale-95 ${
                    activeTab === 'active' ? 'bg-red-600 shadow-red-600/20' : 'bg-emerald-600 shadow-emerald-600/20'
                  }`}
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}