'use client';

// Force dynamic rendering for this personalized route
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import BookmarkList from '@/components/BookmarkList';
import AddBookmarkModal from '@/components/AddBookmarkModal';
import EmptyState from '@/components/EmptyState';
import Loader from '@/components/Loader';
import { createClient } from '@/lib/supabaseClient';
import type { Bookmark, DbBookmark } from '@/lib/types';
import { dbToUiBookmark, createBookmarkInsert } from '@/lib/types';
import { getFaviconUrl } from '@/lib/utils';
import type { User } from '@supabase/supabase-js';

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        console.log('🌍 ========== ENVIRONMENT AUDIT ==========');
        console.log('📍 Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
        console.log('🔑 Anon Key (first 20 chars):', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...');
        console.log('🖥️ Window Location:', window.location.href);

        const supabase = createClient();
        let channel: ReturnType<typeof supabase.channel> | null = null;

        const initializeData = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();

                if (!session) {
                    router.push('/login');
                    return;
                }

                setUser(session.user);

                console.log('🔐 ========== AUTH AUDIT ==========');
                console.log('👤 Logged in user:', {
                    id: session.user.id,
                    email: session.user.email,
                    provider: session.user.app_metadata?.provider
                });
                console.log('🔍 Fetching bookmarks for user_id:', session.user.id);
                console.log('📊 Query details:', {
                    table: 'sbookmarktbl',
                    schema: 'public (implicit)',
                    filter_user_id: session.user.id,
                    filter_is_deleted: false
                });

                const { data, error: fetchError } = await supabase
                    .from('sbookmarktbl')
                    .select('*')
                    .eq('user_id', session.user.id)
                    .eq('is_deleted', false)
                    .order('created_at', { ascending: false });

                console.log('📦 RAW FETCH RESULT:');
                console.log('  Data:', data);
                console.log('  Error:', fetchError);
                console.log('  Data type:', typeof data);
                console.log('  Data is array:', Array.isArray(data));
                console.log('  Data length:', data?.length);

                if (fetchError) {
                    console.error('❌ FETCH ERROR DETECTED');
                    console.error('Error object:', fetchError);
                    console.error('Error stringified:', JSON.stringify(fetchError, null, 2));
                    console.error('Error message:', fetchError.message);
                    console.error('Error code:', fetchError.code);
                    console.error('Error details:', fetchError.details);
                    console.error('Error hint:', fetchError.hint);

                    // Detailed user message
                    let userMessage = 'Failed to load bookmarks.';
                    if (fetchError.message) {
                        if (fetchError.message.includes('does not exist') || fetchError.message.includes('relation')) {
                            userMessage = 'Table "sbookmarktbl" not found. Run: ALTER TABLE smartbookmark.sbookmarktbl SET SCHEMA public;';
                        } else if (fetchError.message.includes('permission') || fetchError.message.includes('denied')) {
                            userMessage = 'Permission denied. Grant permissions to anon/authenticated roles.';
                        } else {
                            userMessage = `Error: ${fetchError.message}`;
                        }
                    }
                    console.error('User message:', userMessage);
                    setError(userMessage);
                    setBookmarks([]);
                } else {
                    console.log('✅ FETCH SUCCESS');
                    console.log('📊 Bookmark count:', data?.length || 0);
                    if (data && data.length > 0) {
                        console.log('📋 Bookmarks found:');
                        data.forEach((bm: any, idx: number) => {
                            console.log(`  ${idx + 1}. user_id: ${bm.user_id}, title: ${bm.title}`);
                        });
                    } else {
                        console.log('⚠️ No bookmarks found for this user_id');
                    }
                    if (data && data.length > 0) {
                        const uiBookmarks = (data as DbBookmark[]).map(dbToUiBookmark);
                        setBookmarks(uiBookmarks);
                    } else {
                        // No bookmarks yet - this is OK, show empty state
                        setBookmarks([]);
                    }
                }

                // Set up realtime subscription
                console.log('🔌 Setting up realtime subscription for user:', session.user.id);

                channel = supabase
                    .channel(`bookmarks-${session.user.id}`) // Unique channel per user
                    .on(
                        'postgres_changes',
                        {
                            event: '*',
                            schema: 'public',
                            table: 'sbookmarktbl',
                            filter: `user_id=eq.${session.user.id}`,
                        },
                        (payload) => {
                            console.log('📡 Realtime update received:', payload.eventType, payload);

                            if (payload.eventType === 'INSERT') {
                                console.log('➕ INSERT event - Adding new bookmark');
                                const newBookmark = dbToUiBookmark(payload.new as DbBookmark);
                                setBookmarks((prev) => {
                                    // Prevent duplicates
                                    if (prev.some(b => b.id === newBookmark.id)) {
                                        console.log('⚠️ Duplicate bookmark detected, skipping');
                                        return prev;
                                    }
                                    console.log('✅ Bookmark added to UI via realtime');
                                    return [newBookmark, ...prev];
                                });
                            } else if (payload.eventType === 'UPDATE') {
                                console.log('🔄 UPDATE event');
                                const updated = payload.new as DbBookmark;
                                if (updated.is_deleted) {
                                    console.log('🗑️ Soft delete detected - Removing from UI');
                                    // Remove from UI
                                    setBookmarks((prev) => prev.filter(b => b.id !== updated.bookmark_id.toString()));
                                } else {
                                    console.log('📝 Updating bookmark in UI');
                                    // Update in place
                                    setBookmarks((prev) =>
                                        prev.map(b =>
                                            b.id === updated.bookmark_id.toString()
                                                ? dbToUiBookmark(updated)
                                                : b
                                        )
                                    );
                                }
                            } else if (payload.eventType === 'DELETE') {
                                console.log('❌ DELETE event - Removing bookmark');
                                const deleted = payload.old as DbBookmark;
                                setBookmarks((prev) => prev.filter(b => b.id !== deleted.bookmark_id.toString()));
                            }
                        }
                    )
                    .subscribe((status) => {
                        console.log('📡 Realtime subscription status:', status);
                        if (status === 'SUBSCRIBED') {
                            console.log('✅ Successfully subscribed to realtime updates');
                        } else if (status === 'CHANNEL_ERROR') {
                            console.warn('⚠️ Realtime connection error (will auto-reconnect)');
                        } else if (status === 'TIMED_OUT') {
                            console.error('⏱️ Realtime subscription timed out');
                        } else if (status === 'CLOSED') {
                            console.log('🔌 Realtime subscription closed');
                        }
                    });


            } catch (error) {
                console.error('Error initializing dashboard:', error);
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };

        initializeData();

        // Cleanup subscription on unmount
        return () => {
            if (channel) {
                supabase.removeChannel(channel);
            }
        };
    }, [router]);

    const handleAddBookmark = async (newBookmark: {
        title: string;
        url: string;
        description?: string;
        tags?: string[];
    }) => {
        if (!user) return;

        const supabase = createClient();
        const faviconUrl = getFaviconUrl(newBookmark.url);

        try {
            console.log('➕ ========== INSERT AUDIT ==========');
            console.log('👤 Inserting for user_id:', user.id);

            const insertData = createBookmarkInsert(
                user.id,
                newBookmark.url,
                newBookmark.title,
                newBookmark.description,
                faviconUrl,
                newBookmark.tags
            );

            console.log('📝 Insert data:', {
                user_id: insertData.user_id,
                url: insertData.url,
                title: insertData.title
            });

            const { data, error: insertError } = await supabase
                .from('sbookmarktbl')
                .insert(insertData)
                .select()
                .single();

            if (insertError) {
                // Check for duplicate URL error
                if (insertError.code === '23505') {
                    setError('This URL is already bookmarked!');
                    setTimeout(() => setError(''), 3000);
                } else {
                    console.error('Error adding bookmark:', insertError);
                    setError('Failed to add bookmark');
                    setTimeout(() => setError(''), 3000);
                }
                return;
            }

            // Realtime will handle adding to UI, but for optimistic update:
            if (data) {
                const uiBookmark = dbToUiBookmark(data as DbBookmark);
                setBookmarks((prev) => {
                    if (prev.some(b => b.id === uiBookmark.id)) {
                        return prev;
                    }
                    return [uiBookmark, ...prev];
                });
            }
        } catch (err) {
            console.error('Error adding bookmark:', err);
            setError('Failed to add bookmark');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleDeleteBookmark = async (id: string) => {
        if (!user) return;

        const supabase = createClient();

        try {
            // Soft delete
            const { error: deleteError } = await supabase
                .from('sbookmarktbl')
                .update({
                    is_deleted: true,
                    updated_at: Date.now() / 1000,
                })
                .eq('bookmark_id', parseInt(id))
                .eq('user_id', user.id);

            if (deleteError) {
                console.error('Error deleting bookmark:', deleteError);
                setError('Failed to delete bookmark');
                setTimeout(() => setError(''), 3000);
                return;
            }

            // Optimistically remove from UI
            setBookmarks((prev) => prev.filter((b) => b.id !== id));
        } catch (err) {
            console.error('Error deleting bookmark:', err);
            setError('Failed to delete bookmark');
            setTimeout(() => setError(''), 3000);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen">
                <Navbar />
                <div className="pt-32">
                    <Loader />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <Navbar />

            <main className="pt-24 pb-20 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-12">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                                My Bookmarks
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                {bookmarks.length} {bookmarks.length === 1 ? 'bookmark' : 'bookmarks'} saved
                            </p>
                        </div>

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="mt-4 sm:mt-0 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 flex items-center space-x-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Add Bookmark</span>
                        </button>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400">
                            {error}
                        </div>
                    )}

                    {/* Bookmarks */}
                    {bookmarks.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <BookmarkList bookmarks={bookmarks} onDelete={handleDeleteBookmark} />
                    )}
                </div>
            </main>

            {/* Add Bookmark Modal */}
            <AddBookmarkModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddBookmark}
            />
        </div>
    );
}
