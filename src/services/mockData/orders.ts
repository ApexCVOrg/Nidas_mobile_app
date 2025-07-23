export interface MockOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
}

export interface MockShippingAddress {
  fullName: string;
  phone: string;
  address: string;
}

export interface MockOrder {
  id: string;
  userId: string;
  items: MockOrderItem[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  shippingAddress: MockShippingAddress;
}

export const mockOrders: MockOrder[] = [
  {
    id: 'order_1',
    userId: '1',
    items: [
      {
        productId: 'p006',
        name: 'ULTRABOOST 22',
        price: 4200000,
        quantity: 1,
        size: '40',
        color: 'white'
      }
    ],
    total: 4200000,
    status: 'pending',
    createdAt: '2024-01-15T10:00:00Z',
    shippingAddress: {
      fullName: 'John Doe',
      phone: '0123456789',
      address: '123 Main St, City'
    }
  },
  {
    id: 'order_2',
    userId: '1', 
    items: [
      {
        productId: 'p008',
        name: 'ADIDAS ORIGINALS',
        price: 1200000,
        quantity: 2,
        size: 'M',
        color: 'blue'
      }
    ],
    total: 2400000,
    status: 'completed',
    createdAt: '2024-01-10T14:30:00Z',
    shippingAddress: {
      fullName: 'John Doe',
      phone: '0123456789', 
      address: '123 Main St, City'
    }
  }
]; 