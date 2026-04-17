import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { 
  ShoppingBag, 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading('Authenticating...');
    try {
      const { data } = await api.post('/auth/admin-login', { email, password });
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      toast.success(`Welcome back, ${data.user.name || 'Admin'}!`, { id: loadingToast });
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid credentials.', { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-6 bg-nykaa-darker">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
         <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
              x: [0, 100, 0],
              y: [0, 50, 0]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-[20%] -left-[10%] size-[600px] bg-pink-600/20 blur-[120px] rounded-full"
         />
         <motion.div 
            animate={{ 
              scale: [1.2, 1, 1.2],
              rotate: [90, 0, 90],
              x: [0, -100, 0],
              y: [0, -50, 0]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-[20%] -right-[10%] size-[600px] bg-purple-600/20 blur-[120px] rounded-full"
         />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="text-center mb-10">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="inline-flex items-center justify-center size-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-[2rem] mb-6 shadow-2xl shadow-pink-500/40 text-white"
          >
            <ShieldCheck size={40} />
          </motion.div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">
            ADMIN <span className="text-pink-500">ACCESS</span>
          </h1>
          <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px]">
            ADMINISTRATOR CREDENTIALS REQUIRED
          </p>
        </div>

        <div className="glass-card p-10 rounded-[3rem] border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)]">
          <div className="mb-8 p-4 rounded-none bg-blue-500/10 border border-blue-500/20">
            <h4 className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-1">Authorized Access Only</h4>
            <p className="text-blue-400/70 text-[10px] uppercase font-bold">Secure Login for Administrators.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Admin Email</label>
              <div className="relative group/input">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-pink-500 transition-colors" size={20} />
                <input
                  type="email"
                  required
                  className="input-glass pl-14 h-16 text-lg font-black tracking-tight"
                  placeholder="admin@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Password</label>
              <div className="relative group/input">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-pink-500 transition-colors" size={20} />
                <input
                  type="password"
                  required
                  className="input-glass pl-14 h-16 text-lg font-black tracking-tight"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary h-16 flex items-center justify-center gap-3 group active:scale-[0.98] transition-all"
            >
              {loading ? (
                <div className="size-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span className="text-xs uppercase tracking-[0.2em]">Secure Login</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 text-[10px] text-gray-700 font-black uppercase tracking-[0.3em]"
        >
          Protected by Admin Security Protocol v4.2
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Login;

