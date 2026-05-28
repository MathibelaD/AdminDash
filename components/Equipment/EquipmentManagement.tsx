'use client'
import React, { useState, useEffect } from 'react';
import { Wrench, Plus, AlertTriangle, X, Save, Loader2 } from 'lucide-react';

interface Equipment {
  id: string;
  name: string;
  type: string;
  purchaseDate: string;
  lastMaintenance: string | null;
  nextMaintenance: string | null;
  status: string;
  supplier: string | null;
  supplierContact: string | null;
  warranty: string | null;
}

export default function EquipmentManagement() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [newEquipment, setNewEquipment] = useState({
    name: '', type: '', purchaseDate: '', lastMaintenance: '',
    nextMaintenance: '', supplier: '', supplierContact: '', warranty: '',
  });

  useEffect(() => { fetchEquipment(); }, []);

  const fetchEquipment = async () => {
    try {
      const res = await fetch('/api/equipment');
      const data = await res.json();
      if (!data.error) setEquipment(data);
    } catch (error) {
      console.error('Error fetching equipment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/equipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEquipment),
      });
      if (res.ok) {
        const saved = await res.json();
        setEquipment([saved, ...equipment]);
        setShowAddModal(false);
        setNewEquipment({ name: '', type: '', purchaseDate: '', lastMaintenance: '', nextMaintenance: '', supplier: '', supplierContact: '', warranty: '' });
      }
    } catch (error) {
      console.error('Error saving equipment:', error);
    } finally {
      setSaving(false);
    }
  };

  const upcomingMaintenance = equipment.filter(item => {
    if (!item.nextMaintenance) return false;
    const diffDays = Math.ceil((new Date(item.nextMaintenance).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return diffDays <= 14 && diffDays >= 0;
  });

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Equipment Management</h1>
          <p className="text-gray-600">Manage and track restaurant equipment</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-5 h-5 mr-2" />Add Equipment
        </button>
      </div>

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
                <span>Due: {new Date(item.nextMaintenance!).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="p-2 bg-blue-100 rounded-lg w-fit"><Wrench className="w-6 h-6 text-blue-600" /></div>
          <p className="mt-4 text-sm text-gray-600">Total Equipment</p>
          <p className="text-2xl font-bold">{equipment.length}</p>
        </div>
        {['OPERATIONAL', 'MAINTENANCE', 'REPAIR'].map((status) => (
          <div key={status} className="bg-white p-6 rounded-lg shadow">
            <div className={`p-2 rounded-lg w-fit ${status === 'OPERATIONAL' ? 'bg-green-100' : status === 'MAINTENANCE' ? 'bg-yellow-100' : 'bg-red-100'}`}>
              <Wrench className={`w-6 h-6 ${status === 'OPERATIONAL' ? 'text-green-600' : status === 'MAINTENANCE' ? 'text-yellow-600' : 'text-red-600'}`} />
            </div>
            <p className="mt-4 text-sm text-gray-600 capitalize">{status.toLowerCase()}</p>
            <p className="text-2xl font-bold">{equipment.filter(item => item.status === status).length}</p>
          </div>
        ))}
      </div>

      {/* Equipment Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium">Equipment List</h2>
          <select className="border rounded-lg px-3 py-1" value={selectedFilter} onChange={(e) => setSelectedFilter(e.target.value)}>
            <option value="all">All Equipment</option>
            <option value="OPERATIONAL">Operational</option>
            <option value="MAINTENANCE">Needs Maintenance</option>
            <option value="REPAIR">Needs Repair</option>
          </select>
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
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {equipment
                .filter(item => selectedFilter === 'all' || item.status === selectedFilter)
                .map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-500">{item.supplier}</div>
                    </td>
                    <td className="px-6 py-4">{item.type}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${item.status === 'OPERATIONAL' ? 'bg-green-100 text-green-800' :
                          item.status === 'MAINTENANCE' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{item.lastMaintenance ? new Date(item.lastMaintenance).toLocaleDateString() : '-'}</td>
                    <td className="px-6 py-4">{item.nextMaintenance ? new Date(item.nextMaintenance).toLocaleDateString() : '-'}</td>
                    <td className="px-6 py-4">{item.warranty ? new Date(item.warranty).toLocaleDateString() : '-'}</td>
                  </tr>
              ))}
            </tbody>
          </table>
          {equipment.length === 0 && (
            <div className="text-center py-8 text-gray-500">No equipment found</div>
          )}
        </div>
      </div>

      {/* Add Equipment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Add New Equipment</h3>
              <button onClick={() => setShowAddModal(false)}><X className="w-6 h-6 text-gray-500" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input type="text" required className="w-full p-2 border rounded-lg" value={newEquipment.name} onChange={(e) => setNewEquipment({ ...newEquipment, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select required className="w-full p-2 border rounded-lg" value={newEquipment.type} onChange={(e) => setNewEquipment({ ...newEquipment, type: e.target.value })}>
                    <option value="">Select Type</option>
                    <option value="Cooking">Cooking</option>
                    <option value="Storage">Storage</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date</label>
                  <input type="date" required className="w-full p-2 border rounded-lg" value={newEquipment.purchaseDate} onChange={(e) => setNewEquipment({ ...newEquipment, purchaseDate: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Warranty Until</label>
                  <input type="date" className="w-full p-2 border rounded-lg" value={newEquipment.warranty} onChange={(e) => setNewEquipment({ ...newEquipment, warranty: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                  <input type="text" className="w-full p-2 border rounded-lg" value={newEquipment.supplier} onChange={(e) => setNewEquipment({ ...newEquipment, supplier: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Contact</label>
                  <input type="text" className="w-full p-2 border rounded-lg" value={newEquipment.supplierContact} onChange={(e) => setNewEquipment({ ...newEquipment, supplierContact: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Next Maintenance</label>
                  <input type="date" className="w-full p-2 border rounded-lg" value={newEquipment.nextMaintenance} onChange={(e) => setNewEquipment({ ...newEquipment, nextMaintenance: e.target.value })} />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" disabled={saving} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400">
                  {saving ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Saving...</> : <><Save className="w-5 h-5 mr-2" />Save</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
