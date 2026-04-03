import { NextResponse } from 'next/server';
import { runIntelligenceEngine, CompetitorInsights } from '@/lib/engine';
import { generateCampaignRecommendations, CampaignRecommendations } from '@/lib/campaign';
import fs from 'fs';
import path from 'path';

export interface FullReport {
  lastRunDate: string;
  insights: CompetitorInsights[];
  recommendations: CampaignRecommendations;
}

// Detect serverless environment (Vercel/AWS) and use /tmp for writes
const IS_SERVERLESS = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;
const DATA_FILE_PATH = IS_SERVERLESS 
  ? path.join('/tmp', 'history.json') 
  : path.join(process.cwd(), 'data', 'history.json');

export async function POST(req: Request) {
  try {
    const { apiKey } = await req.json();
    // We check for finalApiKey later after considering the .env fallback

    if (apiKey === 'demo') {
      // Simulate real processing delay so UI loading states fire
      await new Promise(r => setTimeout(r, 2000));
      const demoInsights = [
        {
          competitor: "Notion",
          featureLaunches: ["Started offering Notion AI as an integrated workspace layer."],
          messagingShifts: ["Shifted towards 'connected enterprise knowledge' rather than 'personal notes'."],
          customerSentiment: { positive: ["Incredibly flexible", "AI saves time"], negative: ["No structured guardrails", "Fails offline"] },
          pricingChanges: ["Pushed enterprise plans with $8/user AI add-on."],
          strategicGaps: ["Offline mode is unusable, hindering traveling teams."]
        },
        {
          competitor: "Asana",
          featureLaunches: ["Smart Goals mapping OKRs to tasks automatically."],
          messagingShifts: ["Highly focused on 'enterprise scale' and C-suite executives."],
          customerSentiment: { positive: ["Great for strict methodologies"], negative: ["Way too expensive for small teams", "Bloated navigation"] },
          pricingChanges: ["Introduced Enterprise+ tier."],
          strategicGaps: ["Extremely slow UI and high cost for SMBs creates downmarket vulnerability."]
        }
      ];
      const demoRecommendations = {
        messagingAndPositioning: {
          weaknessesIdentified: ["We aren't talking enough about how fast our tool is offline."],
          revisedCopySuggestions: [{
            channel: "Homepage Hero",
            originalIdea: "The best tool to manage work.",
            revisedCopy: "The blazingly fast project manager that actually works offline. No enterprise bloat.",
            rationale: "Directly attacks Notion's offline weakness and Asana's enterprise bloat."
          }]
        },
        channelAndTargetingStrategy: {
          recommendations: [{ channel: "SMB Capterra Categories", action: "DOUBLE_DOWN", explanation: "Asana's pricing is pushing out SMBs. High conversion potential here." }]
        },
        gtmStrategyRefinements: {
          strategicMoves: [{
            title: "Launch an 'Asana Switcher' campaign",
            detail: "Target teams of 10-50 with a 'pay only for what you use' pricing model.",
            basedOnCompetitorSignal: "Asana getting 'incredibly expensive for small teams'."
          }]
        }
      };
      return NextResponse.json({
        current: { lastRunDate: new Date().toISOString(), insights: demoInsights, recommendations: demoRecommendations },
        previous: null
      });
    }

    const finalApiKey = apiKey || process.env.MISTRAL_API_KEY;
    if (!finalApiKey) {
      return NextResponse.json({ error: 'No Mistral API Key found. Please add to .env or dashboard input.' }, { status: 400 });
    }

    // 1. Run the Intelligence Engine
    const insights = await runIntelligenceEngine(finalApiKey);

    // 2. Generate Campaign Recommendations
    const recommendations = await generateCampaignRecommendations(insights, finalApiKey);

    const newReport: FullReport = {
      lastRunDate: new Date().toISOString(),
      insights,
      recommendations,
    };

    // 3. Read previous report (if exists) for Diffing in the UI
    let previousReport: FullReport | null = null;
    const dir = path.dirname(DATA_FILE_PATH);
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    } catch (e) {
      console.warn('Could not create data directory:', e);
    }
    
    if (fs.existsSync(DATA_FILE_PATH)) {
      const data = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
      if (data) {
        previousReport = JSON.parse(data) as FullReport;
      }
    }

    // 4. Save the new report (fail silently if file system is read-only)
    try {
      fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(newReport, null, 2));
    } catch (writeError) {
      console.warn('Failed to save history (likely read-only FS):', writeError);
    }

    return NextResponse.json({ current: newReport, previous: previousReport });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  if (fs.existsSync(DATA_FILE_PATH)) {
    const data = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  }
  return NextResponse.json(null);
}
