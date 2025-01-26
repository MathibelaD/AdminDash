'use client'
import React, { useState } from 'react';
import { 
    Wrench, 
  Plus, 
  AlertTriangle, 
  Calendar,
  Phone,
  FileText,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface Equipment {
  id: number;
  name: string;
  type: string;
  purchaseDate: string;
  lastMaintenance: string;
  nextMaintenance: string;
  status: 'operational' | 'maintenance' | 'repair' | 'replaced';
  supplier: string;
  supplierContact: string;
  warranty: string;
}

export default function EquipmentManagement() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Sample equipment data
  const [equipment, setEquipment] = useState<Equipment[]>([
    {
      id: 1,
      name: "Deep Fryer - Large",
      type: "Cooking",
      purchaseDate: "2023-06-15",
      lastMaintenance: "2024-01-10",
      nextMaintenance: "2024-04-10",
      status: "operational",
      supplier: "Kitchen Equipment Co",
      supplierContact: "011 234 5678",
      warranty: "2025-06-15"
    },
    {
      id: 2,
      name: "Commercial Refrigerator",
      type: "Storage",
      purchaseDate: "2023-04-20",
      lastMaintenance: "2024-01-05",
      nextMaintenance: "2024-04-05",
      status: "maintenance",
      supplier: "Cool Systems Ltd",
      supplierContact: "011 987 6543",
      warranty: "2025-04-20"
    }
  ]);

  // Get upcoming maintenance
  const upcomingMaintenance = equipment.filter(item => {
    const nextDate = new Date(item.nextMaintenance);
    const today = new Date();
    const diffDays = Math.ceil((nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 14; // Show equipment needing maintenance in next 14 days
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Equipment Management</h1>
          <p className="text-gray-600">Manage and track restaurant equipment</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Equipment
        </button>
      </div>

      {/* Maintenance Alerts */}
      {upcomingMaintenance.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-yellow-400 mr-2" />
            <h3 className="font-medium">Upcoming Maintenance Required</h3>
          </div>
          <div className="mt-2 space-y-2">
            {upcomingMaintenance.map(item => (
              <div key={item.id} className="flex items-center justify-between text-sm text-yellow-700">
                <span>{item.name}</span>
                <span>Due: {new Date(item.nextMaintenance).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Equipment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Wrench className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-600">Total Equipment</p>
          <p className="text-2xl font-bold">{equipment.length}</p>
        </div>

        {['operational', 'maintenance', 'repair'].map((status) => (
          <div key={status} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-lg ${
                status === 'operational' ? 'bg-green-100' : 
                status === 'maintenance' ? 'bg-yellow-100' : 'bg-red-100'
              }`}>
                <Wrench className={`w-6 h-6 ${
                  status === 'operational' ? 'text-green-600' : 
                  status === 'maintenance' ? 'text-yellow-600' : 'text-red-600'
                }`} />
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-600 capitalize">{status}</p>
            <p className="text-2xl font-bold">
              {equipment.filter(item => item.status === status).length}
            </p>
          </div>
        ))}
      </div>

      {/* Equipment List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Equipment List</h2>
            <select 
              className="border rounded-lg px-3 py-1"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="all">All Equipment</option>
              <option value="operational">Operational</option>
              <option value="maintenance">Needs Maintenance</option>
              <option value="repair">Needs Repair</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Maintenance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Next Due</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Warranty Until</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {equipment
                .filter(item => selectedFilter === 'all' || item.status === selectedFilter)
                .map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.supplier}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{item.type}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${item.status === 'operational' ? 'bg-green-100 text-green-800' :
                          item.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'}`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">{new Date(item.lastMaintenance).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{new Date(item.nextMaintenance).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{new Date(item.warranty).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <button className="text-blue-600 hover:text-blue-800">
                        View Details
                      </button>
                    </td>
                  </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}