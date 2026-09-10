/* =========================================
   SUPABASE CONFIGURATION
========================================= */

const SUPABASE_URL =
    "https://flhorvkvkxbodappjspg.supabase.co";

const SUPABASE_ANON_KEY =
    "xxxx";


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