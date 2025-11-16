import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const resendApiKey = Deno.env.get("RESEND_API_KEY");
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ResetPasswordRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: ResetPasswordRequest = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Processing password reset request for:", email);

    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Generate password reset link
    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email: email,
    });

    // For security reasons, always return success even if user doesn't exist
    // This prevents email enumeration attacks
    if (error) {
      if (error.message.includes("User with this email not found") || error.status === 404) {
        console.log("User not found, but returning success for security");
        return new Response(
          JSON.stringify({ success: true, message: "Si cet email existe, un lien de réinitialisation a été envoyé" }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      console.error("Error generating reset link:", error);
      throw error;
    }

    console.log("Reset link generated successfully");

    // Send email with Resend API
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Salatracker <onboarding@resend.dev>",
        to: [email],
        subject: "Réinitialisation de votre mot de passe",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                .container { background-color: #f9f9f9; border-radius: 8px; padding: 30px; }
                .header { text-align: center; margin-bottom: 30px; }
                .header h1 { color: #8B5CF6; margin: 0; font-size: 28px; }
                .content { background-color: white; border-radius: 6px; padding: 25px; margin-bottom: 20px; }
                .button { display: inline-block; background-color: #8B5CF6; color: white; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: 600; margin: 20px 0; }
                .button:hover { background-color: #7C3AED; }
                .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🕌 Salatracker</h1>
                </div>
                <div class="content">
                  <h2 style="margin-top: 0;">Réinitialisation de mot de passe</h2>
                  <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
                  <p>Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
                  <div style="text-align: center;">
                    <a href="${data.properties.action_link}" class="button">Réinitialiser mon mot de passe</a>
                  </div>
                  <p style="margin-top: 30px; font-size: 14px; color: #666;">
                    Ce lien expirera dans 1 heure. Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email en toute sécurité.
                  </p>
                </div>
                <div class="footer">
                  <p>Salatracker - Votre compagnon pour suivre vos prières quotidiennes</p>
                </div>
              </div>
            </body>
          </html>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json();
      console.error("Resend API error:", errorData);
      throw new Error(`Failed to send email: ${JSON.stringify(errorData)}`);
    }

    const emailData = await emailResponse.json();

    console.log("Email sent successfully:", emailData);

    return new Response(
      JSON.stringify({ success: true, message: "Email envoyé avec succès" }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in send-reset-password function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
