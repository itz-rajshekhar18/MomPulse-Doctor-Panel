'use client';

interface ArticleSubmission {
  id: string;
  title: string;
  status: 'needs-review' | 'published' | 'rejected';
}

interface ArticleSubmissionsProps {
  articles: ArticleSubmission[];
  onEdit: (id: string) => void;
  onView: (id: string) => void;
}

const ArticleIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

export default function ArticleSubmissions({ articles, onEdit, onView }: ArticleSubmissionsProps) {
  const defaultArticles: ArticleSubmission[] = [
    {
      id: '1',
      title: 'Nutrition in Trimester 3',
      status: 'needs-review',
    },
    {
      id: '2',
      title: 'Sleep Training Guide',
      status: 'published',
    }
  ];

  const displayArticles = articles.length > 0 ? articles : defaultArticles;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'needs-review': return 'bg-yellow-50 border-yellow-200';
      case 'published':    return 'bg-green-50 border-green-200';
      case 'rejected':     return 'bg-red-50 border-red-200';
      default:             return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'needs-review': return 'Needs Review';
      case 'published':    return 'Published';
      case 'rejected':     return 'Rejected';
      default:             return 'Unknown';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'needs-review': return 'bg-yellow-100 text-yellow-800';
      case 'published':    return 'bg-green-100 text-green-800';
      case 'rejected':     return 'bg-red-100 text-red-800';
      default:             return 'bg-gray-100 text-gray-800';
    }
  };

  const getIconBg = (status: string) => {
    switch (status) {
      case 'needs-review': return 'bg-yellow-100 text-yellow-600';
      case 'published':    return 'bg-green-100 text-green-600';
      case 'rejected':     return 'bg-red-100 text-red-600';
      default:             return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Article Submissions</h3>

      <div className="space-y-4">
        {displayArticles.map((article) => (
          <div
            key={article.id}
            className={`flex items-center justify-between p-4 rounded-xl border-2 transition-colors ${getStatusColor(article.status)}`}
          >
            <div className="flex items-center gap-4 flex-1">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getIconBg(article.status)}`}>
                <ArticleIcon />
              </div>

              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">{article.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Status:{' '}
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(article.status)}`}>
                    {getStatusLabel(article.status)}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {article.status === 'needs-review' && (
                <button
                  onClick={() => onEdit(article.id)}
                  className="px-3 py-1 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg text-sm font-medium transition-colors"
                >
                  EDIT
                </button>
              )}

              {article.status === 'published' && (
                <button
                  onClick={() => onView(article.id)}
                  className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  title="View"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
