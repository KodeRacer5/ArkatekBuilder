/**
 * CortixEngine Universal Output Schema
 * 
 * Every thinking node outputs this exact structure.
 * One schema, all models, all verticals.
 */

export interface CortixNodeOutput {
  nodeId: string;
  nodeType: string;
  status: 'complete' | 'error' | 'partial';
  data: {
    findings: CortixFinding[];
    flags: CortixFlag[];
    values: Record<string, string | number>;
    sources: CortixSource[];
  };
  meta: {
    model: string;
    confidence: number;
    reasoning: string;
    steps_completed: number;
  };
}

export interface CortixFinding {
  id: string;
  label: string;
  detail: string;
  confidence: number;
  category?: string;
}

export interface CortixFlag {
  id: string;
  severity: 'none' | 'mild' | 'moderate' | 'severe' | 'critical';
  label: string;
  detail: string;
  source?: string;
}

export interface CortixSource {
  title: string;
  type: 'literature' | 'database' | 'guideline' | 'monograph' | 'upstream';
  reference?: string;
  confidence?: number;
}

/**
 * Session context — accumulates across entire pipeline run.
 * Every node reads this, every node appends to it.
 */
export interface CortixSessionContext {
  pipelineId: string;
  startedAt: string;
  patient: Record<string, string>;
  nodeOutputs: CortixNodeOutput[];
  activeProfile: string;
}

/**
 * Empty session context factory
 */
export const createSessionContext = (
  pipelineId: string,
  patient: Record<string, string>,
  profile: string,
): CortixSessionContext => ({
  pipelineId,
  startedAt: new Date().toISOString(),
  patient,
  nodeOutputs: [],
  activeProfile: profile,
});

/**
 * JSON schema string injected into every thinking node prompt.
 * Models must output this exact structure.
 */
export const OUTPUT_SCHEMA_INSTRUCTION = `
Respond ONLY with valid JSON in this exact structure. No markdown, no explanation, no wrapping.
{
  "status": "complete",
  "data": {
    "findings": [{ "id": "f1", "label": "...", "detail": "...", "confidence": 0.0 }],
    "flags": [{ "id": "g1", "severity": "none|mild|moderate|severe|critical", "label": "...", "detail": "..." }],
    "values": { "key": "value" },
    "sources": [{ "title": "...", "type": "literature|database|guideline|monograph|upstream" }]
  },
  "meta": {
    "confidence": 0.0,
    "reasoning": "Brief explanation of analytical approach"
  }
}
Populate only the fields relevant to your task. Leave others as empty arrays or objects.`;
