'use client'
import React, { useState, useEffect } from 'react';
import { PlusCircle, Loader2 } from 'lucide-react';
import AddMenuItem from './AddMenuItem';
import { SearchFilters } from './SearchFilters';
import MenuTable from './MenuTable';

export default function MenuManagement() {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => { fetchMenuItems(); }, []);

  const fetchMenuItems = async () => {
    try {
      const res = await fetch('/api/menu');
      const data = await res.json();
      if (!data.error) {
        const mapped = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          category: item.category?.name || 'Uncategorized',
          price: Number(item.price),
          ingredients: [],
          status: item.isAvailable ? 'Available' : 'Out of Stock',
          type: 'item',
        }));
        setMenuItems(mapped);
      }
    } catch (error) {
      console.error('Error fetching menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    // Refresh the list from DB after adding
    fetchMenuItems();
  };

  const handleEditItem = (item: any) => {
    console.log('Edit item:', item);
  };

  const handleDeleteItem = async (id: number | string) => {
    try {
      const res = await fetch(`/api/menu?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMenuItems(menuItems.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Menu Management</h1>
        <button onClick={() => setShowAddModal(true)} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <PlusCircle className="w-5 h-5 mr-2" />Add Item
        </button>
      </div>

      <SearchFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <MenuTable
        items={menuItems}
        onEdit={handleEditItem}
        onDelete={handleDeleteItem}
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
      />

      <AddMenuItem
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddItem}
      />
    </div>
  );
}
