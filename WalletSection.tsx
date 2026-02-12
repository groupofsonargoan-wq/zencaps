
import React, { useState } from 'react';
import { Wallet, Plus, ArrowUpRight, History, Hash } from 'lucide-react';
import { LiquidCard } from './LiquidCard';

interface WalletSectionProps {
  balance: number;
  bkashNumber: string;
  onAddMoney: (amount: number, method: string, trxID: string) => void;
  onViewHistory: () => void;
}

export const WalletSection: React.FC<WalletSectionProps> = ({ balance, bkashNumber, onAddMoney, onViewHistory }) => {
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [amount, setAmount] = useState('');
  const [trxID, setTrxID] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount && trxID) {
      onAddMoney(Number(amount), 'Bkash', trxID);
      setShowAddMoney(false);
      setAmount('');
      setTrxID('');
    } else if (!trxID) {
      alert("Please enter the Transaction ID (TrxID)");
    }
  };

  return (
    <section className="mb-8 w-full max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LiquidCard className="liquid-gradient border-none !p-8 flex flex-col justify-between min-h-[180px] shadow-2xl shadow-blue-900/20">
          <div>
            <div className="flex items-center gap-2 text-white/70 mb-2">
              <Wallet size={20} />
              <span className="font-bold uppercase tracking-widest text-[10px]">Total Balance</span>
            </div>
            <h2 className="text-5xl font-black tracking-tighter">৳ {balance.toLocaleString()}</h2>
          </div>
          <div className="flex gap-4 mt-8">
            <button 
              onClick={() => setShowAddMoney(true)}
              className="bg-white text-blue-900 px-8 py-3 rounded-2xl font-black flex items-center gap-2 hover:scale-105 transition-all shadow-xl"
            >
              <Plus size={20} />
              Deposit
            </button>
            <button 
              onClick={onViewHistory}
              className="bg-white/10 text-white px-8 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-white/20 transition-all border border-white/5"
            >
              <History size={20} />
              History
            </button>
          </div>
        </LiquidCard>

        <div className="grid grid-cols-2 gap-4">
          <LiquidCard className="flex flex-col justify-center items-center text-center group">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4 group-hover:scale-110 transition-transform border border-emerald-500/20">
              <ArrowUpRight size={28} />
            </div>
            <div className="text-2xl font-black">Secure</div>
            <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">Verified Gate</div>
          </LiquidCard>
          <LiquidCard className="flex flex-col justify-center items-center text-center group">
             <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-4 group-hover:scale-110 transition-transform border border-purple-500/20">
              <Plus size={28} />
            </div>
            <div className="text-2xl font-black">Insta</div>
            <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">Fast Support</div>
          </LiquidCard>
        </div>
      </div>

      {showAddMoney && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[200] flex items-center justify-center p-4">
          <div className="glass w-full max-w-md rounded-[3rem] p-10 animate-in zoom-in duration-300 border border-white/10 shadow-2xl relative">
            <button 
              onClick={() => setShowAddMoney(false)}
              className="absolute top-8 right-8 w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-colors"
            >
              ✕
            </button>

            <h3 className="text-3xl font-black mb-2">Deposit Funds</h3>
            <p className="text-white/40 text-sm mb-8 font-medium">Add balance to your wallet via Bkash.</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-pink-600/5 border border-pink-600/20 rounded-[2rem] p-6 text-xs font-medium leading-relaxed">
                <div className="text-[10px] font-black uppercase text-pink-500 mb-2 tracking-widest">Bkash Send Money Instruction</div>
                <p className="text-white/80">Please send money to our official agent number:</p>
                <p className="text-2xl font-black text-white mt-2 flex items-center justify-between">
                  {bkashNumber}
                  <span className="text-[10px] bg-white/10 px-2 py-1 rounded-lg">AGENT</span>
                </p>
                <p className="mt-4 text-white/40 italic">Note: Keep your TrxID safe after sending.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-3 ml-1">1. Amount (BDT)</label>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500 transition-all text-xl font-black text-white"
                    placeholder="e.g. 500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-3 ml-1">2. Transaction ID (TrxID)</label>
                  <div className="relative">
                    <Hash className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input 
                      type="text" 
                      value={trxID}
                      onChange={(e) => setTrxID(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:border-blue-500 transition-all text-lg font-bold text-white uppercase tracking-widest"
                      placeholder="TRX123456789"
                      required
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-blue-500 transition-all shadow-2xl shadow-blue-600/30 flex items-center justify-center gap-3"
              >
                Submit Request
                <ArrowUpRight size={20} />
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
