'use client'
import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { availableIngredients } from '../data/menu-data';



interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  ingredients: number[];
  status: string;
  type: string;
  drinks?: number[];
  sides?: number[];
}

interface MenuTableProps {
  items: MenuItem[];
  onEdit: (item: MenuItem) => void;
  onDelete: (id: number) => void;
  searchQuery: string;
  selectedCategory: string;
}

export default function MenuTable({ items, onEdit, onDelete, searchQuery, selectedCategory }: MenuTableProps) {
  const getIngredientNames = (ingredientIds: number[]) => {
    return ingredientIds
      .map(id => availableIngredients.find(ing => ing.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full text-left">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-4 text-sm font-medium text-gray-500">Name</th>
            <th className="px-6 py-4 text-sm font-medium text-gray-500">Category</th>
            <th className="px-6 py-4 text-sm font-medium text-gray-500">Type</th>
            <th className="px-6 py-4 text-sm font-medium text-gray-500">Price (R)</th>
            <th className="px-6 py-4 text-sm font-medium text-gray-500">Ingredients</th>
            <th className="px-6 py-4 text-sm font-medium text-gray-500">Status</th>
            <th className="px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {items
            .filter(item => 
              (selectedCategory === 'All' || item.category === selectedCategory) &&
              item.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{item.name}</td>
                <td className="px-6 py-4">{item.category}</td>
                <td className="px-6 py-4 capitalize">{item.type}</td>
                <td className="px-6 py-4">R{item.price.toFixed(2)}</td>
                <td className="px-6 py-4 max-w-xs truncate">
                  {getIngredientNames(item.ingredients)}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full
                    ${item.status === 'Available' ? 'bg-green-100 text-green-800' : 
                      item.status === 'Out of Stock' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => onEdit(item)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onDelete(item.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}