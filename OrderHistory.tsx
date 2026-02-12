
import React from 'react';
import { X, Clock, CheckCircle2, XCircle, ShoppingBag, Mail, Lock } from 'lucide-react';
import { Transaction } from '../types';

interface OrderHistoryProps {
  transactions: Transaction[];
  onClose: () => void;
}

export const OrderHistory: React.FC<OrderHistoryProps> = ({ transactions, onClose }) => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'completed': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'cancelled': return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
      default: return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 size={14} />;
      case 'cancelled': return <XCircle size={14} />;
      default: return <Clock size={14} />;
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="glass w-full max-w-2xl h-[80vh] flex flex-col rounded-[2.5rem] overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        <div className="p-8 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-2xl font-black flex items-center gap-3 tracking-tight">
            <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-500">
              <ShoppingBag size={22} />
            </div>
            Recent Transactions
          </h2>
          <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {transactions.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-white/20 space-y-4">
              <ShoppingBag size={64} strokeWidth={1} />
              <p className="font-bold uppercase tracking-widest text-sm">No orders yet</p>
            </div>
          ) : (
            transactions.slice().reverse().map((tx) => (
              <div key={tx.id} className="glass p-5 rounded-3xl flex flex-col gap-4 border border-white/5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black ${tx.type === 'deposit' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>
                      {tx.type === 'deposit' ? '৳' : <ShoppingBag size={20} />}
                    </div>
                    <div>
                      <div className="font-black text-lg">{tx.itemName || (tx.type === 'deposit' ? 'Wallet Deposit' : 'Product Purchase')}</div>
                      <div className="text-[10px] text-white/30 uppercase font-black tracking-widest">{new Date(tx.date).toLocaleString()}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between md:justify-end gap-6">
                    <div className="text-right">
                      <div className={`text-xl font-black ${tx.type === 'deposit' ? 'text-emerald-400' : 'text-white'}`}>
                        {tx.type === 'deposit' ? '+' : '-'}৳{tx.amount}
                      </div>
                      <div className="text-[10px] text-white/30 uppercase font-black tracking-tighter">{tx.method || 'Wallet Pay'}</div>
                    </div>
                    
                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase flex items-center gap-1.5 border tracking-widest ${getStatusStyle(tx.status)}`}>
                      {getStatusIcon(tx.status)}
                      {tx.status}
                    </div>
                  </div>
                </div>

                {/* Account Details if they exist */}
                {(tx.playerID || tx.accountEmail) && (
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5 space-y-2">
                    {tx.playerID && <div className="text-xs text-blue-400 font-bold font-mono">PLAYER ID: {tx.playerID}</div>}
                    {tx.accountEmail && (
                      <div className="flex items-center gap-4">
                        <div className="text-[10px] flex items-center gap-1 text-white/40 font-black"><Mail size={12}/> EMAIL:</div>
                        <div className="text-xs font-bold text-indigo-300">{tx.accountEmail}</div>
                      </div>
                    )}
                    {tx.accountPassword && (
                      <div className="flex items-center gap-4">
                        <div className="text-[10px] flex items-center gap-1 text-white/40 font-black"><Lock size={12}/> PASS:</div>
                        <div className="text-xs font-bold text-emerald-300">{tx.accountPassword}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
