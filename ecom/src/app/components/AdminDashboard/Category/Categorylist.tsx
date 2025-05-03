'use client'

import React, { useEffect, useState } from 'react'
import { fetchCategoriesdata, Category } from '@/lib/db/category'
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material'
import { Edit, Delete } from '@mui/icons-material'

function CategoryTable() {
  const [categories, setCategories] = useState<Category[]>([])
  const [editOpen, setEditOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  const [editForm, setEditForm] = useState({ name: '', description: '' })

  useEffect(() => {
    const load = async () => {
      const res = await fetchCategoriesdata()
      setCategories(res)
    }
    load()
  }, [])

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setEditForm({ name: category.name, description: category.description })
    setEditOpen(true)
  }

  const handleDelete = async(id: string) => {
    const res = await fetch(`/api/deleteCategory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(id),
        cache: 'no-store',})
        const data = await res.json()
        alert(data.msg)
  }

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditForm(prev => ({ ...prev, [name]: value }))
  }

  const submitEdit = async () => {
    if (!editingCategory) return

    try {
      const response = await fetch('/api/editCategory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingCategory.id,
          name: editForm.name,
          description: editForm.description,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setCategories(prev =>
          prev.map(cat =>
            cat.id === editingCategory.id
              ? { ...cat, name: editForm.name, description: editForm.description }
              : cat
          )
        )
        setEditOpen(false)
        setEditingCategory(null)
      } else {
        console.error(result.error || result.msg)
      }
    } catch (err) {
      console.error('Failed to update category:', err)
    }
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table className="min-w-full" aria-label="category table">
          <TableHead>
            <TableRow>
              <TableCell>Category Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map(category => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(category)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(category.id)} color="secondary">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit Category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Category Name"
            value={editForm.name}
            onChange={handleEditChange}
            fullWidth
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            value={editForm.description}
            onChange={handleEditChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={submitEdit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default CategoryTable