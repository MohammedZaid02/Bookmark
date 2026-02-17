export default function Loader() {
    return (
        <div className="flex items-center justify-center py-20">
            <div className="relative">
                {/* Outer spinning ring */}
                <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-800 border-t-transparent rounded-full animate-spin" />

                {/* Inner gradient circle */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-50 blur-sm animate-pulse" />
                </div>

                {/* Center dot */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-full" />
                </div>
            </div>
        </div>
    );
}
