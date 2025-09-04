import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { SavingsGoal } from '../../types';

interface SavingsChartProps {
  goals: SavingsGoal[];
}

const SavingsChart: React.FC<SavingsChartProps> = ({ goals }) => {
  const barData = goals.map(goal => ({
    name: goal.name,
    current: goal.currentAmount,
    target: goal.targetAmount,
    progress: (goal.currentAmount / goal.targetAmount) * 100,
  }));

  if (goals.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Goal Progress</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          <p>No goals to display</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Goal Progress</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }}
            interval={0}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip 
            formatter={(value: number, name: string) => [
              `₱${value.toLocaleString()}`,
              name === 'current' ? 'Current' : 'Target'
            ]}
          />
          <Bar dataKey="target" fill="#E5E7EB" name="target" />
          <Bar dataKey="current" fill="#10B981" name="current" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SavingsChart;