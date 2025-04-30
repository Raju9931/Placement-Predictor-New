
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/database.types'

// Supabase client setup
// Default to empty strings if env variables are missing, but show a warning
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if the Supabase credentials are missing and provide console warnings
if (!supabaseUrl) {
  console.error('Missing VITE_SUPABASE_URL environment variable');
}
if (!supabaseAnonKey) {
  console.error('Missing VITE_SUPABASE_ANON_KEY environment variable');
}

// Create the Supabase client with fallback values to prevent runtime errors
export const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder-url.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// Authentication helper functions
export const getCurrentUser = async () => {
  // Return null if Supabase is not properly configured
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase not configured: getCurrentUser returning null');
    return null;
  }
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export const signOut = async () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase not configured: signOut returning empty promise');
    return Promise.resolve();
  }
  
  return supabase.auth.signOut();
}
