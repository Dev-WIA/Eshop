import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { ShoppingCart, User, LogOut, Menu, X, Heart, Globe } from 'lucide-react'
import { logout } from '../../store/slices/authSlice'

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false)
  const { t, i18n } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { userInfo } = useSelector((state) => state.auth)
  const { cartItems } = useSelector((state) => state.cart)
  const { wishlistItems } = useSelector((state) => state.wishlist)

  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0)
  const wishlistItemsCount = wishlistItems.length

  const logoutHandler = () => {
    dispatch(logout())
    navigate('/login')
  }

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en'
    i18n.changeLanguage(newLang)
  }

  return (
    <nav className="glass sticky top-0 z-50 w-full px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-accent tracking-tighter">
          E-SHOP
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/shop" className="hover:text-accent transition-colors">{t('shop')}</Link>
          
          <button 
            onClick={toggleLanguage}
            className="flex items-center space-x-2 px-3 py-1 bg-white/5 rounded-lg hover:bg-white/10 transition-all font-bold text-xs"
          >
            <Globe size={14} className="text-accent" />
            <span>{i18n.language === 'en' ? 'العربية' : 'English'}</span>
          </button>
          <Link to="/wishlist" className="relative hover:text-accent transition-colors">
            <Heart size={20} />
            {wishlistItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-primary-bg text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {wishlistItemsCount}
              </span>
            )}
          </Link>
          <Link to="/cart" className="relative hover:text-accent transition-colors">
            <ShoppingCart size={20} />
            {cartItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-primary-bg text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {cartItemsCount}
              </span>
            )}
          </Link>
          
          {userInfo ? (
            <div className="flex items-center space-x-4">
              <Link to="/profile" className="flex items-center space-x-1 hover:text-accent transition-colors">
                <User size={18} />
                <span>{userInfo.name}</span>
              </Link>
              {userInfo.role === 'admin' && (
                <Link to="/admin/dashboard" className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">Admin</Link>
              )}
              <button onClick={logoutHandler} className="hover:text-red-400 transition-colors">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="bg-accent text-primary-bg px-4 py-2 rounded-lg font-semibold hover:bg-white transition-all">
              Login
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center space-x-4">
            <Link to="/cart" className="relative">
                <ShoppingCart size={20} />
                {cartItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-accent text-primary-bg text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {cartItemsCount}
                    </span>
                )}
            </Link>
            <button onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 pb-4 space-y-4 flex flex-col items-center animate-in slide-in-from-top duration-300">
          <Link to="/shop" onClick={() => setIsOpen(false)}>Shop</Link>
          {userInfo ? (
            <>
              <Link to="/profile" onClick={() => setIsOpen(false)}>{userInfo.name}</Link>
              {userInfo.role === 'admin' && (
                 <Link to="/admin/dashboard" onClick={() => setIsOpen(false)}>Admin Panel</Link>
              )}
              <button onClick={logoutHandler}>Logout</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setIsOpen(false)}>Login</Link>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
