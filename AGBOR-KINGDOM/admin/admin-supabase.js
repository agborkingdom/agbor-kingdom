
/* =========================================
   AGBOR KINGDOM ADMIN SUPABASE
========================================= */

const SUPABASE_URL =
    "https://flhorvkvkxbodappjspg.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_6VtnjF-OR6pIJZS59we_sQ_uZ3XlWFs";


/* =========================================
   CREATE ADMIN SUPABASE CLIENT
========================================= */

const kingdomAdminSupabase =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY,
        {
            auth: {
                storageKey: "agbor-kingdom-admin-auth",
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true
            }
        }
    );


console.log(
    "Agbor Kingdom Admin Supabase client:",
    kingdomAdminSupabase
);

