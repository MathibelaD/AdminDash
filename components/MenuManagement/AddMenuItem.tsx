'use client'
import React, { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { availableIngredients, drinks } from '../data/menu-data';

interface MenuCategory {
  id: string;
  name: string;
}

interface AddMenuItemProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newItem: any) => void;
}

export default function AddMenuItem({ isOpen, onClose, onAdd }: AddMenuItemProps) {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [saving, setSaving] = useState(false);
  const [isMeal, setIsMeal] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState<number[]>([]);
  const [selectedDrink, setSelectedDrink] = useState<number>(0);
  const [selectedSides, setSelectedSides] = useState<number[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    price: '',
    costPerUnit: '',
    isAvailable: true,
  });

  useEffect(() => {
    if (isOpen) {
      fetch('/api/menu/categories')
        .then(res => res.json())
        .then(data => { if (!data.error) setCategories(data); })
        .catch(console.error);
    }
  }, [isOpen]);

  const calculatePrice = () => {
    const ingredientsTotal = selectedIngredients.reduce((sum, id) => {
      const ingredient = availableIngredients.find(ing => ing.id === id);
      return sum + (ingredient?.price || 0);
    }, 0);
    const drinksTotal = isMeal ? drinks.find(d => d.id === selectedDrink)?.price || 0 : 0;
    const sidesTotal = selectedSides.reduce((sum, id) => {
      const side = availableIngredients.find(ing => ing.id === id);
      return sum + (side?.price || 0);
    }, 0);
    return (ingredientsTotal + drinksTotal + sidesTotal) * 1.3;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const calculatedPrice = formData.price ? Number(formData.price) : calculatePrice();
    const costPerUnit = formData.costPerUnit ? Number(formData.costPerUnit) : calculatedPrice / 1.3;

    try {
      const res = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description || null,
          categoryId: formData.categoryId,
          price: calculatedPrice,
          costPerUnit,
          isAvailable: formData.isAvailable,
        }),
      });

      if (res.ok) {
        const saved = await res.json();
        onAdd(saved);
        // Reset form
        setFormData({ name: '', description: '', categoryId: '', price: '', costPerUnit: '', isAvailable: true });
        setSelectedIngredients([]);
        setSelectedDrink(0);
        setSelectedSides([]);
        onClose();
      }
    } catch (error) {
      console.error('Error adding menu item:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Menu Item</h2>
          <button onClick={onClose}><X className="w-6 h-6 text-gray-500" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type Selection */}
          <div className="flex gap-4 mb-4">
            <button type="button" onClick={() => setIsMeal(false)} className={`flex-1 py-2 rounded-lg ${!isMeal ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
              Single Item
            </button>
            <button type="button" onClick={() => setIsMeal(true)} className={`flex-1 py-2 rounded-lg ${isMeal ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
              Meal Combo
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
              <input type="text" required className="w-full p-2 border rounded-lg" placeholder="Enter item name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select required className="w-full p-2 border rounded-lg" value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}>
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (R) — leave blank to auto-calculate</label>
              <input type="number" step="0.01" min="0" className="w-full p-2 border rounded-lg" placeholder="Auto from ingredients" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cost Per Unit (R)</label>
              <input type="number" step="0.01" min="0" className="w-full p-2 border rounded-lg" placeholder="Auto from ingredients" value={formData.costPerUnit} onChange={(e) => setFormData({ ...formData, costPerUnit: e.target.value })} />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input type="text" className="w-full p-2 border rounded-lg" placeholder="Brief description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </div>
          </div>

          {/* Ingredients Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ingredients (for price calculation)</label>
            <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(
                  availableIngredients.reduce((acc: { [key: string]: any[] }, curr) => {
                    if (!acc[curr.category]) acc[curr.category] = [];
                    acc[curr.category].push(curr);
                    return acc;
                  }, {})
                ).map(([category, items]) => (
                  <div key={category}>
                    <h3 className="font-medium text-gray-700 mb-2">{category}</h3>
                    {items.map((ingredient) => (
                      <label key={ingredient.id} className="flex items-center space-x-2 mb-2">
                        <input type="checkbox" className="rounded border-gray-300" checked={selectedIngredients.includes(ingredient.id)} onChange={(e) => {
                          if (e.target.checked) setSelectedIngredients([...selectedIngredients, ingredient.id]);
                          else setSelectedIngredients(selectedIngredients.filter(id => id !== ingredient.id));
                        }} />
                        <span className="text-sm">{ingredient.name} - R{ingredient.price.toFixed(2)}</span>
                      </label>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Meal Options */}
          {isMeal && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Drink</label>
                <select className="w-full p-2 border rounded-lg" value={selectedDrink} onChange={(e) => setSelectedDrink(Number(e.target.value))}>
                  <option value={0}>Select a drink</option>
                  {drinks.map(drink => (
                    <option key={drink.id} value={drink.id}>{drink.name} - R{drink.price.toFixed(2)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Sides</label>
                <div className="border rounded-lg p-4">
                  {availableIngredients.filter(item => item.category === 'Sides').map(side => (
                    <label key={side.id} className="flex items-center space-x-2 mb-2">
                      <input type="checkbox" className="rounded border-gray-300" checked={selectedSides.includes(side.id)} onChange={(e) => {
                        if (e.target.checked) setSelectedSides([...selectedSides, side.id]);
                        else setSelectedSides(selectedSides.filter(id => id !== side.id));
                      }} />
                      <span className="text-sm">{side.name} - R{side.price.toFixed(2)}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Price Display */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Calculated Price:</span>
              <span className="text-xl font-bold text-blue-600">
                R{(formData.price ? Number(formData.price) : calculatePrice()).toFixed(2)}
              </span>
            </div>
            {!formData.price && (
              <p className="text-sm text-gray-500 mt-1">Price includes 30% markup on base ingredients cost</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
            <button type="submit" disabled={saving} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400">
              {saving ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Saving...</> : <><Save className="w-5 h-5 mr-2" />Add Item</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
