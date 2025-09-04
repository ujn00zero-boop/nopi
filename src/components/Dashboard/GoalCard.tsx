import React, { useState } from 'react';
import { Target, Calendar, TrendingUp, Plus, Minus, MoreVertical, ChevronDown, ChevronUp } from 'lucide-react';
import { SavingsGoal } from '../../types';
import { format } from 'date-fns';

interface GoalCardProps {
  goal: SavingsGoal;
  onAddTransaction: (goalId: string, amount: number, type: 'deposit' | 'withdrawal', description: string) => void;
  onEditGoal: (goal: SavingsGoal) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onAddTransaction, onEditGoal }) => {
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [transactionAmount, setTransactionAmount] = useState('');
  const [transactionType, setTransactionType] = useState<'deposit' | 'withdrawal'>('deposit');
  const [description, setDescription] = useState('');

  const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  const isCompleted = goal.currentAmount >= goal.targetAmount;
  const daysRemaining = Math.ceil((goal.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  const handleTransactionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(transactionAmount);
    if (amount > 0) {
      onAddTransaction(goal.id, amount, transactionType, description || `${transactionType} to ${goal.name}`);
      setTransactionAmount('');
      setDescription('');
      setShowTransactionForm(false);
    }
  };

  const getProgressColor = () => {
    if (isCompleted) return 'bg-green-500';
    if (progress >= 75) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-3 flex-1 text-left hover:bg-gray-50 -m-2 p-2 rounded-lg transition-colors"
        >
          <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
            <Target className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{goal.name}</h3>
            <p className="text-sm text-gray-500">{goal.category}</p>
          </div>
          <div className="ml-auto">
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </button>
        
        <button
          onClick={() => onEditGoal(goal)}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-4 mt-4">
      {goal.description && (
        <p className="text-sm text-gray-600 mb-4">{goal.description}</p>
      )}

        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{progress.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${getProgressColor()}`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-center">
            <p className="text-xs text-gray-500">Current</p>
            <p className="text-lg font-semibold text-gray-900">
              ₱{goal.currentAmount.toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Target</p>
            <p className="text-lg font-semibold text-gray-900">
              ₱{goal.targetAmount.toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Remaining</p>
            <p className="text-lg font-semibold text-gray-900">
              ₱{Math.max(0, goal.targetAmount - goal.currentAmount).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>
              {daysRemaining > 0 ? `${daysRemaining} days left` : 'Deadline passed'}
            </span>
          </div>
          <span className="text-xs text-gray-500">
            Due {format(goal.deadline, 'MMM d, yyyy')}
          </span>
        </div>

        {!showTransactionForm ? (
          <div className="flex space-x-2 pt-2">
            <button
              onClick={() => setShowTransactionForm(true)}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Money</span>
            </button>
            <button
              onClick={() => {
                setTransactionType('withdrawal');
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
                onClick={() => setTransactionType('deposit')}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  transactionType === 'deposit'
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                }`}
              >
                Deposit
              </button>
              <button
                type="button"
                onClick={() => setTransactionType('withdrawal')}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  transactionType === 'withdrawal'
                    ? 'bg-red-100 text-red-700 border border-red-200'
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                }`}
              >
                Withdraw
              </button>
            </div>
            
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="Amount"
              value={transactionAmount}
              onChange={(e) => setTransactionAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
            
            <input
              type="text"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            
            <div className="flex space-x-2">
              <button
                type="submit"
                className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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
      )}
    </div>
  );
};

export default GoalCard;