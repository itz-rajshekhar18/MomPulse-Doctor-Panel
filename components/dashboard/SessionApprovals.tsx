'use client';

interface SessionApproval {
  id: string;
  title: string;
  proposedBy: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface SessionApprovalsProps {
  sessions: SessionApproval[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export default function SessionApprovals({ sessions, onApprove, onReject }: SessionApprovalsProps) {
  const defaultSessions: SessionApproval[] = [
    {
      id: '1',
      title: 'Postnatal Yoga Core',
      proposedBy: 'Coach Maria',
      date: 'Oct 12',
      status: 'pending'
    },
    {
      id: '2',
      title: 'Infant First Aid basics',
      proposedBy: 'Nurse Kelly',
      date: 'Oct 15',
      status: 'pending'
    }
  ];

  const displaySessions = sessions.length > 0 ? sessions : defaultSessions;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Session Approvals</h3>

      <div className="space-y-4">
        {displaySessions.map((session) => (
          <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v4h8v-4zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>

              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">{session.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Proposed by {session.proposedBy} • {session.date}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onReject(session.id)}
                className="p-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Reject"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              <button
                onClick={() => onApprove(session.id)}
                className="p-2 text-green-500 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                title="Approve"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}