'use client';

import { useAuth } from '@/contexts/AuthContext';

interface DashboardHeaderProps {
  appointmentsToday: number;
  pendingApprovals: number;
}

export default function DashboardHeader({ appointmentsToday, pendingApprovals }: DashboardHeaderProps) {
  const { doctor } = useAuth();

  return (
    <div className="bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-700 dark:to-purple-800 rounded-2xl p-8 text-white mb-8">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-4">
            Welcome back, Dr. {doctor?.name?.split(' ').pop() || 'Doctor'}.
          </h1>
          <p className="text-purple-100 dark:text-purple-200 text-lg mb-6 max-w-2xl">
            Your dashboard is looking healthy. You have {appointmentsToday} appointments scheduled for today 
            and {pendingApprovals} new session approvals pending.
          </p>
        </div>
        
        <div className="flex gap-3">
          <button className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-medium transition-colors">
            View Calendar
          </button>
          <button className="bg-white dark:bg-gray-100 text-purple-600 hover:bg-gray-50 dark:hover:bg-gray-200 px-6 py-3 rounded-xl font-medium transition-colors">
            Patient Records
          </button>
        </div>
      </div>
    </div>
  );
}