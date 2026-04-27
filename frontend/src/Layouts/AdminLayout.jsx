import React from 'react'
import { Outlet, Link, Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { LayoutDashboard, Package, ShoppingBag, Users, Home, Tag } from 'lucide-react'

const AdminLayout = () => {
  const { userInfo } = useSelector((state) => state.auth)
  const location = useLocation()

  if (!userInfo || userInfo.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Products', path: '/admin/products', icon: <Package size={20} /> },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingBag size={20} /> },
    { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
    { name: 'Coupons', path: '/admin/coupons', icon: <Tag size={20} /> },
  ]

  return (
    <div className="flex min-h-screen bg-primary-bg">
      {/* Sidebar */}
      <aside className="w-64 glass border-r border-white/10 flex flex-col">
        <div className="p-6">
          <Link to="/" className="text-xl font-bold text-accent tracking-tighter">
            E-SHOP ADMIN
          </Link>
        </div>
        
        <nav className="flex-grow px-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                location.pathname === item.path
                  ? 'bg-accent text-primary-bg font-semibold'
                  : 'hover:bg-white/5'
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link to="/" className="flex items-center space-x-3 px-4 py-3 hover:bg-white/5 rounded-lg transition-all">
            <Home size={20} />
            <span>Back to Store</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
