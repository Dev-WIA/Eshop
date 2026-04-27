import React from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Star, Heart } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../../store/slices/cartSlice'
import { addToWishlist, removeFromWishlist } from '../../store/slices/wishlistSlice'

const ProductCard = ({ product }) => {
  const dispatch = useDispatch()
  const { wishlistItems } = useSelector(state => state.wishlist)
  const isWishlisted = wishlistItems.some(item => item._id === product._id)

  const addToCartHandler = (e) => {
    e.preventDefault()
    dispatch(addToCart({ ...product, qty: 1 }))
  }

  const toggleWishlistHandler = (e) => {
    e.preventDefault()
    if (isWishlisted) {
      dispatch(removeFromWishlist(product._id))
    } else {
      dispatch(addToWishlist(product))
    }
  }

  return (
    <div className="group glass rounded-2xl overflow-hidden border border-white/5 hover:border-accent/40 transition-all flex flex-col h-full relative">
      <button 
        onClick={toggleWishlistHandler}
        className={`absolute top-4 left-4 z-20 p-2 rounded-xl backdrop-blur-md transition-all ${
           isWishlisted ? 'bg-accent text-primary-bg' : 'bg-primary-bg/80 text-white hover:text-accent'
        }`}
      >
        <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
      </button>

      <Link to={`/product/${product._id}`} className="relative h-64 overflow-hidden">
        <div className="absolute inset-0 bg-white/5 group-hover:bg-transparent transition-all z-0" />
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-primary-bg/80 backdrop-blur-md px-2 py-1 rounded-lg flex items-center space-x-1 text-xs">
          <Star size={12} className="text-yellow-400 fill-yellow-400" />
          <span className="font-bold">{product.rating.toFixed(1)}</span>
          <span className="text-text-muted">({product.numReviews})</span>
        </div>
      </Link>

      <div className="p-5 flex flex-col flex-grow space-y-3">
        <p className="text-xs text-accent font-bold uppercase tracking-widest">{product.category}</p>
        <Link to={`/product/${product._id}`} className="text-lg font-bold hover:text-accent transition-colors line-clamp-1">
          {product.name}
        </Link>
        <p className="text-text-muted text-sm line-clamp-2">
          {product.description}
        </p>
        
        <div className="pt-4 flex items-center justify-between mt-auto">
          <span className="text-2xl font-bold">${product.price}</span>
          <button 
            onClick={addToCartHandler}
            className="p-3 bg-accent text-primary-bg rounded-xl hover:scale-110 transition-transform active:scale-95"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
