import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Shield, 
  Camera, 
  MapPin, 
  Phone, 
  Mail, 
  Moon, 
  Sun, 
  Save, 
  Loader2,
  CheckCircle2,
  Smartphone,
  AtSign
} from 'lucide-react';
import api from '../services/api';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

const Settings = () => {
  const { darkMode, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    profilePic: null
  });

  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/users/profile');
      setFormData({
        ...formData,
        username: data.username || '',
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
      });
      if (data.profilePic) {
        setPreviewUrl(data.profilePic);
      }
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setFetching(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, profilePic: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== '') {
        data.append(key, formData[key]);
      }
    });

    try {
      const response = await api.put('/users/profile', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Profile updated successfully!');
      if (response.data.password) {
        setFormData(prev => ({ ...prev, password: '' }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Moon },
  ];

  if (fetching) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-pink-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black tracking-tight mb-2">Settings</h1>
        <p className="text-nykaa-text-muted">Manage your admin profile and system preferences.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-none w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center gap-2 px-6 py-2.5 rounded-none transition-all duration-300 font-bold text-sm
              ${activeTab === tab.id 
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg' 
                : 'text-nykaa-text-muted hover:text-nykaa-text hover:bg-white/5'}
            `}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'profile' ? (
          <motion.form 
            key="profile"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleSubmit}
            className="glass-card space-y-8"
          >
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center sm:flex-row gap-8 pb-8 border-b border-white/10">
              <div className="relative group">
                <div className="size-32 rounded-3xl bg-gradient-to-br from-pink-500/20 to-purple-600/20 p-1">
                  <div className="size-full rounded-[22px] bg-nykaa-surface flex items-center justify-center overflow-hidden border border-white/10">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Profile" className="size-full object-cover" />
                    ) : (
                      <User size={48} className="text-nykaa-text-muted" />
                    )}
                  </div>
                </div>
                <label className="absolute -bottom-2 -right-2 p-2 bg-pink-500 text-white rounded-none shadow-lg cursor-pointer hover:scale-110 active:scale-95 transition-all">
                  <Camera size={18} />
                  <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                </label>
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-xl font-bold mb-1">Profile Photo</h3>
                <p className="text-sm text-nykaa-text-muted mb-4">Update your photo for the admin header.</p>
                <div className="flex gap-4">
                  <label className="text-xs font-bold text-pink-500 hover:text-pink-400 cursor-pointer uppercase tracking-widest">
                    Upload New
                    <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                  </label>
                  <button type="button" onClick={() => setPreviewUrl(null)} className="text-xs font-bold text-red-500 hover:text-red-400 uppercase tracking-widest">
                    Remove
                  </button>
                </div>
              </div>
            </div>

            {/* Grid Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-nykaa-text-muted ml-1">Username</label>
                <div className="relative">
                  <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-nykaa-text-muted" />
                  <input 
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="admin_pro"
                    className="input-glass pl-12 bg-white/5"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-nykaa-text-muted ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-nykaa-text-muted" />
                  <input 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                    className="input-glass pl-12 bg-white/5"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-nykaa-text-muted ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-nykaa-text-muted" />
                  <input 
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="admin@nykaaprol.com"
                    className="input-glass pl-12 bg-white/5"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-nykaa-text-muted ml-1">Phone (WhatsApp Receiver)</label>
                <div className="relative">
                  <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-nykaa-text-muted" />
                  <input 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="91xxxxxxxxxx"
                    className="input-glass pl-12 bg-white/5"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-nykaa-text-muted ml-1">Business Address</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-nykaa-text-muted" />
                  <input 
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Store location or office address"
                    className="input-glass pl-12 bg-white/5"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-nykaa-text-muted ml-1">New Password (leave blank to keep current)</label>
                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-nykaa-text-muted" />
                  <input 
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="input-glass pl-12 bg-white/5"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary flex items-center gap-3 px-10"
              >
                {loading ? <Loader2 className="size-5 animate-spin" /> : <Save size={20} />}
                Save Profile
              </button>
            </div>
          </motion.form>
        ) : (
          <motion.div 
            key="appearance"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-card space-y-8"
          >
            <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5">
              <div className="flex items-center gap-4">
                <div className={`size-12 rounded-none flex items-center justify-center transition-colors ${darkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-orange-500/20 text-orange-400'}`}>
                  {darkMode ? <Moon size={24} /> : <Sun size={24} />}
                </div>
                <div>
                  <h3 className="font-bold">Dashboard Theme</h3>
                  <p className="text-xs text-nykaa-text-muted">Switch between light and dark modes.</p>
                </div>
              </div>
              <button 
                onClick={toggleTheme}
                className={`
                  w-16 h-8 rounded-full p-1 transition-all duration-300 flex items-center
                  ${darkMode ? 'bg-pink-600 justify-end' : 'bg-gray-300 justify-start'}
                `}
              >
                <motion.div 
                  layout
                  className="w-6 h-6 bg-white rounded-full shadow-md"
                />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
               {['Light Mode', 'Dark Mode'].map((mode, i) => (
                 <div 
                   key={mode}
                   onClick={i === 0 ? () => { if(darkMode) toggleTheme() } : () => { if(!darkMode) toggleTheme() }}
                   className={`
                     cursor-pointer p-6 rounded-3xl border-2 transition-all group
                     ${(i === 0 && !darkMode) || (i === 1 && darkMode) 
                        ? 'border-pink-500 bg-pink-500/5' 
                        : 'border-white/5 bg-white/5 hover:border-white/20'}
                   `}
                 >
                   <div className={`mb-4 w-full aspect-video rounded-none transition-colors ${i === 0 ? 'bg-gray-100 flex items-center justify-center' : 'bg-nykaa-surface flex items-center justify-center'}`}>
                      {i === 0 ? <Sun className="text-gray-400" /> : <Moon className="text-gray-600" />}
                   </div>
                   <p className="text-center font-bold">{mode}</p>
                 </div>
               ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Settings;
