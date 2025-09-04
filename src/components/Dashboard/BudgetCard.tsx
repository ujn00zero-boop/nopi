import React, { useState } from 'react';
import { Wallet, Plus, Minus, TrendingDown, Calendar } from 'lucide-react';
import { Budget, BudgetTransaction } from '../../types';
import { format } from 'date-fns';

interface BudgetCardProps {
  budget: Budget;
  onAddTransaction: (budgetId: string, amount: number, type: 'income' | 'expense', description: string, category?: string) => void;
}

const expenseCategories = [
  'Food',
  'Transportation', 
  'Utility Bill',
  'Emergency',
  'Appliances',
  'Gadgets',
  'Repairs',
  'Other'
];

const BudgetCard: React.FC<BudgetCardProps> = ({ budget, onAddTransaction }) => {
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [transactionAmount, setTransactionAmount] = useState('');
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('income');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(expenseCategories[0]);

  const handleTransactionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(transactionAmount);
    if (amount > 0) {
      onAddTransaction(
        budget.id, 
        amount, 
        transactionType, 
        description || `${transactionType} transaction`,
        transactionType === 'expense' ? category : undefined
      );
      setTransactionAmount('');
      setDescription('');
      setCategory(expenseCategories[0]);
      setShowTransactionForm(false);
    }
  };

  const remainingBudget = budget.totalBudget - budget.totalExpenses;
  const budgetProgress = (budget.totalExpenses / budget.totalBudget) * 100;

  const getProgressColor = () => {
    if (budgetProgress >= 90) return 'bg-red-500';
    if (budgetProgress >= 75) return 'bg-orange-500';
    if (budgetProgress >= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
            <Wallet className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{budget.name}</h3>
            <p className="text-sm text-gray-500">Monthly Budget</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Budget Used</span>
            <span>{budgetProgress.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${getProgressColor()}`}
              style={{ width: `${Math.min(budgetProgress, 100)}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-gray-500">Budget</p>
            <p className="text-lg font-semibold text-gray-900">
              ₱{budget.totalBudget.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Spent</p>
            <p className="text-lg font-semibold text-red-600">
              ₱{budget.totalExpenses.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Remaining</p>
            <p className={`text-lg font-semibold ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ₱{remainingBudget.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>
              {format(budget.period, 'MMMM yyyy')}
            </span>
          </div>
          <span className="text-xs text-gray-500">
            {budget.totalIncome > 0 && `Income: ₱${budget.totalIncome.toLocaleString()}`}
          </span>
        </div>

        {!showTransactionForm ? (
          <div className="flex space-x-2 pt-2">
            <button
              onClick={() => {
                setTransactionType('income');
                setShowTransactionForm(true);
              }}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Money</span>
            </button>
            <button
              onClick={() => {
                setTransactionType('expense');
                setShowTransactionForm(true);
              }}
              className="flex items-center justify-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Minus className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleTransactionSubmit} className="space-y-3 pt-2 border-t border-gray-100">
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setTransactionType('income')}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  transactionType === 'income'
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                }`}
              >
                Income
              </button>
              <button
                type="button"
                onClick={() => setTransactionType('expense')}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  transactionType === 'expense'
                    ? 'bg-red-100 text-red-700 border border-red-200'
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                }`}
              >
                Expense
              </button>
            </div>
            
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="Amount"
              value={transactionAmount}
              onChange={(e) => setTransactionAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />

            {transactionType === 'expense' && (
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {expenseCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            )}
            
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            
            <div className="flex space-x-2">
              <button
                type="submit"
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Transaction
              </button>
              <button
                type="button"
                onClick={() => setShowTransactionForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default BudgetCard;