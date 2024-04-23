/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

import { corsHeaders } from "../_shared/cors.ts";
import { supabase as supabaseClient } from "../_shared/supabase.ts";

// deno-lint-ignore ban-ts-comment
// @ts-ignore
const session = new Supabase.ai.Session("gte-small");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const { content } = await req.json();

  // Generate the embedding
  const embedding = await session.run(content, {
    mean_pool: true,
    normalize: true,
  });

  // DBに保存する
  const { error } = await supabaseClient.from("embeddings").insert({
    content,
    embedding,
  });
  if (error) {
    console.error("Failed to save the embedding", error);
  }

  // Return the embedding
  return new Response(
    JSON.stringify({ embedding }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/embedding' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"content":"Supabase"}'

*/
