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
        subject: "Réinitialisation de votre mot de passe",
        html: `
          <!DOCTYPE html>
          <html lang="fr">
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body { 
                  margin: 0; 
                  padding: 0; 
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                }
                .email-wrapper {
                  width: 100%;
                  padding: 40px 20px;
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                }
                .email-container { 
                  max-width: 600px; 
                  margin: 0 auto; 
                  background-color: #ffffff;
                  border-radius: 16px;
                  overflow: hidden;
                  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                }
                .header { 
                  background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%);
                  padding: 40px 30px;
                  text-align: center;
                }
                .logo {
                  font-size: 48px;
                  margin-bottom: 10px;
                }
                .header h1 { 
                  color: #ffffff; 
                  margin: 0;
                  font-size: 32px;
                  font-weight: 700;
                  letter-spacing: -0.5px;
                }
                .header p {
                  color: rgba(255, 255, 255, 0.9);
                  margin: 8px 0 0 0;
                  font-size: 16px;
                }
                .content { 
                  padding: 40px 30px;
                  color: #1f2937;
                }
                .content h2 {
                  color: #1f2937;
                  font-size: 24px;
                  font-weight: 600;
                  margin: 0 0 16px 0;
                }
                .content p {
                  color: #4b5563;
                  font-size: 16px;
                  line-height: 1.6;
                  margin: 0 0 16px 0;
                }
                .button-container {
                  text-align: center;
                  margin: 32px 0;
                }
                .button { 
                  display: inline-block;
                  background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%);
                  color: #ffffff;
                  text-decoration: none;
                  padding: 16px 40px;
                  border-radius: 12px;
                  font-weight: 600;
                  font-size: 16px;
                  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
                  transition: all 0.3s ease;
                }
                .button:hover { 
                  background: linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%);
                  box-shadow: 0 6px 16px rgba(139, 92, 246, 0.5);
                  transform: translateY(-2px);
                }
                .security-note {
                  background-color: #fef3c7;
                  border-left: 4px solid #f59e0b;
                  padding: 16px;
                  margin: 24px 0;
                  border-radius: 8px;
                }
                .security-note p {
                  color: #92400e;
                  font-size: 14px;
                  margin: 0;
                }
                .footer { 
                  background-color: #f9fafb;
                  padding: 30px;
                  text-align: center;
                  border-top: 1px solid #e5e7eb;
                }
                .footer p {
                  color: #6b7280;
                  font-size: 14px;
                  margin: 4px 0;
                }
                .footer-links {
                  margin-top: 16px;
                }
                .footer-links a {
                  color: #8B5CF6;
                  text-decoration: none;
                  margin: 0 12px;
                  font-size: 14px;
                }
                @media only screen and (max-width: 600px) {
                  .email-wrapper {
                    padding: 20px 10px;
                  }
                  .content {
                    padding: 30px 20px;
                  }
                  .header {
                    padding: 30px 20px;
                  }
                  .button {
                    display: block;
                    padding: 14px 24px;
                  }
                }
              </style>
            </head>
            <body>
              <div class="email-wrapper">
                <div class="email-container">
                  <div class="header">
                    <div class="logo">🕌</div>
                    <h1>Salatracker</h1>
                    <p>Réinitialisation de mot de passe</p>
                  </div>
                  
                  <div class="content">
                    <h2>Bonjour,</h2>
                    <p>
                      Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte Salatracker.
                    </p>
                    <p>
                      Pour créer un nouveau mot de passe, cliquez simplement sur le bouton ci-dessous :
                    </p>
                    
                    <div class="button-container">
                      <a href="${data.properties.action_link}" class="button">
                        🔒 Réinitialiser mon mot de passe
                      </a>
                    </div>
                    
                    <div class="security-note">
                      <p>
                        ⏱️ <strong>Ce lien expirera dans 1 heure</strong> pour des raisons de sécurité.
                      </p>
                    </div>
                    
                    <p>
                      Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email en toute sécurité. 
                      Votre mot de passe actuel restera inchangé.
                    </p>
                    
                    <p style="margin-top: 24px; color: #9ca3af; font-size: 14px;">
                      Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :<br>
                      <a href="${data.properties.action_link}" style="color: #8B5CF6; word-break: break-all;">${data.properties.action_link}</a>
                    </p>
                  </div>
                  
                  <div class="footer">
                    <p><strong>Salatracker</strong></p>
                    <p>Votre compagnon fidèle pour suivre vos prières quotidiennes 🤲</p>
                    <div class="footer-links">
                      <p style="color: #9ca3af; font-size: 12px; margin-top: 12px;">
                        © ${new Date().getFullYear()} Salatracker. Tous droits réservés.
                      </p>
                    </div>
                  </div>
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
