import React, { useState } from 'react';
import { HandCoins, Plus, Users, Clock, DollarSign, Calendar } from 'lucide-react';
import Layout from '../components/Layout';

const Lend: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'lent' | 'borrowed'>('lent');

  // Mock data - replace with actual data from hooks
  const lentMoney = [
    {
      id: '1',
      borrowerName: 'John Doe',
      amount: 5000,
      date: new Date('2024-01-15'),
      dueDate: new Date('2024-02-15'),
      status: 'pending',
      description: 'Emergency medical expenses'
    },
    {
      id: '2',
      borrowerName: 'Jane Smith',
      amount: 2500,
      date: new Date('2024-01-10'),
      dueDate: new Date('2024-02-10'),
      status: 'paid',
      description: 'Car repair'
    }
  ];

  const borrowedMoney = [
    {
      id: '1',
      lenderName: 'Mike Johnson',
      amount: 3000,
      date: new Date('2024-01-20'),
      dueDate: new Date('2024-02-20'),
      status: 'pending',
      description: 'Home renovation'
    }
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-700';
      case 'overdue':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  const totalLent = lentMoney.reduce((sum, item) => sum + item.amount, 0);
  const totalBorrowed = borrowedMoney.reduce((sum, item) => sum + item.amount, 0);
  const pendingLent = lentMoney.filter(item => item.status === 'pending').reduce((sum, item) => sum + item.amount, 0);
  const pendingBorrowed = borrowedMoney.filter(item => item.status === 'pending').reduce((sum, item) => sum + item.amount, 0);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lend & Borrow</h1>
          <p className="text-gray-600">Track money you've lent and borrowed</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Lent</p>
                <p className="text-2xl font-semibold text-gray-900">₱{totalLent.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <HandCoins className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Borrowed</p>
                <p className="text-2xl font-semibold text-gray-900">₱{totalBorrowed.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Lent</p>
                <p className="text-2xl font-semibold text-gray-900">₱{pendingLent.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Borrowed</p>
                <p className="text-2xl font-semibold text-gray-900">₱{pendingBorrowed.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('lent')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'lent'
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <DollarSign className="h-4 w-4" />
              <span>Money Lent</span>
            </button>
            <button
              onClick={() => setActiveTab('borrowed')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'borrowed'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <HandCoins className="h-4 w-4" />
              <span>Money Borrowed</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {activeTab === 'lent' ? 'Money You\'ve Lent' : 'Money You\'ve Borrowed'}
            </h2>
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm">
              <Plus className="h-4 w-4" />
              <span>{activeTab === 'lent' ? 'Add Lent Money' : 'Add Borrowed Money'}</span>
            </button>
          </div>

          {/* List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {activeTab === 'lent' ? (
              lentMoney.length === 0 ? (
                <div className="text-center py-12">
                  <DollarSign className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg text-gray-500 mb-2">No money lent yet</p>
                  <p className="text-sm text-gray-400">Start tracking money you've lent to others</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {lentMoney.map((item) => (
                    <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{item.borrowerName}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                          <div className="flex items-center space-x-6 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>Lent: {formatDate(item.date)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>Due: {formatDate(item.dueDate)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="ml-6 text-right">
                          <p className="text-2xl font-bold text-green-600">₱{item.amount.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              borrowedMoney.length === 0 ? (
                <div className="text-center py-12">
                  <HandCoins className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg text-gray-500 mb-2">No money borrowed yet</p>
                  <p className="text-sm text-gray-400">Start tracking money you've borrowed from others</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {borrowedMoney.map((item) => (
                    <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{item.lenderName}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                          <div className="flex items-center space-x-6 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>Borrowed: {formatDate(item.date)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>Due: {formatDate(item.dueDate)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="ml-6 text-right">
                          <p className="text-2xl font-bold text-blue-600">₱{item.amount.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Lend;