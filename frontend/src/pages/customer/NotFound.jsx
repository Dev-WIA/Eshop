import React from 'react'
import { Link } from 'react-router-dom'
import { Home, AlertCircle } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="h-[70vh] flex flex-col items-center justify-center space-y-8 animate-in zoom-in duration-500">
      <div className="relative">
          <div className="text-[150px] font-black text-white/5 leading-none">404</div>
          <AlertCircle className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-accent" size={80} />
      </div>
      
      <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Page Not Found</h1>
          <p className="text-text-muted">Oops! The page you are looking for doesn't exist or has been moved.</p>
      </div>

      <Link 
        to="/" 
        className="bg-accent text-primary-bg px-8 py-4 rounded-xl font-bold flex items-center space-x-3 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-accent/20"
      >
        <Home size={20} />
        <span>Back to Home</span>
      </Link>
    </div>
  )
}

export default NotFound
