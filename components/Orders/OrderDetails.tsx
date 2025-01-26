'use client'
import React from 'react';
import { X, Phone, MapPin } from 'lucide-react';
import { Order } from './OrderTypes';


interface OrderDetailsProps {
  order: Order;
  onClose: () => void;
  onStatusChange: (orderId: number, status: Order['status']) => void;
}

export default function OrderDetails({ order, onClose, onStatusChange }: OrderDetailsProps) {
  const statusOptions: Order['status'][] = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];

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

  return (
    <div className="bg-white rounded-lg shadow h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Order Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Order Info */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">{order.orderNumber}</h3>
            <select
              value={order.status}
              onChange={(e) => onStatusChange(order.id, e.target.value as Order['status'])}
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Order Type</p>
              <p className="font-medium">{order.orderType === 'dine-in' ? `Dine-in (Table ${order.tableNumber})` : 'Takeaway'}</p>
            </div>
            <div>
              <p className="text-gray-500">Payment Status</p>
              <p className="font-medium capitalize">{order.paymentStatus}</p>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div>
          <h3 className="font-medium mb-2">Customer Details</h3>
          <div className="space-y-2 text-sm">
            <p className="font-medium">{order.customerName}</p>
            {order.customerPhone && (
              <div className="flex items-center text-gray-600">
                <Phone className="w-4 h-4 mr-2" />
                {order.customerPhone}
              </div>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div>
          <h3 className="font-medium mb-3">Order Items</h3>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <div>
                  <span className="font-medium">{item.quantity}x</span> {item.name}
                  {item.notes && (
                    <p className="text-gray-500 text-xs mt-1">{item.notes}</p>
                  )}
                </div>
                <span className="font-medium">R{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span>R{order.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center font-medium text-lg mt-2">
              <span>Total</span>
              <span>R{order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Order Timeline */}
        <div>
          <h3 className="font-medium mb-3">Order Timeline</h3>
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-gray-500 w-24">Created</span>
              <span>{new Date(order.createdAt).toLocaleString()}</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-gray-500 w-24">Last Updated</span>
              <span>{new Date(order.updatedAt).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          {order.status === 'pending' && (
            <button
              onClick={() => onStatusChange(order.id, 'preparing')}
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Start Preparing
            </button>
          )}
          {order.status === 'preparing' && (
            <button
              onClick={() => onStatusChange(order.id, 'ready')}
              className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Mark as Ready
            </button>
          )}
          {(order.status === 'pending' || order.status === 'preparing') && (
            <button
              onClick={() => onStatusChange(order.id, 'cancelled')}
              className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Cancel Order
            </button>
          )}
          {order.status === 'ready' && (
            <button
              onClick={() => onStatusChange(order.id, 'completed')}
              className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Complete Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
}