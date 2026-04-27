import React from 'react'

const Skeleton = ({ className }) => {
  return (
    <div className={`animate-pulse bg-white/5 rounded-2xl ${className}`} />
  )
}

export default Skeleton
