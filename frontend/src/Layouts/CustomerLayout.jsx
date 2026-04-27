import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

const CustomerLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default CustomerLayout
