'use client'
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import WasteAnalytics from './WasteAnalytics';
import WasteEntryForm from './WasteEntryForm';
import WasteLogTable from './WasteLogTable';

export const WasteTrackingPage = () => {
  const [showWasteEntry, setShowWasteEntry] = useState(false);
  const [activeTab, setActiveTab] = useState('log');

  const handleWasteSubmit = async (data: any) => {
    try {
      const reasonMap: Record<string, string> = {
        'Expired': 'EXPIRED',
        'Quality Issues': 'SPOILED',
        'Overproduction': 'OVERCOOKED',
        'Preparation Error': 'DROPPED',
        'Customer Returns': 'CUSTOMER_RETURN',
        'Other': 'OTHER',
        'Spoilage': 'SPOILED',
      };

      await fetch('/api/waste', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemName: data.itemName,
          category: data.category,
          quantity: Number(data.quantity),
          unit: data.unit,
          reason: reasonMap[data.reason] || 'OTHER',
          cost: Number(data.cost),
          notes: data.actionTaken || null,
          date: data.date,
        }),
      });
      setShowWasteEntry(false);
    } catch (error) {
      console.error('Error saving waste entry:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold">Waste Management</h1>
            <p className="text-gray-600">Track and manage food waste</p>
          </div>
          <button
            onClick={() => setShowWasteEntry(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Log Waste
          </button>
        </div>

        <div className="flex space-x-4 border-b">
          <button
            className={`px-4 py-2 ${activeTab === 'log' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('log')}
          >
            Waste Log
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'analytics' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {activeTab === 'log' ? <WasteLogTable /> : <WasteAnalytics />}
      </div>

      <WasteEntryForm
        isOpen={showWasteEntry}
        onClose={() => setShowWasteEntry(false)}
        onSubmit={handleWasteSubmit}
      />
    </div>
  );
}
