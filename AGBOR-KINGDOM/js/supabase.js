/* =========================================
   SUPABASE CONFIGURATION
========================================= */

const SUPABASE_URL =
    "https://flhorvkvkxbodappjspg.supabase.co";

const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsaG9ydmt2a3hib2RhcHBqc3BnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxMjAyODIsImV4cCI6MjEwMjY5NjI4Mn0.JErIhQze3daON7PF_qGBHaAIBK6si4eyDxxU77VchNk";


/* =========================================
   CREATE SUPABASE CLIENT
========================================= */

const kingdomSupabase =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY,
        {
            auth: {
                storageKey: "agbor-kingdom-public-auth",
                persistSession: false,
                autoRefreshToken: false,
                detectSessionInUrl: false
            }
        }
    );


console.log(
    "Agbor Kingdom Supabase client:",
    kingdomSupabase
);