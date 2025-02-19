
interface StockItem {
    id: number;
    name: string;
    quantity: number;
    costPerUnit: number;
    category: string;
    supplier?: string;
    invoiceNumber?: string;
    date: string;
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