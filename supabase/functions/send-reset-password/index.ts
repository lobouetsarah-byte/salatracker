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
  redirectTo?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, redirectTo }: ResetPasswordRequest = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Processing password reset request for:", email);

    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Generate password reset link with redirect
    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email: email,
      options: {
        redirectTo: redirectTo || `${req.headers.get('origin')}/auth`,
      },
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
        subject: "Réinitialisez votre mot de passe",
        html: `
          <!DOCTYPE html>
          <html lang="fr">
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <meta http-equiv="X-UA-Compatible" content="IE=edge">
              <title>Réinitialisation de mot de passe</title>
              <!--[if mso]>
              <style type="text/css">
                body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
              </style>
              <![endif]-->
            </head>
            <body style="margin: 0; padding: 0; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #ffffff;">
                <tr>
                  <td align="center" style="padding: 60px 20px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 560px;">
                      
                      <!-- Logo -->
                      <tr>
                        <td align="center" style="padding-bottom: 48px;">
                          <img src="${req.headers.get('origin') || 'https://salatracker.lovable.app'}/salatrack-logo.png" alt="Salatracker" width="80" height="80" style="display: block; width: 80px; height: 80px; border: 0;" />
                        </td>
                      </tr>
                      
                      <!-- Content -->
                      <tr>
                        <td style="padding: 0 20px;">
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                            
                            <!-- Heading -->
                            <tr>
                              <td align="center" style="padding-bottom: 16px;">
                                <h1 style="margin: 0; color: #000000; font-size: 28px; font-weight: 600; line-height: 1.3; letter-spacing: -0.5px;">Réinitialisez votre mot de passe</h1>
                              </td>
                            </tr>
                            
                            <!-- Body Text -->
                            <tr>
                              <td align="center" style="padding-bottom: 16px;">
                                <p style="margin: 0; color: #000000; font-size: 16px; line-height: 1.7;">Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe pour votre compte Salatracker.</p>
                              </td>
                            </tr>
                            
                            <!-- Button -->
                            <tr>
                              <td align="center" style="padding: 40px 0;">
                                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                                  <tr>
                                    <td align="center" style="border-radius: 8px; background-color: #ffffff; border: 2px solid #000000;">
                                      <a href="${data.properties.action_link}" target="_blank" style="display: inline-block; padding: 16px 48px; color: #000000; text-decoration: none; font-weight: 600; font-size: 16px;">Réinitialiser le mot de passe</a>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                            
                            <!-- Note -->
                            <tr>
                              <td align="center" style="padding-top: 32px;">
                                <p style="margin: 0; color: #000000; font-size: 14px; line-height: 1.6;">
                                  Ce lien expirera dans 1 heure.<br/>
                                  Si vous n'avez pas demandé cette réinitialisation, ignorez simplement cet email.
                                </p>
                              </td>
                            </tr>
                            
                          </table>
                        </td>
                      </tr>
                      
                      <!-- Footer -->
                      <tr>
                        <td style="padding-top: 48px; border-top: 1px solid #e5e5e5;">
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                            <tr>
                              <td align="center" style="padding: 32px 20px 0;">
                                <p style="margin: 0 0 8px 0; color: #000000; font-size: 13px;">Salatracker</p>
                                <p style="margin: 0; color: #000000; font-size: 13px;">Votre compagnon pour les prières quotidiennes</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      
                    </table>
                  </td>
                </tr>
              </table>
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
