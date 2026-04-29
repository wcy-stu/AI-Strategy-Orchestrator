/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { AgentType, StrategyReport } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const aiService = {
  async runAgentTask(type: AgentType, context: string): Promise<string> {
    const promptMap = {
      [AgentType.SCOUT]: `You are the Scout Agent. Research the current market situation for: ${context}. 
        Find 3 major competitor moves and industry trends. Return a concise bulleted summary.`,
      [AgentType.ARCHITECT]: `You are the Architect Agent. Analyze technical feasibility for: ${context}. 
        Identify 3 technical constraints and potential mitigations. Return a concise bulleted summary.`,
      [AgentType.ANALYST]: `You are the Analyst Agent. Process user sentiment for: ${context}. 
        Identify 3 core pain points and themes from common user feedback. Return a concise bulleted summary.`,
      [AgentType.ORCHESTRATOR]: `You are the Strategist. Integrate everything into a roadmap for: ${context}.`,
    };

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: promptMap[type],
    });

    return response.text ?? "Analysis failed.";
  },

  async generateFinalStrategy(
    context: string,
    scoutData: string,
    architectData: string,
    analystData: string
  ): Promise<StrategyReport> {
    const prompt = `
      Project: ${context}
      
      Market Intelligence (Scout):
      ${scoutData}
      
      Technical Constraints (Architect):
      ${architectData}
      
      User Sentiment (Analyst):
      ${analystData}
      
      Tasks:
      1. Synthesize these inputs.
      2. Identify the top 3 high-impact features.
      3. Create a 3-phase roadmap.
      4. List major risks.
      
      Format your response as valid JSON according to this schema:
      {
        "summary": "High-level strategic summary",
        "priorityFeatures": ["Feature 1", "Feature 2", "Feature 3"],
        "roadmap": [
          { "phase": "Phase 1: Title", "goals": ["Goal A", "Goal B"] },
          { "phase": "Phase 2: Title", "goals": ["Goal C"] }
        ],
        "risks": ["Risk 1", "Risk 2"]
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            priorityFeatures: { type: Type.ARRAY, items: { type: Type.STRING } },
            roadmap: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phase: { type: Type.STRING },
                  goals: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["phase", "goals"],
              },
            },
            risks: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["summary", "priorityFeatures", "roadmap", "risks"],
        },
      },
    });

    const text = response.text;
    return JSON.parse(text);
  },
};
