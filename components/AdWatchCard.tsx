"use client";

import React, { useState, useEffect } from 'react';
import { PlayCircle, Loader2 } from 'lucide-react';

export default function AdWatchCard({ onComplete }: { onComplete: () => void }) {
  const [isWatching, setIsWatching] = useState(false);
  const [timer, setTimer] = useState(15);
  const adLink = "https://www.highcpmgate.com/YOUR_ADSTERRA_LINK"; // Apna link yahan dalein

  const startAd = () => {
    window.open(adLink, '_blank');
    setIsWatching(true);
    setTimer(15);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isWatching && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (isWatching && timer === 0) {
      handleCredit();
    }
    return () => clearInterval(interval);
  }, [isWatching, timer]);

  const handleCredit = async () => {
    setIsWatching(false);
    const res = await fetch('/api/credit-ad', { method: 'POST' });
    if (res.ok) {
      alert("Reward Credited!");
      onComplete(); // Dashboard balance refresh karne ke liye
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 group">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="text-lg font-bold">Direct Link Ad</h3>
          <p className="text-slate-400 text-xs">Watch for 15s to earn $0.005</p>
        </div>
        
        {!isWatching ? (
          <button onClick={startAd} className="w-12 h-12 bg-earning-500 rounded-2xl flex items-center justify-center shadow-lg shadow-earning-500/30 active:scale-95 transition-all">
            <PlayCircle size={24} className="text-white fill-current" />
          </button>
        ) : (
          <div className="w-12 h-12 bg-reward-500 rounded-2xl flex items-center justify-center font-bold text-dark-bg">
            {timer}s
          </div>
        )}
      </div>
      
      {isWatching && (
        <div className="mt-6 flex items-center gap-3 text-xs text-reward-400 animate-pulse">
          <Loader2 size={14} className="animate-spin" />
          Keep the ad tab open to receive credit...
        </div>
      )}
    </div>
  );
}