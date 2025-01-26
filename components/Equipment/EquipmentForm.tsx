'use client'
import React, { useState } from 'react';
import { X, Save, Calendar } from 'lucide-react';

interface EquipmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (equipment: any) => void;
  editData?: any;
}

export default function EquipmentForm({ isOpen, onClose, onSave, editData }: EquipmentFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    purchaseDate: '',
    lastMaintenance: '',
    nextMaintenance: '',
    status: 'operational',
    supplier: '',
    supplierContact: '',
    warranty: '',
    maintenanceNotes: '',
    ...editData
  });

  const equipmentTypes = [
    'Cooking',
    'Storage',
    'Preparation',
    'Serving',
    'Cleaning',
    'Safety',
    'Other'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {editData ? 'Edit Equipment' : 'Add New Equipment'}
          </h2>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          onSave(formData);
        }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Equipment Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Equipment Name
              </label>
              <input
                type="text"
                required
                className="w-full p-2 border rounded-lg"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            {/* Equipment Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Equipment Type
              </label>
              <select
                required
                className="w-full p-2 border rounded-lg"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="">Select Type</option>
                {equipmentTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Purchase Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Purchase Date
              </label>
              <input
                type="date"
                required
                className="w-full p-2 border rounded-lg"
                value={formData.purchaseDate}
                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
              />
            </div>

            {/* Warranty Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Warranty Until
              </label>
              <input
                type="date"
                required
                className="w-full p-2 border rounded-lg"
                value={formData.warranty}
                onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
              />
            </div>

            {/* Supplier */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supplier
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-lg"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              />
            </div>

            {/* Supplier Contact */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supplier Contact
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-lg"
                value={formData.supplierContact}
                onChange={(e) => setFormData({ ...formData, supplierContact: e.target.value })}
              />
            </div>

            {/* Last Maintenance */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Maintenance
              </label>
              <input
                type="date"
                required
                className="w-full p-2 border rounded-lg"
                value={formData.lastMaintenance}
                onChange={(e) => setFormData({ ...formData, lastMaintenance: e.target.value })}
              />
            </div>

            {/* Next Maintenance */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Next Maintenance Due
              </label>
              <input
                type="date"
                required
                className="w-full p-2 border rounded-lg"
                value={formData.nextMaintenance}
                onChange={(e) => setFormData({ ...formData, nextMaintenance: e.target.value })}
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Status
              </label>
              <select
                required
                className="w-full p-2 border rounded-lg"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="operational">Operational</option>
                <option value="maintenance">Needs Maintenance</option>
                <option value="repair">Needs Repair</option>
                <option value="replaced">Replaced</option>
              </select>
            </div>
          </div>

          {/* Maintenance Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maintenance Notes
            </label>
            <textarea
              rows={4}
              className="w-full p-2 border rounded-lg"
              value={formData.maintenanceNotes}
              onChange={(e) => setFormData({ ...formData, maintenanceNotes: e.target.value })}
              placeholder="Enter any maintenance history or special notes..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mt-6">
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
              {editData ? 'Save Changes' : 'Add Equipment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}