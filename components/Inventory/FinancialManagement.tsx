'use client'
import React, { useState } from 'react';
import InventoryTable from './InventoryTable';
import FinancialAnalytics from './FinanceAnalytics';

export default function InventoryManagement() {
  const [activeTab, setActiveTab] = useState('inventory');

  return (
    <div className="space-y-6">
      <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit">
        <button
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'inventory' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('inventory')}
        >
          Inventory
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'analytics' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </div>

      {activeTab === 'inventory' && <InventoryTable />}
      {activeTab === 'analytics' && <FinancialAnalytics />}
    </div>
  );
}
