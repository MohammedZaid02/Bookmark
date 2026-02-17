export default function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-20">
            {/* Animated illustration */}
            <div className="relative mb-8">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-20 blur-2xl absolute inset-0 animate-pulse" />
                <div className="relative w-32 h-32 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl flex items-center justify-center border border-gray-200 dark:border-gray-800">
                    <svg
                        className="w-16 h-16 text-gray-400 dark:text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                        />
                    </svg>
                </div>
            </div>

            {/* Text */}
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                No bookmarks yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-8">
                Start building your collection by adding your first bookmark. Keep all your favorite links organized in one place.
            </p>

            {/* Hint */}
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                </svg>
                <span>Click "Add Bookmark" to get started</span>
            </div>
        </div>
    );
}
