'use client'
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, TextField, Grid, Switch } from '@mui/material';

const MarketingPromotions = () => {
  const [promotions, setPromotions] = useState([
    { id: 1, name: 'Summer Sale', discount: 20, startDate: '2025-06-01', endDate: '2025-06-30', active: true, products: [1, 2] }, // product ids associated with the promotion
    { id: 2, name: 'Black Friday', discount: 50, startDate: '2025-11-24', endDate: '2025-11-27', active: false, products: [3] }
  ]);
  
  const [products, setProducts] = useState([
    { id: 1, name: 'Product A', tags: ['promotion1'] },
    { id: 2, name: 'Product B', tags: ['promotion1'] },
    { id: 3, name: 'Product C', tags: [] }
  ]);

  const [newPromotion, setNewPromotion] = useState({
    name: '',
    discount: '',
    startDate: '',
    endDate: '',
    active: false,
    products: [] // List of product IDs linked to this promotion
  });
  
  const [openDialog, setOpenDialog] = useState(false);

  const handleDialogOpen = () => setOpenDialog(true);
  const handleDialogClose = () => setOpenDialog(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPromotion({ ...newPromotion, [name]: value });
  };

  const handleSavePromotion = () => {
    const updatedPromotions = [...promotions, { ...newPromotion, id: Date.now() }];
    setPromotions(updatedPromotions);

    // Link products to promotion by updating the product tags
    const updatedProducts = products.map((product) => {
      if (newPromotion.products.includes(product.id)) {
        return { ...product, tags: [...product.tags, `promotion${newPromotion.id}`] };
      }
      return product;
    });
    setProducts(updatedProducts);

    setNewPromotion({
      name: '',
      discount: '',
      startDate: '',
      endDate: '',
      active: false,
      products: [],
    });

    handleDialogClose();
  };

  const handleToggleActive = (id) => {
    const updatedPromotions = promotions.map((promo) =>
      promo.id === id ? { ...promo, active: !promo.active } : promo
    );
    setPromotions(updatedPromotions);
  };

  const handleProductSelection = (productId) => {
    setNewPromotion((prev) => ({
      ...prev,
      products: prev.products.includes(productId)
        ? prev.products.filter((id) => id !== productId)
        : [...prev.products, productId],
    }));
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleDialogOpen}>
        Create New Promotion
      </Button>

      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
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
                  <span
                    style={{
                      color: promotion.active ? 'green' : 'red',
                      fontWeight: 'bold',
                    }}
                  >
                    {promotion.active ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleToggleActive(promotion.id)}>
                    Toggle Active
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for Creating New Promotion */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Create New Promotion</DialogTitle>
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
            <Grid item xs={12} sm={6}>
              <TextField
                label="Discount (%)"
                name="discount"
                type="number"
                fullWidth
                value={newPromotion.discount}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Start Date"
                name="startDate"
                type="date"
                fullWidth
                value={newPromotion.startDate}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="End Date"
                name="endDate"
                type="date"
                fullWidth
                value={newPromotion.endDate}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <label>Active</label>
              <Switch
                name="active"
                checked={newPromotion.active}
                onChange={() =>
                  setNewPromotion((prev) => ({ ...prev, active: !prev.active }))
                }
              />
            </Grid>
            <Grid item xs={12}>
              <div>
                <h4>Select Products</h4>
                {products.map((product) => (
                  <div key={product.id}>
                    <label>
                      <input
                        type="checkbox"
                        checked={newPromotion.products.includes(product.id)}
                        onChange={() => handleProductSelection(product.id)}
                      />
                      {product.name}
                    </label>
                  </div>
                ))}
              </div>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSavePromotion}
              >
                Save Promotion
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MarketingPromotions;
