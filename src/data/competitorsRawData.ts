export interface RawSignal {
  id: string;
  source: 'Website' | 'G2' | 'Reddit' | 'ReleaseNotes' | 'LinkedIn';
  date: string;
  content: string;
}

export type CompetitorRawData = Record<string, RawSignal[]>;

export const getCompetitorData = (): CompetitorRawData => ({
  Notion: [
    {
      id: "no1", source: "ReleaseNotes", date: "2024-03-01",
      content: "Launched Notion AI: Draft, refine, and extract insights directly inside your workspace. Q&A features can now search across all your team's documents instantly."
    },
    {
      id: "no2", source: "Website", date: "2024-03-25",
      content: "Pricing change: Notion AI is now an add-on at $8/user/month billed annually. The core interface has been simplified for enterprise teams."
    },
    {
      id: "no3", source: "G2", date: "2024-03-30",
      content: "Review: 'I love how flexible Notion is, but honestly, structuring large team projects feels like building a database from scratch. Without strict guardrails, it becomes a mess. AI is cool though.'"
    },
    {
      id: "no4", source: "Reddit", date: "2024-04-01",
      content: "r/productivity: 'Just switched from Notion to [other tool]. Notion's offline mode is still practically non-existent. Trying to use it on a flight was a nightmare.'" 
    }
  ],
  Asana: [
    {
      id: "as1", source: "ReleaseNotes", date: "2024-02-15",
      content: "Introducing Smart Goals: Connect your daily tasks directly to company OKRs and let Asana Intelligence automatically summarize progress risks."
    },
    {
      id: "as2", source: "Website", date: "2024-03-01",
      content: "Headline shift: 'The only work management platform built for enterprise scale.' Enterprise+ plan introduced with advanced cross-org reporting."
    },
    {
      id: "as3", source: "G2", date: "2024-03-12",
      content: "Review: 'Asana is great for rigid project managers, but it's gotten incredibly expensive for small teams. The sheer number of features we don't use makes navigating the interface tedious.'"
    },
    {
      id: "as4", source: "LinkedIn", date: "2024-03-20",
      content: "Post by Product Lead: 'Excited to see how organizations are using Asana's new portfolio views to align C-suite executives with frontline execution!'"
    }
  ],
  ClickUp: [
    {
      id: "cu1", source: "Website", date: "2024-03-10",
      content: "One app to replace them all. ClickUp 3.0 brings lightning-fast performance, universal search, and built-in whiteboards."
    },
    {
      id: "cu2", source: "ReleaseNotes", date: "2024-03-18",
      content: "ClickUp Brain is here. It's an AI network that connects every task, doc, and teammate. Ask 'What is Sarah working on?' and get immediate answers without creating reports."
    },
    {
      id: "cu3", source: "Reddit", date: "2024-03-29",
      content: "r/projectmanagement: 'ClickUp 3.0 is definitely faster, but the UI is so cluttered. It tries to do everything and mastering it takes weeks. Our team is pushing back on adoption.'"
    },
    {
      id: "cu4", source: "G2", date: "2024-04-02",
      content: "Review: 'Amazing tool. You can customize literally anything. But sometimes bugs persist for months, and their support is slow to respond to niche issues.'"
    }
  ],
  Monday: [
    {
      id: "mo1", source: "Website", date: "2024-02-28",
      content: "Monday work management. A platform built for a new way of working. Build customized workflows in minutes."
    },
    {
      id: "mo2", source: "LinkedIn", date: "2024-03-15",
      content: "Company Update: 'We are thrilled to announce deeper integrations with Salesforce and Jira, bridging the gap between sales and engineering teams in Monday CRM.'"
    },
    {
      id: "mo3", source: "G2", date: "2024-03-22",
      content: "Review: 'Very visual and appealing dashboard. However, their pricing is very sneaky—they force you to buy licenses in specific bucket sizes, so we pay for empty seats.'"
    },
    {
      id: "mo4", source: "ReleaseNotes", date: "2024-04-01",
      content: "New Feature: Capacity Planning view. Now managers can explicitly see resource allocation across multiple projects to prevent burnout."
    }
  ]
});
