import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownLeft, Clock, Filter } from 'lucide-react';
import Layout from '../components/Layout';
import { useTransactions } from '../hooks/useTransactions';
import { useSavingsGoals } from '../hooks/useSavingsGoals';
import { Transaction } from '../types';

const History: React.FC = () => {
  const { transactions, loading } = useTransactions();
  const { goals } = useSavingsGoals();
  const [activeTab, setActiveTab] = useState<'all' | 'deposit' | 'withdrawal'>('all');

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

  const filteredTransactions = transactions.filter(transaction => {
    if (activeTab === 'all') return true;
    return transaction.type === activeTab;
  });

  const getTabStats = (type: 'deposit' | 'withdrawal') => {
    const filtered = transactions.filter(t => t.type === type);
    const total = filtered.reduce((sum, t) => sum + t.amount, 0);
    return { count: filtered.length, total };
  };

  const depositStats = getTabStats('deposit');
  const withdrawalStats = getTabStats('withdrawal');

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
            <p className="text-gray-600">View all your savings transactions</p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Filter className="h-4 w-4" />
            <span>{filteredTransactions.length} transactions</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'all'
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className="text-center">
                <div className="font-semibold">All Transactions</div>
                <div className="text-xs text-gray-500 mt-1">
                  {transactions.length} total
                </div>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('deposit')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'deposit'
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className="text-center">
                <div className="font-semibold">Deposits</div>
                <div className="text-xs text-gray-500 mt-1">
                  {depositStats.count} • ₱{depositStats.total.toLocaleString()}
                </div>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('withdrawal')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'withdrawal'
                  ? 'bg-red-100 text-red-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className="text-center">
                <div className="font-semibold">Withdrawals</div>
                <div className="text-xs text-gray-500 mt-1">
                  {withdrawalStats.count} • ₱{withdrawalStats.total.toLocaleString()}
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Transaction List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {loading ? (
            <div className="p-6 space-y-3">
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
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-lg text-gray-500 mb-2">
                {activeTab === 'all' 
                  ? 'No transactions yet' 
                  : `No ${activeTab}s yet`
                }
              </p>
              <p className="text-sm text-gray-400">
                {activeTab === 'all'
                  ? 'Add money to your goals to see transaction history'
                  : `Make some ${activeTab}s to see them here`
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center space-x-4 p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${
                    transaction.type === 'deposit' 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {transaction.type === 'deposit' ? (
                      <ArrowUpRight className="h-6 w-6" />
                    ) : (
                      <ArrowDownLeft className="h-6 w-6" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-base font-medium text-gray-900">
                        {getGoalName(transaction.goalId)}
                      </p>
                      <p className={`text-lg font-semibold ${
                        transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'deposit' ? '+' : '-'}₱{transaction.amount.toLocaleString()}
                      </p>
                    </div>
                    {transaction.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {transaction.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-2 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDate(transaction.date)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default History;