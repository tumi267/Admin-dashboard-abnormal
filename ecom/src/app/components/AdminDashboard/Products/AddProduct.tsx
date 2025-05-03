'use client'

import React, { useEffect, useState } from 'react'
import { fetchCategories } from '@/lib/db/category'
import Loading from '@/app/Loading'
interface Variant {
  name: string
  sku: string
  price: string
  inventory: string
  onSale: boolean // Indicates if variant is on sale
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

const AddProduct: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
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
  const [isLoading,setIsloading]=useState(false)
  useEffect(() => {
    const load = async () => {
      const catList = await fetchCategories()
      setCategories(catList)
    }
    load()
  }, [])

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
  
  

  const addVariant = () => {
    setVariants(prev => [...prev, { name: '', sku: '', price: '', inventory: '', onSale: false }])
  }

  const createItem = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsloading(true)
    const productToSend = {
      ...formData,
      price: parseFloat(formData.price),
      variants: variants.map(v => ({
        name: v.name,
        sku: v.sku,
        price: parseFloat(v.price),
        inventory: parseInt(v.inventory),
        onSale: v.onSale,
      })),
    }

    const res = await fetch(`/api/addProd`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productToSend),
      cache: 'no-store',
    })

    const data = await res.json()
    alert(data.msg || 'Product added')
    setIsloading(false)
  }

  return (
    <div className="p-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {isOpen ? 'Close Form' : 'Add Product'}
      </button>

      {isOpen && (
        isLoading?<Loading/>:<form onSubmit={createItem} className="mt-6 space-y-4 bg-white p-6 rounded shadow-md">
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
      )}
    </div>
  )
}

export default AddProduct

