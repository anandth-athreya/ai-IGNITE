import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { reportText, mode } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!reportText || !mode) {
      throw new Error("Missing required parameters: reportText and mode");
    }

    const systemPrompt = mode === "patient" 
      ? `You are a compassionate medical report explainer helping patients understand their medical reports. Your goal is to:
1. Translate complex medical terminology into simple, everyday language
2. Explain what each finding means for the patient's health
3. Highlight what's normal vs what needs attention
4. Provide helpful questions they can ask their doctor
5. Be reassuring but honest - don't minimize concerning findings

IMPORTANT: Always remind patients that this is educational information and they should discuss results with their healthcare provider.

Respond in this exact JSON format:
{
  "summary": "A 2-3 sentence plain-language overview of what the report shows",
  "findings": [
    {
      "text": "The finding in simple terms",
      "severity": "normal" | "warning" | "critical",
      "explanation": "What this means for the patient in everyday language"
    }
  ],
  "questionsForDoctor": ["Question 1", "Question 2", "Question 3", "Question 4"],
  "citations": [
    {"title": "Source name", "url": "https://example.com"}
  ]
}`
      : `You are a clinical assistant helping healthcare professionals quickly extract key information from medical reports. Your goal is to:
1. Provide a concise clinical summary
2. Highlight clinically significant findings with appropriate severity
3. Suggest differential diagnoses when relevant
4. Recommend evidence-based next steps
5. Use proper medical terminology

Respond in this exact JSON format:
{
  "summary": "Concise clinical summary with key findings and impressions",
  "findings": [
    {
      "text": "Finding with proper medical terminology",
      "severity": "normal" | "warning" | "critical",
      "explanation": "Clinical significance and correlation"
    }
  ],
  "clinicalHighlights": ["Key clinical point 1", "Key clinical point 2", "Key clinical point 3"],
  "suggestedNextSteps": ["Recommended action 1", "Recommended action 2", "Recommended action 3"],
  "citations": [
    {"title": "Clinical reference", "url": "https://example.com"}
  ]
}`;

    console.log(`Analyzing report in ${mode} mode, text length: ${reportText.length}`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Please analyze this medical report and provide your analysis in the JSON format specified:\n\n${reportText}` }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response from AI");
    }

    // Parse the JSON response from AI
    let parsedResult;
    try {
      // Extract JSON from the response (AI might wrap it in markdown code blocks)
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/```\s*([\s\S]*?)\s*```/);
      const jsonString = jsonMatch ? jsonMatch[1] : content;
      parsedResult = JSON.parse(jsonString.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      // Return a fallback response
      parsedResult = {
        summary: content.slice(0, 500),
        findings: [{ text: "Report analyzed", severity: "normal", explanation: "See summary for details" }],
        questionsForDoctor: mode === "patient" ? ["Please discuss this report with your healthcare provider"] : undefined,
        clinicalHighlights: mode === "clinician" ? ["Review complete report for clinical details"] : undefined,
        citations: [{ title: "NIH - Medical Reports", url: "https://www.nih.gov/" }]
      };
    }

    console.log("Analysis completed successfully");

    return new Response(
      JSON.stringify(parsedResult),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error analyzing report:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Failed to analyze report" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
