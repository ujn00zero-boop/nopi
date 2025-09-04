import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Clock, X } from 'lucide-react';
import { Transaction } from '../../types';
import { useSavingsGoals } from '../../hooks/useSavingsGoals';

interface TransactionHistoryProps {
  transactions: Transaction[];
  loading: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ 
  transactions, 
  loading, 
  isOpen, 
  onClose 
}) => {
  const { goals } = useSavingsGoals();

  const getGoalName = (goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    return goal?.name || 'Unknown Goal';
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Transaction History</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
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
          ) : transactions.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-lg text-gray-500 mb-2">No transactions yet</p>
              <p className="text-sm text-gray-400">Add money to your goals to see transaction history</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center space-x-3 p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100"
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
                      <p className="text-sm text-gray-600 mt-0.5">
                        {transaction.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
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
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;