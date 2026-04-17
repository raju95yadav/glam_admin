import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Trash2, X, CheckSquare, Info, ShoppingBag, User as UserIcon, AlertCircle, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const NotificationPanel = ({ isOpen, onClose, onUnreadChange }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/notifications');
      setNotifications(data);
      const unread = data.filter(n => !n.isRead).length;
      onUnreadChange(unread);
    } catch (error) {
      console.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/admin/notifications/${id}/read`);
      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
      const unreadCount = notifications.filter(n => n._id !== id ? !n.isRead : false).length;
      onUnreadChange(unreadCount);
    } catch (error) {
       console.error('Failed to mark as read');
    }
  };

  const deleteOne = async (e, id) => {
    e.stopPropagation();
    try {
      await api.delete(`/admin/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n._id !== id));
      toast.success('Notification removed');
      const unread = notifications.filter(n => n._id !== id && !n.isRead).length;
      onUnreadChange(unread);
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const clearAll = async () => {
    if (!window.confirm('Clear all notifications?')) return;
    try {
      await api.delete('/admin/notifications');
      setNotifications([]);
      onUnreadChange(0);
      toast.success('All cleared');
    } catch (error) {
      toast.error('Failed to clear');
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }
    if (notification.link) {
      navigate(notification.link);
      onClose();
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'PRODUCT': return <Package className="text-pink-500" size={18} />;
      case 'ORDER': return <ShoppingBag className="text-purple-500" size={18} />;
      case 'USER': return <UserIcon className="text-blue-500" size={18} />;
      default: return <Info className="text-gray-500" size={18} />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-4 w-96 glass-card p-0 overflow-hidden z-50 border border-nykaa-border shadow-2xl"
          >
            <div className="p-4 border-b border-nykaa-border flex items-center justify-between bg-nykaa-surface/10 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <Bell size={18} className="text-pink-500" />
                <h3 className="font-black text-sm uppercase tracking-widest text-nykaa-text">Notifications</h3>
              </div>
              {notifications.length > 0 && (
                <button 
                  onClick={clearAll}
                  className="p-2 hover:bg-red-500/10 text-red-500 rounded-xl transition-all"
                  title="Clear All"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            <div className="max-h-[450px] overflow-y-auto scrollbar-hide">
              {loading ? (
                <div className="p-10 flex flex-col items-center justify-center gap-4">
                  <div className="size-8 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin" />
                  <p className="text-xs font-bold text-nykaa-text-muted">Loading logs...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="size-16 bg-nykaa-surface/10 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-nykaa-border">
                    <CheckSquare className="text-nykaa-text-muted" size={32} />
                  </div>
                  <p className="font-bold text-nykaa-text">All Caught Up!</p>
                  <p className="text-xs text-nykaa-text-muted mt-1">No new notifications found.</p>
                </div>
              ) : (
                <div className="divide-y divide-nykaa-border">
                  {notifications.map((n) => (
                    <div
                      key={n._id}
                      onClick={() => handleNotificationClick(n)}
                      className={`
                        p-4 flex gap-4 transition-all cursor-pointer group hover:bg-nykaa-surface/5
                        ${!n.isRead ? 'bg-pink-500/5' : ''}
                      `}
                    >
                      <div className="size-10 rounded-2xl bg-nykaa-surface/10 border border-nykaa-border flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        {getIcon(n.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm leading-snug mb-1 ${!n.isRead ? 'font-bold text-nykaa-text' : 'text-nykaa-text-muted font-medium'}`}>
                          {n.message}
                        </p>
                        <p className="text-[10px] font-bold text-nykaa-text-muted uppercase tracking-tight">
                          {new Date(n.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <button 
                        onClick={(e) => deleteOne(e, n._id)}
                        className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-all self-start"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-3 bg-nykaa-surface/10 border-t border-nykaa-border text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-nykaa-text-muted italic">
                  Logs are auto-deleted after 15 days
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationPanel;
