'use client'
import React, { useState } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function SettingsPage() {
  const { data: session } = useSession();
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    restaurantName: 'Kota Restaurant',
    email: session?.user?.email || '',
    phone: '',
    address: '',
    taxRate: '15',
    currency: 'ZAR',
    timezone: 'Africa/Johannesburg',
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // TODO: Save settings to backend
    setTimeout(() => setSaving(false), 1000);
  };

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-600">Manage your restaurant settings</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* General Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">General</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name</label>
              <input type="text" className="w-full p-2 border rounded-lg" value={settings.restaurantName} onChange={(e) => setSettings({ ...settings, restaurantName: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" className="w-full p-2 border rounded-lg" value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input type="tel" className="w-full p-2 border rounded-lg" value={settings.phone} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input type="text" className="w-full p-2 border rounded-lg" value={settings.address} onChange={(e) => setSettings({ ...settings, address: e.target.value })} />
            </div>
          </div>
        </div>

        {/* Financial Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">Financial</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
              <input type="number" className="w-full p-2 border rounded-lg" value={settings.taxRate} onChange={(e) => setSettings({ ...settings, taxRate: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select className="w-full p-2 border rounded-lg" value={settings.currency} onChange={(e) => setSettings({ ...settings, currency: e.target.value })}>
                <option value="ZAR">ZAR (R)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
              <select className="w-full p-2 border rounded-lg" value={settings.timezone} onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}>
                <option value="Africa/Johannesburg">Africa/Johannesburg (SAST)</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400">
            {saving ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Saving...</> : <><Save className="w-5 h-5 mr-2" />Save Settings</>}
          </button>
        </div>
      </form>
    </div>
  );
}
