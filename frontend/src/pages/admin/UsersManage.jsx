import React from 'react'
import { useGetUsersQuery, useDeleteUserMutation } from '../../store/slices/usersApiSlice'
import { Loader, Users, Trash2, CheckCircle, XCircle } from 'lucide-react'

// Note: Need to add getUsers and deleteUser to usersApiSlice
const UsersManage = () => {
  const { data: users, isLoading, error, refetch } = useGetUsersQuery()
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation()

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id).unwrap()
        refetch()
        alert('User removed successfully')
      } catch (err) {
        alert(err?.data?.message || err.error)
      }
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold flex items-center gap-3">
        <Users className="text-accent" />
        <span>User Management</span>
      </h1>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader className="animate-spin text-accent" size={40} />
        </div>
      ) : error ? (
        <div className="glass p-10 rounded-2xl text-center text-red-400">
            {error?.data?.message || 'Failed to load users.'}
        </div>
      ) : (
        <div className="glass rounded-3xl border border-white/10 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-bold text-sm uppercase text-text-muted">ID</th>
                <th className="px-6 py-4 font-bold text-sm uppercase text-text-muted">NAME</th>
                <th className="px-6 py-4 font-bold text-sm uppercase text-text-muted">EMAIL</th>
                <th className="px-6 py-4 font-bold text-sm uppercase text-text-muted">ADMIN</th>
                <th className="px-6 py-4 font-bold text-sm uppercase text-text-muted text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 text-xs font-mono text-text-muted">{user._id}</td>
                  <td className="px-6 py-4 font-semibold">{user.name}</td>
                  <td className="px-6 py-4 text-sm">{user.email}</td>
                  <td className="px-6 py-4">
                      {user.role === 'admin' ? (
                          <CheckCircle className="text-green-500" size={20} />
                      ) : (
                          <XCircle className="text-red-400" size={20} />
                      )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                        onClick={() => deleteHandler(user._id)}
                        disabled={isDeleting || user.role === 'admin'}
                        className="p-2 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-30"
                    >
                        <Trash2 size={18} className="text-red-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default UsersManage
