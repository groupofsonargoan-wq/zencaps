
import React from 'react';
import { X, User, Mail, Wallet, ShoppingBag, Shield, LogOut } from 'lucide-react';
import { User as UserType, Transaction } from '../types';

interface ProfileModalProps {
  user: UserType;
  transactions: Transaction[];
  onClose: () => void;
  onLogout: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ user, transactions, onClose, onLogout }) => {
  const purchaseCount = transactions.filter(t => t.type === 'purchase' && t.status === 'completed').length;
  const totalSpent = transactions
    .filter(t => t.type === 'purchase' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4">
      <div className="glass w-full max-w-md rounded-[3rem] overflow-hidden animate-in zoom-in duration-300 border border-white/10 shadow-2xl">
        <div className="relative h-32 bg-gradient-to-r from-blue-600 to-indigo-600">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="px-8 pb-8 -mt-12">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-[2rem] bg-[#050505] border-4 border-[#050505] overflow-hidden shadow-2xl mb-4">
              <div className="w-full h-full bg-blue-600 flex items-center justify-center text-3xl font-black text-white">
                {user.name.charAt(0)}
              </div>
            </div>
            <h2 className="text-2xl font-black">{user.name}</h2>
            <p className="text-white/40 text-sm font-medium">{user.email}</p>
            
            {user.role === 'admin' && (
              <div className="mt-2 px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full flex items-center gap-1.5">
                <Shield size={12} className="text-purple-400" />
                <span className="text-[10px] font-black uppercase text-purple-400 tracking-widest">Administrator</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="bg-white/5 p-5 rounded-3xl border border-white/5 text-center">
              <div className="text-blue-400 mb-1 flex justify-center"><Wallet size={20} /></div>
              <div className="text-xl font-black">৳{user.balance}</div>
              <div className="text-[10px] text-white/30 uppercase font-black">Balance</div>
            </div>
            <div className="bg-white/5 p-5 rounded-3xl border border-white/5 text-center">
              <div className="text-emerald-400 mb-1 flex justify-center"><ShoppingBag size={20} /></div>
              <div className="text-xl font-black">{purchaseCount}</div>
              <div className="text-[10px] text-white/30 uppercase font-black">Orders</div>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Mail size={16} />
                </div>
                <span className="text-sm font-bold">Email Verified</span>
              </div>
              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
            </div>
            
            <button 
              onClick={() => { onLogout(); onClose(); }}
              className="w-full flex items-center justify-center gap-2 p-4 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-2xl border border-rose-500/20 transition-all font-black text-sm uppercase tracking-widest"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
