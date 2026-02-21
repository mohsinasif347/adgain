"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { 
  CreditCard, CheckCircle, XCircle, User, 
  Loader2, AlertCircle, Info, X 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- 1. Shimmer/Skeleton Component ---
const RequestSkeleton = () => (
  <div className="bg-[#161e2d] border border-white/5 rounded-[2.5rem] p-6 animate-pulse">
    <div className="flex justify-between items-start mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white/5 rounded-full" />
        <div className="space-y-2">
          <div className="h-3 bg-white/10 rounded w-20" />
          <div className="h-2 bg-white/5 rounded w-24" />
        </div>
      </div>
      <div className="h-6 bg-white/10 rounded w-16" />
    </div>
    <div className="h-16 bg-white/5 rounded-2xl mb-6" />
    <div className="grid grid-cols-2 gap-3">
      <div className="h-12 bg-white/5 rounded-2xl" />
      <div className="h-12 bg-white/5 rounded-2xl" />
    </div>
  </div>
);

export default function WithdrawalRequests() {
  const supabase = createClient();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [modalData, setModalData] = useState<{
    req: any | null, 
    type: 'Approved' | 'Rejected' | null
  }>({ req: null, type: null });
  
  const [rejectionNote, setRejectionNote] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc('get_pending_withdrawals');
    if (!error) setRequests(data);
    setLoading(false);
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleAction = async () => {
    if (!modalData.req || !modalData.type) return;

    const { id } = modalData.req;
    const status = modalData.type;
    
    setProcessingId(id);
    setModalData({ req: null, type: null }); // Close modal immediately

    const { data, error } = await supabase.rpc('process_withdrawal', {
      target_id: id,
      new_status: status,
      admin_note: status === 'Rejected' ? rejectionNote : 'Approved by Admin'
    });

    if (!error && data.success) {
      setRequests(prev => prev.filter(r => r.id !== id));
      setRejectionNote('');
    }
    setProcessingId(null);
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-white px-6 pb-24">
      <header className="py-8">
        <h1 className="text-2xl font-black italic uppercase tracking-tighter">Payout Requests</h1>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1 italic">
          Pending Verification: {requests.length}
        </p>
      </header>

      <div className="space-y-4">
        {loading ? (
          <>
            <RequestSkeleton />
            <RequestSkeleton />
            <RequestSkeleton />
          </>
        ) : requests.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 opacity-20 italic text-sm">
            No pending payouts found.
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            {requests.map((req) => (
              <motion.div 
                key={req.id} 
                layout
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, x: 100, transition: { duration: 0.3 } }}
                className="bg-[#161e2d] border border-white/5 rounded-[2.5rem] p-6 shadow-2xl relative overflow-hidden group"
              >
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 shadow-inner">
                      <User size={20} />
                    </div>
                    <div>
                      <h3 className="font-black text-sm tracking-tight">{req.full_name}</h3>
                      <p className="text-[10px] text-slate-500 font-bold">{new Date(req.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-emerald-400 italic tracking-tighter">
                      {req.amount} <span className="text-[10px] text-emerald-500/50">COINS</span>
                    </p>
                  </div>
                </div>

                <div className="bg-[#0b1120]/50 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-white/5 space-y-2 relative z-10">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <span>Method</span>
                    <span className="text-blue-400">{req.payment_method}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <span>Account</span>
                    <span className="text-slate-300 truncate max-w-[150px]">{req.account_details}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 relative z-10">
                  <button 
                    disabled={processingId === req.id}
                    onClick={() => setModalData({ req, type: 'Approved' })}
                    className="bg-emerald-600 shadow-lg shadow-emerald-900/20 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    <CheckCircle size={14} /> Approve
                  </button>
                  <button 
                    disabled={processingId === req.id}
                    onClick={() => setModalData({ req, type: 'Rejected' })}
                    className="bg-white/5 border border-white/10 text-red-500 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    <XCircle size={14} /> Reject
                  </button>
                </div>
                
                {/* Decorative Background Blur */}
                <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-blue-600/5 blur-3xl rounded-full pointer-events-none" />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* --- Unified Confirmation Modal --- */}
      <AnimatePresence>
        {modalData.req && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setModalData({ req: null, type: null })}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-[#1e293b] w-full max-w-sm rounded-[3rem] p-8 border border-white/10 shadow-2xl"
            >
              <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6 ${modalData.type === 'Approved' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                {modalData.type === 'Approved' ? <CheckCircle size={32} /> : <AlertCircle size={32} />}
              </div>

              <h2 className="text-xl font-black text-center italic uppercase tracking-tighter mb-2">
                Confirm {modalData.type}?
              </h2>
              <p className="text-slate-400 text-center text-xs font-medium px-4 mb-6">
                Are you sure you want to {modalData.type?.toLowerCase()} payout for <span className="text-white font-bold">{modalData.req.full_name}</span>?
              </p>

              {modalData.type === 'Rejected' && (
                <textarea 
                  value={rejectionNote}
                  onChange={(e) => setRejectionNote(e.target.value)}
                  placeholder="Reason for rejection..."
                  className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 min-h-[100px] mb-6 text-white"
                />
              )}

              <div className="flex gap-3">
                <button 
                  onClick={() => setModalData({ req: null, type: null })}
                  className="flex-1 py-4 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAction}
                  className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg ${
                    modalData.type === 'Approved' ? 'bg-emerald-600 shadow-emerald-600/20' : 'bg-red-600 shadow-red-600/20'
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