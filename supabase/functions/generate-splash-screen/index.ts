import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { mode = 'normal' } = await req.json();
    
    // Determine colors based on mode
    const bgColor = mode === 'period' ? '#FFF5F9' : '#F7F8FA';
    const textColor = mode === 'period' ? '#8B3A62' : '#1E40AF';
    const logoEmoji = '🕌';
    
    const prompt = `Create a minimalist mobile app splash screen with these exact specifications:

Background: solid ${bgColor}
Center of screen:
- ${logoEmoji} emoji at 160px size
- Below it: "Salatracker" text in bold, ${textColor} color, 36px
- Below that: "Suivez vos prières au quotidien" in ${textColor} color, 14px

Design style:
- Clean, minimalist
- Centered vertically and horizontally
- Professional Islamic prayer tracking app
- Modern typography
- No shadows, no gradients
- Simple and elegant
- Mobile screen aspect ratio (9:16)

The design should be simple, professional, and centered perfectly on a white background.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        modalities: ["image", "text"]
      })
    });

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      throw new Error("Failed to generate image");
    }

    // Return the base64 image
    return new Response(
      JSON.stringify({ 
        success: true, 
        imageUrl,
        message: "Splash screen generated successfully"
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error("Error generating splash screen:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
