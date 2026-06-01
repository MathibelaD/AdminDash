'use client'
import React, { useEffect, useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { DollarSign, TrendingUp, Package, ShoppingCart, Loader2 } from 'lucide-react';

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  inventoryValue: number;
  avgOrderValue: number;
  dailyRevenue: { date: string; revenue: number; orders: number }[];
  topItems: { name: string; quantity: number; revenue: number }[];
  categoryBreakdown: { category: string; value: number }[];
}

const COLORS = ['#e85d04', '#f48c06', '#ffba08', '#2563eb', '#7c3aed', '#059669'];

export default function FinancialAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('7');

  useEffect(() => {
    fetch(`/api/dashboard/analytics?days=${period}`)
      .then(r => r.json())
      .then(d => { if (!d.error) setData(d); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [period]);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>;
  }

  if (!data) {
    return <div className="text-center py-12 text-gray-400">Failed to load analytics</div>;
  }

  return (
    <div className="space-y-6">
      {/* Period selector */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit">
        {[{ value: '7', label: '7 days' }, { value: '30', label: '30 days' }, { value: '90', label: '90 days' }].map(p => (
          <button
            key={p.value}
            onClick={() => { setLoading(true); setPeriod(p.value); }}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${period === p.value ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <p className="mt-4 text-sm text-gray-500">Revenue ({period}d)</p>
          <p className="text-2xl font-bold text-gray-900">R{data.totalRevenue.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="stat-card">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 text-white" />
          </div>
          <p className="mt-4 text-sm text-gray-500">Orders ({period}d)</p>
          <p className="text-2xl font-bold text-gray-900">{data.totalOrders}</p>
        </div>
        <div className="stat-card">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <p className="mt-4 text-sm text-gray-500">Avg Order Value</p>
          <p className="text-2xl font-bold text-gray-900">R{data.avgOrderValue.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <p className="mt-4 text-sm text-gray-500">Inventory Value</p>
          <p className="text-2xl font-bold text-gray-900">R{data.inventoryValue.toLocaleString('en-ZA')}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue trend */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Revenue Trend</h3>
          <div className="h-64">
            {data.dailyRevenue.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.dailyRevenue}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e85d04" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#e85d04" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} tickFormatter={(v) => `R${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`} />
                  <Tooltip formatter={(value: number) => [`R${value.toLocaleString()}`, 'Revenue']} />
                  <Area type="monotone" dataKey="revenue" stroke="#e85d04" strokeWidth={2} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-gray-400">No revenue data for this period</div>
            )}
          </div>
        </div>

        {/* Top selling items */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Top Selling Items</h3>
          <div className="h-64">
            {data.topItems.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.topItems} layout="vertical" barSize={20}>
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} width={120} />
                  <Tooltip formatter={(value: number) => [value, 'Sold']} />
                  <Bar dataKey="quantity" fill="#e85d04" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-gray-400">No sales data yet</div>
            )}
          </div>
        </div>
      </div>

      {/* Category breakdown */}
      {data.categoryBreakdown.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Inventory by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.categoryBreakdown} dataKey="value" nameKey="category" cx="50%" cy="50%" outerRadius={90} label={({ category, percent }) => `${category} (${(percent * 100).toFixed(0)}%)`}>
                  {data.categoryBreakdown.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`R${value.toLocaleString()}`, 'Value']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
