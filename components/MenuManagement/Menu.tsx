'use client'
import React, { useState, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import AddMenuItem from './AddMenuItem';
import { SearchFilters } from './SearchFilters';
import MenuTable from './MenuTable';
import ConfirmModal from '../ui/ConfirmModal';

export default function MenuManagement() {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => { fetchMenuItems(); }, []);

  const fetchMenuItems = async () => {
    try {
      const res = await fetch('/api/menu');
      const data = await res.json();
      if (!data.error) {
        setMenuItems(data.map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description || '',
          category: item.category?.name || 'Uncategorized',
          categoryId: item.categoryId,
          price: Number(item.price),
          costPerUnit: Number(item.costPerUnit),
          ingredients: [],
          status: item.isAvailable ? 'Available' : 'Out of Stock',
          isAvailable: item.isAvailable,
          type: 'item',
        })));
      }
    } catch (error) {
      console.error('Error fetching menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const handleDeleteItem = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/menu?id=${deleteTarget.id}`, { method: 'DELETE' });
      if (res.ok) setMenuItems(menuItems.filter(item => item.id !== deleteTarget.id));
    } catch (error) {
      console.error('Error deleting item:', error);
    } finally {
      setDeleteTarget(null);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu</h1>
          <p className="text-sm text-gray-500 mt-1">{menuItems.length} items on your menu</p>
        </div>
        <button onClick={handleAdd} className="btn-primary">
          <Plus className="w-4 h-4 mr-1.5" /> Add Item
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
        onEdit={handleEdit}
        onDelete={(id) => setDeleteTarget(menuItems.find(i => i.id === id))}
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
      />

      <AddMenuItem
        isOpen={showModal}
        onClose={handleClose}
        onAdd={fetchMenuItems}
        editItem={editingItem}
      />

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Menu Item"
        message={`This will permanently remove "${deleteTarget?.name}" from your menu. This cannot be undone.`}
        confirmLabel="Yes, delete it"
        onConfirm={handleDeleteItem}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
