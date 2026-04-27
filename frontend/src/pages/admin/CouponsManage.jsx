import React, { useState } from 'react'
import { useGetCouponsQuery, useCreateCouponMutation, useDeleteCouponMutation } from '../../store/slices/couponsApiSlice'
import { Loader, Tag, Trash2, Plus, Calendar, Percent, DollarSign, X } from 'lucide-react'

const CouponsManage = () => {
  const [showModal, setShowModal] = useState(false)
  const [code, setCode] = useState('')
  const [discountType, setDiscountType] = useState('percent')
  const [discountValue, setDiscountValue] = useState('')
  const [expiryDate, setExpiryDate] = useState('')

  const { data: coupons, isLoading, error, refetch } = useGetCouponsQuery()
  const [createCoupon, { isLoading: loadingCreate }] = useCreateCouponMutation()
  const [deleteCoupon] = useDeleteCouponMutation()

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      await createCoupon({ code: code.toUpperCase(), discountType, discountValue, expiryDate }).unwrap()
      setShowModal(false)
      setCode('')
      setDiscountValue('')
      setExpiryDate('')
      refetch()
      alert('Coupon created successfully')
    } catch (err) {
      alert(err?.data?.message || err.error)
    }
  }

  const deleteHandler = async (id) => {
    if (window.confirm('Delete this coupon?')) {
      try {
        await deleteCoupon(id).unwrap()
        refetch()
      } catch (err) {
        alert(err?.data?.message || err.error)
      }
    }
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold">Manage Coupons</h1>
            <p className="text-text-muted text-sm mt-1">Create and monitor your discount campaigns.</p>
        </div>
        <button 
            onClick={() => setShowModal(true)}
            className="bg-accent text-primary-bg px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-accent/20"
        >
            <Plus size={20} />
            <span>Create Coupon</span>
        </button>
      </div>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader className="animate-spin text-accent" size={40} />
        </div>
      ) : error ? (
        <div className="glass p-10 rounded-2xl text-center text-red-400">
          {error?.data?.message || 'Failed to load coupons.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          {coupons.map((coupon) => (
            <div key={coupon._id} className="glass p-6 rounded-3xl border border-white/5 space-y-4 group hover:border-accent/40 transition-all relative">
                <button 
                   onClick={() => deleteHandler(coupon._id)}
                   className="absolute top-4 right-4 p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                >
                    <Trash2 size={18} />
                </button>
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-accent/20 text-accent rounded-2xl">
                        <Tag size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black tracking-widest">{coupon.code}</h3>
                        <span className="text-[10px] uppercase font-bold text-text-muted">{coupon.discountType} discount</span>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm font-bold">
                        <span className="text-text-muted">Value</span>
                        <span className="text-accent">{coupon.discountType === 'percent' ? `${coupon.discountValue}%` : `$${coupon.discountValue}`}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-bold">
                        <span className="text-text-muted">Expires</span>
                        <span>{new Date(coupon.expiryDate).toLocaleDateString()}</span>
                    </div>
                </div>
                <div className={`w-full py-2 rounded-xl text-center text-[10px] font-black uppercase tracking-widest ${new Date(coupon.expiryDate) > new Date() ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {new Date(coupon.expiryDate) > new Date() ? 'Active' : 'Expired'}
                </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 text-left">
              <div className="absolute inset-0 bg-primary-bg/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />
              <div className="glass w-full max-w-lg p-8 rounded-[2rem] border border-white/10 relative animate-in zoom-in duration-300">
                  <div className="flex justify-between items-center mb-8">
                      <h2 className="text-2xl font-bold">Create New Coupon</h2>
                      <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/5 rounded-full"><X size={20} /></button>
                  </div>
                  <form onSubmit={submitHandler} className="space-y-6">
                      <div className="space-y-2">
                          <label className="text-sm font-bold text-text-muted ml-1">Coupon Code</label>
                          <input 
                            type="text" 
                            required 
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="e.g. SUMMER50" 
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:border-accent outline-none font-black tracking-widest uppercase" 
                          />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-text-muted ml-1">Type</label>
                            <select 
                                value={discountType}
                                onChange={(e) => setDiscountType(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:border-accent outline-none appearance-none font-bold text-sm"
                            >
                                <option value="percent">Percentage %</option>
                                <option value="fixed">Fixed Amount $</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                             <label className="text-sm font-bold text-text-muted ml-1">Value</label>
                             <div className="relative">
                                 {discountType === 'percent' ? <Percent className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} /> : <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />}
                                 <input 
                                    type="number" 
                                    required 
                                    value={discountValue}
                                    onChange={(e) => setDiscountValue(e.target.value)}
                                    placeholder="0" 
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-4 focus:border-accent outline-none font-bold" 
                                 />
                             </div>
                          </div>
                      </div>
                      <div className="space-y-2">
                          <label className="text-sm font-bold text-text-muted ml-1">Expiry Date</label>
                          <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                            <input 
                                type="date" 
                                required 
                                value={expiryDate}
                                onChange={(e) => setExpiryDate(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-4 focus:border-accent outline-none font-bold text-sm" 
                            />
                          </div>
                      </div>
                      <button 
                        disabled={loadingCreate}
                        className="w-full bg-accent text-primary-bg font-black py-5 rounded-2xl hover:scale-[1.02] transition-transform shadow-xl shadow-accent/20"
                      >
                          {loadingCreate ? <Loader className="animate-spin inline mr-2" /> : 'GENERATE CAMPAIGN'}
                      </button>
                  </form>
              </div>
          </div>
      )}
    </div>
  )
}

export default CouponsManage
