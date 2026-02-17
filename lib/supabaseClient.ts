import { createBrowserClient } from '@supabase/ssr';

// Check if Supabase credentials are configured
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const isConfigured =
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('your-supabase-url') &&
    !supabaseAnonKey.includes('your-supabase-anon-key');

if (!isConfigured) {
    console.warn('⚠️ Supabase credentials not configured. Please add to .env.local');
}

export function createClient() {
    return createBrowserClient(
        supabaseUrl,
        supabaseAnonKey
    );
}

// Auth helpers for client components
export const loginWithGoogle = async () => {
    if (!isConfigured) {
        throw new Error('Supabase credentials not configured. Please check .env.local file.');
    }

    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${window.location.origin}/auth/callback`,
        },
    });

    if (error) {
        console.error('Error logging in:', error.message);
        throw error;
    }

    return data;
};

export const logout = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error('Error logging out:', error.message);
        throw error;
    }
};
