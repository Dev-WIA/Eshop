import { apiSlice } from './apiSlice'
const COUPONS_URL = '/api/coupons'

export const couponsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCoupons: builder.query({
      query: () => ({
        url: COUPONS_URL,
      }),
      providesTags: ['Coupon'],
    }),
    createCoupon: builder.mutation({
      query: (data) => ({
        url: COUPONS_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Coupon'],
    }),
    deleteCoupon: builder.mutation({
      query: (couponId) => ({
        url: `${COUPONS_URL}/${couponId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Coupon'],
    }),
    validateCoupon: builder.mutation({
      query: (data) => ({
        url: `${COUPONS_URL}/validate`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
})

export const {
  useGetCouponsQuery,
  useCreateCouponMutation,
  useDeleteCouponMutation,
  useValidateCouponMutation,
} = couponsApiSlice
