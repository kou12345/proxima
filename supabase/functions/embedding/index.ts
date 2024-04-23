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
