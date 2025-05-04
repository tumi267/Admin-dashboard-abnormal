'use client'

import React, { useState } from 'react'
import productData from '../../data/product.json'
import Image from 'next/image'
import AddToCart from '@/app/components/AddToCart/AddToCart'
import ProductGrid from '@/app/components/ProductGrid/ProductGrid'

interface Variant {
  id: string
  option: string
  price?: number
  sku?: string
}

interface Product {
  id: string
  title: string
  price: number
  description: string
  image: string
  category?: string
  sku?: string
  onSale?: boolean
  variants?: Variant[]
}

function ProductPage({ params }: { params: { id: string } }) {
  const productId = params.id
  const product = productData.find(p => p.id === productId)

  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null)
  const [qty, setQty] = useState(1)

  if (!product) return <div>Product not found</div>

  return (
    <main>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-[2em] h-[90vh]'>
        <div className='flex flex-col gap-y-4 lg:max-w-[500px] mx-auto'>
          <div className="font-semibold text-sm uppercase text-gray-500">
            {product.category || 'Category'}
          </div>
          <h2 className="font-semibold text-3xl mt-2">{product.title}</h2>
          <div className='text-gray-700 mt-4'>
            <p>{product.description}</p>
          </div>
        </div>

        <div className='relative bg-[#ededf1]'>
          <Image
            src="/turntable.png"
            alt="Product image"
            fill
          />
        </div>

        <div>
          <h4 className="font-semibold mb-2">Variants</h4>
          {product.variants?.length ? (
            <div className="flex flex-col gap-2 mb-4">
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  className={`p-2 border rounded ${
                    selectedVariant?.id === variant.id ? 'bg-black text-white' : 'bg-white'
                  }`}
                  onClick={() => setSelectedVariant(variant)}
                >
                  {variant.option} — R {variant.price || product.price}
                </button>
              ))}
            </div>
          ) : (
            <p>No variants available</p>
          )}

          <div className="my-4">
            <label className="block mb-1 font-medium">Quantity</label>
            <input
              type="number"
              min="1"
              value={qty}
              onChange={e => setQty(Number(e.target.value))}
              className="w-20 p-1 border rounded"
            />
          </div>

          <h3 className="text-lg font-semibold mb-2">
            Price: R {selectedVariant?.price ?? product.price}
          </h3>

          <AddToCart
            item={{
              id: selectedVariant?.id || product.id,
              title: product.title + (selectedVariant ? ` (${selectedVariant.option})` : ''),
              price: selectedVariant?.price ?? product.price,
              qty,
              sku: selectedVariant?.sku || product.sku || 'n/a',
              image: product.image,
              variant: selectedVariant?.option,
            }}
          />
        </div>
      </div>

      <div className='text-center mt-12'>
        <p className="text-gray-500">Related Products</p>
        <h2 className="text-xl font-bold">You might also want to check out these products.</h2>
      </div>

      <div className="mt-6">
        <ProductGrid
          products={productData.filter(p => p.id !== product.id && p.category === product.category)}
        />
      </div>
    </main>
  )
}

export default ProductPage

