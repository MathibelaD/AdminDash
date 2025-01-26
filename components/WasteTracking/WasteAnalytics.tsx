'use client'
import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

export default function WasteAnalytics() {
  const [timeFrame, setTimeFrame] = useState('month');

  // Sample data for charts
  const wasteTrendData = [
    { date: '01/15', cost: 450 },
    { date: '01/16', cost: 300 },
    { date: '01/17', cost: 600 },
    { date: '01/18', cost: 250 },
    { date: '01/19', cost: 400 },
    { date: '01/20', cost: 350 },
    { date: '01/21', cost: 500 },
  ];

  const categoryData = [
    { name: 'Ingredients', value: 35 },
    { name: 'Prepared Food', value: 25 },
    { name: 'Expired Items', value: 20 },
    { name: 'Damaged Items', value: 15 },
    { name: 'Other', value: 5 },
  ];

  const reasonData = [
    { reason: 'Expired', amount: 2500 },
    { reason: 'Overproduction', amount: 1800 },
    { reason: 'Quality Issues', amount: 1200 },
    { reason: 'Preparation Error', amount: 900 },
    { reason: 'Customer Returns', amount: 600 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      {/* Time Frame Selector */}
      <div className="flex justify-end">
        <select
          className="px-4 py-2 border rounded-lg"
          value={timeFrame}
          onChange={(e) => setTimeFrame(e.target.value)}
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-600">Total Waste Cost</h3>
          <p className="text-2xl font-bold">R5,800</p>
          <p className="text-sm text-red-600 mt-2">↑ 12% vs last period</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-600">Average Daily Waste</h3>
          <p className="text-2xl font-bold">R410</p>
          <p className="text-sm text-green-600 mt-2">↓ 5% vs last period</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-600">Most Wasted Item</h3>
          <p className="text-2xl font-bold">Bread Rolls</p>
          <p className="text-sm text-gray-600 mt-2">15% of total waste</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-600">Primary Waste Reason</h3>
          <p className="text-2xl font-bold">Expired</p>
          <p className="text-sm text-gray-600 mt-2">35% of cases</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Waste Trend Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Daily Waste Cost Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={wasteTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="cost" 
                  stroke="#2563eb"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Waste by Category</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Waste by Reason */}
        <div className="bg-white p-6 rounded-lg shadow col-span-full">
          <h3 className="text-lg font-medium mb-4">Waste by Reason</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reasonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="reason" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recommendations Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Recommendations</h3>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium">Reduce Bread Roll Waste</h4>
            <p className="text-sm text-gray-600 mt-1">
              Consider adjusting order quantities for bread rolls. Current waste rate is 15% above target.
            </p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-medium">Review Storage Procedures</h4>
            <p className="text-sm text-gray-600 mt-1">
              35% of waste is due to expiration. Implement better FIFO practices and storage monitoring.
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium">Optimize Prep Quantities</h4>
            <p className="text-sm text-gray-600 mt-1">
              Consider preparing smaller batches more frequently during off-peak hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}