import React, { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Edit2, 
  Trash2, 
  Search, 
  Filter, 
  Package, 
  AlertCircle, 
  X, 
  Plus,
  Layers,
  Tag,
  DollarSign,
  Box,
  Image as ImageIcon,
  MoreVertical,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/products?limit=100');
      setProducts(data.products || []);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product removed from inventory');
      setProducts(products.filter(p => p._id !== id));
      setShowDeleteModal(false);
    } catch (error) {
      toast.error('Deletion failed. Please try again.');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Updating product...');
    try {
      const formData = new FormData();
      formData.append('name', selectedProduct.name);
      formData.append('price', selectedProduct.price);
      formData.append('category', selectedProduct.category);
      formData.append('description', selectedProduct.description);
      formData.append('stock', selectedProduct.stock || 0);
      formData.append('brand', selectedProduct.brand || '');
      
      if (selectedProduct.newImage) {
        formData.append('images', selectedProduct.newImage);
      }

      await api.put(`/products/${selectedProduct._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success('Product updated successfully', { id: loadingToast });
      fetchProducts();
      setIsEditing(false);
    } catch (error) {
      toast.error('Update failed', { id: loadingToast });
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Manage <span className="text-pink-500">Inventory</span></h1>
          <p className="text-gray-400 font-medium mt-1">Found {products.length} products in your beauty collection.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group flex-1 min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-pink-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search by name, category..."
              className="input-glass pl-12 bg-white/5 border-white/5 focus:bg-white/10 transition-all text-sm font-bold"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => navigate('/add-product')}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            Add New Item
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="glass-card animate-pulse h-80 bg-white/5 rounded-3xl"></div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-20 flex flex-col items-center justify-center text-center max-w-2xl mx-auto"
        >
          <div className="size-24 bg-pink-500/10 rounded-full flex items-center justify-center mb-6">
            <Package className="text-pink-500" size={48} />
          </div>
          <h3 className="text-2xl font-black text-white">No items match your search</h3>
          <p className="text-gray-500 font-medium mt-2 max-w-sm">We couldn't find any products matching "{searchTerm}". Try different keywords or add a new product.</p>
          <button 
             onClick={() => setSearchTerm('')}
             className="mt-8 text-pink-500 font-black uppercase tracking-widest text-xs hover:underline"
          >
            Clear Search
          </button>
        </motion.div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredProducts.map((p) => (
            <motion.div 
              variants={itemVariants}
              key={p._id} 
              className="glass-card flex flex-col group"
            >
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4">
                <img 
                  src={p.images?.[0]?.url || 'https://placehold.co/400x500?text=No+Image'} 
                  alt={p.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                   <div className="flex gap-2">
                     <button 
                        onClick={() => { setSelectedProduct(p); setIsEditing(true); }}
                        className="flex-1 bg-white text-black py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-pink-500 hover:text-white transition-all active:scale-95"
                     >
                       Edit Product
                     </button>
                     <button 
                        onClick={() => { setSelectedProduct(p); setShowDeleteModal(true); }}
                        className="size-11 bg-red-500 text-white rounded-xl flex items-center justify-center hover:bg-red-600 transition-colors active:scale-95"
                     >
                       <Trash2 size={18} />
                     </button>
                   </div>
                </div>
                <div className="absolute top-4 right-4">
                   <span className="glass px-3 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-widest">
                     {p.category}
                   </span>
                </div>
              </div>

              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-black text-white leading-tight flex-1 pr-4 line-clamp-1">{p.name}</h3>
                  <p className="text-xl font-black text-pink-500">${p.price}</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold text-gray-500 mt-auto pt-4 border-t border-white/5">
                   <div className="flex items-center gap-1">
                      <Box size={14} className="text-emerald-500" />
                      <span>{p.stock} in stock</span>
                   </div>
                   <div className="h-4 w-px bg-white/10"></div>
                   <div className="flex items-center gap-1">
                      <Tag size={14} className="text-blue-500" />
                      <span>{p.brand}</span>
                   </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(false)}
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
              <h3 className="text-3xl font-black text-white mb-3 tracking-tighter">Wait a moment</h3>
              <p className="text-gray-400 font-medium mb-10 leading-relaxed italic">
                 You are about to permanently remove <span className="text-white font-black not-italic">"{selectedProduct?.name}"</span>. This action is irreversible.
              </p>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => handleDelete(selectedProduct._id)}
                  className="w-full bg-red-500 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-white hover:bg-red-600 transition-all active:scale-95 shadow-xl shadow-red-500/20"
                >
                  Confirm Delete
                </button>
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="w-full py-4 text-gray-500 font-black text-xs uppercase tracking-[0.2em] hover:text-white transition-colors"
                >
                  Keep Product
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Product Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
              className="absolute inset-0 bg-nykaa-darker/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="glass max-w-4xl w-full p-8 md:p-12 rounded-[3.5rem] relative z-10 border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                   <div className="size-14 bg-pink-500/10 rounded-2xl flex items-center justify-center text-pink-500">
                      <Edit2 size={24} />
                   </div>
                   <div>
                      <h3 className="text-3xl font-black text-white tracking-tighter">Edit <span className="text-pink-500">Beauty</span> Product</h3>
                      <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Refining Product Details</p>
                   </div>
                </div>
                <button 
                   onClick={() => setIsEditing(false)} 
                   className="size-12 rounded-2xl glass flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column: Core Info */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Product Name</label>
                      <div className="relative">
                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input 
                          className="input-glass pl-12 font-bold"
                          placeholder="Ex: Matte Silk Lipstick"
                          value={selectedProduct.name}
                          onChange={(e) => setSelectedProduct({...selectedProduct, name: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Category</label>
                        <div className="relative">
                          <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                          <input 
                            className="input-glass pl-12 font-bold"
                            placeholder="Ex: Makeup"
                            value={selectedProduct.category}
                            onChange={(e) => setSelectedProduct({...selectedProduct, category: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Price ($)</label>
                        <div className="relative">
                          <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                          <input 
                            type="number"
                            className="input-glass pl-12 font-bold text-pink-500"
                            placeholder="0.00"
                            value={selectedProduct.price}
                            onChange={(e) => setSelectedProduct({...selectedProduct, price: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Inventory Stock</label>
                         <div className="relative">
                           <Box className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                           <input 
                             type="number"
                             className="input-glass pl-12 font-bold"
                             placeholder="Ex: 50"
                             value={selectedProduct.stock}
                             onChange={(e) => setSelectedProduct({...selectedProduct, stock: e.target.value})}
                           />
                         </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Brand</label>
                        <div className="relative">
                           <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                           <input 
                             className="input-glass pl-12 font-bold"
                             placeholder="Ex: Nykaa"
                             value={selectedProduct.brand || ''}
                             onChange={(e) => setSelectedProduct({...selectedProduct, brand: e.target.value})}
                           />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Imagery & Description */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Product Description</label>
                       <textarea 
                         rows="4"
                         className="input-glass resize-none min-h-[120px] font-medium text-sm"
                         placeholder="Describe the beauty and benefits..."
                         value={selectedProduct.description}
                         onChange={(e) => setSelectedProduct({...selectedProduct, description: e.target.value})}
                       />
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Main Imagery</label>
                       <div className="relative group/img overflow-hidden rounded-3xl aspect-video glass flex items-center justify-center cursor-pointer border-dashed border-2 border-white/10 hover:border-pink-500/50 transition-all">
                          {selectedProduct.newImage ? (
                             <img src={URL.createObjectURL(selectedProduct.newImage)} className="w-full h-full object-cover" />
                          ) : (
                             <img src={selectedProduct.images?.[0]?.url || 'https://placehold.co/400x500?text=No+Image'} className="w-full h-full object-cover opacity-60 group-hover/img:scale-105 transition-transform duration-700" />
                          )}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                             <ImageIcon size={32} className="mb-2" />
                             <p className="text-[10px] font-black uppercase tracking-widest">Change Image</p>
                          </div>
                          <input 
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e) => setSelectedProduct({...selectedProduct, newImage: e.target.files[0]})}
                          />
                       </div>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex gap-4">
                   <button 
                     type="button"
                     onClick={() => setIsEditing(false)}
                     className="flex-1 py-5 rounded-2xl glass font-black text-xs uppercase tracking-[0.2em] text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                   >
                     Discard Changes
                   </button>
                   <button 
                     type="submit" 
                     className="flex-[2] btn-primary py-5 rounded-2xl flex items-center justify-center gap-3"
                   >
                     <span className="text-xs uppercase tracking-[0.2em]">Update Inventory</span>
                     <ChevronRight size={18} />
                   </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageProducts;

