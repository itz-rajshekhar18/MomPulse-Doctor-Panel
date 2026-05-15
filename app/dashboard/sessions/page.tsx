'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Sidebar, TopBar } from '@/components/dashboard';

export default function SessionsPage() {
  const [activeSection, setActiveSection] = useState('sessions');
  const router = useRouter();

  return (
    <div className="flex h-screen bg-[#f5f4f0]">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />

        <div className="flex-1 overflow-auto p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Sessions</h1>
              <p className="text-gray-500 mt-1">Manage and schedule your health sessions.</p>
            </div>
            <button
              onClick={() => router.push('/dashboard/sessions/schedule')}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold rounded-full shadow-md transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Schedule New Session
            </button>
          </div>

          <div className="bg-white rounded-2xl p-12 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No sessions yet</h3>
            <p className="text-gray-500 mb-6 max-w-sm">
              Schedule your first session to start connecting with patients through workshops and consultations.
            </p>
            <button
              onClick={() => router.push('/dashboard/sessions/schedule')}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-full transition-colors"
            >
              Schedule a Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
