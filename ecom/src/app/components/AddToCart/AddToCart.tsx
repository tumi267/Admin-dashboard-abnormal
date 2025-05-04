// components/AddToCart/AddToCart.tsx
'use client'

import React from 'react'
import { useGlobalContext } from '@/app/context/store'

interface CartItem {
  id: string
  title: string
  price: number
  qty: number
  sku: string
  variant?: string
  image: string
}

export default function AddToCart({ item }: { item: CartItem }) {
  const { setData } = useGlobalContext()

  const handleAdd = () => {
    setData(prev => {
      // Optional: check for existing item to merge quantity
      const existing = prev.find(p => p.id === item.id)
      if (existing) {
        return prev.map(p =>
          p.id === item.id ? { ...p, qty: p.qty + item.qty } : p
        )
      }
      return [...prev, item]
    })
  }

  return (
    <button onClick={handleAdd} className="bg-black text-white px-4 py-2 rounded">
      Add to Cart
    </button>
  )
}


