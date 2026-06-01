'use client'
import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  ingredients: number[];
  status: string;
  type: string;
}

interface MenuTableProps {
  items: MenuItem[];
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  searchQuery: string;
  selectedCategory: string;
}

export default function MenuTable({ items, onEdit, onDelete, searchQuery, selectedCategory }: MenuTableProps) {
  const router = useRouter();

  const filtered = items.filter(item =>
    (selectedCategory === 'All' || item.category === selectedCategory) &&
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="table-container">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="table-header">Name</th>
              <th className="table-header">Category</th>
              <th className="table-header">Price</th>
              <th className="table-header">Status</th>
              <th className="table-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, index) => (
              <tr
                key={item.id}
                className={`cursor-pointer transition-colors hover:bg-orange-50/60 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                onClick={() => router.push(`/dashboard/menus/${item.id}`)}
              >
                <td className="table-cell font-medium text-gray-900">{item.name}</td>
                <td className="table-cell">{item.category}</td>
                <td className="table-cell">R{item.price.toFixed(2)}</td>
                <td className="table-cell">
                  <span className={
                    item.status === 'Available' ? 'badge badge-success' :
                    item.status === 'Out of Stock' ? 'badge badge-danger' :
                    'badge badge-warning'
                  }>
                    {item.status}
                  </span>
                </td>
                <td className="table-cell">
                  <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => onEdit(item)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(item.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filtered.length === 0 && (
        <div className="py-12 text-center text-gray-400 text-sm">No menu items found</div>
      )}
    </div>
  );
}
