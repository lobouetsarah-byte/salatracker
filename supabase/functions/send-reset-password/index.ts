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
              <style>
                * {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                }
                body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
                  background-color: #ffffff;
                  line-height: 1.6;
                  -webkit-font-smoothing: antialiased;
                  -moz-osx-font-smoothing: grayscale;
                }
                .email-container {
                  max-width: 560px;
                  margin: 0 auto;
                  padding: 60px 20px;
                }
                .logo {
                  text-align: center;
                  margin-bottom: 48px;
                }
                .logo img {
                  width: 80px;
                  height: 80px;
                  display: inline-block;
                }
                .content {
                  text-align: center;
                  padding: 0 20px;
                }
                h1 {
                  color: #000000;
                  font-size: 28px;
                  font-weight: 600;
                  margin-bottom: 16px;
                  letter-spacing: -0.5px;
                }
                p {
                  color: #000000;
                  font-size: 16px;
                  margin-bottom: 16px;
                  line-height: 1.7;
                }
                .button-container {
                  margin: 40px 0;
                }
                .button {
                  display: inline-block;
                  background-color: #ffffff;
                  color: #000000;
                  text-decoration: none;
                  padding: 16px 48px;
                  border-radius: 8px;
                  font-weight: 600;
                  font-size: 16px;
                  border: 2px solid #000000;
                  transition: all 0.2s ease;
                }
                .button:hover {
                  background-color: #f5f5f5;
                }
                .note {
                  color: #000000;
                  font-size: 14px;
                  margin-top: 32px;
                  line-height: 1.6;
                }
                .footer {
                  text-align: center;
                  margin-top: 48px;
                  padding-top: 32px;
                  border-top: 1px solid #e5e5e5;
                }
                .footer p {
                  color: #000000;
                  font-size: 13px;
                  margin-bottom: 8px;
                }
                
                /* Mobile optimization */
                @media only screen and (max-width: 600px) {
                  .email-container {
                    padding: 40px 16px;
                  }
                  h1 {
                    font-size: 24px;
                  }
                  .button {
                    display: block;
                    width: 100%;
                    padding: 18px 32px;
                    font-size: 17px;
                  }
                  .logo img {
                    width: 70px;
                    height: 70px;
                  }
                }
              </style>
            </head>
            <body>
              <div class="email-container">
                <!-- Logo -->
                <div class="logo">
                  <img src="https://salatracker.lovable.app/salatrack-logo.png" alt="Salatracker Logo" />
                </div>
                
                <!-- Content -->
                <div class="content">
                  <h1>Réinitialisez votre mot de passe</h1>
                  
                  <p>
                    Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe pour votre compte Salatracker.
                  </p>
                  
                  <!-- CTA Button -->
                  <div class="button-container">
                    <a href="${data.properties.action_link}" class="button">
                      Réinitialiser le mot de passe
                    </a>
                  </div>
                  
                  <p class="note">
                    Ce lien expirera dans 1 heure.<br>
                    Si vous n'avez pas demandé cette réinitialisation, ignorez simplement cet email.
                  </p>
                </div>
                
                <!-- Footer -->
                <div class="footer">
                  <p>Salatracker</p>
                  <p>Votre compagnon pour les prières quotidiennes</p>
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
