'use client'
import React, { useState } from 'react';
import { Plus, X, Save } from 'lucide-react';

interface StockItem {
  id: number;
  name: string;
  quantity: number;
  costPerUnit: number;
  category: string;
  supplier?: string;
  invoiceNumber?: string;
  date: string;
}

export default function StockEntry() {
  const [showModal, setShowModal] = useState(false);
  const [recentEntries, setRecentEntries] = useState<StockItem[]>([]);
  const [newItem, setNewItem] = useState<StockItem>({
    id: 0,
    name: '',
    quantity: 0,
    costPerUnit: 0,
    category: '',
    supplier: '',
    invoiceNumber: '',
    date: new Date().toISOString().split('T')[0]
  });

  const categories = [
    'Base',
    'Sides',
    'Meats',
    'Dairy',
    'Vegetables',
    'Sauces',
    'Drinks',
    'Packaging'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const itemWithId = {
      ...newItem,
      id: Date.now()
    };
    setRecentEntries([itemWithId, ...recentEntries]);
    setShowModal(false);
    setNewItem({
      id: 0,
      name: '',
      quantity: 0,
      costPerUnit: 0,
      category: '',
      supplier: '',
      invoiceNumber: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="space-y-6">
      {/* Header and Add Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Stock Entry</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Stock
        </button>
      </div>

      {/* Recent Entries Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h3 className="text-lg font-medium">Recent Stock Entries</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost/Unit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice #</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentEntries.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{item.date}</td>
                  <td className="px-6 py-4">{item.name}</td>
                  <td className="px-6 py-4">{item.category}</td>
                  <td className="px-6 py-4">{item.quantity}</td>
                  <td className="px-6 py-4">R{item.costPerUnit.toFixed(2)}</td>
                  <td className="px-6 py-4">R{(item.quantity * item.costPerUnit).toFixed(2)}</td>
                  <td className="px-6 py-4">{item.supplier}</td>
                  <td className="px-6 py-4">{item.invoiceNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentEntries.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No recent stock entries
            </div>
          )}
        </div>
      </div>

      {/* Add Stock Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Add New Stock</h3>
              <button onClick={() => setShowModal(false)}>
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full p-2 border rounded-lg"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    required
                    className="w-full p-2 border rounded-lg"
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="w-full p-2 border rounded-lg"
                    value={newItem.quantity || ''}
                    onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cost per Unit (R)
                  </label>
                  <input
                    type="number"
                    required
                    min="0.01"
                    step="0.01"
                    className="w-full p-2 border rounded-lg"
                    value={newItem.costPerUnit || ''}
                    onChange={(e) => setNewItem({ ...newItem, costPerUnit: Number(e.target.value) })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Supplier
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg"
                    value={newItem.supplier || ''}
                    onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Invoice Number
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg"
                    value={newItem.invoiceNumber || ''}
                    onChange={(e) => setNewItem({ ...newItem, invoiceNumber: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full p-2 border rounded-lg"
                    value={newItem.date}
                    onChange={(e) => setNewItem({ ...newItem, date: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}