'use client'

import React, { useEffect, useState } from 'react'
import { fetchProducts, listenToProductChanges } from '@/lib/db/product'
import { fetchCategories } from '@/lib/db/category'
import { Edit, Delete } from '@mui/icons-material'
import { IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'
import styles from './product.module.css'
interface Variant {
  name: string
  sku: string
  price: string
  inventory: string
  onSale: boolean 
}

type Product = {
  id:string
  title: string
  description: string
  price: string
  sku: string
  category: string
  status: 'active' | 'inactive'
  onSale: boolean
  variants: Variant[]
}
interface ProductFormData {
  title: string
  description: string
  price: string
  sku: string
  category: string
  status: 'active' | 'inactive' // Product status (active/inactive)
  onSale: boolean // Indicates if product is on sale or promotion
}

function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [openEdit,setOpenEdit] = useState(false)
  const [categories, setCategories] = useState<string[]>([])
  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    description: '',
    price: '',
    sku: '',
    category: '',
    status: 'active',
    onSale: false,
  })
  const [variants, setVariants] = useState<Variant[]>([
    { name: '', sku: '', price: '', inventory: '', onSale: false }
  ])

  useEffect(() => {
    const load = async () => {
      const productsList = await fetchProducts()
      setProducts(productsList)
    }
    load()
  }, [])

  useEffect(() => {
    const unsubscribe = listenToProductChanges(setProducts)
    return () => unsubscribe() 
  }, [])

  // Function to calculate the total inventory for each product
  const calculateTotalInventory = (variants: Variant[]) => {
    return variants.reduce((total, variant) => {
      return total + (parseInt(variant.inventory) || 0) // Ensure inventory is a number
    }, 0)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleVariantChange = <K extends keyof Variant>(
    index: number,
    field: K,
    value: Variant[K]
  ) => {
    const updated = [...variants]
    updated[index][field] = value
    setVariants(updated)
  }

  const handleEdit=async(product: Product)=>{
    const catList = await fetchCategories()
    setCategories(catList)
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price,
      sku: product.sku,
      category: product.category,
      status: product.status,
      onSale: product.onSale,
    })
    setVariants(product.variants || [])
    setOpenEdit(true)
  }

  const handleDelete=async(e)=>{
    let productTodelete=e
    const res = await fetch(`/api/deletProd`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productTodelete),
        cache: 'no-store',
      })
  
      const data = await res.json()
      alert(data.msg)
  }
  const addVariant = () => {
    setVariants(prev => [...prev, { name: '', sku: '', price: '', inventory: '', onSale: false }])
  }
  
  const editItem = async (e: React.FormEvent) => {
    e.preventDefault()
  
    // Combine form data and variants into a single object
    const updatedProduct = {
      ...formData,
      variants,
      id: products.find((p) => p.sku === formData.sku)?.id // assuming sku is unique
    }
  
    if (!updatedProduct.id) {
      alert("Product ID not found. Cannot update.")
      return
    }
  
    try {
      const res = await fetch('/api/editProd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct),
        cache: 'no-store',
      })
  
      const data = await res.json()
  
      if (res.ok) {
        alert('Product updated successfully')
        setOpenEdit(false)
      } else {
        alert(`Update failed: ${data.error || 'Unknown error'}`)
      }
    } catch (err) {
      console.error('Error updating product:', err)
      alert('An unexpected error occurred while updating the product.')
    }
  }
  
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Products</h1>
      <TableContainer component={Paper}>
        <Table className="min-w-full" aria-label="product table">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Variants</TableCell>
              <TableCell>Total Inventory</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product, idx) => (
              <TableRow key={idx}>
                <TableCell>{product.title}</TableCell>
                <TableCell>{product.status}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.variants.length}</TableCell>
                <TableCell>{calculateTotalInventory(product.variants)}</TableCell>
                <TableCell>
                  {/* Edit Icon */}
                  <IconButton onClick={() => handleEdit(product)} color="primary">
                    <Edit />
                  </IconButton>
                  {/* Delete Icon */}
                  <IconButton onClick={()=>{handleDelete(product.id)}} color="secondary">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {openEdit&&<div className={styles.editModule}>
        <div className={styles.moduleform}>
          <button onClick={()=>{setOpenEdit(false)}}>close</button>
        <form onSubmit={editItem} className="mt-6 space-y-4 bg-white p-6 rounded shadow-md">
          <div>
            <label className="block font-semibold">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
              required
            />
          </div>

          <div>
            <label className="block font-semibold">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
              required
            />
          </div>

          <div>
            <label className="block font-semibold">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
              required
            />
          </div>

          <div>
            <label className="block font-semibold">SKU</label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
              required
            />
          </div>

          <div>
            <label className="block font-semibold">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold">Sale/Promotion</label>
            <input
              type="checkbox"
              name="onSale"
              checked={formData.onSale}
              onChange={(e) => setFormData(prev => ({ ...prev, onSale: e.target.checked }))}
              className="mr-2"
            />
            <span>On Sale/Promotion</span>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">Variants</h3>
            {variants.map((variant, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Variant Name"
                  value={variant.name}
                  onChange={e => handleVariantChange(idx, 'name', e.target.value)}
                  className="flex-1 border p-2 rounded"
                />
                <input
                  type="text"
                  placeholder="SKU"
                  value={variant.sku}
                  onChange={e => handleVariantChange(idx, 'sku', e.target.value)}
                  className="flex-1 border p-2 rounded"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={variant.price}
                  onChange={e => handleVariantChange(idx, 'price', e.target.value)}
                  className="flex-1 border p-2 rounded"
                />
                <input
                  type="number"
                  placeholder="Inventory"
                  value={variant.inventory}
                  onChange={e => handleVariantChange(idx, 'inventory', e.target.value)}
                  className="flex-1 border p-2 rounded"
                />
                <input
                  type="checkbox"
                  checked={variant.onSale}
                  onChange={(e) => handleVariantChange(idx, 'onSale', e.target.checked ? true : false)}
                  className="mr-2"
                />
                <span>On Sale</span>
              </div>
            ))}
            <button
              type="button"
              onClick={addVariant}
              className="text-sm text-blue-600 hover:underline"
            >
              + Add Variant
            </button>
          </div>

          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Submit Product
          </button>
        </form>
        </div>
      </div>}
    </div>
  )
}

export default ProductList
