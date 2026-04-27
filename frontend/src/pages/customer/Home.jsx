import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Star, ShieldCheck, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

const Home = () => {
  const { t } = useTranslation()

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center rounded-3xl overflow-hidden glass">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-transparent z-0" />
        <div className="relative z-10 text-center space-y-6 max-w-3xl px-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold tracking-tighter"
          >
            {t('welcome')}
          </motion.h1>
          <motion.p 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
            className="text-text-muted text-lg md:text-xl"
          >
            Discover carefully curated collections that define modern elegance. Premium quality, delivered to your door.
          </motion.p>
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
          >
            <Link 
              to="/shop" 
              className="inline-flex items-center space-x-2 bg-accent text-primary-bg px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform"
            >
              <span>{t('shop')}</span>
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: <Zap className="text-accent" />, title: 'Fast Delivery', desc: 'Get your orders in record time with our optimized logistics.' },
          { icon: <ShieldCheck className="text-accent" />, title: 'Secure Payment', desc: 'Shop with confidence using our encrypted payment system.' },
          { icon: <Star className="text-accent" />, title: 'Premium Quality', desc: 'We only source the finest materials for our products.' },
        ].map((feat, i) => (
          <div key={i} className="glass p-8 rounded-2xl border border-white/5 hover:border-accent/30 transition-colors">
            <div className="mb-4">{feat.icon}</div>
            <h3 className="text-xl font-bold mb-2">{feat.title}</h3>
            <p className="text-text-muted text-sm">{feat.desc}</p>
          </div>
        ))}
      </section>

      {/* Categories / Teaser */}
      <section className="space-y-8">
        <div className="flex justify-between items-end">
          <h2 className="text-4xl font-bold">Featured Categories</h2>
          <Link to="/shop" className="text-accent hover:underline flex items-center space-x-1">
            <span>View all</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-96 rounded-3xl overflow-hidden relative group cursor-pointer">
            <div className="absolute inset-0 bg-secondary-bg group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/40 z-10" />
            <div className="absolute inset-0 z-20 flex flex-col justify-end p-10 space-y-2">
              <h3 className="text-3xl font-bold">New Arrivals</h3>
              <p className="text-white/80">Check out the latest drops.</p>
            </div>
          </div>
          <div className="h-96 rounded-3xl overflow-hidden relative group cursor-pointer">
            <div className="absolute inset-0 bg-accent/10 group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/40 z-10" />
            <div className="absolute inset-0 z-20 flex flex-col justify-end p-10 space-y-2">
              <h3 className="text-3xl font-bold">Seasonal Sale</h3>
              <p className="text-white/80">Get up to 50% off select items.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
