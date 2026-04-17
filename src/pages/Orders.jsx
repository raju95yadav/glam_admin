import React, { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  Search, 
  Clock, 
  Package, 
  CheckCircle2, 
  ExternalLink,
  ChevronDown,
  DollarSign,
  User as UserIcon,
  Filter,
  Truck,
  Trash2,
  AlertCircle
} from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/orders');
      setOrders(data || []);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, status) => {
    try {
      setUpdatingId(orderId);
      await api.put(`/admin/order/${orderId}/status`, { status });
      toast.success(`Order status updated to ${status}`);
      fetchOrders();
    } catch (error) {
      toast.error('Status update failed');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteOrder = async () => {
    if (!selectedOrder) return;
    try {
      setIsDeleting(true);
      await api.delete(`/admin/order/${selectedOrder._id}`);
      toast.success('Order has been permanently deleted');
      setOrders(orders.filter(o => o._id !== selectedOrder._id));
      setShowDeleteModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete order');
    } finally {
      setIsDeleting(false);
      setSelectedOrder(null);
    }
  };

  const filteredOrders = orders.filter(o => 
    o._id.includes(searchTerm) ||
    o.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'shipped': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'out for delivery': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'cancelled': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-pink-500 bg-pink-500/10 border-pink-500/20';
    }
  };

  if (loading && orders.length === 0) {
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
          <h1 className="text-4xl font-black text-white tracking-tight">Order <span className="text-pink-500">Center</span></h1>
          <p className="text-gray-400 font-medium mt-1">Processing {orders.length} orders from your customers.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group flex-1 min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-pink-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search by Order ID, name..."
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

      {/* Orders List */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {filteredOrders.map((order) => (
          <motion.div 
            key={order._id}
            variants={itemVariants}
            className="glass-card group hover:bg-white/5 transition-all p-6"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-start gap-6">
                 <div className="size-16 rounded-[1.5rem] bg-gradient-to-br from-pink-500/10 to-rose-600/10 flex items-center justify-center text-pink-500 shadow-inner group-hover:scale-105 transition-transform shrink-0">
                    <Package size={28} />
                 </div>
                 <div className="space-y-1">
                    <div className="flex items-center gap-3">
                       <h3 className="text-lg font-black text-white tracking-tight">#{order._id.slice(-8).toUpperCase()}</h3>
                       <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(order.orderStatus || (order.isDelivered ? 'delivered' : 'pending'))}`}>
                          {order.orderStatus || (order.isDelivered ? 'Delivered' : 'Confirmed')}
                       </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-bold text-gray-500">
                       <span className="flex items-center gap-1"><UserIcon size={12} /> {order.user?.name || 'Guest'}</span>
                       <span className="flex items-center gap-1"><Clock size={12} /> {new Date(order.createdAt).toLocaleString()}</span>
                       <span className="flex items-center gap-1"><Package size={12} /> {order.orderItems?.length || 0} Items</span>
                    </div>
                 </div>
              </div>

              <div className="flex items-center gap-8">
                 <div className="text-right">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Total Amount</p>
                    <p className="text-2xl font-black text-white">${order.totalPrice?.toFixed(2)}</p>
                 </div>
                 
                 <div className="h-12 w-px bg-white/5 hidden lg:block"></div>

                 <div className="flex items-center gap-3">
                    <select 
                       disabled={updatingId === order._id}
                       onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                       className="bg-white/5 border border-white/10 rounded-none px-4 py-3 text-xs font-black text-white outline-none cursor-pointer focus:border-pink-500/50 transition-colors"
                       value={order.orderStatus || (order.isDelivered ? 'delivered' : 'Confirmed')}
                    >
                       <option value="Confirmed">Confirmed</option>
                       <option value="Packed">Packed</option>
                       <option value="Shipped">Shipped</option>
                       <option value="Out for Delivery">Out for Delivery</option>
                       <option value="Delivered">Delivered</option>
                       <option value="Cancelled">Cancelled</option>
                    </select>
                    <button 
                       onClick={() => { setSelectedOrder(order); setShowDeleteModal(true); }}
                       className="glass size-12 flex items-center justify-center rounded-none text-red-500/50 hover:text-red-500 hover:bg-red-500/10 transition-all active:scale-90"
                       title="Delete Past Order"
                    >
                       <Trash2 size={18} />
                    </button>
                    <button className="glass size-12 flex items-center justify-center rounded-none text-gray-400 hover:text-white transition-all active:scale-90">
                       <ExternalLink size={18} />
                    </button>
                 </div>
              </div>
            </div>
            
            {/* Expanded Content Peek (Optional) */}
            <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-4">
               {order.orderItems?.slice(0, 4).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-white/5 p-3 rounded-none">
                     <img src={item.image} alt="" className="size-10 rounded-none object-cover" />
                     <div className="min-w-0">
                        <p className="text-[10px] font-black text-white truncate">{item.name}</p>
                        <p className="text-[10px] font-bold text-gray-500">x{item.qty}</p>
                     </div>
                  </div>
               ))}
               {order.orderItems?.length > 4 && (
                  <div className="flex items-center justify-center bg-white/5 p-3 rounded-none text-[10px] font-black text-gray-500 hover:text-white cursor-pointer transition-colors">
                     +{order.orderItems.length - 4} MORE ITEMS
                  </div>
               )}
            </div>
          </motion.div>
        ))}

        {filteredOrders.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-20 text-center glass-card border-dashed border-2 border-white/5"
          >
            <ShoppingCart size={48} className="text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-black text-white">No orders yet</h3>
            <p className="text-gray-500 mt-2">When customers start ordering, they'll appear here.</p>
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
              <h3 className="text-3xl font-black text-white mb-3 tracking-tighter">Delete Order?</h3>
              <p className="text-gray-400 font-medium mb-10 leading-relaxed italic">
                 Are you sure you want to delete order <span className="text-white font-black not-italic">"#{selectedOrder?._id.slice(-8).toUpperCase()}"</span>? This will permanently remove it from your history.
              </p>
              
              <div className="flex flex-col gap-3">
                <button 
                  disabled={isDeleting}
                  onClick={handleDeleteOrder}
                  className="w-full bg-red-500 py-4 rounded-none font-black text-xs uppercase tracking-[0.2em] text-white hover:bg-red-600 transition-all active:scale-95 shadow-xl shadow-red-500/20 disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Confirm Delete'}
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

export default Orders;
