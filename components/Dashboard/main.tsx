'use client'
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, ShoppingCart, Package, AlertTriangle, Clock, ChevronRight, Loader2, Flame } from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  todayRevenue: string;
  todayOrders: number;
  inventoryValue: string;
  recentOrders: any[];
  lowStockItems: { id: string; name: string; currentStock: number; minimumStock: number; unit: string }[];
}

const salesData = [
  { day: 'Mon', revenue: 4200 },
  { day: 'Tue', revenue: 3800 },
  { day: 'Wed', revenue: 5100 },
  { day: 'Thu', revenue: 2900 },
  { day: 'Fri', revenue: 6800 },
  { day: 'Sat', revenue: 8900 },
  { day: 'Sun', revenue: 4100 },
];

const getStatusBadge = (status: string) => {
  const map: Record<string, string> = {
    PENDING: 'badge badge-warning',
    PREPARING: 'badge badge-info',
    READY: 'badge badge-success',
    COMPLETED: 'badge badge-neutral',
    CANCELLED: 'badge badge-danger',
  };
  return map[status] || 'badge badge-neutral';
};

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(data => { if (!data.error) setStats(data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Here&apos;s what&apos;s happening with your kota business today.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Today</span>
          </div>
          <p className="mt-4 text-sm text-gray-500">Revenue</p>
          <p className="text-2xl font-bold text-gray-900">R{Number(stats?.todayRevenue || 0).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500">Orders Today</p>
          <p className="text-2xl font-bold text-gray-900">{stats?.todayOrders || 0}</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500">Inventory Value</p>
          <p className="text-2xl font-bold text-gray-900">R{Number(stats?.inventoryValue || 0).toLocaleString('en-ZA')}</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Flame className="w-5 h-5 text-white" />
            </div>
            {(stats?.lowStockItems?.length || 0) > 0 && (
              <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">Alert</span>
            )}
          </div>
          <p className="mt-4 text-sm text-gray-500">Low Stock Items</p>
          <p className="text-2xl font-bold text-gray-900">{stats?.lowStockItems?.length || 0}</p>
        </div>
      </div>

      {/* Low stock alert */}
      {stats?.lowStockItems && stats.lowStockItems.length > 0 && (
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Low Stock Alert</p>
            <div className="mt-1 space-y-0.5">
              {stats.lowStockItems.slice(0, 3).map((item) => (
                <p key={item.id} className="text-sm text-amber-700">
                  {item.name} — {item.currentStock} {item.unit} left (min: {item.minimumStock})
                </p>
              ))}
              {stats.lowStockItems.length > 3 && (
                <Link href="/dashboard/inventory" className="text-sm text-amber-800 font-medium underline">
                  +{stats.lowStockItems.length - 3} more items
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Weekly Revenue</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e85d04" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#e85d04" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(v) => `R${v / 1000}k`} />
                <Tooltip formatter={(value: number) => [`R${value.toLocaleString()}`, 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#e85d04" strokeWidth={2} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Daily Orders</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData} barSize={32}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip formatter={(value: number) => [`R${value.toLocaleString()}`, 'Sales']} />
                <Bar dataKey="revenue" fill="#e85d04" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="table-container">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Recent Orders</h3>
          <Link href="/dashboard/orders" className="text-xs font-medium text-orange-600 hover:text-orange-700 flex items-center gap-1">
            View all <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">Order</th>
                <th className="table-header">Customer</th>
                <th className="table-header">Items</th>
                <th className="table-header">Status</th>
                <th className="table-header">Total</th>
                <th className="table-header">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="table-cell font-medium text-gray-900">{order.orderNumber}</td>
                    <td className="table-cell">{order.customer?.firstName} {order.customer?.lastName}</td>
                    <td className="table-cell text-gray-500">
                      {order.items?.slice(0, 2).map((i: any) => i.menuItem?.name).join(', ')}
                      {order.items?.length > 2 && ` +${order.items.length - 2}`}
                    </td>
                    <td className="table-cell">
                      <span className={getStatusBadge(order.status)}>{order.status}</span>
                    </td>
                    <td className="table-cell font-medium">R{Number(order.total).toFixed(2)}</td>
                    <td className="table-cell text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(order.createdAt).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="table-cell text-center text-gray-400 py-8">No recent orders</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
