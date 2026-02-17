import Navbar from '@/components/Navbar';
import AuthButton from '@/components/AuthButton';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="relative pt-32 pb-20 px-4">
        {/* Background gradient blur effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl" />
          <div className="absolute top-1/3 -right-48 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Hero content */}
          <div className="mb-8 inline-block">
            <span className="px-4 py-2 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 border border-purple-500/20 rounded-full text-sm font-semibold text-purple-600 dark:text-purple-400">
              ✨ Smart Bookmark Management
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
            Organize Your
            <br />
            Digital Life
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Keep all your favorite links organized in one beautiful place.
            Smart, simple, and lightning fast.
          </p>

          {/* CTA button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <AuthButton />
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 text-gray-900 dark:text-white rounded-2xl font-semibold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              View Demo
            </Link>
          </div>

          {/* Feature cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-20">
            <div className="group p-8 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-800/50 shadow-xl hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 hover:scale-105">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Lightning Fast</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Instant search and organization. Find what you need in milliseconds.
              </p>
            </div>

            <div className="group p-8 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-800/50 shadow-xl hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 hover:scale-105">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Smart Tags</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Organize with tags and categories. Never lose track again.
              </p>
            </div>

            <div className="group p-8 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-800/50 shadow-xl hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 hover:scale-105">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-red-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Beautiful Design</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Modern, clean interface that's a joy to use every day.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
