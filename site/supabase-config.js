// Shared Supabase client config, included via <script> on every page that
// needs auth/data. Keep credentials here only — page scripts hold no keys.
// The publishable key is safe for the browser: access is controlled by RLS.
const SUPABASE_URL = 'https://cyxokdvhfqnvdkonayui.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_-8oxkqOfBYuTAqrl00yvAQ_1RX00bQ4';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
