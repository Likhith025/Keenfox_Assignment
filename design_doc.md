# KeenFox Assignment — Design Document

## System Architecture and Data Flow Diagram
The system is built as a unified Full-stack Next.js application, functioning as both the intelligence engine and the interactive dashboard.

### Data Flow
1. **Ingestion Layer:** Raw signals (simulated as JSON mock datasets) are ingested when a sweep is triggered. Normally, this layer would use APIs (e.g. Reddit Data API, G2 Web Scraper scripts) to gather unstructured HTML/text.
2. **Intelligence Engine (LLM Layer):** 
   - A Node.js backend route takes chunks of raw signals (chunked by competitor) and passes them to the Gemini-2.5-Flash LLM.
   - Using strict prompt structures, the LLM converts the unstructured noise into categorized, JSON-structured insights (`CompetitorInsights` schema).
3. **Campaign Integrator (LLM Synthesis Layer):** 
   - Once all competitors are analyzed, the aggregated `CompetitorInsights` are forwarded to a secondary AI prompt.
   - The LLM acts as the VP of Product Marketing, evaluating KeenFox's mock positioning against the aggregated rival data.
   - It outputs three pillars of strategy: Messaging Adjustments, Channel Strategy, and GTM Refinements.
4. **Storage & Presentation:** 
   - The output is saved locally to `data/history.json` to allow "Diffing" (comparing previous insights against current insights).
   - The React Dashboard fetches this data and visualizes it cleanly for users to consume.

## How I Handle Noisy, Incomplete, or Conflicting Data
- **Structured Instruction Prompts:** The engine mitigates noisy LLM answers by heavily restricting output space to a predefined JSON object. Markdown markers are stripped programmatically.
- **Sentiment Segregation:** Rather than just a general summary of reviews, the LLM splits sentiment into `positive` and `negative`. If a review contains both ("I love the UI but hate the pricing"), the AI properly categorizes them into both sections.
- **Synthesis:** Instead of doing basic keyword extraction, the System asks the LLM to act as a *marketing professional*. It takes conflicting data points (e.g., ClickUp getting faster vs ClickUp being too cluttered) and determines if action (like a marketing campaign) is required.
- **Future Improvement:** If processing real endpoints, I'd implement an Embedding layer & Vector Database (like Pinecone natively integrated) and pre-cluster noise using cosine similarity before handing chunks to the reasoning model.

## Prompt Strategy
1. **Engine Stage:** The prompt explicitly assigns a persona ("Competitive Intelligence Analyst") and provides the exact text boundary. The prompt ends with an explicit JSON shape, ensuring predictable structure. 
2. **Campaign Integrator Stage:** This is where the magic happens. We provide the LLM with *KeenFox's current positioning* ("Fast, lightweight, aimed at mid-market"). This grounding constraint stops the AI from generating generic marketing babble and forces it to map competitor weaknesses to KeenFox's stated strengths.

## Known Limitations and Scale Improvements
- **Simulated Ingestion:** Real web scraping is blocked or brittle for G2/LinkedIn. To scale, I would utilize an API like BrightData for unblocked proxy scraping for competitor websites, or buy datasets from intent providers.
- **LLM Context Limits:** If we scraped thousands of Reddit reviews, we couldn't send them in one prompt. **Improvement:** I would add a summarization map-reduce pipeline or an embedding-based RAG architecture where we only forward the 'Top 50 Most Relevant Signals' to the Integrator, rather than raw strings.
- **Diffing:** Currently, the system stores the last run. A true diff experience needs to show "what changed". I would implement a recursive `deep-diff` package on the JSON objects to visually highlight net-new messaging shifts on the Dashboard using colored badging.
