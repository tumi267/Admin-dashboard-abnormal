'use client'

import React, { useState } from 'react'
import { addSale } from '@/lib/db/sales'
import { handlePurchase } from '@/lib/db/customer'

function PurchaseForm() {
  const [customerId, setCustomerId] = useState('')
  const [items, setItems] = useState<string[]>([]) // List of purchased product IDs
  const [totalAmount, setTotalAmount] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Add a sale record
    const sale = {
      customerId,
      saleDate: new Date(),
      items,
      totalAmount,
    }
    const saleId = await addSale(sale)

    // Update customer purchase history
    await handlePurchase(customerId, saleId)

    // Reset the form
    setCustomerId('')
    setItems([])
    setTotalAmount(0)
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Customer ID:</label>
      <input
        type="text"
        value={customerId}
        onChange={(e) => setCustomerId(e.target.value)}
        required
      />

      <label>Items (comma separated):</label>
      <input
        type="text"
        value={items.join(',')}
        onChange={(e) => setItems(e.target.value.split(','))}
        required
      />

      <label>Total Amount:</label>
      <input
        type="number"
        value={totalAmount}
        onChange={(e) => setTotalAmount(Number(e.target.value))}
        required
      />

      <button type="submit">Record Purchase</button>
    </form>
  )
}

export default PurchaseForm
