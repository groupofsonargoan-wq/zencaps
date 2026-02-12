
import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, X, Check, XCircle, Package, Settings, 
  Users, ArrowRight, LayoutDashboard, TrendingUp, 
  DollarSign, ShoppingCart, Edit2, Save, ExternalLink, Flame, Hash, CreditCard, Mail, Lock, Copy, Shield, Search, Globe
} from 'lucide-react';
import { SubscriptionItem, Category, Transaction, OrderStatus, User } from '../types';
import { LiquidCard } from './LiquidCard';

interface AdminPanelProps {
  items: SubscriptionItem[];
  transactions: Transaction[];
  appSettings: { appName: string, bkashNumber: string, paymentMethod: string };
  onUpdateItems: (items: SubscriptionItem[]) => void;
  onUpdateSettings: (settings: { appName: string, bkashNumber: string, paymentMethod: string }) => void;
  onUpdateTransactionStatus: (txId: string, status: OrderStatus) => void;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
  items, 
  transactions, 
  appSettings,
  onUpdateItems, 
  onUpdateSettings,
  onUpdateTransactionStatus,
  onClose 
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'offers' | 'orders' | 'users' | 'settings'>('dashboard');
  const [editingItem, setEditingItem] = useState<SubscriptionItem | null>(null);
  const [newItem, setNewItem] = useState<Partial<SubscriptionItem>>({
    name: '', price: 0, category: 'Gaming', description: '', image: '', currency: 'BDT', isHot: false
  });
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  
  // Local Settings Edit State
  const [editSettings, setEditSettings] = useState(appSettings);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('subflow_users') || '[]');
    setAllUsers(users);
  }, []);

  const handleAdd = () => {
    if (!newItem.name || !newItem.image) return;
    const item: SubscriptionItem = { ...newItem as SubscriptionItem, id: Date.now().toString() };
    onUpdateItems([...items, item]);
    setNewItem({ name: '', price: 0, category: 'Gaming', description: '', image: '', currency: 'BDT', isHot: false });
    alert("Offer published!");
  };

  const handleSaveSettings = () => {
    onUpdateSettings(editSettings);
    alert("System settings updated successfully!");
  };

  const handleCopy = (text: string) => navigator.clipboard.writeText(text);

  const totalEarnings = transactions.filter(t => t.type === 'purchase' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0);
  const pendingOrders = transactions.filter(t => t.status === 'pending').length;

  return (
    <div className="fixed inset-0 z-[700] bg-black/95 backdrop-blur-3xl flex flex-col overflow-hidden">
      <div className="flex flex-col h-full max-w-7xl mx-auto w-full">
        <div className="p-6 md:p-8 flex items-center justify-between border-b border-white/5">
          <div>
            <h2 className="text-3xl font-black bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Admin Hub</h2>
            <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Management Console</p>
          </div>
          <button onClick={onClose} className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 border border-white/5 group"><X className="group-hover:rotate-90 transition-transform" /></button>
        </div>

        <div className="px-6 md:px-8 py-4 flex gap-2 overflow-x-auto scrollbar-hide border-b border-white/5">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'orders', label: 'Queue', icon: Package, count: pendingOrders },
            { id: 'offers', label: 'Offers', icon: ShoppingCart },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'settings', label: 'System', icon: Settings },
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-8 py-4 rounded-2xl transition-all flex items-center gap-3 font-black whitespace-nowrap border ${activeTab === tab.id ? 'bg-white text-black border-white shadow-xl' : 'bg-white/5 text-white/40 border-white/5 hover:bg-white/10'}`}
            >
              <tab.icon size={18} /> {tab.label}
              {tab.count !== undefined && tab.count > 0 && <span className="w-5 h-5 bg-orange-600 text-white rounded-full text-[10px] flex items-center justify-center animate-bounce">{tab.count}</span>}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-in fade-in">
              <LiquidCard className="bg-blue-500/5"><div className="flex items-center gap-4"><div className="p-3 bg-blue-500 rounded-xl"><DollarSign /></div><div><div className="text-[10px] text-white/40 font-black uppercase">Earnings</div><div className="text-2xl font-black">৳{totalEarnings}</div></div></div></LiquidCard>
              <LiquidCard className="bg-orange-500/5"><div className="flex items-center gap-4"><div className="p-3 bg-orange-500 rounded-xl"><ShoppingCart /></div><div><div className="text-[10px] text-white/40 font-black uppercase">Pending</div><div className="text-2xl font-black">{pendingOrders}</div></div></div></LiquidCard>
              <LiquidCard className="bg-purple-500/5"><div className="flex items-center gap-4"><div className="p-3 bg-purple-500 rounded-xl"><Package /></div><div><div className="text-[10px] text-white/40 font-black uppercase">Products</div><div className="text-2xl font-black">{items.length}</div></div></div></LiquidCard>
              <LiquidCard className="bg-emerald-500/5"><div className="flex items-center gap-4"><div className="p-3 bg-emerald-500 rounded-xl"><Users /></div><div><div className="text-[10px] text-white/40 font-black uppercase">Users</div><div className="text-2xl font-black">{allUsers.length}</div></div></div></LiquidCard>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-bottom-4">
               <LiquidCard className="border-blue-500/20">
                  <h3 className="text-2xl font-black mb-8 flex items-center gap-3"><Globe className="text-blue-500"/> System Config</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-3">App Brand Name</label>
                      <input value={editSettings.appName} onChange={e => setEditSettings({...editSettings, appName: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-blue-500 font-black text-xl" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-3">Bkash Agent Number</label>
                      <input value={editSettings.bkashNumber} onChange={e => setEditSettings({...editSettings, bkashNumber: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-blue-500 font-black text-xl" />
                    </div>
                    <button onClick={handleSaveSettings} className="w-full py-5 bg-blue-600 rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-blue-600/20 hover:bg-blue-500 transition-all">Save All Settings</button>
                  </div>
               </LiquidCard>
            </div>
          )}

          {activeTab === 'offers' && (
            <div className="space-y-12">
              <LiquidCard className="border-blue-500/20">
                <h3 className="text-2xl font-black mb-8">{editingItem ? 'Edit Offer' : 'New Offer'}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input placeholder="Product Name" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none font-bold" value={editingItem ? editingItem.name : newItem.name} onChange={e => editingItem ? setEditingItem({...editingItem, name: e.target.value}) : setNewItem({...newItem, name: e.target.value})} />
                  <input placeholder="Price (BDT)" type="number" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none font-bold" value={editingItem ? editingItem.price : newItem.price} onChange={e => editingItem ? setEditingItem({...editingItem, price: Number(e.target.value)}) : setNewItem({...newItem, price: Number(e.target.value)})} />
                  <input placeholder="Image URL" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none font-bold" value={editingItem ? editingItem.image : newItem.image} onChange={e => editingItem ? setEditingItem({...editingItem, image: e.target.value}) : setNewItem({...newItem, image: e.target.value})} />
                  <select className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none text-white font-bold" value={editingItem ? editingItem.category : newItem.category} onChange={e => editingItem ? setEditingItem({...editingItem, category: e.target.value as Category}) : setNewItem({...newItem, category: e.target.value as Category})}>
                    <option value="Streaming">Streaming</option><option value="Gaming">Gaming</option><option value="Premium">Premium</option>
                  </select>
                </div>
                <button onClick={editingItem ? () => { onUpdateItems(items.map(i => i.id === editingItem.id ? editingItem : i)); setEditingItem(null); alert("Updated!"); } : handleAdd} className="w-full mt-8 py-5 bg-blue-600 rounded-2xl font-black uppercase">{editingItem ? 'Save Changes' : 'Publish Offer'}</button>
              </LiquidCard>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {items.map(item => (
                  <div key={item.id} className="glass rounded-3xl p-6 border border-white/5">
                    <h4 className="font-black truncate">{item.name}</h4>
                    <div className="text-xl font-black mb-4">৳{item.price}</div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingItem(item)} className="flex-1 bg-white/5 py-3 rounded-xl font-black text-[10px] uppercase">Edit</button>
                      <button onClick={() => onUpdateItems(items.filter(i => i.id !== item.id))} className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-xl flex items-center justify-center"><Trash2 size={18}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-4">
              {transactions.slice().reverse().map(tx => (
                <div key={tx.id} className="glass p-8 rounded-[2.5rem] flex flex-col md:flex-row md:items-center justify-between gap-8 border border-white/5">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${tx.status === 'pending' ? 'bg-orange-600 animate-pulse' : 'bg-white/10'}`}>{tx.status}</span>
                      <span className="text-[10px] font-black text-white/30">{tx.id}</span>
                      <span className="text-sm font-black text-blue-400">{tx.userName}</span>
                    </div>
                    <h4 className="text-xl font-black">{tx.itemName || 'Deposit'}</h4>
                    {tx.trxID && <div className="text-xs font-black text-orange-400">TRX: {tx.trxID}</div>}
                    {tx.playerID && <div className="text-xs font-black text-blue-400">UID: {tx.playerID}</div>}
                    {tx.accountEmail && <div className="text-xs font-black text-emerald-400">{tx.accountEmail}</div>}
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right"><div className="text-3xl font-black">৳{tx.amount}</div></div>
                    {tx.status === 'pending' && (
                      <div className="flex gap-2">
                        <button onClick={() => onUpdateTransactionStatus(tx.id, 'completed')} className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center"><Check size={24}/></button>
                        <button onClick={() => onUpdateTransactionStatus(tx.id, 'cancelled')} className="w-12 h-12 bg-rose-500 rounded-xl flex items-center justify-center"><XCircle size={24}/></button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'users' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allUsers.map(user => (
                <div key={user.id} className="glass rounded-[2rem] p-6 border border-white/5">
                  <h4 className="font-black text-lg">{user.name}</h4>
                  <div className="text-xs text-white/40 mb-4">{user.email}</div>
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div><div className="text-[10px] font-black uppercase text-white/20">Balance</div><div className="text-xl font-black">৳{user.balance}</div></div>
                    <div className="text-[10px] font-black uppercase text-emerald-400">{user.role}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
