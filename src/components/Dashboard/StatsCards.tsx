import React from 'react';
import { TrendingUp, Target, DollarSign, Calendar } from 'lucide-react';
import { SavingsGoal } from '../../types';

interface StatsCardsProps {
  goals: SavingsGoal[];
}

const StatsCards: React.FC<StatsCardsProps> = ({ goals }) => {
  const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const completedGoals = goals.filter(goal => goal.currentAmount >= goal.targetAmount).length;
  const upcomingDeadlines = goals.filter(goal => {
    const daysUntil = Math.ceil((goal.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return daysUntil <= 30 && goal.currentAmount < goal.targetAmount;
  }).length;

  const stats = [
    {
      title: 'Total Saved',
      value: `₱${totalSaved.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      title: 'Savings Rate',
      value: `${totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0}%`,
      icon: TrendingUp,
      color: 'bg-blue-500',
    },
    {
      title: 'Goals Completed',
      value: completedGoals.toString(),
      icon: Target,
      color: 'bg-purple-500',
    },
    {
      title: 'Upcoming Deadlines',
      value: upcomingDeadlines.toString(),
      icon: Calendar,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className={`${stat.color} p-3 rounded-lg`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;