'use client';

interface MonthlyEarningsProps {
  earnings: number;
  percentageChange: number;
}

export default function MonthlyEarnings({ earnings, percentageChange }: MonthlyEarningsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 rounded-2xl p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-800 dark:to-pink-800 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">MONTHLY EARNINGS</h3>
          <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <div className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {formatCurrency(earnings)}
          </div>
          <div className="flex items-center gap-2">
            <span className={`flex items-center gap-1 text-sm font-medium ${
              percentageChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {percentageChange >= 0 ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
              {Math.abs(percentageChange)}%
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">from last month</span>
          </div>
        </div>

        {/* Mini chart placeholder */}
        <div className="h-16 bg-white/50 dark:bg-black/20 rounded-lg flex items-end justify-between px-2 py-2">
          {Array.from({ length: 12 }).map((_, index) => (
            <div
              key={index}
              className="bg-gradient-to-t from-purple-400 to-purple-300 dark:from-purple-500 dark:to-purple-400 rounded-sm"
              style={{
                height: `${Math.random() * 80 + 20}%`,
                width: '6px',
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}