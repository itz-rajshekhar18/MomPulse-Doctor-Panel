'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function TopBar() {
  const { doctor } = useAuth();

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-8 py-4 flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">MomPulse Admin</h2>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19c-5 0-8-3-8-6s3-6 8-6 8 3 8 6-3 6-8 6z" />
          </svg>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            3
          </span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Dr. {doctor?.name || 'Doctor'}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{doctor?.specialization || 'Specialist'}</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {doctor?.name?.charAt(0) || 'D'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}