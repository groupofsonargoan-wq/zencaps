
import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, Gamepad2, Tv, Sparkles, Search, User, Bell, 
  MessageCircle, ChevronRight, Send, Loader2, Flame, Zap,
  Settings, LogOut, ShoppingBag, Mail, Lock, Hash, ShieldCheck,
  AlertCircle, ArrowUpRight
} from 'lucide-react';
import { SUBSCRIPTIONS as INITIAL_SUBS } from './constants';
import { Category, SubscriptionItem, User as UserType, Transaction, OrderStatus } from './types';
import { WalletSection } from './components/WalletSection';
import { LiquidCard } from './components/LiquidCard';
import { Auth } from './components/Auth';
import { AdminPanel } from './components/AdminPanel';
import { OrderHistory } from './components/OrderHistory';
import { ProfileModal } from './components/ProfileModal';
import { getGeminiRecommendation } from './services/geminiService';

interface AppSettings {
  appName: string;
  bkashNumber: string;
  paymentMethod: string;
}

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [items, setItems] = useState<SubscriptionItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showLowBalanceModal, setShowLowBalanceModal] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [aiChat, setAiChat] = useState<{role: 'user' | 'bot', text: string}[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [purchasingItem, setPurchasingItem] = useState<SubscriptionItem | null>(null);
  
  // App Settings State
  const [appSettings, setAppSettings] = useState<AppSettings>({
    appName: 'ZenCaps',
    bkashNumber: '01234-567890',
    paymentMethod: 'Bkash'
  });

  // Checkout States
  const [playerUID, setPlayerUID] = useState('');
  const [accountEmail, setAccountEmail] = useState('');
  const [accountPassword, setAccountPassword] = useState('');

  const chatEndRef = useRef<HTMLDivElement>(null);
  const walletSectionRef = useRef<HTMLDivElement>(null);

  // Load persistence
  useEffect(() => {
    const savedItems = localStorage.getItem('subflow_items');
    setItems(savedItems ? JSON.parse(savedItems) : INITIAL_SUBS);
    
    const savedTxs = localStorage.getItem('subflow_transactions');
    setTransactions(savedTxs ? JSON.parse(savedTxs) : []);

    const savedUser = sessionStorage.getItem('subflow_session');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));

    const savedSettings = localStorage.getItem('zencaps_settings');
    if (savedSettings) setAppSettings(JSON.parse(savedSettings));
  }, []);

  useEffect(() => {
    if (items.length > 0) localStorage.setItem('subflow_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('subflow_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('zencaps_settings', JSON.stringify(appSettings));
  }, [appSettings]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiChat]);

  if (!currentUser) {
    return <Auth onLogin={(user) => {
      setCurrentUser(user);
      sessionStorage.setItem('subflow_session', JSON.stringify(user));
    }} />;
  }

  const userTransactions = transactions.filter(t => t.userId === currentUser.id);
  const filteredSubs = items.filter(sub => {
    const matchesCategory = 
      activeCategory === 'All' || 
      (activeCategory === 'Hot Deals' ? sub.isHot : sub.category === activeCategory);
    const matchesSearch = sub.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddMoney = (amount: number, method: string, trxID: string) => {
    const newTx: Transaction = {
      id: `DEP-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: currentUser.id,
      userName: currentUser.name,
      type: 'deposit',
      amount,
      method,
      trxID,
      date: new Date().toISOString(),
      status: 'pending' 
    };
    
    setTransactions(prev => [...prev, newTx]);
    alert(`Deposit request for ৳${amount} via ${method} submitted. Admin will confirm soon!`);
  };

  const confirmPurchase = () => {
    if (!purchasingItem) return;
    const isYouTube = purchasingItem.name.toLowerCase().includes('youtube');

    if (purchasingItem.category === 'Gaming' && !playerUID) { alert("Enter Player ID!"); return; }
    if (isYouTube && !accountEmail) { alert("Email is required!"); return; }
    if (!isYouTube && (purchasingItem.category === 'Streaming' || purchasingItem.category === 'Premium')) {
      if (!accountEmail || !accountPassword) { alert("Email & Password required!"); return; }
    }

    if (currentUser.balance >= purchasingItem.price) {
      const updatedUser = { ...currentUser, balance: currentUser.balance - purchasingItem.price };
      setCurrentUser(updatedUser);
      sessionStorage.setItem('subflow_session', JSON.stringify(updatedUser));
      
      const newTx: Transaction = {
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        userId: currentUser.id,
        userName: currentUser.name,
        type: 'purchase',
        amount: purchasingItem.price,
        itemName: purchasingItem.name,
        playerID: playerUID || undefined,
        accountEmail: accountEmail || undefined,
        accountPassword: accountPassword || undefined,
        date: new Date().toISOString(),
        status: 'pending'
      };
      
      setTransactions(prev => [...prev, newTx]);
      setPurchasingItem(null);
      setPlayerUID(''); setAccountEmail(''); setAccountPassword('');
      alert("Purchase successful!");
    } else {
      setPurchasingItem(null);
      setShowLowBalanceModal(true);
    }
  };

  const handleUpdateTransactionStatus = (txId: string, status: OrderStatus) => {
    setTransactions(prev => {
      return prev.map(tx => {
        if (tx.id === txId) {
          if (tx.type === 'deposit' && tx.status === 'pending' && status === 'completed') {
            const users: UserType[] = JSON.parse(localStorage.getItem('subflow_users') || '[]');
            const userIndex = users.findIndex(u => u.id === tx.userId);
            if (userIndex !== -1) {
              users[userIndex].balance += tx.amount;
              localStorage.setItem('subflow_users', JSON.stringify(users));
              if (currentUser.id === tx.userId) {
                const updatedUser = { ...currentUser, balance: currentUser.balance + tx.amount };
                setCurrentUser(updatedUser);
                sessionStorage.setItem('subflow_session', JSON.stringify(updatedUser));
              }
            }
          }
          return { ...tx, status };
        }
        return tx;
      });
    });
  };

  const handleAiAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiMessage.trim()) return;
    const userMsg = aiMessage;
    setAiChat(prev => [...prev, { role: 'user', text: userMsg }]);
    setAiMessage('');
    setIsAiLoading(true);
    const botResponse = await getGeminiRecommendation(userMsg);
    setAiChat(prev => [...prev, { role: 'bot', text: botResponse }]);
    setIsAiLoading(false);
  };

  return (
    <div className="min-h-screen pb-24 md:pb-8 flex flex-col items-center bg-[#050505] text-white selection:bg-blue-600/30">
      <header className="w-full max-w-6xl px-4 py-6 flex items-center justify-between sticky top-0 z-40 bg-black/50 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 cursor-pointer hover:rotate-12 transition-transform">
            <Sparkles size={20} />
          </div>
          <h1 className="text-xl font-black tracking-tighter uppercase italic">{appSettings.appName}</h1>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          {currentUser.role === 'admin' && (
            <button 
              onClick={() => setIsAdminOpen(true)} 
              className="relative w-10 h-10 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center hover:bg-blue-600/30 transition-all border border-blue-500/10"
            >
              <Settings size={20} />
              {transactions.filter(t => t.status === 'pending').length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-600 rounded-full text-[10px] flex items-center justify-center text-white font-black border-2 border-[#050505]">
                  {transactions.filter(t => t.status === 'pending').length}
                </span>
              )}
            </button>
          )}
          <div 
            onClick={() => setIsProfileOpen(true)}
            className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 max-w-[140px] md:max-w-none group cursor-pointer hover:bg-white/10 transition-all"
          >
            <User size={18} className="text-blue-400 shrink-0 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-bold truncate">{currentUser.name}</span>
          </div>
        </div>
      </header>

      <main className="w-full max-w-6xl px-4 py-6">
        <div ref={walletSectionRef}>
          <WalletSection 
            balance={currentUser.balance} 
            bkashNumber={appSettings.bkashNumber}
            onAddMoney={handleAddMoney} 
            onViewHistory={() => setIsHistoryOpen(true)}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input 
              placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-4 py-5 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-white font-medium"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {['All', 'Hot Deals', 'Streaming', 'Gaming', 'Premium'].map((cat) => (
              <button
                key={cat} onClick={() => setActiveCategory(cat as any)}
                className={`px-8 py-5 rounded-2xl whitespace-nowrap font-black text-xs transition-all flex items-center gap-3 border ${
                  activeCategory === cat 
                  ? 'bg-white text-black border-white shadow-xl shadow-white/5' 
                  : 'bg-white/5 text-white/40 hover:bg-white/10 border-white/5'
                }`}
              >
                {cat === 'Hot Deals' && <Flame size={16} className={activeCategory === cat ? 'text-orange-600' : 'text-orange-400'} />}
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSubs.map((sub) => (
            <LiquidCard 
              key={sub.id} 
              className="p-0 flex flex-col border border-white/5 hover:border-white/20" 
              onClick={() => setPurchasingItem(sub)}
            >
              <div className="h-48 relative overflow-hidden">
                <img src={sub.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all" />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className={`text-[10px] font-black uppercase mb-1 tracking-widest ${sub.isHot ? 'text-orange-500' : 'text-blue-500'}`}>
                    {sub.category}
                  </div>
                  <h3 className="text-2xl font-black mb-3 leading-tight">{sub.name}</h3>
                  <p className="text-sm text-white/40 line-clamp-2">{sub.description}</p>
                </div>
                <div className="flex items-center justify-between mt-8">
                  <span className="text-3xl font-black">৳{sub.price}</span>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5 group-hover:bg-blue-600 transition-all">
                    <ChevronRight size={20}/>
                  </div>
                </div>
              </div>
            </LiquidCard>
          ))}
        </div>
      </main>

      {isHistoryOpen && <OrderHistory transactions={userTransactions} onClose={() => setIsHistoryOpen(false)} />}
      {isProfileOpen && <ProfileModal user={currentUser} transactions={transactions} onClose={() => setIsProfileOpen(false)} onLogout={() => setCurrentUser(null)} />}

      {showLowBalanceModal && (
        <div className="fixed inset-0 z-[600] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="glass w-full max-w-sm p-10 rounded-[3rem] animate-in zoom-in duration-300 border border-rose-500/20 shadow-2xl text-center">
            <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-rose-500/20">
               <AlertCircle size={40} className="text-rose-500" />
            </div>
            <h3 className="text-3xl font-black mb-2">Low Balance!</h3>
            <p className="text-white/40 font-bold text-sm mb-8 leading-relaxed">Please add money to your wallet.</p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => { setShowLowBalanceModal(false); walletSectionRef.current?.scrollIntoView({ behavior: 'smooth' }); }}
                className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-blue-500 uppercase tracking-widest text-xs"
              >
                Deposit Now <ArrowUpRight size={18} />
              </button>
              <button onClick={() => setShowLowBalanceModal(false)} className="w-full py-4 bg-white/5 text-white/40 rounded-2xl font-black hover:bg-white/10 uppercase tracking-widest text-[10px]">Close</button>
            </div>
          </div>
        </div>
      )}

      {purchasingItem && (
        <div className="fixed inset-0 z-[500] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="glass w-full max-w-md p-10 rounded-[3rem] animate-in zoom-in duration-300 border border-white/10 shadow-2xl relative">
            <button onClick={() => setPurchasingItem(null)} className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors">✕</button>
            <div className="flex flex-col items-center mb-8">
               <div className="w-16 h-16 bg-blue-600/20 rounded-3xl flex items-center justify-center mb-4"><ShoppingBag size={32} className="text-blue-500" /></div>
               <h3 className="text-3xl font-black text-center leading-tight">Order Now</h3>
               <p className="text-white/40 font-bold mt-1 text-[10px] uppercase tracking-widest">{purchasingItem.name}</p>
            </div>
            <div className="space-y-6 mb-8">
              {purchasingItem.category === 'Gaming' ? (
                <div>
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-3 ml-1">Player ID (UID)</label>
                  <input type="text" value={playerUID} onChange={e => setPlayerUID(e.target.value)} placeholder="Enter Game ID" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:outline-none focus:border-blue-500 text-2xl font-black tracking-widest text-center" />
                </div>
              ) : (purchasingItem.category === 'Streaming' || purchasingItem.category === 'Premium') ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2 ml-1">Email</label>
                    <input type="email" value={accountEmail} onChange={e => setAccountEmail(e.target.value)} placeholder="your@email.com" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500 font-bold" />
                  </div>
                  {!purchasingItem.name.toLowerCase().includes('youtube') && (
                    <div>
                      <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2 ml-1">Password</label>
                      <input type="text" value={accountPassword} onChange={e => setAccountPassword(e.target.value)} placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500 font-bold" />
                    </div>
                  )}
                </div>
              ) : null}
            </div>
            <div className="flex gap-4">
              <button onClick={() => setPurchasingItem(null)} className="flex-1 py-5 bg-white/5 rounded-2xl font-black hover:bg-white/10 transition-colors text-xs uppercase">Back</button>
              <button onClick={confirmPurchase} className="flex-1 py-5 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-500 shadow-2xl shadow-blue-600/30 text-xs uppercase tracking-widest">Pay ৳{purchasingItem.price}</button>
            </div>
          </div>
        </div>
      )}

      {isAdminOpen && (
        <AdminPanel 
          items={items} 
          transactions={transactions}
          appSettings={appSettings}
          onUpdateItems={setItems} 
          onUpdateSettings={setAppSettings}
          onUpdateTransactionStatus={handleUpdateTransactionStatus}
          onClose={() => setIsAdminOpen(false)} 
        />
      )}

      <button onClick={() => setIsAiOpen(true)} className="fixed bottom-28 right-6 md:bottom-10 md:right-10 w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[2rem] shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 border border-white/20 group">
        <MessageCircle size={28} className="text-white group-hover:rotate-12 transition-transform" />
      </button>

      <nav className="fixed bottom-0 left-0 w-full md:hidden glass border-t border-white/10 px-8 py-5 flex items-center justify-between z-50 rounded-t-3xl">
        <button onClick={() => { setActiveCategory('All'); setIsProfileOpen(false); setIsHistoryOpen(false); }} className={`flex flex-col items-center gap-1.5 ${activeCategory === 'All' && !isProfileOpen && !isHistoryOpen ? 'text-blue-400' : 'text-white/30'}`}>
          <Home size={24} /><span className="text-[10px] font-black uppercase tracking-tighter">Home</span>
        </button>
        <button onClick={() => setIsHistoryOpen(true)} className={`flex flex-col items-center gap-1.5 ${isHistoryOpen ? 'text-blue-400' : 'text-white/30'}`}>
          <Tv size={24} /><span className="text-[10px] font-black uppercase tracking-tighter">Orders</span>
        </button>
        <button onClick={() => setActiveCategory('Gaming')} className={`flex flex-col items-center gap-1.5 ${activeCategory === 'Gaming' ? 'text-blue-400' : 'text-white/30'}`}>
          <Gamepad2 size={24} /><span className="text-[10px] font-black uppercase tracking-tighter">Play</span>
        </button>
        <button onClick={() => setIsProfileOpen(true)} className={`flex flex-col items-center gap-1.5 ${isProfileOpen ? 'text-blue-400' : 'text-white/30'}`}>
          <User size={24} /><span className="text-[10px] font-black uppercase tracking-tighter">Me</span>
        </button>
      </nav>

      {isAiOpen && (
        <div className="fixed inset-0 z-[600] flex items-end justify-center md:justify-end md:p-8">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsAiOpen(false)} />
          <div className="relative w-full max-w-lg glass h-[85vh] md:h-[650px] rounded-t-[3rem] md:rounded-[3rem] flex flex-col animate-in slide-in-from-bottom border-t md:border border-white/10 shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-white/10 flex items-center justify-between font-black bg-white/5">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"><Sparkles size={16}/></div>
                 <span className="uppercase tracking-widest text-sm">{appSettings.appName} Intelligence</span>
              </div>
              <button onClick={() => setIsAiOpen(false)} className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center text-white/50">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
              {aiChat.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-5 rounded-[2rem] text-sm font-medium max-w-[85%] leading-relaxed ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white/10 text-white/80 rounded-tl-none border border-white/5'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isAiLoading && <div className="text-xs text-blue-400 font-black animate-pulse uppercase tracking-widest ml-4">Researching...</div>}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={handleAiAsk} className="p-8 border-t border-white/10 flex gap-3 bg-white/5">
              <input value={aiMessage} onChange={e => setAiMessage(e.target.value)} placeholder="How can I help you today?" className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none text-white text-sm focus:border-blue-500 transition-all" />
              <button type="submit" className="bg-blue-600 p-4 rounded-2xl shadow-xl hover:scale-105 transition-transform"><Send size={20}/></button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
