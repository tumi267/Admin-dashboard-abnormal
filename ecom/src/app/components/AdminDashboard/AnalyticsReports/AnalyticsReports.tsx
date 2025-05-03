'use client'
import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, Grid,
  Table, TableHead, TableRow, TableCell, TableBody,
  Paper, Select, MenuItem, InputLabel, FormControl, Button
} from '@mui/material';
import dynamic from 'next/dynamic';

// Type definitions
interface SalesOverview {
  totalSales: number;
  orders: number;
  avgOrderValue: number;
}

interface Product {
  name: string;
  sales: number;
}

interface Customer {
  name: string;
  date: string;
  source: string;
}

interface Cart {
  customer: string;
  items: number;
  value: number;
}

interface Promotion {
  name: string;
  discount: string;
  salesBoost: string;
  products: number;
}

interface SalesTrend {
  day?: string;
  week?: string;
  month?: string;
  sales: number;
}

interface AnalyticsData {
  salesOverview: SalesOverview;
  topProducts: Product[];
  customerAcquisition: Customer[];
  abandonedCarts: Cart[];
  promotions: Promotion[];
  salesTrend: SalesTrend[];
}

import {
    BarChart, Bar, XAxis, YAxis, Tooltip,
    PieChart, Pie, Cell, ResponsiveContainer
  } from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

const dataByRange: Record<string, AnalyticsData> = {
  '7days': {
    salesOverview: { totalSales: 15000, orders: 40, avgOrderValue: 375 },
    topProducts: [
      { name: 'Product A', sales: 6000 },
      { name: 'Product B', sales: 5000 },
      { name: 'Product C', sales: 4000 },
    ],
    customerAcquisition: [
      { name: 'Alice', date: '2025-04-21', source: 'Instagram' },
      { name: 'Bob', date: '2025-04-23', source: 'Referral' },
    ],
    abandonedCarts: [
      { customer: 'Charlie', items: 2, value: 800 },
    ],
    promotions: [
      { name: 'Flash Sale', discount: '15%', salesBoost: '50%', products: 10 },
    ],
    salesTrend: [
      { day: 'Mon', sales: 2000 },
      { day: 'Tue', sales: 3000 },
      { day: 'Wed', sales: 2500 },
      { day: 'Thu', sales: 4000 },
      { day: 'Fri', sales: 3500 },
    ]
  },
  '30days': {
    salesOverview: { totalSales: 45000, orders: 160, avgOrderValue: 281.25 },
    topProducts: [
      { name: 'Product A', sales: 18000 },
      { name: 'Product B', sales: 15000 },
      { name: 'Product C', sales: 12000 },
    ],
    customerAcquisition: [
      { name: 'Alice', date: '2025-04-01', source: 'Google' },
      { name: 'Bob', date: '2025-04-10', source: 'Instagram' },
    ],
    abandonedCarts: [
      { customer: 'Dave', items: 3, value: 950 },
      { customer: 'Eve', items: 1, value: 420 },
    ],
    promotions: [
      { name: 'Easter Sale', discount: '20%', salesBoost: '80%', products: 12 },
    ],
    salesTrend: [
      { week: 'Week 1', sales: 10000 },
      { week: 'Week 2', sales: 12000 },
      { week: 'Week 3', sales: 15000 },
      { week: 'Week 4', sales: 8000 },
    ]
  },
  '60days': {
    salesOverview: { totalSales: 90000, orders: 300, avgOrderValue: 300 },
    topProducts: [
      { name: 'Product A', sales: 35000 },
      { name: 'Product B', sales: 30000 },
      { name: 'Product C', sales: 25000 },
    ],
    customerAcquisition: [
      { name: 'Frank', date: '2025-03-01', source: 'Facebook' },
      { name: 'Grace', date: '2025-03-15', source: 'YouTube' },
    ],
    abandonedCarts: [
      { customer: 'Heidi', items: 5, value: 1200 },
    ],
    promotions: [
      { name: 'March Madness', discount: '30%', salesBoost: '100%', products: 20 },
    ],
    salesTrend: [
      { week: 'Week 1', sales: 20000 },
      { week: 'Week 2', sales: 18000 },
      { week: 'Week 3', sales: 22000 },
      { week: 'Week 4', sales: 15000 },
      { week: 'Week 5', sales: 10000 },
      { week: 'Week 6', sales: 5000 },
    ]
  },
  '90days': {
    salesOverview: { totalSales: 135000, orders: 450, avgOrderValue: 300 },
    topProducts: [
      { name: 'Product A', sales: 50000 },
      { name: 'Product B', sales: 45000 },
      { name: 'Product C', sales: 40000 },
    ],
    customerAcquisition: [
      { name: 'Ivy', date: '2025-02-01', source: 'Google Ads' },
      { name: 'Jack', date: '2025-02-12', source: 'Referral' },
    ],
    abandonedCarts: [
      { customer: 'Karen', items: 3, value: 950 },
    ],
    promotions: [
      { name: 'New Year Kickoff', discount: '25%', salesBoost: '90%', products: 18 },
    ],
    salesTrend: [
      { month: 'February', sales: 45000 },
      { month: 'March', sales: 60000 },
      { month: 'April', sales: 30000 },
    ]
  },
  '180days': {
    salesOverview: { totalSales: 240000, orders: 800, avgOrderValue: 300 },
    topProducts: [
      { name: 'Product A', sales: 90000 },
      { name: 'Product B', sales: 80000 },
      { name: 'Product C', sales: 70000 },
    ],
    customerAcquisition: [
      { name: 'Leo', date: '2025-01-01', source: 'Newsletter' },
      { name: 'Mia', date: '2025-01-10', source: 'Facebook' },
    ],
    abandonedCarts: [
      { customer: 'Noah', items: 6, value: 1500 },
    ],
    promotions: [
      { name: 'Summer Blowout', discount: '50%', salesBoost: '200%', products: 30 },
    ],
    salesTrend: [
      { month: 'January', sales: 40000 },
      { month: 'February', sales: 45000 },
      { month: 'March', sales: 60000 },
      { month: 'April', sales: 50000 },
      { month: 'May', sales: 30000 },
      { month: 'June', sales: 15000 },
    ]
  }
};

