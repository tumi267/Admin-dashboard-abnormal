// lib/db/customer.ts
import { collection, getDocs, updateDoc, deleteDoc, doc, Timestamp, getDoc } from 'firebase/firestore'
import { db } from '../firebase'

export type Customer = {
  id: string
  name: string
  email: string
  phone: string
  promotions: boolean
  lastPurchaseDate?: Timestamp | null
  purchaseHistory: string[]
}

export const fetchCustomers = async (): Promise<Customer[]> => {
  try {
    const snapshot = await getDocs(collection(db, 'customers'))
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<Customer, 'id'>),
    }))
  } catch (error) {
    console.error('Error fetching customers:', error)
    return []
  }
}

export const updateCustomer = async (id: string, data: Partial<Customer>) => {
  try {
    const ref = doc(db, 'customers', id)
    await updateDoc(ref, data)
  } catch (error) {
    console.error('Error updating customer:', error)
  }
}

export const handleDeleteCustomer = async (id: string) => {
  try {
    const ref = doc(db, 'customers', id)
    await deleteDoc(ref)
  } catch (error) {
    console.error('Error deleting customer:', error)
  }
}

export const getCustomerById = async (id: string): Promise<Customer | null> => {
    try {
      const ref = doc(db, 'customers', id)
      const snap = await getDoc(ref)
      if (snap.exists()) {
        return {
          id: snap.id,
          ...(snap.data() as Omit<Customer, 'id'>),
        }
      } else {
        return null
      }
    } catch (error) {
      console.error('Error fetching customer by ID:', error)
      return null
    }
  }
  