'use client'

import React, { useEffect, useState } from 'react'
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Button, Dialog, DialogTitle, DialogContent,
  TextField, Grid, Switch
} from '@mui/material'

// Firebase functions
import {
  getPromotions,
  deletePromotion,
  setPromotion
} from '../../../../lib/db/marketing'

import { fetchProducts } from '../../../../lib/db/product'

const MarketingPromotions = () => {
  const [promotions, setPromotions] = useState([])
  const [products, setProducts] = useState([])

  const [newPromotion, setNewPromotion] = useState({
    name: '',
    discount: '',
    startDate: '',
    endDate: '',
    active: false,
    products: []
  })

  const [openDialog, setOpenDialog] = useState(false)
  const [editingPromotionId, setEditingPromotionId] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      const [fetchedPromotions, fetchedProducts] = await Promise.all([
        getPromotions(),
        fetchProducts()
      ])
      setPromotions(fetchedPromotions)
      setProducts(fetchedProducts)
    }
    loadData()
  }, [])

  const handleDialogOpen = (promotion = null) => {
    if (promotion) {
      setNewPromotion(promotion)
      setEditingPromotionId(promotion.id)
    }
    setOpenDialog(true)
  }

  const handleDialogClose = () => {
    setNewPromotion({
      name: '',
      discount: '',
      startDate: '',
      endDate: '',
      active: false,
      products: []
    })
    setEditingPromotionId(null)
    setOpenDialog(false)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewPromotion((prev) => ({ ...prev, [name]: value }))
  }

  const handleSavePromotion = async () => {
    const id = editingPromotionId || Date.now().toString()
    const saved = await setPromotion(id, newPromotion)

    if (editingPromotionId) {
      setPromotions((prev) =>
        prev.map((promo) => (promo.id === id ? saved : promo))
      )
    } else {
      setPromotions((prev) => [...prev, saved])
    }

    handleDialogClose()
  }

  const handleToggleActive = async (id) => {
    const promo = promotions.find((p) => p.id === id)
    if (!promo) return

    const updated = { ...promo, active: !promo.active }
    await setPromotion(id, updated)

    setPromotions((prev) =>
      prev.map((p) => (p.id === id ? updated : p))
    )
  }

  const handleDeletePromotion = async (id) => {
    await deletePromotion(id)
    setPromotions((prev) => prev.filter((p) => p.id !== id))
  }

  const handleProductSelection = (productId) => {
    setNewPromotion((prev) => ({
      ...prev,
      products: prev.products.includes(productId)
        ? prev.products.filter((id) => id !== productId)
        : [...prev.products, productId]
    }))
  }

  return (
    <div>
      <Button variant="contained" color="primary" onClick={() => handleDialogOpen()}>
        Create New Promotion
      </Button>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Discount (%)</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {promotions.map((promotion) => (
              <TableRow key={promotion.id}>
                <TableCell>{promotion.name}</TableCell>
                <TableCell>{promotion.discount}</TableCell>
                <TableCell>{promotion.startDate}</TableCell>
                <TableCell>{promotion.endDate}</TableCell>
                <TableCell>
                  <span style={{
                    color: promotion.active ? 'green' : 'red',
                    fontWeight: 'bold'
                  }}>
                    {promotion.active ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleToggleActive(promotion.id)}>
                    Toggle Active
                  </Button>
                  <Button onClick={() => handleDialogOpen(promotion)}>
                    Edit
                  </Button>
                  <Button color="error" onClick={() => handleDeletePromotion(promotion.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for Creating/Editing Promotion */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>{editingPromotionId ? 'Edit Promotion' : 'Create New Promotion'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Promotion Name"
                name="name"
                fullWidth
                value={newPromotion.name}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Discount (%)"
                name="discount"
                type="number"
                fullWidth
                value={newPromotion.discount}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Start Date"
                name="startDate"
                type="date"
                fullWidth
                value={newPromotion.startDate}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="End Date"
                name="endDate"
                type="date"
                fullWidth
                value={newPromotion.endDate}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <label>Active</label>
              <Switch
                checked={newPromotion.active}
                onChange={() =>
                  setNewPromotion((prev) => ({ ...prev, active: !prev.active }))
                }
              />
            </Grid>
            <Grid item xs={12}>
              <h4>Select Products</h4>
              {products.map((product) => (
                <div key={product.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={newPromotion.products.includes(product.id)}
                      onChange={() => handleProductSelection(product.id)}
                    />
                    {product?.title}
                  </label>
                </div>
              ))}
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" fullWidth onClick={handleSavePromotion}>
                {editingPromotionId ? 'Update Promotion' : 'Save Promotion'}
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default MarketingPromotions
