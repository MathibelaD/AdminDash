'use client'
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, ShoppingBag, ArrowUp, Clock, AlertTriangle, Package, DollarSign, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  todayRevenue: string;
  todayOrders: number;
  inventoryValue: string;
  recentOrders: any[];
  lowStockItems: { id: string; name: string; currentStock: number; minimumStock: number; unit: string }[];
}

const salesData = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 5000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 6890 },
  { name: 'Sat', sales: 8390 },
  { name: 'Sun', sales: 3490 },
];

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(data => {
        if (!data.error) setStats(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Welcome back, Admin</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm text-green-600 flex items-center">
              <ArrowUp className="w-4 h-4 mr-1" />Today
            </span>
          </div>
          <h3 className="text-gray-600 text-sm">Today&apos;s Revenue</h3>
          <p className="text-2xl font-bold">R{Number(stats?.todayRevenue || 0).toFixed(2)}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm">Total Orders Today</h3>
          <p className="text-2xl font-bold">{stats?.todayOrders || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm">Inventory Value</h3>
          <p className="text-2xl font-bold">R{Number(stats?.inventoryValue || 0).toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm">Low Stock Items</h3>
          <p className="text-2xl font-bold">{stats?.lowStockItems?.length || 0}</p>
        </div>
      </div>

      {/* Low Stock Alerts */}
      {stats?.lowStockItems && stats.lowStockItems.length > 0 && (
        <div className="mb-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-yellow-400 mr-2" />
            <h3 className="font-medium">Low Stock Alerts</h3>
          </div>
          <div className="mt-2 space-y-1">
            {stats.lowStockItems.map((item) => (
              <p key={item.id} className="text-sm text-yellow-700">
                {item.name} - Only {item.currentStock} {item.unit} remaining (Minimum: {item.minimumStock})
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Weekly Sales</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Sales by Day</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-lg font-medium">Recent Orders</h3>
          <Link href="/dashboard/orders" className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
            View All <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        <div className="divide-y">
          {stats?.recentOrders && stats.recentOrders.length > 0 ? (
            stats.recentOrders.map((order) => (
              <div key={order.id} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">Order {order.orderNumber}</p>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Clock className="w-4 h-4 mr-1" />
                      {new Date(order.createdAt).toLocaleString()}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {order.customer?.firstName} {order.customer?.lastName}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm
                      ${order.status === 'PREPARING' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'READY' ? 'bg-green-100 text-green-800' :
                        order.status === 'COMPLETED' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'}`}>
                      {order.status}
                    </span>
                    <p className="mt-2 font-medium">R{Number(order.total).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">No recent orders</div>
          )}
        </div>
      </div>
    </div>
  );
}
