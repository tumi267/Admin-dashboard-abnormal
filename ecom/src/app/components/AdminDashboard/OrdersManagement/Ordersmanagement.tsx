'use client'

import React, { useEffect, useState } from 'react'
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Chip,
  Grid,
} from '@mui/material'
import { fetchOrders, Order } from '../../../../lib/db/orders'

function OrderTable() {
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [amendDialogOpen, setAmendDialogOpen] = useState(false)

  useEffect(() => {
    const load = async () => {
      const res = await fetchOrders()
      setOrders(res)
    }
    load()
  }, [])

  const handleOpenOrder = (order: Order) => {
    setSelectedOrder(order)
  }

  const handleClose = () => {
    setSelectedOrder(null)
    setAmendDialogOpen(false)
  }

  const handleAmendOpen = () => setAmendDialogOpen(true)
  const handleAmendClose = () => setAmendDialogOpen(false)

  const renderStatus = (status: string) => {
    const colorMap: Record<string, 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'warning'> = {
      pending: 'warning',
      paid: 'primary',
      shipped: 'secondary',
      delivered: 'success',
      cancelled: 'error',
    }
    return <Chip label={status} color={colorMap[status] || 'default'} size="small" />
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order #</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Total Paid</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map(order => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>
                  {order.createdAt?.toDate?.().toLocaleDateString() || 'N/A'}
                </TableCell>
                <TableCell>{order.customer?.name || 'N/A'}</TableCell>
                <TableCell>{order.totalItems}</TableCell>
                <TableCell>R {order.totalAmount.toFixed(2)}</TableCell>
                <TableCell>{renderStatus(order.status)}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpenOrder(order)}>View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* View Order Dialog */}
      <Dialog open={!!selectedOrder && !amendDialogOpen} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Item</strong></TableCell>
                        <TableCell align="right"><strong>Quantity</strong></TableCell>
                        <TableCell align="right"><strong>Price</strong></TableCell>
                        <TableCell align="right"><strong>Total</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedOrder.items.map((item, i) => (
                        <TableRow key={i}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell align="right">{item.quantity}</TableCell>
                          <TableCell align="right">R {item.price.toFixed(2)}</TableCell>
                          <TableCell align="right">R {(item.price * item.quantity).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <p style={{ marginTop: '1rem' }}>
                  <strong>Total:</strong> R {selectedOrder.totalAmount.toFixed(2)}
                </p>
              </Grid>

              <Grid item xs={12} md={6}>
                <h4><strong>Customer Details:</strong></h4>
                <p><strong>Name:</strong> {selectedOrder.customer.name}</p>
                <p><strong>Email:</strong> {selectedOrder.customer.email}</p>
                <p><strong>Phone:</strong> {selectedOrder.customer.phone}</p>
                <h4><strong>Shipping Address:</strong></h4>
                <p>
                  {selectedOrder.address.street},<br />
                  {selectedOrder.address.city}, {selectedOrder.address.province}<br />
                  {selectedOrder.address.postalCode}
                </p>
              </Grid>

              <Grid item xs={12}>
                <p><strong>Status:</strong> {selectedOrder.status}</p>

                <Button
                  variant="outlined"
                  color="secondary"
                  sx={{ mb: 2 }}
                  onClick={handleAmendOpen}
                >
                  Amend Order
                </Button>
                <br />

                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    alert('Update status for: ' + selectedOrder.id)
                  }}
                >
                  Process order
                </Button>
              </Grid>
            </Grid>
          )}
        </DialogContent>
      </Dialog>

      {/* Amend Order Dialog */}
      <Dialog open={amendDialogOpen} onClose={handleAmendClose} maxWidth="sm" fullWidth>
        <DialogTitle>Amend Order</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Grid container spacing={2}>
              {selectedOrder.items.map((item, index) => (
                <Grid item xs={12} key={index}>
                  <p><strong>{item.name}</strong></p>
                  <label htmlFor={`quantity-${index}`}>Quantity:</label>
                  <input
                    id={`quantity-${index}`}
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => {
                      const newItems = [...selectedOrder.items]
                      newItems[index].quantity = parseInt(e.target.value, 10)
                      setSelectedOrder({ ...selectedOrder, items: newItems })
                    }}
                    style={{
                      width: '100%',
                      padding: '8px',
                      marginTop: '4px',
                      boxSizing: 'border-box',
                    }}
                  />
                  <Button
  variant="outlined"
  color="secondary"
  onClick={() => {
    const newItems = selectedOrder.items.filter((_, i) => i !== index)
    setSelectedOrder({ ...selectedOrder, items: newItems })
  }}
  style={{ marginTop: '8px' }}
>
  Remove
</Button>

                </Grid>
              ))}
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    // Replace this with real backend call
                    console.log('Saving amended order:', selectedOrder)
                    handleAmendClose()
                  }}
                >
                  Save Changes
                </Button>
              </Grid>
            </Grid>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default OrderTable