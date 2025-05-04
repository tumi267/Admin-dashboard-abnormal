'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'

const ProductImageLib = ({ imageSetter }) => {
  const [imageFile, setImageFile] = useState<File | null>(null)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null
    if (file) {
      const compressedImage = await compressImage(file)
      setImageFile(compressedImage)
      imageSetter((prev) => ({ ...prev, imageUrl: URL.createObjectURL(compressedImage) })) // Update parent form with image URL
    }
  }

  const compressImage = async (file: File): Promise<File> => {
    // Implement your image compression logic here
    // Example using a simple library or logic
    return file // return compressed file
  }

  return (
    <div className="flex flex-col items-center space-y-2">
      <input type="file" onChange={handleImageUpload} />
      {imageFile && (
        <img src={URL.createObjectURL(imageFile)} alt="Product Preview" className="max-w-xs" />
      )}
    </div>
  )
}

export default ProductImageLib
