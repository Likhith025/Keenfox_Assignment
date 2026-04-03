import { getCompetitorData } from '../data/competitorsRawData';

// This is the structure we want the LLM to return
export interface CompetitorInsights {
  competitor: string;
  featureLaunches: string[];
  messagingShifts: string[];
  customerSentiment: {
    positive: string[];
    negative: string[];
  };
  pricingChanges: string[];
  strategicGaps: string[];
}

export async function extractInsightsForCompetitor(competitorName: string, signals: any[], apiKey: string): Promise<CompetitorInsights> {
  const prompt = `
You are a Competitive Intelligence Analyst for KeenFox, a B2B SaaS productivity company.
Analyze the following raw signals about our competitor: ${competitorName}.
Extract the following information and return ONLY valid JSON:
- featureLaunches: List of new features or product updates (Array of strings).
- messagingShifts: How they are positioning their product (Array of strings).
- customerSentiment: Separate into positive and negative points (Object with 'positive' and 'negative' string arrays).
- pricingChanges: Any pricing or packaging changes (Array of strings).
- strategicGaps: Notable weaknesses in their product or strategy based on the signals (Array of strings).

Raw Signals:
${JSON.stringify(signals, null, 2)}

Return ONLY JSON matching this format exactly, with no markdown codeblocks or extra text:
{
  "competitor": "CompetitorName",
  "featureLaunches": [],
  "messagingShifts": [],
  "customerSentiment": { "positive": [], "negative": [] },
  "pricingChanges": [],
  "strategicGaps": []
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
      temperature: 0.2
    })
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(`Mistral API Error: ${data.error?.message || response.statusText}`);
  }

  try {
    const text = data.choices[0].message.content;
    return JSON.parse(text) as CompetitorInsights;
  } catch (error) {
    console.error("Failed to parse JSON from AI", data.choices?.[0]?.message?.content);
    throw new Error("Failed to parse LLM response into structured JSON");
  }
}

export async function runIntelligenceEngine(apiKey: string): Promise<CompetitorInsights[]> {
  const rawData = getCompetitorData();
  const insights: CompetitorInsights[] = [];

  for (const [competitor, signals] of Object.entries(rawData)) {
    console.log(`Analyzing ${competitor}...`);
    const insight = await extractInsightsForCompetitor(competitor, signals, apiKey);
    insights.push(insight);
  }

  return insights;
}
