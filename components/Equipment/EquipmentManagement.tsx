'use client'
import React, { useState, useEffect } from 'react';
import { Wrench, Plus, AlertTriangle, X, Save, Loader2, Edit, Trash2, Calendar } from 'lucide-react';
import ConfirmModal from '../ui/ConfirmModal';

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
  notes: string | null;
}

const EQUIPMENT_TYPES = [
  'Deep Fryer',
  'Gas Stove',
  'Chip Cutter',
  'Fridge/Freezer',
  'Display Counter',
  'Microwave',
  'Bread Slicer',
  'Scale',
  'Generator',
  'Gas Cylinder',
  'Prep Table',
  'Other',
];

const STATUS_OPTIONS = [
  { value: 'OPERATIONAL', label: 'Operational' },
  { value: 'MAINTENANCE', label: 'Needs Maintenance' },
  { value: 'REPAIR', label: 'Needs Repair' },
  { value: 'REPLACED', label: 'Replaced' },
];

export default function EquipmentManagement() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Equipment | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Equipment | null>(null);
  const [saving, setSaving] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [formData, setFormData] = useState({
    name: '', type: '', purchaseDate: '', lastMaintenance: '',
    nextMaintenance: '', supplier: '', supplierContact: '', warranty: '', notes: '', status: 'OPERATIONAL',
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

  const openAdd = () => {
    setEditingItem(null);
    setFormData({ name: '', type: '', purchaseDate: '', lastMaintenance: '', nextMaintenance: '', supplier: '', supplierContact: '', warranty: '', notes: '', status: 'OPERATIONAL' });
    setShowModal(true);
  };

  const openEdit = (item: Equipment) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      type: item.type,
      purchaseDate: item.purchaseDate ? item.purchaseDate.split('T')[0] : '',
      lastMaintenance: item.lastMaintenance ? item.lastMaintenance.split('T')[0] : '',
      nextMaintenance: item.nextMaintenance ? item.nextMaintenance.split('T')[0] : '',
      supplier: item.supplier || '',
      supplierContact: item.supplierContact || '',
      warranty: item.warranty ? item.warranty.split('T')[0] : '',
      notes: item.notes || '',
      status: item.status,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = editingItem ? 'PUT' : 'POST';
      const body = editingItem ? { id: editingItem.id, ...formData } : formData;
      const res = await fetch('/api/equipment', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setShowModal(false);
        fetchEquipment();
      }
    } catch (error) {
      console.error('Error saving equipment:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/equipment?id=${deleteTarget.id}`, { method: 'DELETE' });
      if (res.ok) setEquipment(equipment.filter(e => e.id !== deleteTarget.id));
    } catch (error) {
      console.error('Error deleting equipment:', error);
    } finally {
      setDeleteTarget(null);
    }
  };

  const upcomingMaintenance = equipment.filter(item => {
    if (!item.nextMaintenance) return false;
    const diffDays = Math.ceil((new Date(item.nextMaintenance).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return diffDays <= 14 && diffDays >= 0;
  });

  const overdueMaintenance = equipment.filter(item => {
    if (!item.nextMaintenance) return false;
    return new Date(item.nextMaintenance).getTime() < Date.now();
  });

  const filtered = equipment.filter(item => selectedFilter === 'all' || item.status === selectedFilter);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Equipment</h1>
          <p className="text-sm text-gray-500 mt-1">{equipment.length} items tracked</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus className="w-4 h-4 mr-1.5" /> Add Equipment
        </button>
      </div>

      {/* Alerts */}
      {overdueMaintenance.length > 0 && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-800">Overdue Maintenance ({overdueMaintenance.length})</p>
            <div className="mt-1 space-y-0.5">
              {overdueMaintenance.map(item => (
                <p key={item.id} className="text-sm text-red-700">
                  {item.name} — was due {new Date(item.nextMaintenance!).toLocaleDateString('en-ZA')}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {upcomingMaintenance.length > 0 && (
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <Calendar className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Upcoming Maintenance ({upcomingMaintenance.length})</p>
            <div className="mt-1 space-y-0.5">
              {upcomingMaintenance.map(item => (
                <p key={item.id} className="text-sm text-amber-700">
                  {item.name} — due {new Date(item.nextMaintenance!).toLocaleDateString('en-ZA')}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <Wrench className="w-5 h-5 text-white" />
          </div>
          <p className="mt-4 text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold text-gray-900">{equipment.length}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-gray-500">Operational</p>
          <p className="text-2xl font-bold text-emerald-600">{equipment.filter(e => e.status === 'OPERATIONAL').length}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-gray-500">Maintenance</p>
          <p className="text-2xl font-bold text-amber-600">{equipment.filter(e => e.status === 'MAINTENANCE').length}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-gray-500">Repair</p>
          <p className="text-2xl font-bold text-red-600">{equipment.filter(e => e.status === 'REPAIR').length}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit">
        {[{ value: 'all', label: 'All' }, ...STATUS_OPTIONS].map(s => (
          <button
            key={s.value}
            onClick={() => setSelectedFilter(s.value)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${selectedFilter === s.value ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="table-container">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">Equipment</th>
                <th className="table-header">Type</th>
                <th className="table-header">Status</th>
                <th className="table-header">Last Service</th>
                <th className="table-header">Next Due</th>
                <th className="table-header">Warranty</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, index) => (
                <tr key={item.id} className={`transition-colors hover:bg-orange-50/60 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                  <td className="table-cell">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    {item.supplier && <p className="text-xs text-gray-500">{item.supplier}</p>}
                  </td>
                  <td className="table-cell">{item.type}</td>
                  <td className="table-cell">
                    <span className={
                      item.status === 'OPERATIONAL' ? 'badge badge-success' :
                      item.status === 'MAINTENANCE' ? 'badge badge-warning' :
                      item.status === 'REPAIR' ? 'badge badge-danger' :
                      'badge badge-neutral'
                    }>
                      {item.status}
                    </span>
                  </td>
                  <td className="table-cell text-gray-500">{item.lastMaintenance ? new Date(item.lastMaintenance).toLocaleDateString('en-ZA') : '—'}</td>
                  <td className="table-cell text-gray-500">{item.nextMaintenance ? new Date(item.nextMaintenance).toLocaleDateString('en-ZA') : '—'}</td>
                  <td className="table-cell text-gray-500">{item.warranty ? new Date(item.warranty).toLocaleDateString('en-ZA') : '—'}</td>
                  <td className="table-cell">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteTarget(item)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors">
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
          <div className="py-12 text-center text-gray-400 text-sm">No equipment found</div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-gray-900">{editingItem ? 'Edit Equipment' : 'Add Equipment'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input type="text" required className="input-field" placeholder="e.g. Main Deep Fryer" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select required className="input-field" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                    <option value="">Select Type</option>
                    {EQUIPMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                {editingItem && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select className="input-field" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                      {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date</label>
                  <input type="date" required className="input-field" value={formData.purchaseDate} onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Warranty Until</label>
                  <input type="date" className="input-field" value={formData.warranty} onChange={(e) => setFormData({ ...formData, warranty: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                  <input type="text" className="input-field" value={formData.supplier} onChange={(e) => setFormData({ ...formData, supplier: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Contact</label>
                  <input type="text" className="input-field" placeholder="Phone or email" value={formData.supplierContact} onChange={(e) => setFormData({ ...formData, supplierContact: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Maintenance</label>
                  <input type="date" className="input-field" value={formData.lastMaintenance} onChange={(e) => setFormData({ ...formData, lastMaintenance: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Next Maintenance</label>
                  <input type="date" className="input-field" value={formData.nextMaintenance} onChange={(e) => setFormData({ ...formData, nextMaintenance: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea className="input-field h-20 resize-none" placeholder="Serial number, special instructions, etc." value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary">
                  {saving ? <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> Saving...</> : <><Save className="w-4 h-4 mr-1.5" /> {editingItem ? 'Update' : 'Add'}</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Equipment"
        message={`This will permanently remove "${deleteTarget?.name}" from your equipment list. This cannot be undone.`}
        confirmLabel="Yes, delete it"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
