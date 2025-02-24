
interface StockItem {
    id: number;
    name: string;
    quantity: number;
    costPerUnit: number;
    minimumStock: number;
    category: string;
    supplier?: string;
    invoiceNumber?: string;
    date: string;
    unit: string;
  }
  
  interface StockCategory {
    id: string;
    name: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  interface NewCategory {
    name: string;
    description?: string;
  }

  interface InventoryItem {
    id: string;
    name: string;
    category: {
      id: string;
      name: string;
    };
    currentStock: number;
    minimumStock: number;
    costPerUnit: number;
    unit: string;
    updatedAt: string;
  }