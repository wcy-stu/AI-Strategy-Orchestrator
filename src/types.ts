/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum AgentType {
  SCOUT = 'Scout',
  ARCHITECT = 'Architect',
  ANALYST = 'Analyst',
  ORCHESTRATOR = 'Orchestrator',
}

export enum AgentStatus {
  IDLE = 'idle',
  RESEARCHING = 'researching',
  ANALYZING = 'analyzing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export interface AgentState {
  type: AgentType;
  status: AgentStatus;
  message: string;
  progress: number;
}

export interface MarketInsight {
  competitor: string;
  move: string;
  impact: 'High' | 'Medium' | 'Low';
}

export interface TechnicalConstraint {
  area: string;
  limitation: string;
  mitigation: string;
}

export interface UserSentiment {
  category: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  keyQuote: string;
}

export interface StrategyReport {
  summary: string;
  priorityFeatures: string[];
  roadmap: { phase: string; goals: string[] }[];
  risks: string[];
}
