import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useGetMyOrdersQuery } from '../../store/slices/ordersApiSlice'
import { useUpdateProfileMutation } from '../../store/slices/usersApiSlice'
import { setCredentials } from '../../store/slices/authSlice'
import { User, Package, Settings, ChevronRight, Loader, CheckCircle, XCircle } from 'lucide-react'

const Profile = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [activeTab, setActiveTab] = useState('orders')

  const dispatch = useDispatch()
  const { userInfo } = useSelector((state) => state.auth)

  const { data: orders, isLoading: loadingOrders, error: errorOrders } = useGetMyOrdersQuery()
  const [updateProfile, { isLoading: loadingUpdate }] = useUpdateProfileMutation()

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name)
      setEmail(userInfo.email)
    }
  }, [userInfo])

  const submitHandler = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert('Passwords do not match')
      return
    }
    try {
      const res = await updateProfile({
          _id: userInfo._id,
          name,
          email,
          password,
      }).unwrap()
      dispatch(setCredentials({ ...res }))
      alert('Profile updated successfully')
      setPassword('')
      setConfirmPassword('')
    } catch (err) {
      alert(err?.data?.message || err.error)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar */}
        <div className="md:w-1/3 space-y-6">
            <div className="glass p-8 rounded-3xl text-center space-y-4 border border-white/5">
                <div className="w-24 h-24 bg-accent/20 text-accent rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
                    {userInfo?.name.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h2 className="text-2xl font-bold">{userInfo?.name}</h2>
                    <p className="text-text-muted">{userInfo?.email}</p>
                </div>
            </div>

            <div className="glass rounded-3xl overflow-hidden border border-white/5">
                <button 
                    onClick={() => setActiveTab('orders')}
                    className={`w-full flex items-center justify-between px-6 py-4 transition-colors ${activeTab === 'orders' ? 'bg-accent text-primary-bg' : 'hover:bg-white/5'}`}
                >
                    <div className="flex items-center space-x-3">
                        <Package size={20} />
                        <span className="font-bold">My Orders</span>
                    </div>
                    <ChevronRight size={18} />
                </button>
                <button 
                    onClick={() => setActiveTab('settings')}
                    className={`w-full flex items-center justify-between px-6 py-4 transition-colors ${activeTab === 'settings' ? 'bg-accent text-primary-bg' : 'hover:bg-white/5'}`}
                >
                    <div className="flex items-center space-x-3">
                        <Settings size={20} />
                        <span className="font-bold">Account Settings</span>
                    </div>
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>

        {/* Content */}
        <div className="md:w-2/3">
            {activeTab === 'orders' ? (
                <div className="space-y-8">
                    <h3 className="text-3xl font-bold">Order History</h3>
                    {loadingOrders ? (
                        <div className="flex justify-center py-10">
                            <Loader className="animate-spin text-accent" size={40} />
                        </div>
                    ) : errorOrders ? (
                        <div className="text-red-400">{errorOrders?.data?.message || 'Error loading orders'}</div>
                    ) : orders?.length === 0 ? (
                        <div className="glass p-10 rounded-3xl text-center text-text-muted">
                            You haven't placed any orders yet.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <div key={order._id} className="glass p-6 rounded-2xl border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-accent/40 transition-all">
                                    <div>
                                        <div className="flex items-center space-x-2">
                                            <span className="font-mono text-xs text-text-muted">#{order._id.substring(0, 10)}</span>
                                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-white/5">{order.createdAt.substring(0,10)}</span>
                                        </div>
                                        <h4 className="font-bold text-lg mt-1">${order.totalPrice.toFixed(2)}</h4>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col items-end">
                                            <div className={`flex items-center gap-1 text-[10px] font-bold uppercase rounded-lg px-3 py-1 ${order.isPaid ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                                {order.isPaid ? <CheckCircle size={10} /> : <XCircle size={10} />}
                                                {order.isPaid ? 'Paid' : 'Unpaid'}
                                            </div>
                                            <div className={`flex items-center gap-1 text-[10px] font-bold uppercase rounded-lg px-3 py-1 mt-1 ${order.isDelivered ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                                {order.isDelivered ? <CheckCircle size={10} /> : <XCircle size={10} />}
                                                {order.isDelivered ? 'Delivered' : 'Pending'}
                                            </div>
                                        </div>
                                        <Link to={`/order/${order._id}`} className="bg-white/10 hover:bg-accent hover:text-primary-bg p-3 rounded-xl transition-all">
                                            <ChevronRight size={20} />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-8">
                    <h3 className="text-3xl font-bold">Account Settings</h3>
                    <form onSubmit={submitHandler} className="glass p-8 rounded-3xl border border-white/10 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-text-muted px-1">Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-accent outline-none transition-all"
                                    placeholder="Your Name"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-text-muted px-1">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-accent outline-none transition-all"
                                    placeholder="email@example.com"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-text-muted px-1">New Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-accent outline-none transition-all"
                                    placeholder="Leave blank to keep current"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-text-muted px-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-accent outline-none transition-all"
                                    placeholder="Confirm new password"
                                />
                            </div>
                        </div>

                        <button 
                            disabled={loadingUpdate}
                            className="w-full bg-accent text-primary-bg font-bold py-4 rounded-xl flex items-center justify-center space-x-2 hover:scale-[1.02] transition-transform active:scale-95 shadow-lg shadow-accent/20"
                        >
                            {loadingUpdate ? <Loader className="animate-spin" size={20} /> : 'Save Changes'}
                        </button>
                    </form>
                </div>
            )}
        </div>
      </div>
    </div>
  )
}

export default Profile
