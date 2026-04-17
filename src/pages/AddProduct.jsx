import React, { useState, useRef } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusCircle,
  Image as ImageIcon,
  Tag,
  DollarSign,
  Type,
  Send,
  Box,
  Layers,
  Sparkles,
  X,
  UploadCloud,
  ChevronRight,
  Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: '',
    price: '',
    category: '',
    brand: 'Nykaa',
    stock: '',
    image: null,
    imagePreview: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product.image) {
      toast.error('Please upload a product image');
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading('Listing your product...');

    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('price', product.price);
    formData.append('category', product.category);
    formData.append('description', product.description);
    formData.append('stock', product.stock || 0);
    formData.append('brand', product.brand);

    formData.append('images', product.image);

    try {
      await api.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Beauty item listed successfully!', { id: loadingToast });
      setProduct({ name: '', price: '', category: '', brand: 'Nykaa', stock: '', image: null, imagePreview: '', description: '' });
      setTimeout(() => navigate('/manage-products'), 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to list product', { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (file) => {
    if (file && file.type.startsWith('image/')) {
      setProduct(prev => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file)
      }));
    } else {
      toast.error('Please upload a valid image file');
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  const fieldsetVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-4">
          <div className="size-12 bg-pink-500 rounded-none flex items-center justify-center shadow-lg shadow-pink-500/20">
            <PlusCircle className="text-white" size={28} />
          </div>
          New <span className="text-pink-500">Beauty</span> Insight
        </h1>
        <p className="text-gray-400 font-medium mt-3 ml-16">Create a premium listing for your latest collection.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Info - 2/3 Width */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div
            variants={fieldsetVariants}
            initial="hidden"
            animate="visible"
            className="glass-card p-10 space-y-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="size-8 bg-purple-500/10 rounded-none flex items-center justify-center text-purple-500">
                <Info size={16} />
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-wider">Basic Details</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Product Title</label>
                <div className="relative group">
                  <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-pink-500 transition-colors" size={20} />
                  <input
                    type="text"
                    name="name"
                    required
                    className="input-glass pl-12 font-bold"
                    placeholder="Ex: Midnight Matte Red Lipstick"
                    value={product.name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Full Description</label>
                <textarea
                  name="description"
                  required
                  rows="6"
                  className="input-glass resize-none font-medium text-sm leading-relaxed"
                  placeholder="Describe the texture, finish, and unique benefits of this product..."
                  value={product.description}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
          </motion.div>

          {/* Inventory & Pricing */}
          <motion.div
            variants={fieldsetVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            className="glass-card p-10"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="size-8 bg-emerald-500/10 rounded-none flex items-center justify-center text-emerald-500">
                <DollarSign size={16} />
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-wider">Inventory & Pricing</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Price ($)</label>
                <div className="relative group">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500" size={20} />
                  <input
                    type="number"
                    name="price"
                    required
                    className="input-glass pl-12 font-black text-pink-500"
                    placeholder="0.00"
                    value={product.price}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Available Stock</label>
                <div className="relative group">
                  <Box className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                  <input
                    type="number"
                    name="stock"
                    required
                    className="input-glass pl-12 font-bold"
                    placeholder="Ex: 50"
                    value={product.stock}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar Info - 1/3 Width */}
        <div className="space-y-8">
          {/* Image Upload Area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 flex flex-col items-center"
          >
            <div className="w-full flex items-center gap-3 mb-6">
              <div className="size-8 bg-blue-500/10 rounded-none flex items-center justify-center text-blue-500">
                <ImageIcon size={16} />
              </div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">Main Imagery</h3>
            </div>

            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              className={`relative w-full aspect-[3/4] rounded-3xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center overflow-hidden cursor-pointer
                ${isDragging ? 'border-pink-500 bg-pink-500/5' : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'}`}
              onClick={() => fileInputRef.current.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFileChange(e.target.files[0])}
              />

              {product.imagePreview ? (
                <div className="relative w-full h-full group">
                  <img src={product.imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <UploadCloud className="text-white" size={32} />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center p-6">
                  <div className="size-16 bg-white/5 rounded-none flex items-center justify-center mb-4 text-gray-500">
                    <UploadCloud size={32} />
                  </div>
                  <p className="text-white font-bold text-sm">Drop your image</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-2">or click to browse</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Categorization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-8 space-y-6"
          >
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Category</label>
                <div className="relative group">
                  <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-pink-500 transition-colors" size={18} />
                  <select
                    name="category"
                    required
                    className="input-glass pl-12 appearance-none font-bold"
                    value={product.category}
                    onChange={handleChange}
                  >
                    <option value="" disabled>Select Segment</option>
                    <option value="Makeup">Makeup</option>
                    <option value="Skin Care">Skin Care</option>
                    <option value="Hair Care">Hair Care</option>
                    <option value="Fragrance">Fragrance</option>
                    <option value="Personal Care">Personal Care</option>
                    <option value="Mom & Baby">Mom & Baby</option>
                    <option value="Health & Wellness">Health & Wellness</option>
                    <option value="Men">Men</option>
                    <option value="Luxe">Luxe</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Brand Identity</label>
                <div className="relative group">
                  <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-pink-500 transition-colors" size={18} />
                  <input
                    type="text"
                    name="brand"
                    className="input-glass pl-12 font-bold"
                    placeholder="Ex: Nykaa"
                    value={product.brand}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary bg-black h-16 flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
            >
              {loading ? (
                <div className="size-6 border-4 border-white/90 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span className="text-xs uppercase tracking-[0.2em]">Publish Product</span>
                  <ChevronRight size={20} />
                </>
              )}
            </button>
          </motion.div>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;

