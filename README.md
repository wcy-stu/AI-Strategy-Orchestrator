# AI Strategy Orchestrator

A high-performance, multi-agent product intelligence platform built with **React**, **Tailwind CSS**, and **Google Gemini 1.5 Pro/Flash**.

## 🚀 Project Overview

The **AI Strategy Orchestrator** is designed to solve the fragmentation of early-stage product strategy. Instead of manually researching market trends, technical feasibility, and user needs separately, this platform orchestrates multiple specialized AI agents to perform simultaneous analysis and synthesize the findings into an actionable roadmap.

### Key Features
- **Multi-Agent Chain of Intelligence**: 
  - `Scout Agent`: Scans competitors and industry trends.
  - `Architect Agent`: Evaluates technical constraints and infrastructure.
  - `Analyst Agent`: Processes user sentiment and core pain points.
  - `Orchestrator`: Synthesizes inputs into a strategic report.
- **Dynamic Visual Feedback**: Watch each agent's progress in real-time as they perform their reasoning tasks.
- **Strategic Roadmap Generation**: Get a structured, 3-phase development plan with prioritized features and identified risks.
- **Swiss-Design Inspired UI**: A clean, technical, and high-contrast interface designed for professional strategic work.

## 🛠️ Tech Stack
- **Frontend**: React 19, Vite, TypeScript
- **Styling**: Tailwind CSS 4.0
- **Animation**: Motion (Framer Motion)
- **AI Engine**: Google Generative AI (Gemini SDK)
- **Icons**: Lucide React

## 📦 How to Run Locally

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd ai-strategy-orchestrator
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add your Gemini API Key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

## 🧠 Core Logic Flow
The application implements a "Chain-of-Intelligence" pattern:
1. **Parallelized Research Phase**: Scout, Architect, and Analyst agents are launched concurrently using `Promise.all` to minimize latency.
2. **Contextual Aggregation**: The partial reports from step 1 are fed into the high-entropy Orchestrator.
3. **Structured Synthesis**: The Orchestrator uses JSON-mode response schemas to ensure the final output fits the UI components perfectly, reducing hallucinations and formatting errors.
