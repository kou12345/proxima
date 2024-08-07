import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.5";
import { Database } from "./database.types.ts";

export const supabase = createClient<Database>(
  // Supabase API URL - env var exported by default.
  Deno.env.get("NEXT_PUBLIC_SUPABASE_URL")!,
  // Supabase API ANON KEY - env var exported by default.
  Deno.env.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")!,
);
