'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getDashboardStats, getTodaysAppointments, Appointment } from '@/lib/firestore';
import {
  DashboardHeader,
  Sidebar,
  TopBar,
  TodaysAppointments,
  MonthlyEarnings,
  UpcomingWorkshops,
  SessionApprovals,
  ArticleSubmissions
} from '@/components/dashboard';

interface DashboardStats {
  totalPatients: number;
  todaysAppointmentCount: number;
  wellnessScore: number;
  recentAppointments: Appointment[];
}

export default function DashboardPage() {
  const { user, doctor, loading, signOut } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [todaysAppointments, setTodaysAppointments] = useState<Appointment[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (doctor?.id) {
      loadDashboardData();
    }
  }, [user, doctor, loading, router]);

  const loadDashboardData = async () => {
    if (!doctor?.id) return;

    try {
      setStatsLoading(true);
      const [dashboardStats, appointments] = await Promise.all([
        getDashboardStats(doctor.id),
        getTodaysAppointments(doctor.id)
      ]);
      setStats(dashboardStats);
      setTodaysAppointments(appointments);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleSessionApprove = (id: string) => {
    console.log('Approved session:', id);
    // TODO: Implement session approval logic
  };

  const handleSessionReject = (id: string) => {
    console.log('Rejected session:', id);
    // TODO: Implement session rejection logic
  };

  const handleArticleEdit = (id: string) => {
    console.log('Edit article:', id);
    // TODO: Implement article edit logic
  };

  const handleArticleView = (id: string) => {
    console.log('View article:', id);
    // TODO: Implement article view logic
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <TopBar />

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Dashboard Header */}
            <DashboardHeader
              appointmentsToday={todaysAppointments.length}
              pendingApprovals={3}
            />

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Left Column - Appointments */}
              <div className="lg:col-span-2">
                <TodaysAppointments
                  appointments={todaysAppointments}
                  loading={statsLoading}
                />
              </div>

              {/* Right Column - Earnings & Workshops */}
              <div className="space-y-8">
                <MonthlyEarnings
                  earnings={14280}
                  percentageChange={12.5}
                />
                <UpcomingWorkshops workshops={[]} />
              </div>
            </div>

            {/* Bottom Grid - Approvals & Articles */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <SessionApprovals
                sessions={[]}
                onApprove={handleSessionApprove}
                onReject={handleSessionReject}
              />
              <ArticleSubmissions
                articles={[]}
                onEdit={handleArticleEdit}
                onView={handleArticleView}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}