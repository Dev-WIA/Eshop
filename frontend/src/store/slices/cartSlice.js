import { createSlice } from '@reduxjs/toolkit'

const initialState = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : { 
      cartItems: [], 
      shippingAddress: {}, 
      paymentMethod: 'Stripe',
      coupon: null,
      discount: 0 
    }

const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2)
}

const updateCart = (state) => {
  // Calculate items price
  state.itemsPrice = addDecimals(
    state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  )

  // Calculate shipping price (If order is over $100 then free, else $10)
  state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10)

  // Calculate tax price (15% tax)
  state.taxPrice = addDecimals(Number((0.15 * state.itemsPrice).toFixed(2)))

  // Apply Discount
  let discountedAmount = 0
  if (state.coupon) {
    if (state.coupon.discountType === 'percent') {
      discountedAmount = (state.coupon.discountValue / 100) * state.itemsPrice
    } else {
      discountedAmount = state.coupon.discountValue
    }
  }
  state.discount = Number(discountedAmount.toFixed(2))

  // Calculate total price
  state.totalPrice = (
    Number(state.itemsPrice) +
    Number(state.shippingPrice) +
    Number(state.taxPrice) -
    Number(state.discount)
  ).toFixed(2)

  localStorage.setItem('cart', JSON.stringify(state))

  return state
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload

      const existItem = state.cartItems.find((x) => x._id === item._id)

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x
        )
      } else {
        state.cartItems = [...state.cartItems, item]
      }

      return updateCart(state)
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload)
      return updateCart(state)
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload
      return updateCart(state)
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload
      return updateCart(state)
    },
    applyCoupon: (state, action) => {
      state.coupon = action.payload
      return updateCart(state)
    },
    removeCoupon: (state) => {
      state.coupon = null
      state.discount = 0
      return updateCart(state)
    },
    clearCartItems: (state) => {
      state.cartItems = []
      state.coupon = null
      state.discount = 0
      return updateCart(state)
    },
  },
})

export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  applyCoupon,
  removeCoupon,
  clearCartItems,
} = cartSlice.actions

export default cartSlice.reducer
