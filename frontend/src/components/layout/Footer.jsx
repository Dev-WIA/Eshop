import React from 'react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-20 py-10 border-t border-white/10 text-center">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10 text-left">
          <div>
            <h3 className="text-accent font-bold mb-4">E-SHOP</h3>
            <p className="text-text-muted text-sm">
              Providing the best products with the most seamless shopping experience.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white">Links</h4>
            <ul className="text-text-muted text-sm space-y-2">
              <li><a href="/shop" className="hover:text-accent transition-colors">Shop</a></li>
              <li><a href="/cart" className="hover:text-accent transition-colors">Cart</a></li>
              <li><a href="/login" className="hover:text-accent transition-colors">Login</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white">Contact</h4>
            <p className="text-text-muted text-sm">
              Email: support@eshop.com<br />
              Phone: +1 234 567 890
            </p>
          </div>
        </div>
        <p className="text-text-muted text-xs">
          &copy; {currentYear} E-SHOP. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
