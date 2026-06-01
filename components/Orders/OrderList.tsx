'use client'
import React from 'react';
import { Clock, Eye } from 'lucide-react';
import { Order } from './OrderTypes';

interface OrderListProps {
  orders: Order[];
  onSelectOrder: (order: Order) => void;
  onStatusChange: (orderId: number, status: Order['status']) => void;
}

const getStatusBadge = (status: string) => {
  const map: Record<string, string> = {
    pending: 'badge badge-warning',
    preparing: 'badge badge-info',
    ready: 'badge badge-success',
    completed: 'badge badge-neutral',
    cancelled: 'badge badge-danger',
    delivery: 'badge badge-info',
  };
  return map[status] || 'badge badge-neutral';
};

const getPaymentBadge = (status: string) => {
  const map: Record<string, string> = {
    paid: 'badge badge-success',
    pending: 'badge badge-warning',
    failed: 'badge badge-danger',
  };
  return map[status] || 'badge badge-neutral';
};

export default function OrderList({ orders, onSelectOrder }: OrderListProps) {
  return (
    <div className="table-container">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="table-header">Order #</th>
              <th className="table-header">Customer</th>
              <th className="table-header">Type</th>
              <th className="table-header">Items</th>
              <th className="table-header">Total</th>
              <th className="table-header">Status</th>
              <th className="table-header">Payment</th>
              <th className="table-header">Time</th>
              <th className="table-header"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="table-cell font-medium text-gray-900">{order.orderNumber}</td>
                <td className="table-cell">{order.customerName}</td>
                <td className="table-cell capitalize">{order.orderType?.replace('-', ' ')}</td>
                <td className="table-cell text-gray-500 max-w-[180px] truncate">
                  {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                </td>
                <td className="table-cell font-medium">R{order.total.toFixed(2)}</td>
                <td className="table-cell">
                  <span className={getStatusBadge(order.status)}>{order.status}</span>
                </td>
                <td className="table-cell">
                  <span className={getPaymentBadge(order.paymentStatus || '')}>{order.paymentStatus}</span>
                </td>
                <td className="table-cell text-gray-500">
                  <span className="flex items-center gap-1 text-xs">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(order.createdAt).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </td>
                <td className="table-cell">
                  <button
                    onClick={() => onSelectOrder(order)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {orders.length === 0 && (
        <div className="py-12 text-center text-gray-400 text-sm">No orders found</div>
      )}
    </div>
  );
}
