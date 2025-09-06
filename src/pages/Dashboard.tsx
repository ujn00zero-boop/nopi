import React, { useState } from 'react';
import { Plus, Target, Wallet, LandPlot } from 'lucide-react';
import Layout from '../components/Layout';
import StatsCards from '../components/Dashboard/StatsCards';
import GoalCard from '../components/Dashboard/GoalCard';
import BudgetCard from '../components/Dashboard/BudgetCard';
import AddGoalModal from '../components/Dashboard/AddGoalModal';
import AddBudgetModal from '../components/Dashboard/AddBudgetModal';
import SavingsChart from '../components/Dashboard/SavingsChart';
import { useSavingsGoals } from '../hooks/useSavingsGoals';
import { useBudgets } from '../hooks/useBudgets';
import { useBudgetTransactions } from '../hooks/useBudgetTransactions';
import { SavingsGoal } from '../types';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const Dashboard: React.FC = () => {
  const { goals, loading: goalsLoading, addGoal, updateGoal } = useSavingsGoals();
  const { budgets, loading: budgetsLoading, addBudget, updateBudget } = useBudgets();
  const { addTransaction: addBudgetTransaction } = useBudgetTransactions();
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);
  const [activeTab, setActiveTab] = useState<'goals' | 'budget' | 'loan'>('goals');

  const handleAddTransaction = async (goalId: string, amount: number, type: 'deposit' | 'withdrawal', description: string) => {
    try {
      // Update goal amount
      const goal = goals.find(g => g.id === goalId);
      if (goal) {
        const newAmount = type === 'deposit'
          ? goal.currentAmount + amount
          : Math.max(0, goal.currentAmount - amount);
        
        await updateDoc(doc(db, 'savingsGoals', goalId), {
          currentAmount: newAmount,
          updatedAt: new Date(),
        });
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const handleEditGoal = (goal: SavingsGoal) => {
    setEditingGoal(goal);
    setShowAddGoalModal(true);
  };

  const handleAddGoal = async (goalData: Omit<SavingsGoal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (editingGoal) {
        await updateGoal(editingGoal.id, goalData);
        setEditingGoal(null);
      } else {
        await addGoal(goalData);
      }
    } catch (error) {
      console.error('Error saving goal:', error);
    }
  };

  const closeModal = () => {
    setShowAddGoalModal(false);
    setEditingGoal(null);
  };

  const handleAddBudgetTransaction = async (budgetId: string, amount: number, type: 'income' | 'expense', description: string, category?: string) => {
    try {
      // Add budget transaction
      await addBudgetTransaction({
        budgetId,
        amount,
        type,
        description,
        category,
        date: new Date(),
      });

      // Update budget totals
      const budget = budgets.find(b => b.id === budgetId);
      if (budget) {
        const updates = type === 'income' 
          ? { totalIncome: budget.totalIncome + amount }
          : { totalExpenses: budget.totalExpenses + amount };
        
        await updateDoc(doc(db, 'budgets', budgetId), {
          ...updates,
          updatedAt: new Date(),
        });
      }
    } catch (error) {
      console.error('Error adding budget transaction:', error);
    }
  };

  const handleAddBudget = async (budgetData: any) => {
    try {
      await addBudget(budgetData);
    } catch (error) {
      console.error('Error saving budget:', error);
    }
  };

  if (goalsLoading || budgetsLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Manage your savings goals and budget</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('goals')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'goals'
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Target className="h-4 w-4" />
              <span>Goals</span>
            </button>
            <button
              onClick={() => setActiveTab('budget')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'budget'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Wallet className="h-4 w-4" />
              <span>Budget</span>
            </button>
            <button
              onClick={() => setActiveTab('loan')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'loan'
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <LandPlot className="h-4 w-4" />
              <span>Loan</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'goals' ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Your Goals</h2>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">{goals.length} active goals</span>
                <button
                  onClick={() => setShowAddGoalModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                  <span>New Goal</span>
                </button>
              </div>
            </div>
            
            {goals.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
                  <Target className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No savings goals yet</h3>
                <p className="text-gray-600 mb-4">Create your first savings goal to start tracking your progress</p>
                <button
                  onClick={() => setShowAddGoalModal(true)}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Create Your First Goal
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {goals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onAddTransaction={handleAddTransaction}
                    onEditGoal={handleEditGoal}
                  />
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'budget' ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Your Budget</h2>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">{budgets.length} active budgets</span>
                <button
                  onClick={() => setShowAddBudgetModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                  <span>New Budget</span>
                </button>
              </div>
            </div>
            
            {budgets.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
                  <Wallet className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No budgets yet</h3>
                <p className="text-gray-600 mb-4">Create your first budget to start tracking your expenses</p>
                <button
                  onClick={() => setShowAddBudgetModal(true)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Your First Budget
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {budgets.map((budget) => (
                  <BudgetCard
                    key={budget.id}
                    budget={budget}
                    onAddTransaction={handleAddBudgetTransaction}
                  />
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'loan' ? (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Your Loans</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-600">Loan content goes here.</p>
            </div>
          </div>
        ) : null}

        {/* Stats Cards */}
        {activeTab === 'goals' && <StatsCards goals={goals} />}

        {/* Charts */}
        {activeTab === 'goals' && <SavingsChart goals={goals} />}

        {/* Add Goal Modal */}
        <AddGoalModal
          isOpen={showAddGoalModal}
          onClose={closeModal}
          onAdd={handleAddGoal}
          editGoal={editingGoal}
        />

        {/* Add Budget Modal */}
        <AddBudgetModal
          isOpen={showAddBudgetModal}
          onClose={() => setShowAddBudgetModal(false)}
          onAdd={handleAddBudget}
        />
      </div>
    </Layout>
  );
};

export default Dashboard;