import React from 'react'
import productData from '../../data/product.json'
import ProductGrid from '@/app/components/ProductGrid/ProductGrid'
function page({ params }: { params: { name: string } }) {
  const catagory=params.name
  // api call for product with catagory name

  return (
    <div className='pt-[96px] pb-[96px]'>
    <h2 className='ml-[2em] font-semibold font-sans text-xl'>{catagory.toLocaleUpperCase()}</h2>
    {/* sort or filter options */}
    <ProductGrid
    products={productData}/>
    </div>
  )
}

export default page