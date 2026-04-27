import React from 'react'
import { useGetProductsQuery, useDeleteProductMutation, useCreateProductMutation } from '../../store/slices/productsApiSlice'
import { Trash2, Edit, Plus, Loader, Package } from 'lucide-react'
import { Link } from 'react-router-dom'

const ProductsManage = () => {
  const { data, isLoading, error, refetch } = useGetProductsQuery()
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation()
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation()

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id).unwrap()
        refetch()
        alert('Product deleted successfully')
      } catch (err) {
        alert(err?.data?.message || err.error)
      }
    }
  }

  const createProductHandler = async () => {
    if (window.confirm('Are you sure you want to create a new sample product?')) {
      try {
        await createProduct().unwrap()
        refetch()
      } catch (err) {
        alert(err?.data?.message || err.error)
      }
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Package className="text-accent" />
          <span>Inventory Management</span>
        </h1>
        <button 
           onClick={createProductHandler}
           disabled={isCreating}
           className="bg-accent text-primary-bg px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all"
        >
          <Plus size={20} />
          <span>New Product</span>
        </button>
      </div>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader className="animate-spin text-accent" size={40} />
        </div>
      ) : error ? (
        <div className="glass p-10 rounded-2xl text-center text-red-400">
            {error?.data?.message || 'Failed to load products.'}
        </div>
      ) : (
        <div className="glass rounded-3xl border border-white/10 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-bold text-sm uppercase text-text-muted">ID</th>
                <th className="px-6 py-4 font-bold text-sm uppercase text-text-muted">NAME</th>
                <th className="px-6 py-4 font-bold text-sm uppercase text-text-muted">PRICE</th>
                <th className="px-6 py-4 font-bold text-sm uppercase text-text-muted">CATEGORY</th>
                <th className="px-6 py-4 font-bold text-sm uppercase text-text-muted text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data.products.map((product) => (
                <tr key={product._id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 text-xs font-mono text-text-muted">{product._id}</td>
                  <td className="px-6 py-4 font-semibold">{product.name}</td>
                  <td className="px-6 py-4 font-mono">${product.price}</td>
                  <td className="px-6 py-4">
                      <span className="bg-accent/10 text-accent px-2 py-1 rounded text-xs font-bold uppercase">
                          {product.category}
                      </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                        <Link to={`/admin/product/${product._id}/edit`} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                            <Edit size={18} className="text-accent" />
                        </Link>
                        <button 
                            onClick={() => deleteHandler(product._id)}
                            disabled={isDeleting}
                            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                            <Trash2 size={18} className="text-red-500" />
                        </button>
                    </div>
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

export default ProductsManage
