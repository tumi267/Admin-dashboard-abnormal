'use client'
import React, { useState } from 'react';
import Category from './Category/Category';
import CustomerMamagent from './CustomerManagment/CustomerMamagent';
import Ordersmanagement from './OrdersManagement/Ordersmanagement';
import MarketingPromotions from './MarketingPormotion/MarketingPromotion';
import AnalyticsReports from './AnalyticsReports/AnalyticsReports';
import { FiMenu, FiX, FiGrid, FiShoppingBag, FiUsers, FiTag, FiBarChart2, FiSettings, FiPieChart } from 'react-icons/fi';

function AdminDashboard({productsList}) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(true);
 
  const renderContent = () => {
    switch (activeTab) {
      case 'products':
        return <div className="bg-white p-6 rounded-lg shadow">{productsList}</div>;
      case 'categories':
        return <div className="bg-white p-6 rounded-lg shadow"><Category /></div>;
      case 'customers':
        return <div className="bg-white p-6 rounded-lg shadow"><CustomerMamagent /></div>;
      case 'orders':
        return <div className="bg-white p-6 rounded-lg shadow"><Ordersmanagement /></div>;
      case 'marketing':
        return <div className="bg-white p-6 rounded-lg shadow"><MarketingPromotions /></div>;
      case 'analytics':
        return <div className="bg-white p-6 rounded-lg shadow"><AnalyticsReports /></div>;
      default:
        return <div className="bg-white p-6 rounded-lg shadow">Select a menu item</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${isMenuOpen ? 'w-64' : 'w-20'} bg-indigo-800 text-white transition-all duration-300 flex flex-col`}>
        <div className="p-4 flex items-center justify-between">
          {isMenuOpen ? (
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          ) : (
            <div className="w-8 h-8"></div>
          )}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white focus:outline-none">
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
        <nav className="flex-1 mt-6">
          <ul>
            {/* <li>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center w-full p-4 ${activeTab === 'dashboard' ? 'bg-indigo-700' : ''} hover:bg-indigo-700 transition-colors`}
              >
                <FiGrid size={20} />
                {isMenuOpen && <span className="ml-3">Dashboard</span>}
              </button>
            </li> */}
            <li>
              <button
                onClick={() => setActiveTab('products')}
                className={`flex items-center w-full p-4 ${activeTab === 'products' ? 'bg-indigo-700' : ''} hover:bg-indigo-700 transition-colors`}
              >
                <FiShoppingBag size={20} />
                {isMenuOpen && <span className="ml-3">Products</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('categories')}
                className={`flex items-center w-full p-4 ${activeTab === 'categories' ? 'bg-indigo-700' : ''} hover:bg-indigo-700 transition-colors`}
              >
                <FiTag size={20} />
                {isMenuOpen && <span className="ml-3">Categories</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('customers')}
                className={`flex items-center w-full p-4 ${activeTab === 'customers' ? 'bg-indigo-700' : ''} hover:bg-indigo-700 transition-colors`}
              >
                <FiUsers size={20} />
                {isMenuOpen && <span className="ml-3">Customers</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex items-center w-full p-4 ${activeTab === 'orders' ? 'bg-indigo-700' : ''} hover:bg-indigo-700 transition-colors`}
              >
                <FiPieChart size={20} />
                {isMenuOpen && <span className="ml-3">Orders</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('marketing')}
                className={`flex items-center w-full p-4 ${activeTab === 'marketing' ? 'bg-indigo-700' : ''} hover:bg-indigo-700 transition-colors`}
              >
                <FiBarChart2 size={20} />
                {isMenuOpen && <span className="ml-3">Marketing</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center w-full p-4 ${activeTab === 'analytics' ? 'bg-indigo-700' : ''} hover:bg-indigo-700 transition-colors`}
              >
                <FiSettings size={20} />
                {isMenuOpen && <span className="ml-3">Analytics</span>}
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm p-4">
          <h2 className="text-xl font-semibold text-gray-800 capitalize">
            {activeTab === 'dashboard' ? 'Overview' : activeTab}
          </h2>
        </header>
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
export default AdminDashboard