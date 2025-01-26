'use client'
import React from 'react';
import { AlertCircle, Search } from 'lucide-react';

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  inStock: number;
  minRequired: number;
  costPerUnit: number;
  lastRestocked: string;
}

export default function InventoryTable() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterCategory, setFilterCategory] = React.useState('all');

  // Sample data - replace with real data
  const inventoryData: InventoryItem[] = [
    { id: 1, name: 'Bread Roll', category: 'Base', inStock: 150, minRequired: 100, costPerUnit: 8, lastRestocked: '2024-01-10' },
    { id: 2, name: 'French Fries', category: 'Sides', inStock: 80, minRequired: 100, costPerUnit: 15, lastRestocked: '2024-01-09' },
    { id: 3, name: 'Polony', category: 'Meats', inStock: 120, minRequired: 50, costPerUnit: 12, lastRestocked: '2024-01-11' },
    { id: 4, name: 'Cheese Slice', category: 'Dairy', inStock: 30, minRequired: 50, costPerUnit: 8, lastRestocked: '2024-01-08' },
  ];

  const categories = ['all', ...Array.from(new Set(inventoryData.map(item => item.category)))];
  const lowStockItems = inventoryData.filter(item => item.inStock <= item.minRequired);

  const filteredItems = inventoryData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-yellow-400 mr-2" />
            <h3 className="font-medium">Low Stock Alert</h3>
          </div>
          <div className="mt-2">
            {lowStockItems.map(item => (
              <p key={item.id} className="text-sm text-yellow-700">
                {item.name} - Only {item.inStock} units remaining (Minimum: {item.minRequired})
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search inventory..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 border rounded-lg min-w-[150px]"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-lg font-medium">Current Inventory</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">In Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Min Required</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost Per Unit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Restocked</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{item.name}</td>
                  <td className="px-6 py-4">{item.category}</td>
                  <td className="px-6 py-4">{item.inStock}</td>
                  <td className="px-6 py-4">{item.minRequired}</td>
                  <td className="px-6 py-4">R{item.costPerUnit}</td>
                  <td className="px-6 py-4">{item.lastRestocked}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${item.inStock <= item.minRequired ? 
                        'bg-red-100 text-red-800' : 
                        'bg-green-100 text-green-800'}`}>
                      {item.inStock <= item.minRequired ? 'Low Stock' : 'In Stock'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}