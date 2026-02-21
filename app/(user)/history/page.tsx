"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { History, ArrowDownLeft, ArrowUpRight, Clock, CheckCircle, XCircle, ChevronLeft, Loader2, Coins } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HistoryPage() {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<'earnings' | 'withdrawals'>('earnings');
  
  const [earnings, setEarnings] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  
  // Lazy Loading Pagination States
  const [earningPage, setEarningPage] = useState(0);
  const [withdrawalPage, setWithdrawalPage] = useState(0);
  const [hasMoreEarnings, setHasMoreEarnings] = useState(true);
  const [hasMoreWithdrawals, setHasMoreWithdrawals] = useState(true);
  const LIMIT = 15; // Aik waqt mein 15 records aayenge

  // Data Fetching Function
  const fetchTransactions = useCallback(async (type: 'earning' | 'withdrawal', page: number, isLoadMore = false) => {
    if (!isLoadMore) setLoading(true);
    else setLoadingMore(true);

    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const from = page * LIMIT;
      const to = from + LIMIT - 1;

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', type)
        .order('created_at', { ascending: false }) // Latest hamesha upar
        .range(from, to);

      if (!error && data) {
        if (type === 'earning') {
          setEarnings(prev => isLoadMore ? [...prev, ...data] : data);
          setHasMoreEarnings(data.length === LIMIT);
        } else {
          setWithdrawals(prev => isLoadMore ? [...prev, ...data] : data);
          setHasMoreWithdrawals(data.length === LIMIT);
        }
      }
    }

    setLoading(false);
    setLoadingMore(false);
  }, [supabase]);

  // Jab page load ho ya tab change ho to data fetch karo
  useEffect(() => {
    if (activeTab === 'earnings' && earnings.length === 0) {
      fetchTransactions('earning', 0);
    } else if (activeTab === 'withdrawals' && withdrawals.length === 0) {
      fetchTransactions('withdrawal', 0);
    }
  }, [activeTab, fetchTransactions, earnings.length, withdrawals.length]);

  const loadMore = () => {
    if (activeTab === 'earnings') {
      const nextPage = earningPage + 1;
      setEarningPage(nextPage);
      fetchTransactions('earning', nextPage, true);
    } else {
      const nextPage = withdrawalPage + 1;
      setWithdrawalPage(nextPage);
      fetchTransactions('withdrawal', nextPage, true);
    }
  };

  // Date format helper
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', month: 'short', year: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Status Icon component with lowercase check
  const StatusIcon = ({ status }: { status: string }) => {
    if (status === 'completed') return <CheckCircle size={16} className="text-earning-500" />;
    if (status === 'rejected') return <XCircle size={16} className="text-red-500" />;
    return <Clock size={16} className="text-reward-500" />;
  };

  // VIP Skeleton Loader Component for History List
  const HistorySkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-2xl flex justify-between items-center animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/10 rounded-xl"></div>
            <div className="space-y-2">
              <div className="w-32 h-4 bg-white/10 rounded-md"></div>
              <div className="w-24 h-2 bg-white/5 rounded-md"></div>
            </div>
          </div>
          <div className="space-y-2 text-right">
            <div className="w-16 h-5 bg-white/10 rounded-md ml-auto"></div>
            <div className="w-12 h-2 bg-white/5 rounded-md ml-auto"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-dark-bg text-white pb-24 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-5%] w-72 h-72 bg-primary-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <header className="px-6 pt-10 pb-6 flex items-center gap-4 relative z-10 border-b border-white/5 bg-dark-bg/80 backdrop-blur-md sticky top-0">
        <Link href="/dashboard" className="p-2 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
          <ChevronLeft size={24} className="text-slate-300" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transaction History</h1>
          <p className="text-xs text-slate-400 mt-1">Track your earnings and payouts</p>
        </div>
      </header>

      <main className="px-6 pt-6 relative z-10">
        {/* Custom Tabs */}
        <div className="flex bg-dark-card border border-white/5 rounded-2xl p-1 mb-8">
          <button 
            onClick={() => setActiveTab('earnings')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'earnings' ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Ad Earnings
          </button>
          <button 
            onClick={() => setActiveTab('withdrawals')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'withdrawals' ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Withdrawals
          </button>
        </div>

        {/* Dynamic Content Area */}
        <div className="space-y-4">
          
          {/* Loading State with Shimmer */}
          {loading && !loadingMore ? (
            <HistorySkeleton />
          ) : (
            <>
              {/* Earnings List */}
              {activeTab === 'earnings' && (
                <>
                  {earnings.length > 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                      {earnings.map((item) => (
                        <div key={item.id} className="bg-white/5 border border-white/10 p-4 rounded-2xl flex justify-between items-center group hover:bg-white/10 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-earning-500/10 rounded-xl flex items-center justify-center text-earning-500 border border-earning-500/20">
                              <ArrowDownLeft size={20} />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-200">{item.description || 'Ad Reward Credited'}</p>
                              <p className="text-[10px] text-slate-500 font-medium tracking-wide mt-1">{formatDate(item.created_at)}</p>
                            </div>
                          </div>
                          <p className="text-base font-black text-earning-500 flex items-center gap-1.5">
                            +{Math.round(item.amount)}
                            <Coins size={16} className="text-yellow-500" />
                          </p>
                        </div>
                      ))}
                    </motion.div>
                  ) : (
                    <div className="text-center py-16 text-slate-500 bg-dark-card border border-white/5 rounded-3xl">
                      <History size={48} className="mx-auto mb-4 opacity-20" />
                      <p>No earnings yet. Start watching ads!</p>
                    </div>
                  )}
                  
                  {/* Load More Button for Earnings */}
                  {hasMoreEarnings && earnings.length > 0 && (
                    <button 
                      onClick={loadMore} disabled={loadingMore}
                      className="w-full py-4 text-sm font-bold text-primary-400 hover:text-primary-300 flex items-center justify-center gap-2"
                    >
                      {loadingMore ? <Loader2 size={16} className="animate-spin" /> : 'Load More Records'}
                    </button>
                  )}
                </>
              )}

              {/* Withdrawals List */}
              {activeTab === 'withdrawals' && (
                <>
                  {withdrawals.length > 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                      {withdrawals.map((item) => (
                        <div key={item.id} className="bg-white/5 border border-white/10 p-4 rounded-2xl flex justify-between items-center group hover:bg-white/10 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-reward-500/10 rounded-xl flex items-center justify-center text-reward-500 border border-reward-500/20">
                              <ArrowUpRight size={20} />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-200 max-w-[150px] truncate">{item.description || 'Withdrawal'}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <StatusIcon status={item.status} />
                                <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">{item.status}</p>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-base font-black text-white flex items-center justify-end gap-1.5">
                              -{Math.round(item.amount)}
                              <Coins size={16} className="text-yellow-500" />
                            </p>
                            <p className="text-[10px] text-slate-500 font-medium tracking-wide mt-1">{formatDate(item.created_at)}</p>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  ) : (
                    <div className="text-center py-16 text-slate-500 bg-dark-card border border-white/5 rounded-3xl">
                      <History size={48} className="mx-auto mb-4 opacity-20" />
                      <p>No withdrawal requests found.</p>
                    </div>
                  )}

                  {/* Load More Button for Withdrawals */}
                  {hasMoreWithdrawals && withdrawals.length > 0 && (
                    <button 
                      onClick={loadMore} disabled={loadingMore}
                      className="w-full py-4 text-sm font-bold text-primary-400 hover:text-primary-300 flex items-center justify-center gap-2"
                    >
                      {loadingMore ? <Loader2 size={16} className="animate-spin" /> : 'Load More Records'}
                    </button>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}