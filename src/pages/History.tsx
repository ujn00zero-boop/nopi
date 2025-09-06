import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownLeft, Clock, Filter, ChevronDown } from 'lucide-react';
import Layout from '../components/Layout';
import { useTransactions } from '../hooks/useTransactions';
import { useSavingsGoals } from '../hooks/useSavingsGoals';
import { useBudgets } from '../hooks/useBudgets';
import { useBudgetTransactions } from '../hooks/useBudgetTransactions';
import { Transaction, BudgetTransaction, Budget } from '../types';

const History: React.FC = () => {
  const { transactions, loading: loadingTransactions } = useTransactions();
  const { goals } = useSavingsGoals();
  const { budgets, loading: loadingBudgets } = useBudgets();
  const { transactions: budgetTransactions, loading: loadingBudgetTransactions } = useBudgetTransactions();
  const [activeTab, setActiveTab] = useState<'all' | 'deposit' | 'withdrawal' | 'budget'>('all');
  const [showDropdown, setShowDropdown] = useState(false);

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

  const getBudgetName = (budgetId: string) => {
    const budget = budgets.find(b => b.id === budgetId);
    return budget?.name || 'Unknown Budget';
  };

  const getTabStats = (type: 'deposit' | 'withdrawal') => {
    const filtered = transactions.filter(t => t.type === type);
    const total = filtered.reduce((sum, t) => sum + t.amount, 0);
    return { count: filtered.length, total };
  };

  const depositStats = getTabStats('deposit');
  const withdrawalStats = getTabStats('withdrawal');

  const getBudgetTabStats = (type: 'income' | 'expense') => {
    const filtered = budgetTransactions.filter(t => t.type === type);
    const total = filtered.reduce((sum, t) => sum + t.amount, 0);
    return { count: filtered.length, total };
  };

  const incomeStats = getBudgetTabStats('income');
  const expenseStats = getBudgetTabStats('expense');

  const allHistoryItems = [
    ...transactions.map(t => ({ ...t, type: t.type as 'deposit' | 'withdrawal', itemType: 'transaction' as const })),
    ...budgetTransactions.map(bt => ({ ...bt, type: bt.type as 'income' | 'expense', itemType: 'budgetTransaction' as const })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  const filteredHistoryItems = allHistoryItems.filter(item => {
    if (activeTab === 'all') return true;
    if (activeTab === 'budget') return item.itemType === 'budgetTransaction';
    if (item.itemType === 'transaction') {
      return item.type === activeTab;
    }
    return false;
  });

  const loading = loadingTransactions || loadingBudgets || loadingBudgetTransactions;

  const filterOptions = [
    { value: 'all', label: 'All Transactions', count: allHistoryItems.length, total: null },
    { value: 'deposit', label: 'Deposits', count: depositStats.count, total: depositStats.total },
    { value: 'withdrawal', label: 'Withdrawals', count: withdrawalStats.count, total: withdrawalStats.total },
    { value: 'budget', label: 'Budget Transactions', count: budgetTransactions.length, total: null },
  ];

  const currentFilter = filterOptions.find(option => option.value === activeTab);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
            <p className="text-gray-600">View all your financial history</p>
          </div>
          
          {/* Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center justify-between w-full sm:w-64 px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Filter className="h-4 w-4 text-gray-500" />
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-900">{currentFilter?.label}</div>
                  <div className="text-xs text-gray-500">
                    {filteredHistoryItems.length} items
                    {currentFilter?.total && ` • ₱${currentFilter.total.toLocaleString()}`}
                  </div>
                </div>
              </div>
              <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-full sm:w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="py-2">
                  {filterOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setActiveTab(option.value as any);
                        setShowDropdown(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                        activeTab === option.value ? 'bg-green-50 border-r-2 border-green-500' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className={`text-sm font-medium ${
                            activeTab === option.value ? 'text-green-700' : 'text-gray-900'
                          }`}>
                            {option.label}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {option.count} transactions
                            {option.total && ` • ₱${option.total.toLocaleString()}`}
                          </div>
                        </div>
                        {activeTab === option.value && (
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
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
          ) : filteredHistoryItems.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-lg text-gray-500 mb-2">
                {activeTab === 'all'
                  ? 'No history items yet'
                  : activeTab === 'budget'
                    ? 'No budget transactions yet'
                    : `No ${activeTab}s yet`}
              </p>
              <p className="text-sm text-gray-400">
                {activeTab === 'all'
                  ? 'Add money to your goals or manage your budgets to see history'
                  : activeTab === 'budget'
                    ? 'Add income or expenses to your budgets to see them here'
                    : `Make some ${activeTab}s to see them here`}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredHistoryItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-4 p-6 hover:bg-gray-50 transition-colors"
                >
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-lg ${
                      item.itemType === 'transaction'
                        ? item.type === 'deposit'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-600'
                        : item.type === 'income'
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-orange-100 text-orange-600'
                    }`}
                  >
                    {item.itemType === 'transaction' ? (
                      item.type === 'deposit' ? (
                        <ArrowUpRight className="h-6 w-6" />
                      ) : (
                        <ArrowDownLeft className="h-6 w-6" />
                      )
                    ) : item.type === 'income' ? (
                      <ArrowUpRight className="h-6 w-6" />
                    ) : (
                      <ArrowDownLeft className="h-6 w-6" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-base font-medium text-gray-900">
                        {item.itemType === 'transaction'
                          ? getGoalName(item.goalId)
                          : getBudgetName(item.budgetId)}
                      </p>
                      <p
                        className={`text-lg font-semibold ${
                          item.itemType === 'transaction'
                            ? item.type === 'deposit'
                              ? 'text-green-600'
                              : 'text-red-600'
                            : item.type === 'income'
                              ? 'text-blue-600'
                              : 'text-orange-600'
                        }`}
                      >
                        {item.type === 'deposit' || item.type === 'income' ? '+' : '-'}₱
                        {item.amount.toLocaleString()}
                      </p>
                    </div>
                    {item.description && (
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-2 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDate(item.date)}
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