'use client'
import React, { useEffect, useState } from 'react';
import { AlertCircle, Save, X, Search, Plus, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface InventoryItem {
  id: string;
  name: string;
  category: { id: string; name: string };
  currentStock: number;
  minimumStock: number;
  costPerUnit: number;
  unit: string;
  updatedAt: string;
}

interface StockCategory {
  id: string;
  name: string;
  description?: string;
}

export default function InventoryTable() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [categories, setCategories] = useState<StockCategory[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [isLoadingInventory, setIsLoadingInventory] = useState(true);
  const [newItem, setNewItem] = useState({
    name: '', quantity: 0, costPerUnit: 0, minimumStock: 0,
    category: '', supplier: '', invoiceNumber: '', unit: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchCategories();
    fetchInventory();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/stockCategories');
      if (res.ok) setCategories(await res.json());
    } catch (e) { console.error(e); }
  };

  const fetchInventory = async () => {
    setIsLoadingInventory(true);
    try {
      const res = await fetch('/api/inventory');
      if (res.ok) setInventoryItems(await res.json());
    } catch (e) { console.error(e); }
    finally { setIsLoadingInventory(false); }
  };

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category.name === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const uniqueCategories = ['all', ...new Set(inventoryItems.map(item => item.category.name))];
  const lowStockItems = inventoryItems.filter(item => item.currentStock <= item.minimumStock);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newItem.name, categoryId: newItem.category,
          currentStock: newItem.quantity, costPerUnit: newItem.costPerUnit,
          minimumStock: newItem.minimumStock, unit: newItem.unit,
          supplier: newItem.supplier, invoiceNumber: newItem.invoiceNumber,
        }),
      });
      if (!res.ok) throw new Error('Failed to create item');
      setShowModal(false);
      setNewItem({ name: '', quantity: 0, costPerUnit: 0, minimumStock: 0, category: '', supplier: '', invoiceNumber: '', unit: '', date: new Date().toISOString().split('T')[0] });
      fetchInventory();
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/stockCategories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory),
      });
      if (!res.ok) throw new Error('Failed to create category');
      const saved = await res.json();
      setCategories([...categories, saved]);
      setNewCategory({ name: '', description: '' });
      setShowCategoryModal(false);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
          <p className="text-sm text-gray-500 mt-1">{inventoryItems.length} items tracked</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowCategoryModal(true)} className="btn-secondary">
            <Plus className="w-4 h-4 mr-1.5" /> Category
          </button>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            <Plus className="w-4 h-4 mr-1.5" /> Add Stock
          </button>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Low Stock ({lowStockItems.length} items)</p>
            <div className="mt-1 space-y-0.5">
              {lowStockItems.slice(0, 4).map(item => (
                <p key={item.id} className="text-sm text-amber-700">
                  {item.name} — {item.currentStock} {item.unit} (min: {item.minimumStock})
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search inventory..."
            className="input-field pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="input-field w-auto min-w-[140px]"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          {uniqueCategories.map(cat => (
            <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="table-container">
        <div className="overflow-x-auto">
          {isLoadingInventory ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-header">Item</th>
                  <th className="table-header">Category</th>
                  <th className="table-header">Stock</th>
                  <th className="table-header">Min Required</th>
                  <th className="table-header">Cost/Unit</th>
                  <th className="table-header">Updated</th>
                  <th className="table-header">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="table-cell font-medium text-gray-900">{item.name}</td>
                    <td className="table-cell">{item.category?.name}</td>
                    <td className="table-cell">{item.currentStock} {item.unit}</td>
                    <td className="table-cell">{item.minimumStock} {item.unit}</td>
                    <td className="table-cell">R{Number(item.costPerUnit).toFixed(2)}</td>
                    <td className="table-cell text-gray-500">{format(new Date(item.updatedAt), 'd MMM yyyy')}</td>
                    <td className="table-cell">
                      <span className={item.currentStock <= item.minimumStock ? 'badge badge-danger' : 'badge badge-success'}>
                        {item.currentStock <= item.minimumStock ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!isLoadingInventory && filteredItems.length === 0 && (
            <div className="py-12 text-center text-gray-400 text-sm">No inventory items found</div>
          )}
        </div>
      </div>

      {/* Add Stock Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-gray-900">Add New Stock</h3>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                  <input type="text" required className="input-field" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select required className="input-field" value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}>
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                  <select required className="input-field" value={newItem.unit} onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}>
                    <option value="">Select Unit</option>
                    <option value="pieces">Pieces</option>
                    <option value="kg">Kilograms</option>
                    <option value="liters">Liters</option>
                    <option value="slices">Slices</option>
                    <option value="cans">Cans</option>
                    <option value="heads">Heads</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input type="number" required min="1" className="input-field" value={newItem.quantity || ''} onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Stock</label>
                  <input type="number" required min="0" className="input-field" value={newItem.minimumStock || ''} onChange={(e) => setNewItem({ ...newItem, minimumStock: Number(e.target.value) })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cost per Unit (R)</label>
                  <input type="number" required min="0.01" step="0.01" className="input-field" value={newItem.costPerUnit || ''} onChange={(e) => setNewItem({ ...newItem, costPerUnit: Number(e.target.value) })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                  <input type="text" className="input-field" value={newItem.supplier} onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
                  <input type="text" className="input-field" value={newItem.invoiceNumber} onChange={(e) => setNewItem({ ...newItem, invoiceNumber: e.target.value })} />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={isLoading} className="btn-primary">
                  {isLoading ? <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> Saving...</> : <><Save className="w-4 h-4 mr-1.5" /> Save</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-gray-900">Add Category</h3>
              <button onClick={() => setShowCategoryModal(false)} className="p-1 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" required className="input-field" value={newCategory.name} onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea className="input-field h-24 resize-none" value={newCategory.description} onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowCategoryModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={isLoading} className="btn-primary">
                  {isLoading ? <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> Saving...</> : <><Save className="w-4 h-4 mr-1.5" /> Save</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
