'use client'
import React from 'react';
import { Clock, ChevronRight } from 'lucide-react';
import { Order } from './OrderTypes';


interface OrderListProps {
  orders: Order[];
  onSelectOrder: (order: Order) => void;
  onStatusChange: (orderId: number, status: Order['status']) => void;
}

export default function OrderList({ orders, onSelectOrder }: OrderListProps) {
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {orders.map((order) => (
        <div
          key={order.id}
          className="border-b last:border-b-0 p-4 hover:bg-gray-50 cursor-pointer"
          onClick={() => onSelectOrder(order)}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{order.orderNumber}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              
              <div className="text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{order.customerName}</p>
                    <p>{order.orderType === 'dine-in' ? `Table ${order.tableNumber}` : 'Takeaway'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">R{order.total.toFixed(2)}</p>
                    <div className="flex items-center text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatTime(order.createdAt)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-2 text-sm text-gray-500">
                {order.items.map((item, index) => (
                  <span key={item.id}>
                    {index > 0 && ', '}
                    {item.quantity}x {item.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}

      {orders.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No orders found
        </div>
      )}
    </div>
  );
}