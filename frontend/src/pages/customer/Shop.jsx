import { useState } from 'react'
import { useGetProductsQuery } from '../../store/slices/productsApiSlice'
import ProductCard from '../../components/product/ProductCard'
import Skeleton from '../../components/common/Skeleton'
import { Search, Filter, Loader } from 'lucide-react'

const Shop = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState('All')
  const [pageNumber, setPageNumber] = useState(1)

  const { data, isLoading, error } = useGetProductsQuery({ 
      keyword: searchTerm, 
      category, 
      pageNumber 
  })

  const categories = ['All', 'Electronics', 'Fashion', 'Home', 'Beauty']

  // Handle category change reset page
  const categoryHandler = (e) => {
      setCategory(e.target.value)
      setPageNumber(1)
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <h1 className="text-4xl font-bold">The Shop</h1>
        
        <div className="flex w-full md:w-auto items-center space-x-4">
          <div className="relative flex-grow md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 focus:border-accent outline-none transition-all"
            />
          </div>
          <div className="relative">
             <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-accent" size={16} />
             <select 
               value={category}
               onChange={categoryHandler}
               className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-8 py-2 appearance-none focus:border-accent outline-none transition-all cursor-pointer"
             >
               {categories.map((c) => (
                 <option key={c} value={c} className="bg-primary-bg">{c}</option>
               ))}
             </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-4">
                    <Skeleton className="h-64" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex justify-between items-center pt-4">
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-10 w-10 rounded-xl" />
                    </div>
                </div>
            ))}
        </div>
      ) : error ? (
        <div className="glass p-10 rounded-2xl text-center text-red-400">
          {error?.data?.message || 'Failed to load products.'}
        </div>
      ) : (
        <div className="space-y-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {data?.products?.length > 0 ? (
                data.products.map((product) => (
                <ProductCard key={product._id} product={product} />
                ))
            ) : (
                <div className="col-span-full py-20 text-center text-text-muted">
                    No products found matching your criteria.
                </div>
            )}
            </div>

            {/* Pagination */}
            {data?.pages > 1 && (
                <div className="flex justify-center space-x-2 pb-10">
                    {[...Array(data.pages).keys()].map((x) => (
                        <button
                            key={x + 1}
                            onClick={() => setPageNumber(x + 1)}
                            className={`px-4 py-2 rounded-lg font-bold transition-all ${
                                x + 1 === data.page 
                                ? 'bg-accent text-primary-bg' 
                                : 'glass hover:bg-white/10'
                            }`}
                        >
                            {x + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
      )}
    </div>
  )
}

export default Shop
