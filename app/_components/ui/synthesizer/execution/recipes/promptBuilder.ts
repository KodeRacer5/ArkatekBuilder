/**
 * CortixEngine Universal Prompt Builder
 *
 * One template. Variables injected per node from config table.
 * Appends JSON schema instruction to every thinking node.
 */

import { OUTPUT_SCHEMA_INSTRUCTION } from './schema';
import { NODE_RECIPES } from './nodeRecipes';
import type { CortixSessionContext } from './schema';

/**
 * Build the system prompt for any thinking node.
 * Falls back to generic if no recipe found.
 */
export function buildNodeSystemPrompt(nodeLabel: string): string {
  const recipe = NODE_RECIPES[nodeLabel];
  if (!recipe) {
    return `You are a CortixEngine clinical analysis specialist.\nAnalyze the provided data thoroughly.\n${OUTPUT_SCHEMA_INSTRUCTION}`;
  }
  return [
    `You are a ${recipe.role} specialist within the CortixEngine clinical reasoning platform.`,
    `Your task: ${recipe.task}`,
    `Focus your output on: ${recipe.focus}.`,
    OUTPUT_SCHEMA_INSTRUCTION,
  ].join('\n\n');
}

/**
 * Build the user message for a thinking node.
 * Includes full session context + any direct upstream + user input.
 */
export function buildNodeUserMessage(
  sessionContext: CortixSessionContext,
  upstreamResults: string[],
  userInput?: string,
): string {
  const sections: string[] = [];

  // Patient data
  const patientFields = Object.entries(sessionContext.patient)
    .filter(([_, v]) => v && v.trim())
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');
  if (patientFields) {
    sections.push(`## Patient Data\n${patientFields}`);
  }

  // Prior node outputs (session accumulator)
  if (sessionContext.nodeOutputs.length > 0) {
    sections.push(`## Prior Analysis\n${JSON.stringify(sessionContext.nodeOutputs, null, 2)}`);
  }

  // Direct upstream (edge-connected)
  if (upstreamResults.length > 0) {
    sections.push(`## Direct Upstream Input\n${upstreamResults.join('\n---\n')}`);
  }

  // User input
  if (userInput?.trim()) {
    sections.push(`## User Input\n${userInput}`);
  }

  sections.push('Analyze the above and respond with the required JSON structure.');

  return sections.join('\n\n');
}

/**
 * Parse model JSON response. Tolerant of markdown wrapping.
 */
export function parseNodeOutput(raw: string): Record<string, any> | null {
  // Strip markdown code fences if present
  let cleaned = raw.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
  }
  try {
    return JSON.parse(cleaned);
  } catch {
    // Try to extract JSON object from mixed output
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try { return JSON.parse(match[0]); } catch { /* fall through */ }
    }
    return null;
  }
}
