'use client'
import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, Plus, Minus } from 'lucide-react';

interface MenuCategory {
  id: string;
  name: string;
}

interface InventoryItem {
  id: string;
  name: string;
  category: { id: string; name: string };
  costPerUnit: number;
  unit: string;
}

interface SelectedIngredient {
  inventoryItemId: string;
  name: string;
  quantity: number;
  unit: string;
  costPerUnit: number;
}

interface AddMenuItemProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newItem?: any) => void;
  editItem?: any;
}

export default function AddMenuItem({ isOpen, onClose, onAdd, editItem }: AddMenuItemProps) {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState<SelectedIngredient[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    price: '',
    isAvailable: true,
  });

  const isEditing = !!editItem;

  // Load categories and inventory when modal opens
  useEffect(() => {
    if (isOpen) {
      Promise.all([
        fetch('/api/menu/categories').then(r => r.json()),
        fetch('/api/inventory').then(r => r.json()),
      ]).then(([cats, items]) => {
        if (!cats.error) setCategories(cats);
        if (!items.error) setInventoryItems(items);
      }).catch(console.error);
    }
  }, [isOpen]);

  // Pre-fill form when editing
  useEffect(() => {
    if (editItem) {
      setFormData({
        name: editItem.name || '',
        description: editItem.description || '',
        categoryId: editItem.categoryId || '',
        price: editItem.price?.toString() || '',
        isAvailable: editItem.isAvailable ?? true,
      });
      setSelectedIngredients([]);
    } else {
      setFormData({ name: '', description: '', categoryId: '', price: '', isAvailable: true });
      setSelectedIngredients([]);
    }
  }, [editItem, isOpen]);

  const ingredientCost = selectedIngredients.reduce(
    (sum, ing) => sum + (ing.costPerUnit * ing.quantity), 0
  );

  const sellingPrice = Number(formData.price) || 0;
  const costBase = ingredientCost > 0 ? ingredientCost : (editItem?.costPerUnit || 0);
  const profit = sellingPrice - costBase;
  const margin = sellingPrice > 0 ? (profit / sellingPrice) * 100 : 0;

  const addIngredient = (item: InventoryItem) => {
    if (selectedIngredients.find(i => i.inventoryItemId === item.id)) return;
    setSelectedIngredients([...selectedIngredients, {
      inventoryItemId: item.id,
      name: item.name,
      quantity: 1,
      unit: item.unit,
      costPerUnit: Number(item.costPerUnit),
    }]);
  };

  const updateIngredientQty = (id: string, delta: number) => {
    setSelectedIngredients(selectedIngredients.map(ing =>
      ing.inventoryItemId === id
        ? { ...ing, quantity: Math.max(1, ing.quantity + delta) }
        : ing
    ));
  };

  const removeIngredient = (id: string) => {
    setSelectedIngredients(selectedIngredients.filter(i => i.inventoryItemId !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.price) return;
    setSaving(true);

    const payload = {
      name: formData.name,
      description: formData.description || null,
      categoryId: formData.categoryId,
      price: Number(formData.price),
      costPerUnit: ingredientCost > 0 ? ingredientCost : (editItem?.costPerUnit || 0),
      isAvailable: formData.isAvailable,
      ingredients: selectedIngredients.map(i => i.inventoryItemId),
    };

    try {
      const res = await fetch('/api/menu', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isEditing ? { id: editItem.id, ...payload } : payload),
      });

      if (res.ok) {
        onAdd();
        onClose();
      }
    } catch (error) {
      console.error('Error saving menu item:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  // Group inventory by category
  const grouped = inventoryItems.reduce((acc: Record<string, InventoryItem[]>, item) => {
    const cat = item.category?.name || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-4 border-b border-gray-100 z-10">
          <h2 className="text-lg font-bold text-gray-900">{isEditing ? 'Edit Menu Item' : 'Add Menu Item'}</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
              <input type="text" required className="input-field" placeholder="e.g. Kota Full House" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select required className="input-field" value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}>
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
              <input type="text" className="input-field" placeholder="What's in it — e.g. Polony, Russian, Chips, Cheese, Atchar" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="isAvailable"
                className="rounded border-gray-300"
                checked={formData.isAvailable}
                onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
              />
              <label htmlFor="isAvailable" className="text-sm text-gray-700">Available for ordering</label>
            </div>
          </div>

          {/* Ingredients from Inventory */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ingredients (from your stock)</label>
            <p className="text-xs text-gray-500 mb-3">Select what goes into this item. This helps track stock usage per order.</p>

            {/* Selected ingredients */}
            {selectedIngredients.length > 0 && (
              <div className="mb-3 space-y-2">
                {selectedIngredients.map(ing => (
                  <div key={ing.inventoryItemId} className="flex items-center justify-between bg-orange-50 border border-orange-100 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-900">{ing.name}</span>
                      <span className="text-xs text-gray-500">R{ing.costPerUnit.toFixed(2)}/{ing.unit}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => updateIngredientQty(ing.inventoryItemId, -1)} className="p-1 rounded hover:bg-orange-100">
                        <Minus className="w-3.5 h-3.5 text-gray-600" />
                      </button>
                      <span className="text-sm font-medium w-6 text-center">{ing.quantity}</span>
                      <button type="button" onClick={() => updateIngredientQty(ing.inventoryItemId, 1)} className="p-1 rounded hover:bg-orange-100">
                        <Plus className="w-3.5 h-3.5 text-gray-600" />
                      </button>
                      <span className="text-xs text-gray-500">{ing.unit}</span>
                      <button type="button" onClick={() => removeIngredient(ing.inventoryItemId)} className="p-1 rounded hover:bg-red-100 ml-1">
                        <X className="w-3.5 h-3.5 text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Available inventory to pick from */}
            <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto p-3">
              {Object.entries(grouped).map(([category, items]) => (
                <div key={category} className="mb-3 last:mb-0">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{category}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {items.map(item => {
                      const isSelected = selectedIngredients.some(i => i.inventoryItemId === item.id);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          disabled={isSelected}
                          onClick={() => addIngredient(item)}
                          className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${
                            isSelected
                              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                              : 'bg-white text-gray-700 border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                          }`}
                        >
                          {item.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
              {inventoryItems.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">No inventory items yet. Add stock first.</p>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price (R)</label>
              <input
                type="number"
                required
                min="1"
                step="0.01"
                className="input-field bg-white"
                placeholder="What you charge customers"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
              <p className="text-xs text-gray-500 mt-1">You decide the price. Set it based on what customers in your area pay.</p>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-gray-200">
              <div>
                <p className="text-xs text-gray-500">Ingredient Cost</p>
                <p className="text-sm font-bold text-gray-900">R{costBase.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Profit</p>
                <p className={`text-sm font-bold ${profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  R{profit.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Margin</p>
                <p className={`text-sm font-bold ${margin >= 30 ? 'text-emerald-600' : margin >= 15 ? 'text-amber-600' : 'text-red-600'}`}>
                  {margin.toFixed(0)}%
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> Saving...</> : <><Save className="w-4 h-4 mr-1.5" /> {isEditing ? 'Update' : 'Add to Menu'}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
