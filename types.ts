
export type Category = 'Streaming' | 'Gaming' | 'Premium' | 'Other' | 'Hot Deals';
export type OrderStatus = 'pending' | 'completed' | 'cancelled';

export interface SubscriptionItem {
  id: string;
  name: string;
  category: Category;
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  currency: 'BDT' | 'USD';
  badge?: string;
  isHot?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
  role: 'user' | 'admin';
  password?: string;
}

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  type: 'deposit' | 'purchase';
  amount: number;
  method?: string;
  trxID?: string;
  date: string;
  status: OrderStatus;
  itemName?: string;
  playerID?: string;
  accountEmail?: string;
  accountPassword?: string;
}
