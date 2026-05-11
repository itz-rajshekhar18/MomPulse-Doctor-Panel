'use client';

interface Workshop {
  id: string;
  title: string;
  registeredCount: number;
  image: string;
}

interface UpcomingWorkshopsProps {
  workshops: Workshop[];
}

export default function UpcomingWorkshops({ workshops }: UpcomingWorkshopsProps) {
  const defaultWorkshops: Workshop[] = [
    {
      id: '1',
      title: 'Prenatal Wellness Workshop',
      registeredCount: 45,
      image: '/workshop-1.jpg'
    },
    {
      id: '2',
      title: 'Postpartum Recovery Session',
      registeredCount: 32,
      image: '/workshop-2.jpg'
    }
  ];

  const displayWorkshops = workshops.length > 0 ? workshops : defaultWorkshops;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Workshops</h3>
      
      <p className="text-gray-600 mb-6">
        You have 2 group wellness sessions scheduled for this weekend. 45 moms have already registered.
      </p>

      {/* Workshop participants avatars */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex -space-x-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full border-2 border-white flex items-center justify-center"
            >
              <span className="text-white text-xs font-semibold">
                {String.fromCharCode(65 + index)}
              </span>
            </div>
          ))}
          <div className="w-8 h-8 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center">
            <span className="text-gray-600 text-xs font-semibold">+42</span>
          </div>
        </div>
      </div>

      {/* Workshop image placeholder */}
      <div className="relative mb-6">
        <div className="w-full h-32 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="text-white text-center">
              <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-medium">Wellness Session</p>
            </div>
          </div>
        </div>
      </div>

      <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-medium transition-colors">
        Manage Sessions
      </button>
    </div>
  );
}