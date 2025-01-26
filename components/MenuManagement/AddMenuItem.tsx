'use client'
import React, { useState } from 'react';
import { availableIngredients, drinks, categories } from '../data/menu-data';



interface AddMenuItemProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newItem: any) => void;
}

export default function AddMenuItem({ isOpen, onClose, onAdd }: AddMenuItemProps) {
  const [isMeal, setIsMeal] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState<number[]>([]);
  const [selectedDrink, setSelectedDrink] = useState<number>(0);
  const [selectedSides, setSelectedSides] = useState<number[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Kota',
    status: 'Available'
  });

  const calculatePrice = (ingredients: number[], isDrink = false, sides: number[] = []) => {
    const ingredientsTotal = ingredients.reduce((sum, id) => {
      const ingredient = availableIngredients.find(ing => ing.id === id);
      return sum + (ingredient?.price || 0);
    }, 0);

    const drinksTotal = isDrink ? drinks.find(d => d.id === selectedDrink)?.price || 0 : 0;
    
    const sidesTotal = sides.reduce((sum, id) => {
      const side = availableIngredients.find(ing => ing.id === id);
      return sum + (side?.price || 0);
    }, 0);

    return (ingredientsTotal + drinksTotal + sidesTotal) * 1.3; // 30% markup
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem = {
      ...formData,
      id: Date.now(),
      price: calculatePrice(selectedIngredients, isMeal, selectedSides),
      ingredients: selectedIngredients,
      type: isMeal ? 'meal' : 'item',
      ...(isMeal && {
        drinks: [selectedDrink],
        sides: selectedSides
      })
    };
    onAdd(newItem);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Add New Menu Item</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type Selection */}
          <div className="flex gap-4 mb-4">
            <button
              type="button"
              onClick={() => setIsMeal(false)}
              className={`flex-1 py-2 rounded-lg ${!isMeal ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
            >
              Single Item
            </button>
            <button
              type="button"
              onClick={() => setIsMeal(true)}
              className={`flex-1 py-2 rounded-lg ${isMeal ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
            >
              Meal Combo
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Item Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded-lg"
                placeholder="Enter item name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            
            <div>
              <label className="block mb-1">Category</label>
              <select 
                className="w-full p-2 border rounded-lg"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                {categories
                  .filter(cat => cat !== 'All')
                  .map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))
                }
              </select>
            </div>

            <div>
              <label className="block mb-1">Status</label>
              <select 
                className="w-full p-2 border rounded-lg"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <option>Available</option>
                <option>Out of Stock</option>
                <option>Coming Soon</option>
              </select>
            </div>
          </div>

          {/* Ingredients Selection */}
          <div>
            <label className="block mb-1">Ingredients</label>
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
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={selectedIngredients.includes(ingredient.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedIngredients([...selectedIngredients, ingredient.id]);
                            } else {
                              setSelectedIngredients(
                                selectedIngredients.filter(id => id !== ingredient.id)
                              );
                            }
                          }}
                        />
                        <span className="text-sm">
                          {ingredient.name} - R{ingredient.price.toFixed(2)}
                        </span>
                      </label>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Meal Specific Options */}
          {isMeal && (
            <>
              <div>
                <label className="block mb-1">Select Drink</label>
                <select 
                  className="w-full p-2 border rounded-lg"
                  value={selectedDrink}
                  onChange={(e) => setSelectedDrink(Number(e.target.value))}
                >
                  <option value={0}>Select a drink</option>
                  {drinks.map(drink => (
                    <option key={drink.id} value={drink.id}>
                      {drink.name} - R{drink.price.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1">Select Sides</label>
                <div className="border rounded-lg p-4">
                  {availableIngredients
                    .filter(item => item.category === 'Sides')
                    .map(side => (
                      <label key={side.id} className="flex items-center space-x-2 mb-2">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={selectedSides.includes(side.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSides([...selectedSides, side.id]);
                            } else {
                              setSelectedSides(
                                selectedSides.filter(id => id !== side.id)
                              );
                            }
                          }}
                        />
                        <span className="text-sm">
                          {side.name} - R{side.price.toFixed(2)}
                        </span>
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
                R{calculatePrice(selectedIngredients, isMeal, selectedSides).toFixed(2)}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Price includes 30% markup on base ingredients cost
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
