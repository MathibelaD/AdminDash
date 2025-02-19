'use client'
import React, { useEffect, useState } from 'react';
import { AlertCircle, Save, X, Search, Plus, Loader2 } from 'lucide-react';
import { format } from 'date-fns'

interface InventoryItem {
  id: string;
  name: string;
  category: {
    id: string;
    name: string;
  };
  currentStock: number;
  minimumStock: number;
  costPerUnit: number;
  unit: string;
  updatedAt: string;
}

export default function InventoryTable() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterCategory, setFilterCategory] = React.useState('all');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newCategory, setNewCategory] = useState<NewCategory>({ name: '', description: '' });
  const [categories, setCategories] = useState<StockCategory[]>([]);
  const [recentEntries, setRecentEntries] = useState<StockItem[]>([]);
  const [newItem, setNewItem] = useState<StockItem>({
    id: 0,
    name: '',
    quantity: 0,
    costPerUnit: 0,
    minimumStock: 0,
    category: '',
    supplier: '',
    invoiceNumber: '',
    unit: '',

    date: new Date().toISOString().split('T')[0]
  });
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [isLoadingInventory, setIsLoadingInventory] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchInventory();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/stockCategories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchInventory = async () => {
    setIsLoadingInventory(true);
    try {
      const response = await fetch('/api/inventory');
      if (!response.ok) throw new Error('Failed to fetch inventory');
      const data = await response.json();
      setInventoryItems(data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setIsLoadingInventory(false);
    }
  };

  // Update your filtering logic to work with the new data structure
  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category.name === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const uniqueCategories = ['all', ...new Set(inventoryItems.map(item => item.category.name))];

  // Calculate low stock items
  const lowStockItems = inventoryItems.filter(item => item.currentStock <= item.minimumStock);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newItem.name,
          categoryId: newItem.category, // This should be the category ID
          currentStock: newItem.quantity,
          costPerUnit: newItem.costPerUnit,
          unit: 'pieces', // You might want to add a unit selector to your form
          supplierId: null, // If you have supplier IDs, add them here
          description: '', // Add description field to your form if needed
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create inventory item');
      }

      const savedItem = await response.json();

      // Update your local state
      setRecentEntries([savedItem, ...recentEntries]);

      // Reset form and close modal
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

      setShowModal(false);
      console.log("Stock item added successfully");
      //toast.success('Stock item added successfully');
    } catch (error) {
      console.error('Error saving inventory item:', error);
      //toast.error(error instanceof Error ? error.message : 'Failed to save stock item');
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/stockCategories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCategory),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create category');
      }

      const savedCategory = await response.json();
      setCategories([...categories, savedCategory]);
      setNewCategory({ name: '', description: '' });
      setShowCategoryModal(false);
      console.log("Category added successfully");
    } catch (error) {
      console.error('Error saving category:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const categoryOptions = categories.map(cat => ({
    value: cat.id, label: cat.name
  }));
  // Sample data - replace with real data



  return (
    <div className="space-y-6">
      {/* Stock Entry buttons */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Inventory Entry</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setShowCategoryModal(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Category
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Stock
          </button>
        </div>
      </div>

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
                {item.name} - Only {item.currentStock} {item.unit} remaining (Minimum: {item.minimumStock})
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Search && Filters */}
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
          {uniqueCategories.map(category => (
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
          {isLoadingInventory ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">In Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Min Required</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost Per Unit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Updated</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{item.name}</td>
                    <td className="px-6 py-4">{item.category?.name}</td>
                    <td className="px-6 py-4">{item.currentStock}</td>
                    <td className="px-6 py-4">{item.minimumStock}</td>
                    <td className="px-6 py-4">R{Number(item.costPerUnit).toFixed(2)}</td>
                    <td className="px-6 py-4">{format(new Date(item.updatedAt), ' d MMM yyyy')}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${item.currentStock <= item.minimumStock ?
                          'bg-red-100 text-red-800' :
                          'bg-green-100 text-green-800'}`}>
                        {item.currentStock <= item.minimumStock ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!isLoadingInventory && filteredItems.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No inventory items found
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
                    {categoryOptions.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit
                  </label>
                  <select
                    required
                    className="w-full p-2 border rounded-lg"
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                  >
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
                    Minimum Stock
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    className="w-full p-2 border rounded-lg"
                    value={newItem.minimumStock || ''}
                    onChange={(e) => setNewItem({ ...newItem, minimumStock: Number(e.target.value) })}
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
                  disabled={isLoading}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Save className="w-5 h-5 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Stock Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Add New Stock Category</h3>
              <button onClick={() => setShowCategoryModal(false)}>
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded-lg"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  placeholder="Enter category name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  className="w-full p-2 border rounded-lg h-32"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  placeholder="Enter category description (optional)"
                />
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400"
                >
                  <Save className="w-5 h-5 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}