'use client'
import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import AddMenuItem from './AddMenuItem';
import { MenuTable } from './MenuTable';
import { SearchFilters } from './SearchFilters';


export default function MenuManagement() {
  // State
  const [menuItems, setMenuItems] = useState([
    {
      id: 1,
      name: 'Classic Kota',
      category: 'Kota',
      price: 45.99,
      ingredients: [1, 4, 8, 12, 16],
      status: 'Available',
      type: 'item'
    },
    {
      id: 2,
      name: 'Cheese Burger Meal',
      category: 'Meals',
      price: 75.99,
      ingredients: [2, 6, 11, 13, 14, 16],
      drinks: [101],
      sides: [4],
      status: 'Available',
      type: 'meal'
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Handlers
  const handleAddItem = (newItem: any) => {
    setMenuItems([...menuItems, newItem]);
  };

  const handleEditItem = (item: any) => {
    // Add edit functionality
    console.log('Edit item:', item);
  };

  const handleDeleteItem = (id: number) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Menu Management</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Add Item
        </button>
      </div>

      {/* Search and Filters */}
      <SearchFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Menu Table */}
      <MenuTable
        items={menuItems}
        onEdit={handleEditItem}
        onDelete={handleDeleteItem}
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
      />

      {/* Add Modal */}
      <AddMenuItem
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddItem}
      />
    </div>
  );
}
