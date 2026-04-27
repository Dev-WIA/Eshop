import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useGetOrderDetailsQuery } from '../../store/slices/ordersApiSlice'
import { Loader, CheckCircle, XCircle, MapPin, CreditCard, ShoppingBag, ArrowLeft } from 'lucide-react'
import axios from 'axios'

const OrderDetails = () => {
  const { id: orderId } = useParams()
  const { data: order, isLoading, error, refetch } = useGetOrderDetailsQuery(orderId)

  const paymentHandler = async () => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}`,
        },
      }

      const { data } = await axios.post(
        'http://localhost:5000/api/payment/create-checkout-session',
        { orderId },
        config
      )

      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      alert(err?.response?.data?.message || 'Payment failed to initiate')
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
       <Link to="/profile" className="inline-flex items-center space-x-2 text-text-muted hover:text-accent transition-colors">
        <ArrowLeft size={18} />
        <span>Back to My Orders</span>
      </Link>

      {isLoading ? (
         <div className="h-64 flex items-center justify-center">
            <Loader className="animate-spin text-accent" size={40} />
         </div>
      ) : error ? (
        <div className="glass p-10 rounded-2xl text-center text-red-400">
            {error?.data?.message || 'Failed to load order details.'}
        </div>
      ) : (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-bold">Order Details</h1>
                    <p className="text-text-muted font-mono text-sm mt-1">ID: {order._id}</p>
                </div>
                <div className="flex items-center space-x-4">
                    {!order.isPaid && (
                        <button 
                            onClick={paymentHandler}
                            className="bg-accent text-primary-bg px-8 py-4 rounded-xl font-bold flex items-center space-x-2 hover:scale-105 transition-all shadow-lg shadow-accent/20"
                        >
                            <CreditCard size={20} />
                            <span>Pay Now with Stripe</span>
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 text-left">
                {/* Info Cards */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="glass p-8 rounded-3xl border border-white/10 space-y-4">
                            <div className="flex items-center space-x-3 text-accent mb-2">
                                <MapPin size={24} />
                                <h3 className="text-xl font-bold text-white">Shipping</h3>
                            </div>
                            <p className="text-text-muted">
                                <strong>Name:</strong> {order.user.name}<br />
                                <strong>Email:</strong> {order.user.email}<br />
                                <strong>Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                            </p>
                            <div className="pt-2">
                                {order.isDelivered ? (
                                    <div className="flex items-center text-green-500 gap-2 bg-green-500/10 px-4 py-2 rounded-xl w-fit font-bold text-xs uppercase">
                                        <CheckCircle size={14} /> Delivered on {order.deliveredAt.substring(0, 10)}
                                    </div>
                                ) : (
                                    <div className="flex items-center text-yellow-500 gap-2 bg-yellow-500/10 px-4 py-2 rounded-xl w-fit font-bold text-xs uppercase">
                                        <XCircle size={14} /> Not Delivered
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="glass p-8 rounded-3xl border border-white/10 space-y-4">
                            <div className="flex items-center space-x-3 text-accent mb-2">
                                <CreditCard size={24} />
                                <h3 className="text-xl font-bold text-white">Payment Method</h3>
                            </div>
                            <p className="text-text-muted">
                                <strong>Method:</strong> {order.paymentMethod}
                            </p>
                            <div className="pt-2">
                                {order.isPaid ? (
                                    <div className="flex items-center text-green-500 gap-2 bg-green-500/10 px-4 py-2 rounded-xl w-fit font-bold text-xs uppercase">
                                        <CheckCircle size={14} /> Paid on {order.paidAt.substring(0, 10)}
                                    </div>
                                ) : (
                                    <div className="flex items-center text-red-400 gap-2 bg-red-400/10 px-4 py-2 rounded-xl w-fit font-bold text-xs uppercase">
                                        <XCircle size={14} /> Not Paid
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="glass p-8 rounded-3xl border border-white/10 space-y-6">
                        <h3 className="text-xl font-bold flex items-center space-x-3">
                            <ShoppingBag size={24} className="text-accent" />
                            <span>Order Items</span>
                        </h3>
                        {order.orderItems.length === 0 ? <p>Order is empty</p> : (
                            <div className="space-y-4">
                                {order.orderItems.map((item, index) => (
                                    <div key={index} className="flex items-center gap-6 pb-4 border-b border-white/5 last:border-0 last:pb-0">
                                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/5">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-grow">
                                            <Link to={`/product/${item.product}`} className="font-bold hover:text-accent transition-colors">
                                                {item.name}
                                            </Link>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-mono text-sm">{item.qty} x ${item.price} = </span>
                                            <span className="font-bold text-accent">${(item.qty * item.price).toFixed(2)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Summary Card */}
                <div className="lg:col-span-1">
                    <div className="glass p-8 rounded-3xl border border-white/10 sticky top-28 space-y-6">
                         <h3 className="text-xl font-bold">Order Summary</h3>
                         <div className="space-y-4 text-sm">
                             <div className="flex justify-between">
                                 <span className="text-text-muted">Items</span>
                                 <span>${order.itemsPrice.toFixed(2)}</span>
                             </div>
                             <div className="flex justify-between">
                                 <span className="text-text-muted">Shipping</span>
                                 <span>${order.shippingPrice.toFixed(2)}</span>
                             </div>
                             <div className="flex justify-between">
                                 <span className="text-text-muted">Tax</span>
                                 <span>${order.taxPrice.toFixed(2)}</span>
                             </div>
                             <div className="pt-4 border-t border-white/10 flex justify-between items-center text-xl font-bold">
                                 <span>Total</span>
                                 <span className="text-accent">${order.totalPrice.toFixed(2)}</span>
                             </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  )
}

export default OrderDetails
