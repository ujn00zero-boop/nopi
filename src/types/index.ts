export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  category: string;
  description?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  goalId: string;
  amount: number;
  type: 'deposit' | 'withdrawal';
  description: string;
  date: Date;
  userId: string;
}

export interface User {
  id: string;
  email: string;
  displayName?: string;
  totalSavings: number;
  createdAt: Date;
}