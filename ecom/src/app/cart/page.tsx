'use client'

import React from 'react'
import { useGlobalContext } from '@/app/context/store'

function Cart() {
  const { data } = useGlobalContext()

  const total = data.reduce((sum, item) => sum + item.price * item.qty, 0)

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Your Cart</h2>

      {data.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <table className="w-full text-left border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Product</th>
              <th className="p-2">Variant</th>
              <th className="p-2">SKU</th>
              <th className="p-2">Qty</th>
              <th className="p-2">Unit Price</th>
              <th className="p-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.id} className="border-t">
                <td className="p-2">{item.title}</td>
                <td className="p-2">{item.variant || 'Default'}</td>
                <td className="p-2">{item.sku}</td>
                <td className="p-2">{item.qty}</td>
                <td className="p-2">R {item.price.toFixed(2)}</td>
                <td className="p-2">R {(item.price * item.qty).toFixed(2)}</td>
              </tr>
            ))}
            <tr className="border-t font-bold">
              <td colSpan={5} className="p-2 text-right">Total:</td>
              <td className="p-2">R {total.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Cart
