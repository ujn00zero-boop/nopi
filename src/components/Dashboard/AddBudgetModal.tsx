import React, { useState } from 'react';
import { X, Wallet } from 'lucide-react';
import { Budget } from '../../types';

interface AddBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (budgetData: Omit<Budget, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  editBudget?: Budget | null;
}

const AddBudgetModal: React.FC<AddBudgetModalProps> = ({ isOpen, onClose, onAdd, editBudget }) => {
  const [formData, setFormData] = useState({
    name: '',
    totalBudget: 0,
    period: '',
  });

  React.useEffect(() => {
    if (editBudget) {
      setFormData({
        name: editBudget.name,
        totalBudget: editBudget.totalBudget,
        period: format(editBudget.period, 'yyyy-MM'),
      });
    } else {
      const currentDate = new Date();
      setFormData({
        name: '',
        totalBudget: 0,
        period: format(currentDate, 'yyyy-MM'),
      });
    }
  }, [editBudget]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      period: new Date(formData.period + '-01'),
      totalIncome: 0,
      totalExpenses: 0,
    });
    onClose();
    if (!editBudget) {
      setFormData({
        name: '',
        totalBudget: 0,
        period: format(new Date(), 'yyyy-MM'),
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalBudget' ? parseFloat(value) || 0 : value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
              <Wallet className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {editBudget ? 'Edit Budget' : 'New Budget'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Budget Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Monthly Budget"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Budget Amount
            </label>
            <input
              type="number"
              name="totalBudget"
              value={formData.totalBudget || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Period
            </label>
            <input
              type="month"
              name="period"
              value={formData.period}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editBudget ? 'Update Budget' : 'Create Budget'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Helper function for date formatting
function format(date: Date, formatStr: string): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  if (formatStr === 'yyyy-MM') {
    return `${year}-${month}`;
  }
  if (formatStr === 'MMMM yyyy') {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    return `${monthNames[date.getMonth()]} ${year}`;
  }
  return date.toLocaleDateString();
}

export default AddBudgetModal;