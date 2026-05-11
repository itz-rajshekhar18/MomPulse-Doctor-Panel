'use client';

import { Appointment } from '@/lib/firestore';

interface TodaysAppointmentsProps {
  appointments: Appointment[];
  loading: boolean;
}

export default function TodaysAppointments({ appointments, loading }: TodaysAppointmentsProps) {
  const formatTime = (date: any) => {
    if (!date) return '';
    const appointmentDate = date.toDate ? date.toDate() : new Date(date);
    return appointmentDate.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const getAppointmentTypeColor = (notes: string) => {
    if (notes?.toLowerCase().includes('video')) return 'bg-purple-100 text-purple-700';
    if (notes?.toLowerCase().includes('clinic')) return 'bg-blue-100 text-blue-700';
    return 'bg-green-100 text-green-700';
  };

  const getAppointmentTypeLabel = (notes: string) => {
    if (notes?.toLowerCase().includes('video')) return 'VIDEO CALL';
    if (notes?.toLowerCase().includes('clinic')) return 'IN-CLINIC';
    return 'CONSULTATION';
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Today's Appointments</h3>
          <p className="text-gray-500">March 24, 2024</p>
        </div>
        <button className="text-purple-600 hover:text-purple-700 font-medium">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl animate-pulse">
              <div className="w-16 h-12 bg-gray-200 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="w-20 h-6 bg-gray-200 rounded-full"></div>
            </div>
          ))
        ) : appointments.length > 0 ? (
          appointments.map((appointment) => (
            <div key={appointment.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">
                  {formatTime(appointment.appointmentDate)}
                </div>
              </div>
              
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{appointment.patientName}</h4>
                <p className="text-sm text-gray-600">
                  {appointment.notes || 'General consultation'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAppointmentTypeColor(appointment.notes || '')}`}>
                  {getAppointmentTypeLabel(appointment.notes || '')}
                </span>
                
                {appointment.notes?.toLowerCase().includes('video') && (
                  <button className="w-10 h-10 bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center justify-center text-white transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                    </svg>
                  </button>
                )}

                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8a2 2 0 100-4 2 2 0 000 4zm0 0v4m-4-8a2 2 0 100-4 2 2 0 000 4zm8 0a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
            <p className="text-gray-500">No appointments scheduled for today</p>
          </div>
        )}
      </div>
    </div>
  );
}