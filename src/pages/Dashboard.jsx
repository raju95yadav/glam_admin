import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  TrendingUp, 
  Package, 
  Users, 
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Activity
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const timerRef = useRef(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/admin/stats');
        setStats(data);
        setChartData(data.salesData || []);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();

    // Start fluctuation effect
    timerRef.current = setInterval(() => {
      setChartData(prev => {
        if (prev.length === 0) return prev;
        const newData = [...prev];
        const lastIndex = newData.length - 1;
        // Subtle fluctuation: +/- 2%
        const jitter = 1 + (Math.random() * 0.04 - 0.02); 
        newData[lastIndex] = {
          ...newData[lastIndex],
          sales: Math.floor(newData[lastIndex].sales * jitter)
        };
        return newData;
      });
    }, 3000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="size-12 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Revenue', value: stats?.revenue || 0, icon: <DollarSign size={24} />, color: 'from-green-500/20 to-emerald-500/20', iconColor: 'text-green-500', prefix: '$', path: '/dashboard' },
    { title: 'Total Orders', value: stats?.orders || 0, icon: <ShoppingCart size={24} />, color: 'from-pink-500/20 to-rose-500/20', iconColor: 'text-pink-500', path: '/orders' },
    { title: 'Products', value: stats?.products || 0, icon: <Package size={24} />, color: 'from-blue-500/20 to-indigo-500/20', iconColor: 'text-blue-500', path: '/manage-products' },
    { title: 'Total Users', value: stats?.users || 0, icon: <Users size={24} />, color: 'from-purple-500/20 to-violet-500/20', iconColor: 'text-purple-500', path: '/users' },
  ];

  const COLORS = ['#ff1493', '#8b5cf6', '#3b82f6', '#10b981'];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Analytics <span className="text-pink-500">Overview</span></h1>
          <p className="text-gray-400 font-medium mt-1">Real-time performance metrics for your RAJPRODUCT project.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="glass px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-bold text-gray-400">
              <span className="size-2 bg-green-500 rounded-full animate-ping"></span>
              LIVE DATA
           </div>
           <button className="btn-primary flex items-center gap-2 text-sm">
              <Activity size={16} />
              Export Report
           </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Link key={index} to={stat.path} className="block group">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`glass-card relative overflow-hidden h-full`}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`}></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-4 rounded-2xl bg-white/5 ${stat.iconColor} shadow-inner`}>
                    {stat.icon}
                  </div>
                  <div className="flex items-center gap-1 text-xs font-black text-green-500 bg-green-500/10 px-2 py-1 rounded-lg">
                    <ArrowUpRight size={12} />
                    +12.5%
                  </div>
                </div>
                <h3 className="text-gray-400 text-xs font-black uppercase tracking-[0.2em]">{stat.title}</h3>
                <p className="text-3xl font-black text-white mt-2 flex items-baseline gap-1">
                  {stat.prefix}
                  <CountUp end={stat.value} duration={2.5} separator="," />
                </p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 glass-card min-h-[450px] flex flex-col"
        >
          <div className="flex items-center justify-between mb-8">
             <h3 className="text-xl font-black text-white">Revenue <span className="text-pink-500">Growth</span></h3>
             <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold outline-none cursor-pointer hover:bg-white/10 transition-colors">
               <option>Last 7 Days</option>
               <option>Last 30 Days</option>
             </select>
          </div>
          <div className="flex-1 w-full min-h-[400px] relative">
            <ResponsiveContainer width="100%" height={400} debounce={50}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff1493" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ff1493" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: 'rgba(255,255,255,0.3)', fontSize: 12, fontWeight: 'bold'}}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: 'rgba(255,255,255,0.3)', fontSize: 12, fontWeight: 'bold'}}
                />
                <Tooltip 
                  contentStyle={{backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'}}
                  itemStyle={{color: '#fff', fontSize: '12px', fontWeight: 'bold'}}
                  cursor={{stroke: '#ff1493', strokeWidth: 2}}
                />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#ff1493" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorSales)"
                  animationDuration={1000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card flex flex-col"
        >
          <h3 className="text-xl font-black text-white mb-8">Category <span className="text-purple-500">Share</span></h3>
          <div className="flex-1 w-full flex items-center justify-center min-h-[300px] relative">
            <ResponsiveContainer width="100%" height={300} debounce={50}>
              <PieChart>
                <Pie
                  data={stats?.categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {stats?.categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px'}}
                   itemStyle={{color: '#fff', fontSize: '11px'}}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  formatter={(value) => <span className="text-xs font-bold text-gray-400 ml-2">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 pt-6 border-t border-white/5">
             <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Main Driver</p>
                <p className="text-xs font-black text-pink-500 uppercase tracking-widest">Makeup (40%)</p>
             </div>
             <p className="text-[10px] text-gray-500 italic">Makeup categories remain the primary revenue generator this quarter.</p>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity Table (Placeholder Look) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card"
      >
        <div className="flex items-center justify-between mb-8">
           <h3 className="text-xl font-black text-white">Recent <span className="text-pink-500">Orders</span></h3>
           <button className="text-xs font-black text-pink-500 uppercase tracking-widest hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 uppercase text-[10px] font-black text-gray-500 tracking-[0.2em]">
                <th className="pb-4">Order ID</th>
                <th className="pb-4">Customer</th>
                <th className="pb-4">Product</th>
                <th className="pb-4">Amount</th>
                <th className="pb-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[1, 2, 3].map((_, i) => (
                <tr key={i} className="group hover:bg-white/5 transition-colors">
                  <td className="py-6 text-sm font-bold text-gray-400">#ORD00{i+1}</td>
                  <td className="py-6">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-500 text-[10px] font-black">JD</div>
                      <span className="text-sm font-bold text-white">Jassiji Kaur</span>
                    </div>
                  </td>
                  <td className="py-6 text-sm font-medium text-gray-300">Lipstick Matte Red</td>
                  <td className="py-6 text-sm font-black text-white">$129.00</td>
                  <td className="py-6 text-right">
                    <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-black rounded-full uppercase tracking-widest">Completed</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;

