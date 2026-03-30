/**
 * AgentService — LLM API integration
 * Source: CortixEngineSynthesizer.tsx lines 62-96
 *
 * Handles calls to OpenRouter API for clinical agent execution.
 * Falls back to simulation mode when no API key is set.
 */

import type { AgentMessage } from '../canvas/canvas.types';

export const AgentService = {
  endpoint: 'https://openrouter.ai/api/v1/chat/completions',
  model: 'anthropic/claude-sonnet-4-20250514',
  apiKey: '', // set at runtime from cortixConfig

  async execute(
    systemPrompt: string,
    upstreamData: string[],
    userInput: string,
    patientContext: string,
  ): Promise<string> {
    const messages: AgentMessage[] = [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: [
          patientContext && `## Patient Context\n${patientContext}`,
          upstreamData.length > 0 && `## Upstream Analysis\n${upstreamData.join('\n---\n')}`,
          userInput && `## User Input\n${userInput}`,
          'Provide your clinical analysis.',
        ].filter(Boolean).join('\n\n'),
      },
    ];

    // Simulation mode (no API key)
    if (!AgentService.apiKey) {
      await new Promise(r => setTimeout(r, 600 + Math.random() * 1000));
      return `[Simulated] Analysis based on ${upstreamData.length} upstream inputs. ${
        userInput ? `User context: "${userInput.slice(0, 50)}..."` : 'No user context.'
      }`;
    }

    const res = await fetch(AgentService.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AgentService.apiKey}`,
      },
      body: JSON.stringify({
        model: AgentService.model,
        messages,
        max_tokens: 2048,
      }),
    });
    const data = await res.json();
    return data.choices?.[0]?.message?.content || 'No response';
  },
};