const defaultData: AnalyticsData = {
  salesOverview: { totalSales: 0, orders: 0, avgOrderValue: 0 },
  topProducts: [],
  customerAcquisition: [],
  abandonedCarts: [],
  promotions: [],
  salesTrend: []
};

const AnalyticsReports = (): React.JSX.Element => {
  const [timeRange, setTimeRange] = useState<string>('30days');
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const currentData: AnalyticsData = dataByRange[timeRange] || defaultData;
  const { 
    salesOverview, 
    topProducts, 
    customerAcquisition, 
    abandonedCarts, 
    promotions,
    salesTrend 
  } = currentData;

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const exportCSV = (filename: string, headers: string[], rows: string[][]): void => {
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isMounted) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h5" gutterBottom>Analytics Reports</Typography>
      
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Time Range</InputLabel>
            <Select 
              value={timeRange} 
              label="Time Range" 
              onChange={(e) => setTimeRange(e.target.value as string)}
            >
              <MenuItem value="7days">Last 7 Days</MenuItem>
              <MenuItem value="30days">Last 30 Days</MenuItem>
              <MenuItem value="60days">Last 60 Days</MenuItem>
              <MenuItem value="90days">Last 90 Days</MenuItem>
              <MenuItem value="180days">Last 180 Days</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Overview Cards */}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Total Sales</Typography>
              <Typography variant="h4">{formatCurrency(salesOverview.totalSales)}</Typography>
              <Typography variant="body2" color="text.secondary">
                {formatNumber(salesOverview.orders)} orders
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Total Orders</Typography>
              <Typography variant="h4">{formatNumber(salesOverview.orders)}</Typography>
              <Typography variant="body2" color="text.secondary">
                {formatCurrency(salesOverview.avgOrderValue)} avg. order
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Avg. Order Value</Typography>
              <Typography variant="h4">{formatCurrency(salesOverview.avgOrderValue)}</Typography>
              <Typography variant="body2" color="text.secondary">
                {Math.round(salesOverview.totalSales / salesOverview.avgOrderValue)} estimated customers
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Top Performing Products</Typography>
              <div style={{ height: 300 }}>
                <BarChart
                  width={500}
                  height={300}
                  data={topProducts}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => formatCurrency(Number(value))}
                    labelFormatter={(label) => `Product: ${label}`}
                  />
                  <Bar dataKey="sales" fill="#8884d8" name="Sales" />
                </BarChart>
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Sales Distribution</Typography>
              <div style={{ height: 300 }}>
                <PieChart width={500} height={300}>
                  <Pie
                    data={topProducts}
                    dataKey="sales"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {topProducts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                </PieChart>
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Sales Trend</Typography>
              <div style={{ height: 300 }}>
                <BarChart
                  width={800}
                  height={300}
                  data={salesTrend}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey={timeRange.includes('days') ? 'day' : timeRange.includes('week') ? 'week' : 'month'} />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                  <Bar dataKey="sales" fill="#82ca9d" name="Sales" />
                </BarChart>
              </div>
            </CardContent>
          </Card>
        </Grid>

        {/* Customer Acquisition */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Customer Acquisition</Typography>
              <Button 
                size="small" 
                onClick={() => exportCSV(
                  'customer_acquisition.csv', 
                  ['Name', 'Date', 'Source'], 
                  customerAcquisition.map(c => [c.name, c.date, c.source])
                )}
                sx={{ mb: 2 }}
              >
                Export CSV
              </Button>
              <Paper sx={{ maxHeight: 400, overflow: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Source</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {customerAcquisition.map((c, i) => (
                      <TableRow key={i}>
                        <TableCell>{c.name}</TableCell>
                        <TableCell>{c.date}</TableCell>
                        <TableCell>{c.source}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </CardContent>
          </Card>
        </Grid>

        {/* Abandoned Carts */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Abandoned Carts</Typography>
              <Button 
                size="small" 
                onClick={() => exportCSV(
                  'abandoned_carts.csv', 
                  ['Customer', 'Items', 'Value'], 
                  abandonedCarts.map(a => [a.customer, a.items.toString(), formatCurrency(a.value)])
                )}
                sx={{ mb: 2 }}
              >
                Export CSV
              </Button>
              <Paper sx={{ maxHeight: 400, overflow: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Customer</TableCell>
                      <TableCell>Items</TableCell>
                      <TableCell>Value</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {abandonedCarts.map((a, i) => (
                      <TableRow key={i}>
                        <TableCell>{a.customer}</TableCell>
                        <TableCell>{a.items}</TableCell>
                        <TableCell>{formatCurrency(a.value)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </CardContent>
          </Card>
        </Grid>

        {/* Promotions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Promotions</Typography>
              <Button 
                size="small" 
                onClick={() => exportCSV(
                  'promotions.csv', 
                  ['Name', 'Discount', 'Sales Boost', 'Products'], 
                  promotions.map(p => [p.name, p.discount, p.salesBoost, p.products.toString()])
                )}
                sx={{ mb: 2 }}
              >
                Export CSV
              </Button>
              <Paper sx={{ maxHeight: 400, overflow: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Discount</TableCell>
                      <TableCell>Sales Boost</TableCell>
                      <TableCell>Products</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {promotions.map((p, i) => (
                      <TableRow key={i}>
                        <TableCell>{p.name}</TableCell>
                        <TableCell>{p.discount}</TableCell>
                        <TableCell>{p.salesBoost}</TableCell>
                        <TableCell>{p.products}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default AnalyticsReports;