'use client'
import React from 'react';
import { Wrench, CheckCircle, AlertCircle } from 'lucide-react';

interface MaintenanceRecord {
  id: number;
  equipmentId: number;
  date: string;
  type: 'routine' | 'repair' | 'emergency';
  description: string;
  cost: number;
  technician: string;
  status: 'completed' | 'pending' | 'scheduled';
}

interface MaintenanceHistoryProps {
  equipmentId: number;
  equipmentName: string;
}

export default function MaintenanceHistory({ equipmentId, equipmentName }: MaintenanceHistoryProps) {
  // Sample maintenance records
  const maintenanceRecords: MaintenanceRecord[] = [
    {
      id: 1,
      equipmentId: 1,
      date: '2024-01-15',
      type: 'routine',
      description: 'Regular cleaning and inspection',
      cost: 350,
      technician: 'John Smith',
      status: 'completed'
    },
    {
      id: 2,
      equipmentId: 1,
      date: '2023-12-01',
      type: 'repair',
      description: 'Replaced heating element',
      cost: 1200,
      technician: 'Mike Johnson',
      status: 'completed'
    },
    {
      id: 3,
      equipmentId: 1,
      date: '2024-02-01',
      type: 'routine',
      description: 'Scheduled maintenance check',
      cost: 400,
      technician: 'John Smith',
      status: 'scheduled'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'scheduled':
        return <Wrench className="w-5 h-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'routine':
        return 'bg-blue-100 text-blue-800';
      case 'repair':
        return 'bg-red-100 text-red-800';
      case 'emergency':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-medium">{equipmentName}</h2>
            <p className="text-sm text-gray-500">Maintenance History</p>
          </div>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Wrench className="w-5 h-5 mr-2" />
            Schedule Maintenance
          </button>
        </div>
      </div>

      {/* Maintenance Records */}
      <div className="divide-y">
        {maintenanceRecords.map((record) => (
          <div key={record.id} className="p-6 hover:bg-gray-50">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(record.status)}
                  <span className="font-medium">{new Date(record.date).toLocaleDateString()}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(record.type)}`}>
                    {record.type.charAt(0).toUpperCase() + record.type.slice(1)}
                  </span>
                </div>
                <p className="mt-2 text-gray-600">{record.description}</p>
                <div className="mt-2 text-sm text-gray-500">
                  <p>Technician: {record.technician}</p>
                  <p>Cost: R{record.cost.toFixed(2)}</p>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-800 text-sm">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Section */}
      <div className="p-6 bg-gray-50 border-t">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Total Maintenance Cost</p>
            <p className="text-lg font-medium">
              R{maintenanceRecords
                .filter(record => record.status === 'completed')
                .reduce((sum, record) => sum + record.cost, 0)
                .toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Total Services</p>
            <p className="text-lg font-medium">{maintenanceRecords.length}</p>
          </div>
          <div>
            <p className="text-gray-500">Next Scheduled</p>
            <p className="text-lg font-medium">
              {maintenanceRecords
                .filter(record => record.status === 'scheduled')
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0]?.date || 'None'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}