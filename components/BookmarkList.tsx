'use client';

import type { Bookmark } from '@/lib/types';
import BookmarkCard from './BookmarkCard';

interface BookmarkListProps {
    bookmarks: Bookmark[];
    onDelete: (id: string) => void;
}

export default function BookmarkList({ bookmarks, onDelete }: BookmarkListProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map((bookmark) => (
                <BookmarkCard
                    key={bookmark.id}
                    bookmark={bookmark}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}
