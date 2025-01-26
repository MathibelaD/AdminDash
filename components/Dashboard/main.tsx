'use client'
import React from 'react'; 
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, LineChart, Line 
} from 'recharts';
import { 
  TrendingUp, ShoppingBag, 
  ArrowUp, ArrowDown, Clock, AlertTriangle,
  Package, DollarSign, ChevronRight
} from 'lucide-react';

const salesData = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 5000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 6890 },
  { name: 'Sat', sales: 8390 },
  { name: 'Sun', sales: 3490 },
];

const popularItems = [
  { name: 'Classic Kota', orders: 150 },
  { name: 'Cheese Burger', orders: 120 },
  { name: 'Chips', orders: 100 },
  { name: 'Chicken Kota', orders: 90 },
  { name: 'Beef Burger', orders: 80 },
];

const recentOrders = [
  { 
    id: 1, 
    orderNumber: '#1234',
    items: [
      { name: 'Classic Kota', quantity: 2 },
      { name: 'Chips', quantity: 1 }
    ],
    status: 'preparing',
    timeAgo: '10 minutes ago',
    total: 120.50
  },
  { 
    id: 2, 
    orderNumber: '#1235',
    items: [
      { name: 'Cheese Burger', quantity: 1 },
      { name: 'Coke', quantity: 2 }
    ],
    status: 'ready',
    timeAgo: '15 minutes ago',
    total: 85.00
  },
  // Add more orders as needed
];

// Sample inventory alerts
const inventoryAlerts = [
  { item: 'Bread Roll', stock: 20, minimum: 50 },
  { item: 'Cheese Slices', stock: 15, minimum: 30 },
];

export default function Dashboard() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Welcome back, Admin</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Today's Revenue */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm text-green-600 flex items-center">
              <ArrowUp className="w-4 h-4 mr-1" />12%
            </span>
          </div>
          <h3 className="text-gray-600 text-sm">Todays Revenue</h3>
          <p className="text-2xl font-bold">R4,500.00</p>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-red-600 flex items-center">
              <ArrowDown className="w-4 h-4 mr-1" />3%
            </span>
          </div>
          <h3 className="text-gray-600 text-sm">Total Orders</h3>
          <p className="text-2xl font-bold">82</p>
        </div>

        {/* Inventory Value */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm">Inventory Value</h3>
          <p className="text-2xl font-bold">R15,250.00</p>
        </div>

        {/* Net Profit */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="text-sm text-green-600 flex items-center">
              <ArrowUp className="w-4 h-4 mr-1" />8%
            </span>
          </div>
          <h3 className="text-gray-600 text-sm">Net Profit</h3>
          <p className="text-2xl font-bold">R2,800.00</p>
        </div>
      </div>

      {/* Alert Section */}
      {inventoryAlerts.length > 0 && (
        <div className="mb-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-yellow-400 mr-2" />
            <h3 className="font-medium">Low Stock Alerts</h3>
          </div>
          <div className="mt-2 space-y-1">
            {inventoryAlerts.map((alert, index) => (
              <p key={index} className="text-sm text-yellow-700">
                {alert.item} - Only {alert.stock} units remaining (Minimum: {alert.minimum})
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Weekly Sales Chart */}
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

        {/* Popular Items Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Popular Items</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={popularItems}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-lg font-medium">Recent Orders</h3>
          <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
            View All <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
        <div className="divide-y">
          {recentOrders.map((order) => (
            <div key={order.id} className="p-6 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Order {order.orderNumber}</p>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Clock className="w-4 h-4 mr-1" />
                    {order.timeAgo}
                  </div>
                  <div className="mt-2">
                    {order.items.map((item, index) => (
                      <p key={index} className="text-sm text-gray-600">
                        {item.quantity}x {item.name}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm
                    ${order.status === 'preparing' ? 'bg-blue-100 text-blue-800' : 
                      order.status === 'ready' ? 'bg-green-100 text-green-800' : 
                      'bg-gray-100 text-gray-800'}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <p className="mt-2 font-medium">R{order.total.toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}