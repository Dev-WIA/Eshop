import React, { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useGetProductDetailsQuery, useCreateReviewMutation } from '../../store/slices/productsApiSlice'
import { addToCart } from '../../store/slices/cartSlice'
import { Plus, Minus, ShoppingBag, ArrowLeft, Loader, Shield, Truck, RefreshCcw, Star } from 'lucide-react'

const Stars = ({ rating, count }) => (
    <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
            <Star key={i} size={16} className={i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'} />
        ))}
        {count !== undefined && <span className="text-text-muted text-sm ml-2">({count} reviews)</span>}
    </div>
)

const ProductDetails = () => {
  const { id: productId } = useParams()
  const [qty, setQty] = useState(1)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { userInfo } = useSelector(state => state.auth)
  const { data: product, isLoading, error, refetch } = useGetProductDetailsQuery(productId)
  const [createReview, { isLoading: loadingReview }] = useCreateReviewMutation()

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }))
    navigate('/cart')
  }

  const submitReviewHandler = async (e) => {
    e.preventDefault()
    try {
      await createReview({ productId, rating, comment }).unwrap()
      alert('Review submitted')
      setRating(0)
      setComment('')
      refetch()
    } catch (err) {
      alert(err?.data?.message || err.error)
    }
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-500 pb-20">
      <Link to="/shop" className="inline-flex items-center space-x-2 text-text-muted hover:text-accent transition-colors">
        <ArrowLeft size={18} />
        <span>Back to results</span>
      </Link>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader className="animate-spin text-accent" size={40} />
        </div>
      ) : error ? (
        <div className="glass p-10 rounded-2xl text-center text-red-400">
          {error?.data?.message || 'Failed to load product details.'}
        </div>
      ) : (
        <>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="h-[500px] rounded-3xl overflow-hidden glass border border-white/5">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            {/* Thumbs placeholder */}
            <div className="flex space-x-4">
               {[1,2,3].map(n => (
                   <div key={n} className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10" />
               ))}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col space-y-8">
            <div className="space-y-4">
                <span className="text-accent font-bold tracking-widest uppercase text-sm">{product.category}</span>
                <h1 className="text-5xl font-bold">{product.name}</h1>
                <Stars rating={product.rating} count={product.numReviews} />
                <div className="flex items-center space-x-4 pt-2">
                    <span className="text-4xl font-bold">${product.price}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        product.countInStock > 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                    }`}>
                        {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                </div>
                <p className="text-text-muted leading-relaxed text-lg">
                    {product.description}
                </p>
            </div>

            {/* Quantity Selector */}
            {product.countInStock > 0 && (
                <div className="space-y-4">
                    <label className="text-sm font-bold text-text-muted">Quantity</label>
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center border border-white/10 rounded-xl px-2 py-1 bg-white/5">
                            <button 
                                onClick={() => setQty(q => Math.max(1, q - 1))}
                                className="p-2 hover:text-accent transition-colors"
                            >
                                <Minus size={18} />
                            </button>
                            <span className="w-10 text-center font-bold text-lg">{qty}</span>
                            <button 
                                onClick={() => setQty(q => Math.min(product.countInStock, q + 1))}
                                className="p-2 hover:text-accent transition-colors"
                            >
                                <Plus size={18} />
                            </button>
                        </div>
                        <button 
                            onClick={addToCartHandler}
                            className="flex-grow bg-accent text-primary-bg font-bold py-4 rounded-xl flex items-center justify-center space-x-3 hover:scale-[1.02] transition-transform active:scale-95"
                        >
                            <ShoppingBag size={20} />
                            <span>Add to Cart</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-white/5">
                {[
                    { icon: <Truck size={20} />, label: 'Free Shipping' },
                    { icon: <Shield size={20} />, label: '2 Year Warranty' },
                    { icon: <RefreshCcw size={20} />, label: 'Easy Returns' },
                ].map((badge, i) => (
                    <div key={i} className="flex flex-col items-center space-y-2 p-4 rounded-2xl bg-white/5 text-center">
                        <div className="text-accent">{badge.icon}</div>
                        <span className="text-[10px] uppercase font-bold tracking-widest whitespace-nowrap">{badge.label}</span>
                    </div>
                ))}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 pt-20 border-t border-white/5">
            <div className="space-y-8 text-left">
                <h3 className="text-3xl font-bold">Reviews</h3>
                {product.reviews.length === 0 && <p className="text-text-muted">No reviews yet. Be the first to share your thoughts!</p>}
                <div className="space-y-6">
                    {product.reviews.map(rev => (
                        <div key={rev._id} className="glass p-6 rounded-2xl border border-white/5 space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="font-bold">{rev.name}</span>
                                <span className="text-xs text-text-muted">{rev.createdAt.substring(0, 10)}</span>
                            </div>
                            <Stars rating={rev.rating} />
                            <p className="text-text-muted">{rev.comment}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-8 text-left">
                <h3 className="text-3xl font-bold">Write a Review</h3>
                {userInfo ? (
                    <form onSubmit={submitReviewHandler} className="glass p-8 rounded-3xl border border-white/10 space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-text-muted">Rating</label>
                            <div className="flex space-x-2">
                                {[1,2,3,4,5].map(v => (
                                    <button 
                                        type="button"
                                        key={v}
                                        onClick={() => setRating(v)}
                                        className={`p-2 rounded-lg transition-colors ${v <= rating ? 'text-yellow-400' : 'text-white/20'}`}
                                    >
                                        <Star size={24} fill={v <= rating ? 'currentColor' : 'none'} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-text-muted">Comment</label>
                            <textarea 
                                rows={4}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-accent outline-none resize-none transition-all"
                                placeholder="Your feedback..."
                                required
                            />
                        </div>

                        <button 
                            disabled={loadingReview}
                            className="w-full bg-accent text-primary-bg font-bold py-4 rounded-xl hover:scale-[1.02] transition-transform shadow-lg shadow-accent/20"
                        >
                            {loadingReview ? <Loader className="animate-spin" size={20} /> : 'Submit Review'}
                        </button>
                    </form>
                ) : (
                    <div className="glass p-8 rounded-3xl text-center">
                        <p className="text-text-muted mb-4">You must be logged in to leave a review.</p>
                        <Link to={`/login?redirect=/product/${productId}`} className="text-accent font-bold hover:underline">
                            Login here
                        </Link>
                    </div>
                )}
            </div>
        </div>
        </>
      )}
    </div>
  )
}

export default ProductDetails
