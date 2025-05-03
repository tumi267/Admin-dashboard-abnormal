// app/admin/page.js (Server Component)
import AdminDashboard from '../components/AdminDashboard/AdminDashboard';
import Products from '../components/AdminDashboard/Products/Products';

export default async function AdminPage() {
  const productsList = await Products();
  return <AdminDashboard productsList={productsList} />;
}