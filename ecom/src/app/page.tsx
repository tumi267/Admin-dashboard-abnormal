import Image from 'next/image'
import Slider from './components/Slider/Slider'
import Hero from './components/Hero/Hero'
import ProductGrid from './components/ProductGrid/ProductGrid'
import productData from './data/product.json'
export default function Home() {
  return (
    <main>
      {/* <Slider/> */}
      <Hero
      msg='mesage'
      title='title'
      prodid='id123456asjdb'
      />
      <div className='pt-[96px] pb-[96px]'>
      <h2 className='ml-[2em] font-semibold font-sans text-xl'>Latest Products</h2>
      <ProductGrid
      products={productData}/>
      </div>
      <div className='pb-[96px]'>
      <h2 className='ml-[2em] font-semibold font-sans text-xl'>Weekly Speacial</h2>
      <ProductGrid
      products={productData}/>
      </div>
      <div className='pb-[96px]'>
      <h2 className='ml-[2em] font-semibold font-sans text-xl'>Sales</h2>
      <ProductGrid
      products={productData}/>
      </div>
    </main>
  )
}
