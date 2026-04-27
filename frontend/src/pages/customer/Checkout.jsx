import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { saveShippingAddress, clearCartItems } from '../../store/slices/cartSlice'
import { useCreateOrderMutation } from '../../store/slices/ordersApiSlice'
import { MapPin, CreditCard, ChevronRight, Loader, ShoppingBag } from 'lucide-react'

const Checkout = () => {
  const cart = useSelector((state) => state.cart)
  const { shippingAddress, cartItems } = cart

  const [address, setAddress] = useState(shippingAddress.address || '')
  const [city, setCity] = useState(shippingAddress.city || '')
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '')
  const [country, setCountry] = useState(shippingAddress.country || '')

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [createOrder, { isLoading }] = useCreateOrderMutation()

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      const res = await createOrder({
        orderItems: cartItems,
        shippingAddress: { address, city, postalCode, country },
        paymentMethod: 'Stripe',
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap()
      dispatch(saveShippingAddress({ address, city, postalCode, country }))
      dispatch(clearCartItems())
      navigate(`/order/${res._id}`)
    } catch (err) {
      alert(err?.data?.message || err.error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center space-x-4 text-sm font-bold uppercase tracking-widest text-text-muted">
         <span className="text-accent">Shipping</span>
         <ChevronRight size={16} />
         <span>Payment</span>
         <ChevronRight size={16} />
         <span>Success</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="glass p-10 rounded-3xl border border-white/10 space-y-8">
            <div className="flex items-center space-x-3">
                <MapPin className="text-accent" />
                <h2 className="text-2xl font-bold">Shipping Details</h2>
            </div>

            <form onSubmit={submitHandler} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-muted px-1">Address</label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-accent outline-none transition-all"
                        placeholder="123 Street Name"
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-muted px-1">City</label>
                        <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-accent outline-none transition-all"
                            placeholder="Algiers"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-muted px-1">Postal Code</label>
                        <input
                            type="text"
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-accent outline-none transition-all"
                            placeholder="16000"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-muted px-1">Country</label>
                    <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-accent outline-none transition-all"
                        placeholder="Algeria"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-accent text-primary-bg font-bold py-4 rounded-xl flex items-center justify-center space-x-2 hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                    {isLoading ? <Loader size={20} className="animate-spin" /> : (
                        <>
                            <span>Place Order & Pay</span>
                            <CreditCard size={20} />
                        </>
                    )}
                </button>
            </form>
        </div>

        {/* Mini Summary */}
        <div className="space-y-8">
            <h2 className="text-2xl font-bold px-2">Your Order</h2>
            <div className="glass p-6 rounded-3xl border border-white/10 space-y-4">
                {cartItems.map(item => (
                    <div key={item._id} className="flex justify-between items-center text-sm">
                        <span className="text-text-muted">{item.qty}x {item.name}</span>
                        <span className="font-bold">${(item.qty * item.price).toFixed(2)}</span>
                    </div>
                ))}
                <div className="pt-4 border-t border-white/10 flex justify-between items-center text-xl font-bold">
                    <span>Total</span>
                    <span className="text-accent">${cart.totalPrice}</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
