import React from 'react'
import { useGetOrdersQuery, useDeliverOrderMutation } from '../../store/slices/ordersApiSlice'
import { Loader, CheckCircle, XCircle, Eye, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'

const OrdersManage = () => {
  const { data: orders, isLoading, error, refetch } = useGetOrdersQuery()
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation()

  const deliverHandler = async (id) => {
    if (window.confirm('Mark this order as delivered?')) {
      try {
        await deliverOrder(id).unwrap()
        refetch()
        alert('Order marked as delivered')
      } catch (err) {
        alert(err?.data?.message || err.error)
      }
    }
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Orders</h1>
      </div>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader className="animate-spin text-accent" size={40} />
        </div>
      ) : error ? (
        <div className="glass p-10 rounded-2xl text-center text-red-400">
          {error?.data?.message || 'Failed to load orders.'}
        </div>
      ) : (
        <div className="glass rounded-3xl overflow-hidden border border-white/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 text-text-muted text-xs uppercase tracking-widest">
                  <th className="px-6 py-4 font-bold">ID</th>
                  <th className="px-6 py-4 font-bold">User</th>
                  <th className="px-6 py-4 font-bold">Date</th>
                  <th className="px-6 py-4 font-bold">Total</th>
                  <th className="px-6 py-4 font-bold">Paid</th>
                  <th className="px-6 py-4 font-bold">Delivered</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs">{order._id.substring(0, 10)}</td>
                    <td className="px-6 py-4">{order.user && order.user.name}</td>
                    <td className="px-6 py-4">{order.createdAt.substring(0, 10)}</td>
                    <td className="px-6 py-4 font-bold">${order.totalPrice.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      {order.isPaid ? (
                        <div className="flex items-center text-green-500 gap-1 bg-green-500/10 px-2 py-1 rounded w-fit text-[10px] font-bold uppercase">
                          <CheckCircle size={10} /> Paid
                        </div>
                      ) : (
                        <div className="flex items-center text-red-400 gap-1 bg-red-400/10 px-2 py-1 rounded w-fit text-[10px] font-bold uppercase">
                          <XCircle size={10} /> Unpaid
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {order.isDelivered ? (
                         <div className="flex items-center text-green-500 gap-1 bg-green-500/10 px-2 py-1 rounded w-fit text-[10px] font-bold uppercase">
                            <CheckCircle size={10} /> Delivered
                        </div>
                      ) : (
                        <div className="flex items-center text-yellow-500 gap-1 bg-yellow-500/10 px-2 py-1 rounded w-fit text-[10px] font-bold uppercase">
                          <XCircle size={10} /> Pending
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <Link to={`/order/${order._id}`} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-accent">
                          <Eye size={18} />
                        </Link>
                        {order.isPaid && !order.isDelivered && (
                            <button 
                                onClick={() => deliverHandler(order._id)}
                                disabled={loadingDeliver}
                                className="p-2 hover:bg-white/5 rounded-lg transition-colors text-green-500"
                            >
                                <Truck size={18} />
                            </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrdersManage
