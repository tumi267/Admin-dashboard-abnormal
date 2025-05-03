import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { db } from '../firebase'

// Sale type
export type Sale = {
  id: string
  customerId: string
  saleDate: Date
  items: string[] // Array of product IDs purchased
  totalAmount: number
}

// Add a new sale record
export const addSale = async (sale: Sale) => {
  const salesRef = collection(db, 'sales')
  const docRef = await addDoc(salesRef, {
    ...sale,
    saleDate: Timestamp.fromDate(sale.saleDate), // Firestore timestamp format
  })
  return docRef.id // Return the sale ID
}
