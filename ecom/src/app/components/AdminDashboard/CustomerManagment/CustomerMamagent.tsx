'use client'

import React, { useEffect, useState } from 'react'
import {
  fetchCustomers,
  Customer,
  updateCustomer,
  handleDeleteCustomer,
} from '@/lib/db/customer'
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
  Button,
  TextField,
  FormControlLabel,
  Switch,
} from '@mui/material'
import { Edit, Delete } from '@mui/icons-material'

function formatPurchaseDate(date: any) {
  if (!date || typeof date.toDate !== 'function') return 'N/A'
  return date.toDate().toLocaleDateString()
}

function CustomerTable() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)

  useEffect(() => {
    const load = async () => {
      const res = await fetchCustomers()
      setCustomers(res)
    }
    load()
  }, [])

  const openEditForm = (customer: Customer) => {
    setEditingCustomer(customer)
  }

  const handleSave = async () => {
    if (!editingCustomer) return
    await updateCustomer(editingCustomer.id, editingCustomer)
    setCustomers(prev =>
      prev.map(c => (c.id === editingCustomer.id ? editingCustomer : c))
    )
    setEditingCustomer(null)
  }

  const handleDelete = async (id: string) => {
    try {
      await handleDeleteCustomer(id)
      setCustomers(prev => prev.filter(customer => customer.id !== id))
    } catch (error) {
      console.error('Error deleting customer:', error)
    }
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table className="min-w-full" aria-label="customer table">
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Promotions</TableCell>
              <TableCell>Last Purchase</TableCell>
              <TableCell>Purchases</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map(c => (
              <TableRow key={c.id}>
                <TableCell>{c.email}</TableCell>
                <TableCell>{c.name}</TableCell>
                <TableCell>{c.phone}</TableCell>
                <TableCell>{c.promotions ? 'Yes' : 'No'}</TableCell>
                <TableCell>{formatPurchaseDate(c.lastPurchaseDate)}</TableCell>
                <TableCell>{c.purchaseHistory.length}</TableCell>
                <TableCell>
                  <IconButton onClick={() => openEditForm(c)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(c.id)} color="secondary">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={!!editingCustomer} onClose={() => setEditingCustomer(null)}>
        <DialogTitle>Edit Customer</DialogTitle>
        <DialogContent>
          <TextField
            label="Email"
            fullWidth
            margin="dense"
            value={editingCustomer?.email || ''}
            onChange={e =>
              setEditingCustomer(c => c && { ...c, email: e.target.value })
            }
          />
          <TextField
            label="Name"
            fullWidth
            margin="dense"
            value={editingCustomer?.name || ''}
            onChange={e =>
              setEditingCustomer(c => c && { ...c, name: e.target.value })
            }
          />
          <TextField
            label="Phone"
            fullWidth
            margin="dense"
            value={editingCustomer?.phone || ''}
            onChange={e =>
              setEditingCustomer(c => c && { ...c, phone: e.target.value })
            }
          />
          <FormControlLabel
            control={
              <Switch
                checked={editingCustomer?.promotions || false}
                onChange={e =>
                  setEditingCustomer(c => c && { ...c, promotions: e.target.checked })
                }
              />
            }
            label="Receive Promotions"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingCustomer(null)}>Cancel</Button>
          <Button onClick={handleSave} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default CustomerTable
