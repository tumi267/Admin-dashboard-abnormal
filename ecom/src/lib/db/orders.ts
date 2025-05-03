import {
    collection,
    getDocs,
    doc,
    getDoc,
    Timestamp,
  } from 'firebase/firestore'
  import { db } from '../firebase'
  
  export type OrderItem = {
    productId: string
    name: string
    quantity: number
    price: number
  }
  
  export type Address = {
    street: string
    city: string
    province: string
    postalCode: string
  }
  
  export type Order = {
    id: string
    customerId: string
    items: OrderItem[]
    address: Address
    status: string
    totalAmount: number
    totalItems: number
    createdAt: Timestamp
    customer: {
      name: string
      email: string
      phone: string
    }
  }
  
  export const fetchOrders = async (): Promise<Order[]> => {
    const ordersSnapshot = await getDocs(collection(db, 'orders'))
  
    const orders = await Promise.all(
      ordersSnapshot.docs.map(async (docSnap) => {
        const data = docSnap.data()
        const customerRef = doc(db, 'customers', data.customerId)
        const customerSnap = await getDoc(customerRef)
        const customerData = customerSnap.exists() ? customerSnap.data() : {}
  
        return {
          id: docSnap.id,
          customerId: data.customerId,
          items: data.items || [],
          address: data.address || {
            street: '',
            city: '',
            province: '',
            postalCode: '',
          },
          status: data.status || 'Pending',
          totalAmount: data.totalAmount || 0,
          totalItems: data.totalItems || 0,
          createdAt: data.createdAt || Timestamp.now(),
          customer: {
            name: customerData.name || 'Unknown',
            email: customerData.email || '',
            phone: customerData.phone || '',
          },
        }
      })
    )
  
    return orders
  }
  