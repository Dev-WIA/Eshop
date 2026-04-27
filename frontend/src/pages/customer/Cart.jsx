import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Tag, X } from 'lucide-react'
import { addToCart, removeFromCart, applyCoupon, removeCoupon } from '../../store/slices/cartSlice'
import { useValidateCouponMutation } from '../../store/slices/couponsApiSlice'

const Cart = () => {
  const [couponCode, setCouponCode] = React.useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { cartItems, itemsPrice, shippingPrice, taxPrice, totalPrice, discount, coupon } = useSelector((state) => state.cart)
  const [validateCoupon, { isLoading: isValidating }] = useValidateCouponMutation()

  const checkoutHandler = () => {
    navigate('/login?redirect=/checkout')
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <h1 className="text-4xl font-bold">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="glass p-20 rounded-3xl flex flex-col items-center space-y-6 text-center">
            <div className="p-6 bg-accent/20 rounded-full text-accent">
                <ShoppingBag size={48} />
            </div>
            <div className="space-y-2">
                <h2 className="text-2xl font-bold">Your cart is empty</h2>
                <p className="text-text-muted">Looks like you haven't added anything yet.</p>
            </div>
            <Link to="/shop" className="bg-accent text-primary-bg px-8 py-4 rounded-xl font-bold">
                Start Shopping
            </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 text-left">
          <div className="lg:col-span-2 space-y-6">
            {/* Cart Items List */}
            {cartItems.map((item) => (
              <div key={item._id} className="glass p-6 rounded-3xl border border-white/5 flex flex-col md:flex-row items-center gap-8 group hover:border-accent/40 transition-all">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white/5 flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex-grow space-y-1">
                    <h3 className="text-xl font-bold">
                        <Link to={`/product/${item._id}`} className="hover:text-accent transition-colors">
                            {item.name}
                        </Link>
                    </h3>
                    <p className="text-text-muted text-sm">{item.category}</p>
                </div>
                <div className="flex items-center space-x-6">
                    <div className="flex items-center border border-white/10 rounded-xl px-2 py-1 bg-white/5">
                        <button onClick={() => dispatch(addToCart({ ...item, qty: Math.max(1, item.qty - 1) }))} className="p-1 hover:text-accent transition-colors"><Minus size={16} /></button>
                        <span className="w-8 text-center font-bold">{item.qty}</span>
                        <button onClick={() => dispatch(addToCart({ ...item, qty: Math.min(item.countInStock, item.qty + 1) }))} className="p-1 hover:text-accent transition-colors"><Plus size={16} /></button>
                    </div>
                    <div className="text-right w-24">
                        <p className="font-bold text-lg">${(item.price * item.qty).toFixed(2)}</p>
                        <p className="text-xs text-text-muted">${item.price} each</p>
                    </div>
                    <button 
                        onClick={() => dispatch(removeFromCart(item._id))}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1 space-y-8">
            {/* Coupon Code Section */}
            <div className="glass p-8 rounded-3xl border border-white/10 space-y-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <Tag size={20} className="text-accent" />
                    <span>Promo Code</span>
                </h3>
                {coupon ? (
                   <div className="flex items-center justify-between bg-accent/10 border border-accent/20 p-4 rounded-xl">
                       <div className="flex flex-col">
                            <span className="text-accent font-bold text-sm tracking-widest">{coupon.code}</span>
                            <span className="text-xs text-text-muted">
                                {coupon.discountType === 'percent' ? `${coupon.discountValue}% off` : `$${coupon.discountValue} off`}
                            </span>
                       </div>
                       <button 
                         onClick={() => dispatch(removeCoupon())}
                         className="p-1 hover:bg-accent/20 rounded-md transition-colors"
                       >
                           <X size={18} className="text-accent" />
                       </button>
                   </div>
                ) : (
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            placeholder="Enter code"
                            className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:border-accent outline-none transition-all uppercase"
                        />
                        <button 
                            onClick={async () => {
                                try {
                                    const res = await validateCoupon({ code: couponCode }).unwrap()
                                    dispatch(applyCoupon(res))
                                    setCouponCode('')
                                } catch (err) {
                                    alert(err?.data?.message || 'Invalid coupon')
                                }
                            }}
                            disabled={isValidating || !couponCode}
                            className="bg-accent text-primary-bg px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-accent/20 disabled:opacity-50"
                        >
                            Apply
                        </button>
                    </div>
                )}
            </div>

            {/* Order Summary */}
            <div className="glass p-8 rounded-3xl border border-white/10 space-y-6">
              <h3 className="text-2xl font-bold">Summary</h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-muted">Total Items</span>
                  <span className="font-bold">{cartItems.reduce((acc, item) => acc + item.qty, 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Subtotal</span>
                  <span className="font-bold">${itemsPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Shipping</span>
                  <span className="font-bold">${shippingPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Tax</span>
                  <span className="font-bold">${taxPrice}</span>
                </div>
                {discount > 0 && (
                     <div className="flex justify-between text-green-500 font-bold">
                        <span>Discount</span>
                        <span>-${discount.toFixed(2)}</span>
                    </div>
                )}
                <div className="pt-4 border-t border-white/5 flex justify-between items-center text-2xl font-bold">
                  <span>Total</span>
                  <span className="text-accent">${totalPrice}</span>
                </div>
              </div>
              
              <button
                onClick={checkoutHandler}
                className="w-full bg-accent text-primary-bg font-bold py-4 rounded-xl flex items-center justify-center space-x-2 hover:scale-[1.02] transition-transform shadow-lg shadow-accent/20 active:scale-95"
              >
                <span>Checkout</span>
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
