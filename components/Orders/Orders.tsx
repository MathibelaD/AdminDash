'use client'
import React, { useState, useEffect } from 'react';
import OrderDetails from './OrderDetails';
import OrderFilters from './OrderFilters';
import OrderList from './OrderList';
import { Order } from './OrderTypes';
import { Loader2 } from 'lucide-react';

export default function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (!data.error) {
        setOrders(data.map((o: any) => ({
          id: o.id,
          orderNumber: o.orderNumber,
          items: o.items.map((i: any) => ({
            id: i.id,
            name: i.menuItem?.name || 'Unknown',
            quantity: i.quantity,
            price: Number(i.unitPrice),
          })),
          status: o.status.toLowerCase(),
          total: Number(o.total),
          customerName: `${o.customer?.firstName || ''} ${o.customer?.lastName || ''}`.trim(),
          customerPhone: '',
          tableNumber: o.tableNumber,
          orderType: o.orderType?.toLowerCase().replace('_', '-'),
          createdAt: new Date(o.createdAt),
          updatedAt: new Date(o.updatedAt),
          paymentStatus: o.paymentStatus?.toLowerCase(),
        })));
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: number | string, newStatus: Order['status']) => {
    try {
      await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus.toUpperCase() }),
      });
      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus, updatedAt: new Date() } : order
      ));
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-500 mt-1">{orders.length} total orders</p>
      </div>

      <OrderFilters
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={selectedOrder ? 'lg:col-span-2' : 'lg:col-span-3'}>
          <OrderList
            orders={filteredOrders}
            onSelectOrder={setSelectedOrder}
            onStatusChange={handleStatusChange}
          />
        </div>
        {selectedOrder && (
          <div>
            <OrderDetails
              order={selectedOrder}
              onClose={() => setSelectedOrder(null)}
              onStatusChange={handleStatusChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
