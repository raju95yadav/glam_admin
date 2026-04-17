import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, LogOut, Search, Bell, User } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../services/api';
import NotificationPanel from './NotificationPanel';

const Navbar = () => {
  const { darkMode, toggleTheme } = useTheme();
  const [admin, setAdmin] = React.useState(null);
  const [isNotifOpen, setIsNotifOpen] = React.useState(false);
  const [unreadCount, setUnreadCount] = React.useState(0);

  React.useEffect(() => {
    fetchAdmin();
    fetchUnreadCount();
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const { data } = await api.get('/admin/notifications');
      setUnreadCount(data.filter(n => !n.isRead).length);
    } catch (error) {
       console.error('Failed to fetch unread count');
    }
  };

  const fetchAdmin = async () => {
    try {
      const { data } = await api.get('/users/profile');
      setAdmin(data);
    } catch (error) {
      console.error('Failed to fetch admin in Navbar');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success('Security session ended', {
      icon: '🔒',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
    setTimeout(() => {
      window.location.href = 'http://localhost:5173/login';
    }, 1200);
  };

  return (
    <nav className="h-20 glass border-b border-nykaa-border px-8 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md w-full hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-nykaa-text-muted size-4" />
          <input 
            type="text" 
            placeholder="Search products, orders..."
            className="input-glass pl-12 h-11 bg-nykaa-surface/5 border-nykaa-border hover:bg-nykaa-surface/10 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button 
          onClick={toggleTheme}
          className="p-3 rounded-2xl glass hover:bg-nykaa-surface/10 transition-colors text-nykaa-text-muted hover:text-nykaa-text"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="relative">
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-3 rounded-2xl glass hover:bg-nykaa-surface/10 transition-colors text-nykaa-text-muted hover:text-nykaa-text relative"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 size-4 bg-pink-500 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-pulse border-2 border-nykaa-surface">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          
          <NotificationPanel 
            isOpen={isNotifOpen} 
            onClose={() => setIsNotifOpen(false)} 
            onUnreadChange={setUnreadCount}
          />
        </div>

        <div className="h-10 w-px bg-nykaa-border mx-2"></div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-nykaa-text leading-tight">{admin?.name || 'Admin User'}</p>
            <p className="text-[10px] text-pink-500 uppercase tracking-widest font-black">{admin?.role === 'admin' ? 'Super Admin' : 'Admin'}</p>
          </div>
          <div className="size-11 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 p-[2px]">
            <div className="size-full rounded-[14px] bg-nykaa-surface flex items-center justify-center overflow-hidden">
               {admin?.profilePic ? (
                 <img src={admin.profilePic} alt="Admin" className="size-full object-cover" />
               ) : (
                 <User className="text-nykaa-text-muted size-6" />
               )}
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="p-3 rounded-2xl glass hover:bg-red-500/20 text-gray-400 hover:text-red-500 transition-all active:scale-95"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
