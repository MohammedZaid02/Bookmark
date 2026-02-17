// Database types matching smartbookmark.sbookmarktbl schema
export interface DbBookmark {
    bookmark_id: number;
    user_id: string;
    url: string;
    title: string;
    description: string;
    favicon_url: string;
    is_favorite: boolean;
    is_archived: boolean;
    is_deleted: boolean;
    click_count: number;
    folder_name: string;
    tags: string;
    visibility: string;
    created_at: number;
    updated_at: number;
}

// UI-friendly bookmark type (for components)
export interface Bookmark {
    id: string;
    title: string;
    url: string;
    description?: string;
    favicon?: string;
    tags?: string[];
    created_at: string;
    user_id: string;
}

// User type from Supabase Auth
export interface User {
    id: string;
    email: string;
    avatar_url?: string;
    full_name?: string;
}

// Helper to convert DB bookmark to UI bookmark
export function dbToUiBookmark(db: DbBookmark): Bookmark {
    return {
        id: db.bookmark_id.toString(),
        title: db.title !== 'NA' ? db.title : 'Untitled',
        url: db.url,
        description: db.description !== 'NA' ? db.description : undefined,
        favicon: db.favicon_url !== 'NA' ? db.favicon_url : undefined,
        tags: db.tags !== 'NA' ? db.tags.split(',').map(t => t.trim()) : undefined,
        created_at: new Date(db.created_at * 1000).toISOString(),
        user_id: db.user_id,
    };
}

// Helper to create new bookmark insert object
export function createBookmarkInsert(
    user_id: string,
    url: string,
    title: string,
    description?: string,
    favicon_url?: string,
    tags?: string[]
): Partial<DbBookmark> {
    const now = Date.now() / 1000;

    return {
        user_id,
        url,
        title: title || 'NA',
        description: description || 'NA',
        favicon_url: favicon_url || 'NA',
        tags: tags && tags.length > 0 ? tags.join(', ') : 'NA',
        is_favorite: false,
        is_archived: false,
        is_deleted: false,
        click_count: 0,
        folder_name: 'General',
        visibility: 'private',
        created_at: now,
        updated_at: now,
    };
}
