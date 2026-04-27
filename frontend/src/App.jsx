import React, { useEffect, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import CustomerLayout from './Layouts/CustomerLayout'
import AdminLayout from './Layouts/AdminLayout'

// Customer Pages
import Home from './pages/customer/Home'
import Shop from './pages/customer/Shop'
import ProductDetails from './pages/customer/ProductDetails'
import Cart from './pages/customer/Cart'
import Login from './pages/customer/Login'
import Register from './pages/customer/Register'
import Profile from './pages/customer/Profile'
import Checkout from './pages/customer/Checkout'
import OrderDetails from './pages/customer/OrderDetails'
import Wishlist from './pages/customer/Wishlist'
import NotFound from './pages/customer/NotFound'

// Admin Pages
import Dashboard from './pages/admin/Dashboard'
import ProductsManage from './pages/admin/ProductsManage'
import AddEditProduct from './pages/admin/AddEditProduct'
import OrdersManage from './pages/admin/OrdersManage'
import UsersManage from './pages/admin/UsersManage'
import CouponsManage from './pages/admin/CouponsManage'

const App = () => {
  const { i18n } = useTranslation()

  useEffect(() => {
    document.body.dir = i18n.language === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = i18n.language
  }, [i18n.language])

  return (
    <div className={`min-h-screen bg-primary-bg text-white selection:bg-accent/30 ${i18n.language === 'ar' ? 'font-arabic' : ''}`}>
      <Router>
        <Suspense fallback={<div className="h-screen flex items-center justify-center text-accent">Loading...</div>}>
          <Routes>
            {/* Customer Routes */}
            <Route path="/" element={<CustomerLayout />}>
              <Route index element={<Home />} />
              <Route path="shop" element={<Shop />} />
              <Route path="product/:id" element={<ProductDetails />} />
              <Route path="cart" element={<Cart />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="profile" element={<Profile />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="order/:id" element={<OrderDetails />} />
              <Route path="wishlist" element={<Wishlist />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<ProductsManage />} />
              <Route path="product/:id/edit" element={<AddEditProduct />} />
              <Route path="orders" element={<OrdersManage />} />
              <Route path="users" element={<UsersManage />} />
              <Route path="coupons" element={<CouponsManage />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </div>
  )
}

export default App
