'use client'
import React, { useState } from 'react';
import { Search, FileDown, Edit, Trash2 } from 'lucide-react';

interface WasteLog {
  id: number;
  date: string;
  itemName: string;
  category: string;
  quantity: number;
  unit: string;
  reason: string;
  cost: number;
  actionTaken: string;
}

export default function WasteLogTable() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [dateRange, setDateRange] = useState('week');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  // Sample waste log data
  const wasteLogs: WasteLog[] = [
    {
      id: 1,
      date: '2024-01-15',
      itemName: 'Bread Rolls',
      category: 'Ingredients',
      quantity: 5,
      unit: 'kg',
      reason: 'Expired',
      cost: 150,
      actionTaken: 'Adjusted order quantities'
    },
    {
      id: 2,
      date: '2024-01-14',
      itemName: 'Prepared Kotas',
      category: 'Prepared Food',
      quantity: 3,
      unit: 'units',
      reason: 'Overproduction',
      cost: 180,
      actionTaken: 'Updated demand forecasting'
    },
    {
      id: 3,
      date: '2024-01-13',
      itemName: 'Cheese Slices',
      category: 'Ingredients',
      quantity: 2,
      unit: 'kg',
      reason: 'Quality Issues',
      cost: 120,
      actionTaken: 'Changed supplier'
    },
    {
      id: 4,
      date: '2024-01-12',
      itemName: 'Russian Sausages',
      category: 'Ingredients',
      quantity: 4,
      unit: 'kg',
      reason: 'Storage Error',
      cost: 240,
      actionTaken: 'Fixed freezer temperature'
    }
  ];

  const categories = ['all', 'Ingredients', 'Prepared Food', 'Expired Items', 'Damaged Items', 'Other'];
  const dateRanges = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' }
  ];

  // Sorting function
  const sortData = (data: WasteLog[]) => {
    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof WasteLog];
      const bValue = b[sortConfig.key as keyof WasteLog];
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  // Filter function
  const filteredLogs = wasteLogs.filter(log => {
    const matchesSearch = 
      log.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.reason.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || log.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedLogs = sortData(filteredLogs);

  // Calculate statistics
  const totalWasteCost = filteredLogs.reduce((sum, log) => sum + log.cost, 0);
  const totalItems = filteredLogs.length;

  // Group by reason to find most common
  const reasonCounts = filteredLogs.reduce((acc, log) => {
    acc[log.reason] = (acc[log.reason] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const mostCommonReason = Object.entries(reasonCounts).reduce((a, b) => 
    a[1] > b[1] ? a : b
  )[0];

  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const handleExport = () => {
    // Implement export functionality
    console.log('Exporting data...');
  };

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search waste logs..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 border rounded-lg min-w-[150px]"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
        <select
          className="px-4 py-2 border rounded-lg min-w-[150px]"
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
        >
          {dateRanges.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
        <button 
          onClick={handleExport}
          className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <FileDown className="w-5 h-5 mr-2" />
          Export
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Total Waste Cost</p>
          <p className="text-2xl font-bold">R{totalWasteCost.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Total Items Wasted</p>
          <p className="text-2xl font-bold">{totalItems}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Most Common Reason</p>
          <p className="text-2xl font-bold">{mostCommonReason}</p>
        </div>
      </div>

      {/* Waste Log Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('date')}
                >
                  Date
                  {sortConfig.key === 'date' && (
                    <span className="ml-1">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('itemName')}
                >
                  Item
                  {sortConfig.key === 'itemName' && (
                    <span className="ml-1">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('cost')}
                >
                  Cost (R)
                  {sortConfig.key === 'cost' && (
                    <span className="ml-1">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action Taken</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{new Date(log.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{log.itemName}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${log.category === 'Ingredients' ? 'bg-blue-100 text-blue-800' :
                        log.category === 'Prepared Food' ? 'bg-green-100 text-green-800' :
                        log.category === 'Expired Items' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'}`}>
                      {log.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">{log.quantity} {log.unit}</td>
                  <td className="px-6 py-4">{log.reason}</td>
                  <td className="px-6 py-4">R{log.cost.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600 max-w-xs truncate" title={log.actionTaken}>
                      {log.actionTaken}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No waste logs found
          </div>
        )}
      </div>
    </div>
  );
}