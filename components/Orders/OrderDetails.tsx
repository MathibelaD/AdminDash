'use client'
import React from 'react';
import { X, Phone } from 'lucide-react';
import { Order } from './OrderTypes';

interface OrderDetailsProps {
  order: Order;
  onClose: () => void;
  onStatusChange: (orderId: number, status: Order['status']) => void;
}

export default function OrderDetails({ order, onClose, onStatusChange }: OrderDetailsProps) {
  const statusOptions: Order['status'][] = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];

  const getStatusClass = (status: string) => {
    const map: Record<string, string> = {
      pending: 'badge badge-warning',
      preparing: 'badge badge-info',
      ready: 'badge badge-success',
      completed: 'badge badge-neutral',
      cancelled: 'badge badge-danger',
    };
    return map[status] || 'badge badge-neutral';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h2 className="text-sm font-bold text-gray-900">Order Details</h2>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      <div className="p-5 space-y-5">
        {/* Order Info */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">{order.orderNumber}</span>
          <select
            value={order.status}
            onChange={(e) => onStatusChange(order.id, e.target.value as Order['status'])}
            className="input-field w-auto text-sm py-1.5"
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-500 text-xs">Type</p>
            <p className="font-medium mt-0.5">{order.orderType === 'dine-in' ? `Dine-in (Table ${order.tableNumber})` : 'Takeaway'}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Payment</p>
            <p className="mt-0.5"><span className={getStatusClass(order.paymentStatus)}>{order.paymentStatus}</span></p>
          </div>
        </div>

        {/* Customer */}
        <div className="pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Customer</p>
          <p className="text-sm font-medium">{order.customerName}</p>
          {order.customerPhone && (
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
              <Phone className="w-3.5 h-3.5" /> {order.customerPhone}
            </p>
          )}
        </div>

        {/* Items */}
        <div className="pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-2">Items</p>
          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span><span className="font-medium">{item.quantity}x</span> {item.name}</span>
                <span className="font-medium">R{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
            <span className="text-sm font-bold">Total</span>
            <span className="text-lg font-bold text-gray-900">R{order.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Timeline */}
        <div className="pt-3 border-t border-gray-100 text-xs text-gray-500 space-y-1">
          <p>Created: {new Date(order.createdAt).toLocaleString('en-ZA')}</p>
          <p>Updated: {new Date(order.updatedAt).toLocaleString('en-ZA')}</p>
        </div>

        {/* Actions */}
        <div className="pt-3 border-t border-gray-100 flex gap-2">
          {order.status === 'pending' && (
            <>
              <button onClick={() => onStatusChange(order.id, 'preparing')} className="btn-primary flex-1 justify-center text-xs py-2">
                Start Preparing
              </button>
              <button onClick={() => onStatusChange(order.id, 'cancelled')} className="btn-secondary flex-1 justify-center text-xs py-2 text-red-600 border-red-200 hover:bg-red-50">
                Cancel
              </button>
            </>
          )}
          {order.status === 'preparing' && (
            <button onClick={() => onStatusChange(order.id, 'ready')} className="btn-primary flex-1 justify-center text-xs py-2 bg-emerald-600 hover:bg-emerald-700">
              Mark Ready
            </button>
          )}
          {order.status === 'ready' && (
            <button onClick={() => onStatusChange(order.id, 'completed')} className="btn-primary flex-1 justify-center text-xs py-2 bg-emerald-600 hover:bg-emerald-700">
              Complete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
