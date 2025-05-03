'use client'
import React, { useState } from 'react'

// Define form data structure
interface CategoryFormData {
  name: string
  description: string
}

function AddCategory() {
  const [AddCategoryModule, setAddCategoryModule] = useState(false)
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Handle form submission
  const handleNewCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/addCategory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || data.msg || 'Something went wrong')
      }

      alert('Category added successfully!')
      setFormData({ name: '', description: '' })
      setAddCategoryModule(false)
    } catch (err: any) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button onClick={() => setAddCategoryModule(true)}>Add Category</button>

      {AddCategoryModule && (
        <div>
          <form onSubmit={handleNewCategory}>
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              placeholder="Name"
              onChange={handleChange}
              required
            />

            <label>Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              placeholder="Description"
              onChange={handleChange}
              required
            />

            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
      )}
    </>
  )
}

export default AddCategory
