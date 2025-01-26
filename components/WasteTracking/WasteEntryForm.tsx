'use client'
import React, { useState } from 'react';
import { X, Save } from 'lucide-react';

interface WasteEntryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export default function WasteEntryForm({ isOpen, onClose, onSubmit }: WasteEntryFormProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    itemName: '',
    category: '',
    quantity: '',
    unit: 'kg',
    reason: '',
    cost: '',
    actionTaken: '',
  });

  const categories = [
    'Ingredients',
    'Prepared Food',
    'Expired Items',
    'Damaged Items',
    'Other'
  ];

  const reasons = [
    'Expired',
    'Overproduction',
    'Quality Issues',
    'Spoilage',
    'Customer Returns',
    'Preparation Error',
    'Other'
  ];

  const units = ['kg', 'g', 'units', 'portions'];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Log Waste Entry</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          onSubmit(formData);
        }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                required
                className="w-full p-2 border rounded-lg"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                required
                className="w-full p-2 border rounded-lg"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Item Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Name
              </label>
              <input
                type="text"
                required
                className="w-full p-2 border rounded-lg"
                value={formData.itemName}
                onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                placeholder="Enter item name"
              />
            </div>

            {/* Quantity and Unit */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  className="w-full p-2 border rounded-lg"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit
                </label>
                <select
                  required
                  className="w-full p-2 border rounded-lg"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                >
                  {units.map((unit) => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Cost */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cost (R)
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                className="w-full p-2 border rounded-lg"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                placeholder="Enter cost"
              />
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason
              </label>
              <select
                required
                className="w-full p-2 border rounded-lg"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              >
                <option value="">Select Reason</option>
                {reasons.map((reason) => (
                  <option key={reason} value={reason}>{reason}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Taken */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Action Taken / Prevention Notes
            </label>
            <textarea
              className="w-full p-2 border rounded-lg"
              rows={3}
              value={formData.actionTaken}
              onChange={(e) => setFormData({ ...formData, actionTaken: e.target.value })}
              placeholder="Enter any actions taken to prevent future waste..."
            />
          </div>

          {/* Submit Button */}
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
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Save className="w-5 h-5 mr-2" />
              Save Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}