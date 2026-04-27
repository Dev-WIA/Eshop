import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useGetProductDetailsQuery, useUpdateProductMutation } from '../../store/slices/productsApiSlice'
import { ArrowLeft, Loader, Upload, Save } from 'lucide-react'
import axios from 'axios'

const AddEditProduct = () => {
  const { id: productId } = useParams()
  
  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [image, setImage] = useState('')
  const [category, setCategory] = useState('')
  const [countInStock, setCountInStock] = useState(0)
  const [description, setDescription] = useState('')
  const [uploading, setUploading] = useState(false)

  const { data: product, isLoading, error } = useGetProductDetailsQuery(productId)
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation()
  
  const navigate = useNavigate()

  useEffect(() => {
    if (product) {
      setName(product.name)
      setPrice(product.price)
      setImage(product.image)
      setCategory(product.category)
      setCountInStock(product.countInStock)
      setDescription(product.description)
    }
  }, [product])

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('image', file)
    setUploading(true)

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}`,
        },
      }

      const { data } = await axios.post('/api/upload', formData, config)
      setImage(data.image)
      setUploading(false)
    } catch (error) {
      console.error(error)
      setUploading(false)
      alert('Upload failed')
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      await updateProduct({
        productId,
        name,
        price,
        image,
        category,
        countInStock,
        description,
      }).unwrap()
      alert('Product updated')
      navigate('/admin/products')
    } catch (err) {
      alert(err?.data?.message || err.error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      <Link to="/admin/products" className="inline-flex items-center space-x-2 text-text-muted hover:text-accent transition-colors">
        <ArrowLeft size={18} />
        <span>Back to Products</span>
      </Link>

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Edit Product</h1>
      </div>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader className="animate-spin text-accent" size={40} />
        </div>
      ) : error ? (
        <div className="glass p-10 rounded-2xl text-center text-red-400">
            {error?.data?.message || 'Failed to load product.'}
        </div>
      ) : (
        <form onSubmit={submitHandler} className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-8">
            <div className="glass p-8 rounded-3xl border border-white/10 space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-muted px-1">Product Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-accent outline-none transition-all"
                        placeholder="Premium Headphones"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-muted px-1">Price ($)</label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-accent outline-none transition-all"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-muted px-1">Stock</label>
                        <input
                            type="number"
                            value={countInStock}
                            onChange={(e) => setCountInStock(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-accent outline-none transition-all"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-muted px-1">Category</label>
                    <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-accent outline-none transition-all"
                        placeholder="Electronics"
                        required
                    />
                </div>
            </div>
          </div>

          <div className="space-y-8">
              <div className="glass p-8 rounded-3xl border border-white/10 space-y-6">
                <div className="space-y-4">
                    <label className="text-sm font-medium text-text-muted px-1">Product Image</label>
                    <div className="relative group aspect-square rounded-2xl overflow-hidden glass border-2 border-dashed border-white/10 hover:border-accent/40 transition-all flex flex-col items-center justify-center">
                        {image ? (
                            <img src={image} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-center space-y-2">
                                <Upload className="mx-auto text-text-muted" size={40} />
                                <p className="text-xs text-text-muted">No image uploaded</p>
                            </div>
                        )}
                        <input 
                            type="file" 
                            onChange={uploadFileHandler}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        {uploading && (
                           <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                               <Loader className="animate-spin text-accent" size={30} />
                           </div>
                        )}
                    </div>
                    <input
                        type="text"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-mono outline-none"
                        placeholder="Image URL"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-muted px-1">Description</label>
                    <textarea
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-accent outline-none transition-all resize-none"
                        placeholder="Tell us about the product..."
                        required
                    />
                </div>
              </div>

              <button
                type="submit"
                disabled={isUpdating}
                className="w-full bg-accent text-primary-bg font-bold py-5 rounded-2xl flex items-center justify-center space-x-3 hover:scale-[1.02] transition-transform active:scale-95 shadow-lg shadow-accent/20"
              >
                {isUpdating ? <Loader className="animate-spin" size={20} /> : (
                    <>
                        <Save size={20} />
                        <span>Update Product</span>
                    </>
                )}
              </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default AddEditProduct
