import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { get, put } from "./firebase.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method === "GET") {
    const id = new URL(req.url).search.substring(1);
    const text = await get(id);
    return new Response(text, { headers: corsHeaders });
  }

  if (req.method === "POST") {
    const id = new URL(req.url).search.substring(1);
    const text = await req.text();
    await put(id, text);
    return new Response("ok", { headers: corsHeaders });
  }

  throw new Error("invalid method");
});
