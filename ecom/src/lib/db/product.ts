import { collection, getDocs, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'

// Function to fetch products initially
export const fetchProducts = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'products'))
    return snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        variants: data.variants || [], // Ensure variants is an array
      }
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

// Function to listen for product changes in real-time
export const listenToProductChanges = (callback: (products: any[]) => void) => {
  const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
    const products = snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        variants: data.variants || [],
      }
    })
    callback(products) // Call the callback function with updated products
  }, (error) => {
    console.error('Error listening to product changes:', error)
  })

  // Return the unsubscribe function to stop listening
  return unsubscribe
}
