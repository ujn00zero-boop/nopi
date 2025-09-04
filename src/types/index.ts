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

export interface Budget {
  id: string;
  name: string;
  totalBudget: number;
  totalIncome: number;
  totalExpenses: number;
  period: Date; // Month/Year
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BudgetTransaction {
  id: string;
  budgetId: string;
  amount: number;
  type: 'income' | 'expense';
  category?: string; // Only for expenses
  description: string;
  date: Date;
  userId: string;
}