import ProductGrid from '@/app/components/ProductGrid/ProductGrid'
import React from 'react'
import productData from '../../data/product.json'
import AddToCart from '@/app/components/AddToCart/AddToCart'

interface Product {
  id: string,
  title: string,
  price: number,
  description: string,
  image: string
}
function Prouct({ params }: { params: { id: string } }) {
  // get id from params 
  // make api call for product data 
  // api call for related products in same category
  const productId=params.id
  const product= productData.find((e)=>{return e.id==productId})
  
  return (
    <main>
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-[2em] p-4 h-[90vh]'>
      <div className='flex flex-col gap-y-4 lg:max-w-[500px] mx-auto'>
        <div className="font-semibold text-sm uppercase text-gray-500">category</div>
        <div >
          <h2 className="font-semibold text-3xl mt-2">{product?.title}</h2>
        </div>
        <div className='text-gray-700 mt-4"'>
          <p>{product?.description}</p>
        </div>
      </div>

      <div className='bg-[#ededf1]'>
        image
      </div>
      <div>
        variantes
        <div>
          <h3>R {product?.price}</h3>
          <AddToCart
          prodid={product?.id}/>
        </div>
      </div>
    </div>
    <div className='text-center'>
      <p>related product</p>
      <h2>You might also want to check out these products.</h2>
    </div>
    <div>
      {/* related product */}
      <ProductGrid
      products={productData}
      />
    </div>
    </main>
  )
}

export default Prouct