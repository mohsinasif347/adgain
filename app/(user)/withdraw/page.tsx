"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { ChevronLeft, Wallet, Smartphone, Building, CheckCircle2, ArrowRight, AlertCircle, Loader2, Coins as CoinIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Minimum withdrawal 5000 coins
const MIN_WITHDRAWAL_COINS = 5000;
const CONVERSION_RATE = 1000; // 1000 Coins = $1

const PAYMENT_METHODS = [
  { id: 'easypaisa', name: 'EasyPaisa', icon: Smartphone },
  { id: 'jazzcash', name: 'JazzCash', icon: Smartphone },
  { id: 'binance', name: 'Binance Pay', icon: Building },
];

export default function WithdrawPage() {
  const supabase = createClient();
  const router = useRouter();
  
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Form States
  const [selectedMethod, setSelectedMethod] = useState(PAYMENT_METHODS[0]);
  const [amount, setAmount] = useState<string>('');
  const [accountDetails, setAccountDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchBalance() {
      const { data, error } = await supabase.rpc('get_user_stats');
      if (!error && data) {
        setProfile(data.profile);
      }
      setLoading(false);
    }
    fetchBalance();
  }, [supabase]);

  const handleMaxAmount = () => {
    if (profile?.balance) {
      setAmount(Math.floor(profile.balance).toString());
    }
  };

  const handleWithdrawRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const withdrawAmount = parseInt(amount);
    
    // Validations
    if (!withdrawAmount || withdrawAmount <= 0) return setError('Please enter a valid amount.');
    if (withdrawAmount < MIN_WITHDRAWAL_COINS) return setError(`Minimum withdrawal is ${MIN_WITHDRAWAL_COINS} Coins.`);
    if (withdrawAmount > profile.balance) return setError('Insufficient coin balance.');
    if (!accountDetails.trim()) return setError('Please enter your account details.');

    setIsSubmitting(true);

    try {
      const { data, error: rpcError } = await supabase.rpc('request_withdrawal', {
        w_amount: withdrawAmount,
        w_method: selectedMethod.name,
        w_details: accountDetails
      });

      if (rpcError) throw rpcError;

      const response = data as { success: boolean, message: string };

      if (response && response.success) {
        setSuccess(true);
        setTimeout(() => router.push('/history'), 3000);
      } else {
        setError(response?.message || 'Something went wrong.');
      }
    } catch (err: any) {
      setError(err.message || 'Network error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Real-time conversion calculation
  const estimatedUSD = amount ? (parseInt(amount) / CONVERSION_RATE).toFixed(2) : "0.00";

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg px-6 pt-10 pb-24 space-y-8">
        <div className="flex items-center gap-4 border-b border-white/5 pb-6">
          <div className="w-10 h-10 bg-white/5 rounded-xl animate-pulse"></div>
          <div className="w-48 h-5 bg-white/10 rounded-full animate-pulse"></div>
        </div>
        <div className="w-full h-28 bg-white/5 rounded-[2rem] animate-pulse"></div>
        <div className="h-64 bg-white/5 rounded-[2rem] animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg text-white pb-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      <header className="px-6 pt-10 pb-6 flex items-center gap-4 relative z-10 sticky top-0 bg-dark-bg/80 backdrop-blur-md border-b border-white/5">
        <Link href="/dashboard" className="p-2 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
          <ChevronLeft size={24} className="text-slate-300" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Withdraw</h1>
          <p className="text-xs text-slate-400 mt-1">Convert your coins to real cash</p>
        </div>
      </header>

      <main className="px-6 pt-6 relative z-10 max-w-md mx-auto">
        
        {/* Available Balance Card */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-900 border border-white/10 p-6 rounded-[2.5rem] flex items-center justify-between mb-8 shadow-xl shadow-primary-900/20">
          <div>
            <p className="text-primary-100/70 text-xs font-bold uppercase tracking-wider mb-1">Total Coins</p>
            <div className="flex items-center gap-2">
              <h2 className="text-3xl font-black text-white">{Math.floor(profile?.balance || 0).toLocaleString()}</h2>
              <CoinIcon size={24} className="text-yellow-400 animate-pulse" />
            </div>
          </div>
          <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center">
            <Wallet size={24} className="text-white" />
          </div>
        </div>

        {success ? (
          <div className="bg-primary-500/10 border border-primary-500/20 rounded-[2.5rem] p-8 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <CheckCircle2 size={40} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Request Sent!</h3>
            <p className="text-slate-400 text-sm">Your withdrawal is pending approval. You will be redirected shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleWithdrawRequest} className="space-y-8">
            
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-300 px-1">Payment Method</label>
              <div className="grid grid-cols-3 gap-3">
                {PAYMENT_METHODS.map((method) => {
                  const Icon = method.icon;
                  const isSelected = selectedMethod.id === method.id;
                  return (
                    <div 
                      key={method.id}
                      onClick={() => setSelectedMethod(method)}
                      className={`cursor-pointer rounded-2xl p-4 flex flex-col items-center gap-2 text-center transition-all border ${
                        isSelected 
                          ? 'bg-primary-600 border-primary-500 shadow-lg scale-105' 
                          : 'bg-white/5 border-white/5 hover:bg-white/10'
                      }`}
                    >
                      <Icon size={24} className={isSelected ? 'text-white' : 'text-slate-400'} />
                      <span className={`text-[10px] font-bold uppercase ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                        {method.name}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="text-[10px] text-slate-500 px-1 text-right italic font-medium">Minimum: {MIN_WITHDRAWAL_COINS.toLocaleString()} Coins</p>
            </div>

            <div className="space-y-4 bg-white/5 border border-white/10 p-6 rounded-[2.5rem]">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Withdraw Amount</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <CoinIcon size={16} className="text-yellow-500" />
                  </div>
                  <input 
                    type="number"
                    placeholder="Min. 5000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-dark-bg border border-white/10 rounded-xl py-3 pl-10 pr-20 text-white font-bold focus:outline-none focus:border-primary-500 transition-colors"
                  />
                  <button 
                    type="button"
                    onClick={handleMaxAmount}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                  >
                    MAX
                  </button>
                </div>
                {/* Real-time conversion display */}
                {amount && parseInt(amount) >= 1 && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[11px] text-primary-400 font-bold px-1">
                    You will receive: ${estimatedUSD} USD
                  </motion.p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account Details</label>
                <input 
                  type="text"
                  placeholder={`Enter ${selectedMethod.name} No / Email`}
                  value={accountDetails}
                  onChange={(e) => setAccountDetails(e.target.value)}
                  className="w-full bg-dark-bg border border-white/10 rounded-xl py-3 px-4 text-white font-bold focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-400 bg-red-400/10 border border-red-400/20 p-3 rounded-xl text-xs font-bold">
                  <AlertCircle size={14} />
                  <p>{error}</p>
                </div>
              )}
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold text-lg py-4 rounded-2xl shadow-xl shadow-primary-600/30 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : 'Confirm Withdrawal'}
              {!isSubmitting && <ArrowRight size={20} />}
            </button>

            <div className="flex items-center justify-center gap-2 opacity-30">
              <CoinIcon size={12} className="text-slate-400" />
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">1000 Coins = $1 USD</p>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}