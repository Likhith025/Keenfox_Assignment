import { CompetitorInsights } from './engine';

export interface CampaignRecommendations {
  messagingAndPositioning: {
    weaknessesIdentified: string[];
    revisedCopySuggestions: { channel: string; originalIdea: string; revisedCopy: string; rationale: string }[];
  };
  channelAndTargetingStrategy: {
    recommendations: { channel: string; action: 'DOUBLE_DOWN' | 'PULL_BACK' | 'EXPLORE'; explanation: string }[];
  };
  gtmStrategyRefinements: {
    strategicMoves: { title: string; detail: string; basedOnCompetitorSignal: string }[];
  };
}

export async function generateCampaignRecommendations(insights: CompetitorInsights[], apiKey: string): Promise<CampaignRecommendations> {
  const prompt = `
You are the VP of Product Marketing at KeenFox, a B2B SaaS productivity company.
Based on the latest competitive intelligence from our rivals (Notion, Asana, ClickUp, Monday.com), generate concrete campaign adjustments.

Current KeenFox Positioning: We are a fast, lightweight productivity tool aimed at mid-market teams feeling overwhelmed by complex enterprise software.

Competitor Intelligence:
${JSON.stringify(insights, null, 2)}

Provide your strategic recommendations across three dimensions and return ONLY valid JSON:
1. Messaging & Positioning (identify our weaknesses relative to them, and suggest concrete revised copy for at least 3 channels).
2. Channel & Targeting Strategy (where to double down or pull back).
3. Full GTM Strategy Refinements (3-5 prioritized recommendations).

Return exactly this JSON structure, with no markdown code blocks:
{
  "messagingAndPositioning": {
    "weaknessesIdentified": ["string"],
    "revisedCopySuggestions": [
      { "channel": "Homepage Headline", "originalIdea": "string", "revisedCopy": "string", "rationale": "string" }
    ]
  },
  "channelAndTargetingStrategy": {
    "recommendations": [
      { "channel": "string", "action": "DOUBLE_DOWN", "explanation": "string" }
    ]
  },
  "gtmStrategyRefinements": {
    "strategicMoves": [
      { "title": "string", "detail": "string", "basedOnCompetitorSignal": "string" }
    ]
  }
}
  `;

  const url = `https://api.mistral.ai/v1/chat/completions`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "mistral-large-latest",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.4
    })
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(`Mistral API Error: ${data.error?.message || response.statusText}`);
  }

  try {
    const text = data.choices[0].message.content;
    return JSON.parse(text) as CampaignRecommendations;
  } catch (error) {
    console.error("Failed to parse JSON from AI", data.choices?.[0]?.message?.content);
    throw new Error("Failed to parse LLM response into structured JSON");
  }
}
