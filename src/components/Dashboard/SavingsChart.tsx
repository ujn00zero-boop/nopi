import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { SavingsGoal } from '../../types';

interface SavingsChartProps {
  goals: SavingsGoal[];
}

const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#6B7280'];

const SavingsChart: React.FC<SavingsChartProps> = ({ goals }) => {
  const pieData = goals.map((goal, index) => ({
    name: goal.name,
    value: goal.currentAmount,
    color: COLORS[index % COLORS.length],
  }));

  const barData = goals.map(goal => ({
    name: goal.name,
    current: goal.currentAmount,
    target: goal.targetAmount,
    progress: (goal.currentAmount / goal.targetAmount) * 100,
  }));

  if (goals.length === 0) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Savings Distribution</h3>
          <div className="flex items-center justify-center h-64 text-gray-500">
            <p>No goals to display</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Goal Progress</h3>
          <div className="flex items-center justify-center h-64 text-gray-500">
            <p>No goals to display</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Savings Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={5}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Amount']} />
            <Tooltip formatter={(value: number) => [`₱${value.toLocaleString()}`, 'Amount']} />
          </PieChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-2 gap-2 mt-4">
          {pieData.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-gray-600 truncate">{entry.name}</span>
            </div>
          ))}
        </div>
      </div>

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
    </div>
  );
};

export default SavingsChart;