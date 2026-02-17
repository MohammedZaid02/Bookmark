'use client';

import type { Bookmark } from '@/lib/types';
import { formatDate, getFaviconUrl, extractDomain } from '@/lib/utils';

interface BookmarkCardProps {
    bookmark: Bookmark;
    onDelete: (id: string) => void;
}

export default function BookmarkCard({ bookmark, onDelete }: BookmarkCardProps) {
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this bookmark?')) {
            onDelete(bookmark.id);
        }
    };

    return (
        <div className="group relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-800/50 shadow-lg hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 hover:scale-105">
            {/* Gradient overlay */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative">
                {/* Header with favicon and domain */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center overflow-hidden">
                            <img
                                src={bookmark.favicon || getFaviconUrl(bookmark.url)}
                                alt=""
                                className="w-6 h-6"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                }}
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
                                {extractDomain(bookmark.url)}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatDate(bookmark.created_at)}
                            </span>
                        </div>
                    </div>

                    {/* Delete button */}
                    <button
                        onClick={handleDelete}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                        aria-label="Delete bookmark"
                    >
                        <svg
                            className="w-5 h-5 text-red-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                        </svg>
                    </button>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {bookmark.title}
                </h3>

                {/* Description */}
                {bookmark.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {bookmark.description}
                    </p>
                )}

                {/* Tags */}
                {bookmark.tags && bookmark.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {bookmark.tags.slice(0, 3).map((tag, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 rounded-full border border-blue-200/50 dark:border-blue-700/50"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Visit link */}
                <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors duration-200"
                >
                    <span>Visit</span>
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                    </svg>
                </a>
            </div>
        </div>
    );
}
