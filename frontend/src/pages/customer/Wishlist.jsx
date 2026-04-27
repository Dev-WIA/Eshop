import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Heart, ShoppingBag, Trash2 } from 'lucide-react'
import { removeFromWishlist } from '../../store/slices/wishlistSlice'
import { addToCart } from '../../store/slices/cartSlice'

const Wishlist = () => {
  const { wishlistItems } = useSelector((state) => state.wishlist)
  const dispatch = useDispatch()

  const addToCartHandler = (product) => {
    dispatch(addToCart({ ...product, qty: 1 }))
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      <h1 className="text-4xl font-bold flex items-center gap-3">
        <Heart className="text-accent fill-accent" size={36} />
        <span>My Wishlist</span>
      </h1>

      {wishlistItems.length === 0 ? (
        <div className="glass p-20 rounded-3xl flex flex-col items-center space-y-6 text-center">
            <div className="p-6 bg-accent/20 rounded-full text-accent">
                <Heart size={48} />
            </div>
            <div className="space-y-2">
                <h2 className="text-2xl font-bold">Your wishlist is empty</h2>
                <p className="text-text-muted">Save items you love to see them here.</p>
            </div>
            <Link to="/shop" className="bg-accent text-primary-bg px-8 py-4 rounded-xl font-bold transition-all hover:scale-105 active:scale-95">
                Go to Shop
            </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {wishlistItems.map((item) => (
            <div key={item._id} className="glass p-6 rounded-2xl border border-white/5 space-y-4 group relative flex flex-col">
              <button 
                onClick={() => dispatch(removeFromWishlist(item._id))}
                className="absolute top-4 right-4 p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-all z-10"
              >
                <Trash2 size={18} />
              </button>
              
              <div className="h-48 rounded-xl overflow-hidden bg-white/5">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>

              <div className="flex-grow space-y-2">
                <h3 className="text-lg font-bold">
                  <Link to={`/product/${item._id}`} className="hover:text-accent transition-colors">
                    {item.name}
                  </Link>
                </h3>
                <p className="text-accent font-bold">${item.price}</p>
              </div>

              <button
                onClick={() => addToCartHandler(item)}
                className="w-full bg-accent text-primary-bg font-bold py-3 rounded-xl flex items-center justify-center space-x-2 transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-accent/10"
              >
                <ShoppingBag size={18} />
                <span>Move to Cart</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Wishlist
