
import React, { useState, useMemo } from 'react';
import { User, Company } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
  users: User[];
  companies: Company[];
}

const Login: React.FC<LoginProps> = ({ onLogin, users, companies }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const recognizedUser = useMemo(() => {
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }, [email, users]);

  const recognizedCompany = useMemo(() => {
    if (!recognizedUser) return null;
    if (recognizedUser.isMaster) return { name: 'Sistem Yöneticisi', taxId: 'PLATFORM' };
    return companies.find(c => c.id === recognizedUser.companyId);
  }, [recognizedUser, companies]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (recognizedUser) {
      onLogin(recognizedUser);
    } else {
      setError('Geçersiz e-posta adresi. (Örn: master@kiraki.com, admin@kiraki.com)');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-950 p-4 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-blue-900/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-blue-800/20 rounded-full blur-[120px]"></div>

      <div className="max-w-md w-full animate-in zoom-in-95 duration-500 relative z-10">
        <div className="text-center mb-8 lg:mb-10">
          <div className="inline-flex w-16 h-16 lg:w-20 lg:h-20 bg-white rounded-2xl lg:rounded-3xl items-center justify-center mb-6 shadow-2xl shadow-white/10">
            <span className="text-blue-950 font-black text-3xl lg:text-4xl">K</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tighter mb-2">KIRAKI</h2>
          <p className="text-blue-300 font-bold uppercase tracking-[0.2em] text-[9px] lg:text-[10px]">Financial Intelligence Platform</p>
        </div>

        <form className="bg-white p-8 lg:p-12 rounded-[2.5rem] lg:rounded-[3.5rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] space-y-6 lg:space-y-8" onSubmit={handleLogin}>
          {error && <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 text-[10px] rounded-xl font-bold animate-shake">{error}</div>}
          
          <div className="space-y-4 lg:space-y-6">
            <div className="relative">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">E-posta</label>
              <input 
                type="email" 
                className="w-full px-5 py-3 lg:px-6 lg:py-4 rounded-xl border-2 border-slate-100 focus:border-blue-900 outline-none transition-all font-bold text-sm"
                placeholder="email@kuraki.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {recognizedUser && (
                <div className="mt-4 p-4 lg:p-5 bg-blue-50 border border-blue-100 rounded-[1.2rem] lg:rounded-[1.5rem] flex items-center gap-3 lg:gap-4 animate-in slide-in-from-top-2 duration-300">
                   <img src={recognizedUser.avatar} className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 border-white shadow-sm" alt="" />
                   <div className="overflow-hidden">
                      <p className="text-xs lg:text-sm font-black text-blue-900 leading-tight truncate">{recognizedUser.name}</p>
                      <p className="text-[9px] lg:text-[10px] text-blue-500 font-black uppercase tracking-widest mt-0.5 truncate">{recognizedCompany?.name || 'Platform Admin'}</p>
                   </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Şifre</label>
              <input type="password" required className="w-full px-5 py-3 lg:px-6 lg:py-4 rounded-xl border-2 border-slate-100 focus:border-blue-900 outline-none transition-all font-bold text-sm" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <button type="submit" className="w-full bg-blue-900 text-white font-black py-4 lg:py-5 rounded-xl lg:rounded-2xl hover:bg-blue-950 transition-all shadow-xl shadow-blue-900/20 active:scale-[0.98] uppercase tracking-widest text-[10px] lg:text-xs mt-4">
              Güvenli Giriş Yap
            </button>
          </div>

          <div className="pt-4 text-center">
            <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest leading-relaxed">
              © 2024 Kiraki Intelligence
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
