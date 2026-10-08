// Shared Supabase client config, included via <script> on every page that
// needs auth/data. Keep credentials here only — page scripts hold no keys.
// The publishable key is safe for the browser: access is controlled by RLS.
const SUPABASE_URL = 'https://ivqlqvjkvwuuyymroiib.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_v8x9buUCzqvkBJxA354bbA_MSLlmUnK';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
