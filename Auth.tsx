
import React, { useState } from 'react';
import { User, Mail, Lock, Sparkles, ArrowRight, ShieldCheck, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { User as UserType } from '../types';

interface AuthProps {
  onLogin: (user: UserType) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const SECRET_ADMIN_EMAIL = 'owner@subflow.vip'; 
  const SECRET_ADMIN_PASS = 'admin@786';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Artificial slight delay for "workable" feel
    setTimeout(() => {
      const users: UserType[] = JSON.parse(localStorage.getItem('subflow_users') || '[]');
      
      if (isLogin) {
        // --- LOGIN LOGIC ---
        
        // Admin Bypass
        if (email.toLowerCase() === SECRET_ADMIN_EMAIL.toLowerCase()) {
          if (password === SECRET_ADMIN_PASS) {
            setIsLoading(false);
            onLogin({ id: 'admin-master', name: 'Main Admin', email: SECRET_ADMIN_EMAIL, balance: 999999, role: 'admin' });
            return;
          } else {
            setIsLoading(false);
            alert("Incorrect Password");
            return;
          }
        }

        // Regular User Lookup
        const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (!foundUser) {
          setIsLoading(false);
          alert("This email is not registered");
          return;
        }

        if (foundUser.password !== password) {
          setIsLoading(false);
          alert("Incorrect Password");
          return;
        }

        setIsLoading(false);
        onLogin(foundUser);

      } else {
        // --- REGISTRATION LOGIC ---
        
        if (!name || !email || !password || !confirmPassword) {
          setIsLoading(false);
          alert("Please fill in all fields");
          return;
        }

        if (password.length < 6) {
          setIsLoading(false);
          alert("Password must be at least 6 characters long");
          return;
        }

        if (password !== confirmPassword) {
          setIsLoading(false);
          alert("Passwords do not match!");
          return;
        }

        const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
        if (emailExists) {
          setIsLoading(false);
          alert("This email is already registered! Please log in instead.");
          setIsLogin(true);
          return;
        }

        const newUser: UserType = { 
          id: `USER-${Date.now()}`, 
          name, 
          email: email.toLowerCase(), 
          password, 
          balance: 0, 
          role: 'user' 
        };

        const updatedUsers = [...users, newUser];
        localStorage.setItem('subflow_users', JSON.stringify(updatedUsers));
        
        setIsLoading(false);
        alert("Registration Successful! You can now log in.");
        setIsLogin(true);
        // Clean up sensitive fields
        setPassword('');
        setConfirmPassword('');
      }
    }, 800);
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#050505] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="glass w-full max-w-md p-10 rounded-[3rem] relative overflow-hidden border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in duration-500">
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-blue-500/40 mb-6 group cursor-pointer hover:scale-105 transition-all">
            <Sparkles className="text-white group-hover:rotate-12 transition-transform" size={36} />
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent">
            ZenCaps
          </h1>
          <p className="text-white/40 text-[10px] font-black tracking-[0.3em] uppercase mt-3">
            {isLogin ? 'Premium Access Gateway' : 'Create New Account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1">
              <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  required 
                  placeholder="John Doe" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:border-blue-500 font-bold text-white transition-all placeholder:text-white/10" 
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input 
                type="email" 
                required 
                placeholder="email@example.com" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:border-blue-500 font-bold text-white transition-all placeholder:text-white/10" 
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input 
                type={showPassword ? "text" : "password"} 
                required 
                placeholder="••••••••" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-14 py-4 focus:outline-none focus:border-blue-500 font-bold text-white transition-all placeholder:text-white/10" 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div className="space-y-1 animate-in slide-in-from-top-2 duration-300">
              <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Confirm Password</label>
              <div className="relative group">
                <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required 
                  placeholder="••••••••" 
                  value={confirmPassword} 
                  onChange={e => setConfirmPassword(e.target.value)} 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:border-blue-500 font-bold text-white transition-all placeholder:text-white/10" 
                />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm mt-4 ${isLoading ? 'opacity-70 cursor-wait' : 'active:scale-95'}`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {isLogin ? 'Sign In' : 'Create Account'}
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-white/5 text-center text-sm">
          <p className="text-white/30 font-medium">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              onClick={toggleForm} 
              className="ml-2 text-blue-400 font-black hover:text-blue-300 transition-all underline decoration-blue-500/30 underline-offset-4"
            >
              {isLogin ? 'Join ZenCaps' : 'Back to Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
