// lib/db/category.ts
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'

/**
 * Fetch all category names from Firestore
 * Collection: "category"
 * Returns: string[]
 */
export const fetchCategories = async (): Promise<string[]> => {
  try {
    const snapshot = await getDocs(collection(db, 'category'))
    return snapshot.docs.map(doc => doc.data().name as string)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export type Category = {
  id: string
  name: string
  description: string
}

export const fetchCategoriesdata = async (): Promise<Category[]> => {
  try {
    const snapshot = await getDocs(collection(db, 'category'))

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<Category, 'id'>)
    }))
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

