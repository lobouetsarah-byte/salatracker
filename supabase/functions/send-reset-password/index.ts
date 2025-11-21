import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const resendApiKey = Deno.env.get("RESEND_API_KEY");
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ResetPasswordRequest {
  email: string;
  redirectTo?: string;
}

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 200 });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const { email, redirectTo }: ResetPasswordRequest = await req.json();

    if (!email || typeof email !== 'string') {
      return new Response(
        JSON.stringify({ error: "Valid email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ success: true, message: "Si cet email existe, un lien de réinitialisation a été envoyé" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Processing password reset request for:", email.substring(0, 3) + "***");

    const { createClient } = await import("jsr:@supabase/supabase-js@2");
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const origin = req.headers.get('origin') || req.headers.get('referer') || 'https://salatracker.lovable.app';
    const sanitizedRedirectTo = redirectTo || `${origin}/auth`;

    if (!sanitizedRedirectTo.startsWith('http://') && !sanitizedRedirectTo.startsWith('https://')) {
      return new Response(
        JSON.stringify({ success: true, message: "Si cet email existe, un lien de réinitialisation a été envoyé" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email: email.toLowerCase().trim(),
      options: {
        redirectTo: sanitizedRedirectTo,
      },
    });

    if (error) {
      if (error.message?.includes("User") || error.status === 404 || error.status === 400) {
        console.log("User not found or invalid, but returning success for security");
        return new Response(
          JSON.stringify({ success: true, message: "Si cet email existe, un lien de réinitialisation a été envoyé" }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      console.error("Error generating reset link:", error.message);
      throw error;
    }

    if (!data?.properties?.action_link) {
      console.error("No action link generated");
      return new Response(
        JSON.stringify({ success: true, message: "Si cet email existe, un lien de réinitialisation a été envoyé" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Reset link generated successfully");

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Salatracker <onboarding@resend.dev>",
        to: [email.toLowerCase().trim()],
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
      const errorData = await emailResponse.json().catch(() => ({}));
      console.error("Resend API error:", errorData);
      return new Response(
        JSON.stringify({ success: true, message: "Si cet email existe, un lien de réinitialisation a été envoyé" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const emailData = await emailResponse.json();
    console.log("Email sent successfully");

    return new Response(
      JSON.stringify({ success: true, message: "Email envoyé avec succès" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in send-reset-password function:", error.message);
    return new Response(
      JSON.stringify({ success: true, message: "Si cet email existe, un lien de réinitialisation a été envoyé" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
