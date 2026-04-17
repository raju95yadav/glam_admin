import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  PlusCircle, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Layers,
  Users,
  Package
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { title: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { title: 'Manage Products', icon: Package, path: '/manage-products' },
    { title: 'Add Product', icon: PlusCircle, path: '/add-product' },
    { title: 'Users', icon: Users, path: '/users' },
    { title: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isCollapsed ? 100 : 280 }}
      className="h-screen sticky top-0 bg-nykaa-surface/5 backdrop-blur-3xl border-r border-nykaa-border flex flex-col z-50 transition-all duration-300"
    >
      {/* Logo Section */}
      <Link to="/dashboard" className="p-8 flex items-center gap-4 hover:opacity-80 transition-opacity cursor-pointer">
        <div className="size-12 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-pink-500/30">
          <ShoppingBag className="text-white size-6" />
        </div>
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="font-black text-2xl tracking-tighter text-nykaa-text"
            >
              GLOW<span className="text-pink-500">Beauty</span>
            </motion.div>
          )}
        </AnimatePresence>
      </Link>

      {/* Toggle Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-4 top-10 size-8 bg-pink-600 rounded-full flex items-center justify-center text-white border-4 border-nykaa-bg hover:scale-110 transition-transform active:scale-95 z-[60]"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Menu Items */}
      <nav className="flex-1 px-4 py-8 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              relative flex items-center gap-4 px-4 py-4 rounded-2xl transition-all group overflow-hidden
              ${isActive ? 'bg-pink-500/10 text-pink-500' : 'text-nykaa-text-muted hover:text-nykaa-text hover:bg-nykaa-surface/5'}
            `}
          >
            {({ isActive }) => (
              <>
                <item.icon size={22} className={`flex-shrink-0 ${isActive ? 'text-pink-500' : 'group-hover:text-pink-400'}`} />
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="font-bold tracking-wide"
                    >
                      {item.title}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-pink-500 rounded-r-full"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Card */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="p-6 m-4 mt-auto glass rounded-3xl border border-white/5 bg-gradient-to-br from-pink-500/10 to-purple-500/10"
          >
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="text-pink-500" size={18} />
              <p className="text-xs font-black uppercase tracking-widest text-nykaa-text">Raj Stats</p>
            </div>
            <p className="text-[10px] text-nykaa-text-muted font-bold mb-4">View real-time analytics and insights.</p>
            <button className="w-full py-3 bg-pink-500/10 hover:bg-pink-500/20 text-pink-500 rounded-xl text-xs font-bold transition-all active:scale-95">
              Launch Console
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
};

export default Sidebar;
