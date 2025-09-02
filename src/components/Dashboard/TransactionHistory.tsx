import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';
import { Transaction } from '../../types';
import { useSavingsGoals } from '../../hooks/useSavingsGoals';

interface TransactionHistoryProps {
  transactions: Transaction[];
  loading: boolean;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions, loading }) => {
  const { goals } = useSavingsGoals();

  const getGoalName = (goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    return goal?.name || 'Unknown Goal';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
        <div className="text-center py-8">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No transactions yet</p>
          <p className="text-sm text-gray-400">Add money to your goals to see transaction history</p>
        </div>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {transactions.slice(0, 10).map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
              transaction.type === 'deposit' 
                ? 'bg-green-100 text-green-600' 
                : 'bg-red-100 text-red-600'
            }`}>
              {transaction.type === 'deposit' ? (
                <ArrowUpRight className="h-5 w-5" />
              ) : (
                <ArrowDownLeft className="h-5 w-5" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                {getGoalName(transaction.goalId)}
              </p>
              {transaction.description && (
                <p className="text-xs text-gray-600 mt-0.5">
                  {transaction.description}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-0.5">
                {formatDate(transaction.date)}
              </p>
            </div>
            
            <div className="text-right">
              <p className={`text-sm font-semibold ${
                transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.type === 'deposit' ? '+' : '-'}₱{transaction.amount.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionHistory;