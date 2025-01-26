'use client'
import React, { useState } from 'react';
import OrderDetails from './OrderDetails';
import OrderFilters from './OrderFilters';
import OrderList from './OrderList';
import { Order } from './OrderTypes';


export default function OrdersManagement() {
  // Sample orders data
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 1,
      orderNumber: "ORD001",
      items: [
        { id: 1, name: "Classic Kota", quantity: 2, price: 45.99 },
        { id: 2, name: "Chips", quantity: 1, price: 25.00 }
      ],
      status: "pending",
      total: 116.98,
      customerName: "John Doe",
      customerPhone: "0123456789",
      tableNumber: 5,
      orderType: "dine-in",
      createdAt: new Date(),
      updatedAt: new Date(),
      paymentStatus: "pending"
    }
  ]);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleStatusChange = (orderId: number, newStatus: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus, updatedAt: new Date() }
        : order
    ));
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Orders Management</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <OrderFilters
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          
          <OrderList
            orders={filteredOrders}
            onSelectOrder={setSelectedOrder}
            onStatusChange={handleStatusChange}
          />
        </div>

        <div>
          {selectedOrder && (
            <OrderDetails
              order={selectedOrder}
              onClose={() => setSelectedOrder(null)}
              onStatusChange={handleStatusChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}