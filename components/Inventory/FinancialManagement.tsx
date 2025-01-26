'use client'
import React, { useState } from 'react';
import InventoryTable from './InventoryTable';
import StockEntry from './StockEntry';
import FinancialAnalytics from './FinanceAnalytics';


export default function InventoryManagement() {
  const [activeTab, setActiveTab] = useState('inventory');

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Inventory & Stock Management</h1>
        <div className="flex space-x-4 border-b">
          <button
            className={`px-4 py-2 ${activeTab === 'inventory' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('inventory')}
          >
            Inventory
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'stock' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('stock')}
          >
            Stock Entry
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'analytics' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
        </div>
      </div>

      {activeTab === 'inventory' && <InventoryTable />}
      {activeTab === 'stock' && <StockEntry />}
      {activeTab === 'analytics' && <FinancialAnalytics />}
    </div>
  );
}