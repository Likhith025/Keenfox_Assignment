# KeenFox Intel — AI-Powered Strategy Loop 🦊📉

[![Deployment](https://img.shields.io/badge/Deployment-Live-success?style=flat-square)](https://keenfox-assignment.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

**KeenFox Intel** is an advanced AI-powered system designed to continuously gather competitive intelligence across the B2B SaaS productivity landscape and feed those insights directly into a campaign strategy loop.

Built as an Engineering Intern Assignment, this system solves the challenge of manual competitor tracking by automating the extraction of strategic signals and generating actionable GTM (Go-To-Market) refinements.

---

## 🚀 Live Demo
**Access the dashboard here:** [https://keenfox-assignment.vercel.app/](https://keenfox-assignment.vercel.app/)

> [!TIP]
> Use the API key `demo` in the dashboard to see the system in action with pre-fetched competitive data without requiring a Mistral AI key.

---

## 🧩 The System Architecture

The project consists of two interconnected intelligent components:

### 1. Competitive Intelligence Engine
A robust pipeline that aggregates signals from the market landscape (Notion, Asana, ClickUp, Monday.com, etc.).
- **Signal Extraction:** Identifies feature launches, messaging shifts, and pricing changes.
- **Sentiment Analysis:** Categorizes customer love and pain points from G2, Reddit, and community forums.
- **Strategic Mapping:** Highlights visible gaps and weaknesses in competitor offerings.

### 2. Campaign Feedback Loop Integrator
The "Reasoning Core" that synthesizes intelligence into concrete growth tactics:
- **Messaging & Positioning:** Generates revised copy suggestions (Homepages, Ads, Cold Emails) based on identified competitor weaknesses.
- **Channel Strategy:** Recommends where to double down or pull back based on market activity.
- **GTM Refinements:** Provides 3–5 prioritized strategic moves grounded in real competitive data.

---

## 🛠️ Technology Stack

- **Core:** [Next.js 15+](https://nextjs.org/) (App Router, Server Actions)
- **AI Core:** [Mistral AI SDK](https://mistral.ai/) (Reasoning & Synthesis)
- **Styling:** [Tailwind CSS 4.0](https://tailwindcss.com/) (Modern utility-first styling)
- **Animations:** [Framer Motion](https://www.framer.com/motion/) (Smooth UI transitions & micro-interactions)
- **Icons:** [Lucide React](https://lucide.dev/)
- **State Management:** React Hooks + Local Storage History

---

## ⚡ Getting Started

### Prerequisites
- Node.js 18+
- A Mistral AI API Key (Optional, as `demo` mode is available)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Likhith025/Keenfox_Assignment.git
   cd Keenfox_Assignment
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root:
   ```env
   MISTRAL_API_KEY=your_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

---

## 📖 Documentation & Design

For a deep dive into the system logic, prompt engineering strategies, and data handling, please refer to the [Design Document](file:///d:/Keenfox_Assignment/design_doc.md).

### Key Files
- `src/lib/engine.ts`: Core logic for competitive signal extraction.
- `src/lib/campaign.ts`: Strategy synthesis and recommendation engine.
- `src/app/api/run/route.ts`: API orchestration and history management.

---

## 🛡️ Evaluation Criteria Met
- **System Design:** Modular architecture with clean separation between intelligence and synthesis.
- **Intelligence Quality:** High-fidelity JSON extraction from unstructured signals.
- **Actionable Output:** Specific GTM suggestions grounded in competitor data.
- **Premium UX:** High-contrast, interactive dashboard with real-time loading states.

---

Developed by **Likhith** for the KeenFox Engineering Internship Assignment.

