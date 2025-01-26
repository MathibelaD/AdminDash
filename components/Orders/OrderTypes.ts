export interface OrderItem {
    id: number;
    name: string;
    quantity: number;
    price: number;
    notes?: string;
  }
  
  export interface Order {
    id: number;
    orderNumber: string;
    items: OrderItem[];
    status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
    total: number;
    customerName: string;
    customerPhone?: string;
    tableNumber?: number;
    orderType: 'dine-in' | 'takeaway';
    createdAt: Date;
    updatedAt: Date;
    paymentStatus: 'pending' | 'paid';
    paymentMethod?: 'cash' | 'card' | 'transfer';
  }
  
  export interface StatusColors {
    [key: string]: string;
    pending: string;
    preparing: string;
    ready: string;
    completed: string;
    cancelled: string;
  }