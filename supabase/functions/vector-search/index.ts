import { corsHeaders } from "../_shared/cors.ts";
import { supabase as supabaseClient } from "../_shared/supabase.ts";

// Setup type definitions for built-in Supabase Runtime APIs
/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

// deno-lint-ignore ban-ts-comment
// @ts-ignore
const session = new Supabase.ai.Session("gte-small");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const { query } = await req.json();

  const embedding = await session.run(query, {
    mean_pool: true,
    normalize: true,
  });

  const { data, error } = await supabaseClient.rpc("match_documents_dot", {
    query_embedding: embedding,
    match_threshold: 0.5,
    match_count: 2,
  });
  if (error) {
    console.error("Failed to match documents", error);
    return new Response(
      JSON.stringify({ error: "Failed to match documents" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  return new Response(
    JSON.stringify(data),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
