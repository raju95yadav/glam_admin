import React, { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users as UsersIcon, 
  Search, 
  Mail, 
  Phone, 
  Calendar, 
  ShieldCheck, 
  User as UserIcon,
  ChevronRight,
  MoreVertical,
  Filter,
  Trash2,
  AlertCircle
} from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/users');
      setUsers(data || []);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      setIsDeleting(true);
      await api.delete(`/admin/user/${selectedUser._id}`);
      toast.success('User removed from platform');
      setUsers(users.filter(u => u._id !== selectedUser._id));
      setShowDeleteModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove user');
    } finally {
      setIsDeleting(false);
      setSelectedUser(null);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.phone?.includes(searchTerm)
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="size-12 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">User <span className="text-pink-500">Directory</span></h1>
          <p className="text-gray-400 font-medium mt-1">Managing {users.length} registered beauty enthusiasts.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group flex-1 min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-pink-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search by name, email, phone..."
              className="input-glass pl-12 bg-white/5 border-white/5 focus:bg-white/10 transition-all text-sm font-bold"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="glass p-3 rounded-none text-gray-400 hover:text-white transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Users List */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4"
      >
        <div className="hidden lg:grid grid-cols-12 px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] border-b border-white/5">
          <div className="col-span-4">User Details</div>
          <div className="col-span-3">Contact Info</div>
          <div className="col-span-2">Joined Date</div>
          <div className="col-span-2">Role</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {filteredUsers.map((user) => (
          <motion.div 
            key={user._id}
            variants={itemVariants}
            className="glass-card group hover:bg-white/5 transition-all p-4 lg:px-8 lg:py-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-4">
              {/* User Identity */}
              <div className="lg:col-span-4 flex items-center gap-4">
                <div className="size-12 rounded-none bg-gradient-to-br from-pink-500/10 to-purple-600/10 flex items-center justify-center text-pink-500 shadow-inner group-hover:scale-110 transition-transform">
                  <UserIcon size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">{user.name || 'Anonymous User'}</h3>
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                    <span className="size-2 bg-green-500 rounded-full"></span>
                    Online
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="lg:col-span-3 space-y-1">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-300">
                  <Mail size={14} className="text-pink-500/50" />
                  {user.email}
                </div>
                {user.phone && (
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                    <Phone size={14} />
                    {user.phone}
                  </div>
                )}
              </div>

              {/* Joined Date */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-300">
                  <Calendar size={14} className="text-blue-500/50" />
                  {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>

              {/* Role */}
              <div className="lg:col-span-2">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  user.role === 'admin' 
                    ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20' 
                    : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                }`}>
                  {user.role}
                </span>
              </div>

              {/* Actions */}
              <div className="lg:col-span-1 text-right">
                <button 
                  onClick={() => { setSelectedUser(user); setShowDeleteModal(true); }}
                  className="size-10 rounded-none bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white flex items-center justify-center transition-all ml-auto group/btn"
                >
                  <Trash2 size={18} className="group-hover/btn:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredUsers.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-20 text-center glass-card border-dashed border-2 border-white/5"
          >
            <UsersIcon size={48} className="text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-black text-white">No users found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search criteria.</p>
          </motion.div>
        )}
      </motion.div>
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isDeleting && setShowDeleteModal(false)}
              className="absolute inset-0 bg-nykaa-darker/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass max-w-sm w-full p-10 rounded-[2.5rem] relative z-10 border border-white/10 shadow-2xl text-center"
            >
              <div className="size-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                <AlertCircle className="text-red-500" size={40} />
              </div>
              <h3 className="text-3xl font-black text-white mb-3 tracking-tighter">Remove User?</h3>
              <p className="text-gray-400 font-medium mb-10 leading-relaxed italic">
                 Are you sure you want to remove <span className="text-white font-black not-italic">"{selectedUser?.name || selectedUser?.email}"</span>? They will be logged out and their account will be deleted permanently.
              </p>
              
              <div className="flex flex-col gap-3">
                <button 
                  disabled={isDeleting}
                  onClick={handleDeleteUser}
                  className="w-full bg-red-500 py-4 rounded-none font-black text-xs uppercase tracking-[0.2em] text-white hover:bg-red-600 transition-all active:scale-95 shadow-xl shadow-red-500/20 disabled:opacity-50"
                >
                  {isDeleting ? 'Removing...' : 'Confirm Removal'}
                </button>
                <button 
                  disabled={isDeleting}
                  onClick={() => setShowDeleteModal(false)}
                  className="w-full py-4 text-gray-500 font-black text-xs uppercase tracking-[0.2em] hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Users;
