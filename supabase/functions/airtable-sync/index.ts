import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const AIRTABLE_API_KEY = Deno.env.get("AIRTABLE_API_KEY");
const AIRTABLE_BASE_ID = Deno.env.get("AIRTABLE_BASE_ID");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, table, data, recordId } = await req.json();

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      throw new Error("Airtable configuration missing");
    }

    const baseUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${table}`;
    const headers = {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      "Content-Type": "application/json",
    };

    let response;

    switch (action) {
      case "list":
        response = await fetch(baseUrl, { headers });
        break;

      case "get":
        if (!recordId) throw new Error("Record ID required");
        response = await fetch(`${baseUrl}/${recordId}`, { headers });
        break;

      case "create":
        response = await fetch(baseUrl, {
          method: "POST",
          headers,
          body: JSON.stringify({ fields: data }),
        });
        break;

      case "update":
        if (!recordId) throw new Error("Record ID required");
        response = await fetch(`${baseUrl}/${recordId}`, {
          method: "PATCH",
          headers,
          body: JSON.stringify({ fields: data }),
        });
        break;

      case "delete":
        if (!recordId) throw new Error("Record ID required");
        response = await fetch(`${baseUrl}/${recordId}`, {
          method: "DELETE",
          headers,
        });
        break;

      default:
        throw new Error("Invalid action");
    }

    const result = await response.json();

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: response.ok ? 200 : 400,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
