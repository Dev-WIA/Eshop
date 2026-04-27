import React from 'react'
import { useGetOrdersQuery } from '../../store/slices/ordersApiSlice'
import { useGetProductsQuery } from '../../store/slices/productsApiSlice'
import { useGetUsersQuery } from '../../store/slices/usersApiSlice'
import { 
    TrendingUp, 
    ShoppingBag, 
    Users, 
    DollarSign, 
    Loader, 
    Package, 
    AlertCircle,
    BarChart3,
    PieChart as PieChartIcon,
    ArrowUpRight
} from 'lucide-react'
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts'

const Dashboard = () => {
  const { data: orders, isLoading: loadingOrders } = useGetOrdersQuery()
  const { data: productsData, isLoading: loadingProducts } = useGetProductsQuery({})
  const { data: users, isLoading: loadingUsers } = useGetUsersQuery()

  const products = productsData?.products || []

  // Stats calculation
  const totalSales = orders?.reduce((acc, order) => acc + (order.isPaid ? order.totalPrice : 0), 0) || 0
  const orderCount = orders?.length || 0
  const userCount = users?.length || 0
  const productCount = products?.length || 0

  // Chart Data preparation
  const chartData = orders?.slice(-7).map(order => ({
    name: new Date(order.createdAt).toLocaleDateString('en-US', { weekday: 'short' }),
    sales: order.isPaid ? order.totalPrice : 0,
    orders: 1
  })) || []

  // Category Distribution for Pie Chart
  const categories = {}
  products.forEach(p => {
    categories[p.category] = (categories[p.category] || 0) + 1
  })
  const pieData = Object.keys(categories).map(cat => ({
    name: cat,
    value: categories[cat]
  }))

  const COLORS = ['#38bdf8', '#818cf8', '#c084fc', '#fb7185', '#fbbf24']

  const isLoading = loadingOrders || loadingProducts || loadingUsers

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-10">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-4xl font-black tracking-tight">Analytics Dashboard</h1>
            <p className="text-text-muted mt-1 text-sm font-medium">Monitoring your store's growth and operations.</p>
        </div>
        <div className="bg-accent/10 text-accent px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 border border-accent/20">
            <TrendingUp size={16} />
            <span>Live Analysis</span>
        </div>
      </div>

      {isLoading ? (
          <div className="h-96 flex items-center justify-center">
              <Loader className="animate-spin text-accent" size={48} />
          </div>
      ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { label: 'Total Revenue', value: `$${totalSales.toLocaleString()}`, icon: <DollarSign />, color: 'text-green-400', bg: 'bg-green-500/10' },
                    { label: 'Orders placed', value: orderCount, icon: <ShoppingBag />, color: 'text-accent', bg: 'bg-accent/10' },
                    { label: 'Total Customers', value: userCount, icon: <Users />, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
                    { label: 'Inventory Size', value: productCount, icon: <Package />, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                ].map((stat, i) => (
                    <div key={i} className="glass group p-8 rounded-[2rem] border border-white/5 space-y-4 hover:border-accent/30 transition-all hover:translate-y-[-4px]">
                        <div className={`p-4 ${stat.bg} ${stat.color} rounded-2xl w-fit transition-transform group-hover:scale-110`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-text-muted text-xs font-bold uppercase tracking-widest">{stat.label}</p>
                            <div className="flex items-end justify-between">
                                <h3 className="text-4xl font-black mt-1 leading-none">{stat.value}</h3>
                                <div className="text-green-500 flex items-center text-[10px] font-bold mb-1">
                                    <ArrowUpRight size={14} /> 12%
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass p-8 rounded-[2rem] border border-white/5 space-y-8">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <BarChart3 size={20} className="text-accent" />
                            Revenue Timeline
                        </h3>
                        <span className="text-xs text-text-muted font-bold px-3 py-1 bg-white/5 rounded-lg">Last 7 Orders</span>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} 
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} 
                                />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', fontSize: '12px' }}
                                    itemStyle={{ color: '#38bdf8', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="sales" stroke="#38bdf8" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass p-8 rounded-[2rem] border border-white/5 space-y-8">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <PieChartIcon size={20} className="text-purple-400" />
                        Inventory Split
                    </h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                     contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', fontSize: '12px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {pieData.map((entry, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                <span className="text-[10px] items-center font-bold text-text-muted truncate uppercase">{entry.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass p-8 rounded-3xl border border-white/5 space-y-6">
                    <h3 className="text-xl font-bold">Operational Alerts</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-white/5 p-6 rounded-2xl flex flex-col items-center text-center space-y-3 hover:bg-white/10 transition-all cursor-pointer group">
                            <AlertCircle className="text-yellow-500 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-bold leading-relaxed">Pending Shipments<br/><span className="text-lg text-white">5 Orders</span></span>
                        </div>
                        <div className="bg-white/5 p-6 rounded-2xl flex flex-col items-center text-center space-y-3 hover:bg-white/10 transition-all cursor-pointer group">
                            <Package className="text-red-400 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-bold leading-relaxed">Low Stock Alert<br/><span className="text-lg text-white">2 Products</span></span>
                        </div>
                    </div>
                </div>

                <div className="glass p-8 rounded-3xl border border-white/5 flex flex-col md:flex-row items-center gap-8 justify-between">
                    <div className="space-y-4">
                        <h3 className="text-2xl font-black">Marketing Overview</h3>
                        <p className="text-text-muted text-sm max-w-xs">Your personalized coupon campaigns are performing 15% better than last month.</p>
                        <button className="bg-white/5 hover:bg-white/10 px-6 py-2.5 rounded-xl text-xs font-bold transition-all">Launch Campaign</button>
                    </div>
                    <div className="w-32 h-32 bg-accent/20 rounded-full flex items-center justify-center relative shadow-[0_0_50px_rgba(56,189,248,0.2)]">
                        <TrendingUp size={48} className="text-accent" />
                        <div className="absolute -top-2 -right-2 bg-green-500 text-primary-bg font-black px-2 py-1 rounded-lg text-[10px]">+24%</div>
                    </div>
                </div>
            </div>
          </>
      )}
    </div>
  )
}

export default Dashboard
