import React from 'react'
import AddProduct from './AddProduct'
import ProductList from './productlist'

// Server component
export default async function Products() {
  

  return (
    <div>
      <h1>Products</h1>
      <AddProduct/>
      <ProductList/>
    </div>
  )
}