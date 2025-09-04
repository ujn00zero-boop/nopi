import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Layout from '../components/Layout';
import StatsCards from '../components/Dashboard/StatsCards';
import GoalCard from '../components/Dashboard/GoalCard';
import AddGoalModal from '../components/Dashboard/AddGoalModal';
import SavingsChart from '../components/Dashboard/SavingsChart';
import { useSavingsGoals } from '../hooks/useSavingsGoals';
import { SavingsGoal } from '../types';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const Dashboard: React.FC = () => {
  const { goals, loading: goalsLoading, addGoal, updateGoal } = useSavingsGoals();
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);

  const addTransaction = async (transactionData: any) => {
    // This will be handled by the useTransactions hook when called
    const { addTransaction: addTransactionFn } = await import('../hooks/useTransactions');
    // For now, we'll just handle the goal update here
  };

  const handleAddTransaction = async (goalId: string, amount: number, type: 'deposit' | 'withdrawal', description: string) => {
    try {
      // Add transaction
      await addTransaction({
        goalId,
        amount,
        type,
        description,
        date: new Date(),
      });

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

  if (goalsLoading) {
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
            <h1 className="text-2xl font-bold text-gray-900">Savings Dashboard</h1>
            <p className="text-gray-600">Track your savings goals and monitor progress</p>
          </div>
          <div>
            <button
              onClick={() => setShowAddGoalModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
            >
              <Plus className="h-5 w-5" />
              <span>New Goal</span>
            </button>
          </div>
        </div>
{/* Goals and Transactions */}
        <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Your Goals</h2>
              <span className="text-sm text-gray-500">{goals.length} active goals</span>
            </div>
            
            {goals.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
                  <Plus className="h-8 w-8 text-green-600" />
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
        {/* Stats Cards */}
        <StatsCards goals={goals} />

        {/* Charts */}
        <SavingsChart goals={goals} />

        

        {/* Add Goal Modal */}
        <AddGoalModal
          isOpen={showAddGoalModal}
          onClose={closeModal}
          onAdd={handleAddGoal}
          editGoal={editingGoal}
        />
      </div>
    </Layout>
  );
};

export default Dashboard;