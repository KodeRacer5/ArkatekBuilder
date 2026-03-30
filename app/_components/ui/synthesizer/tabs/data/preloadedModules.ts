/**
 * Preloaded pipeline module definitions
 * 12 pipelines extracted from prototype lines 2881-3046
 * Each pipeline has title, desc, tag (node count), category, and full ClinicalNodeData nodes[]
 */

import type { ClinicalNodeData } from '../../canvas/canvas.types';
import { CanvasNodeRenderType } from '../../canvas/canvas.types';
import { mkEngine, mkData, mkSquare, mkPill, mkMerger, mkTrigger } from '../../store/useNodeTypesStore';
import { NODE_ACCENT_COLORS, HEALTH_ACCENT_COLORS } from '../../canvas/canvas.constants';

export interface PipelineModuleNode extends ClinicalNodeData {
  /** render type for dimension lookup during auto-layout */
  renderType?: string;
}

/** Explicit edge between pipeline nodes (by array index) */
export interface PipelineEdge {
  from: number;
  to: number;
}

export interface PipelineModule {
  title: string;
  desc: string;
  tag: string;
  category: string;
  nodes: PipelineModuleNode[];
  /** Explicit DAG topology. If omitted, nodes are connected linearly (0→1→2→...) */
  topology?: PipelineEdge[];
}

/* ═══════════════════════════════════════════════════
   12 PRELOADED PIPELINE MODULES
   ═══════════════════════════════════════════════════ */

export const PRELOADED_MODULES: PipelineModule[] = [
  /* ─── DIAGNOSTIC ─── */
  {
    title: 'Differential Diagnosis Pipeline',
    desc: 'Full clinical intake → differential diagnosis → evidence grading pipeline',
    tag: '6 nodes',
    category: 'Diagnostic',
    nodes: [
      { ...mkData('Lab Panel', 'Patient labs', 'flask-conical', 'labs-out', 'Lab Data', 'labs', NODE_ACCENT_COLORS.lab), renderType: 'default' },
      { ...mkData('Symptom Profile', 'Symptoms', 'activity', 'symptoms-out', 'Symptoms', 'symptoms', NODE_ACCENT_COLORS.symptoms), renderType: 'default' },
      { ...mkData('Patient History', 'History', 'user', 'history-out', 'History', 'history', NODE_ACCENT_COLORS.history), renderType: 'default' },
      { ...mkEngine('Differential Diagnosis',
        'Generate ranked differential diagnoses',
        'You are a differential diagnosis engine. Analyze all upstream data.',
        { ext: { label: 'DDx', icon: 'crosshair', color: NODE_ACCENT_COLORS.diffdiag }, tool: null, data: null },
        NODE_ACCENT_COLORS.diffdiag), renderType: 'engine' },
      { ...mkEngine('Evidence Grading',
        'Grade evidence quality',
        'You are an evidence grading engine. Apply GRADE framework.',
        { ext: { label: 'Evidence', icon: 'award', color: NODE_ACCENT_COLORS.evidence }, tool: null, data: null },
        NODE_ACCENT_COLORS.evidence), renderType: 'engine' },
      { ...mkSquare('Clinical Summary', 'Generate clinical summary', 'file-text', NODE_ACCENT_COLORS.summary), renderType: 'square' },
    ],
    topology: [
      { from: 0, to: 3 }, { from: 1, to: 3 }, { from: 2, to: 3 }, // 3 inputs → DDx
      { from: 3, to: 4 }, // DDx → Evidence
      { from: 4, to: 5 }, // Evidence → Summary
    ],
  },
  {
    title: 'Symptom Analysis',
    desc: 'Symptom intake → causal analysis → contraindication check',
    tag: '4 nodes',
    category: 'Diagnostic',
    nodes: [
      { ...mkData('Symptom Profile', 'Symptoms', 'activity', 'symptoms-out', 'Symptoms', 'symptoms', NODE_ACCENT_COLORS.symptoms), renderType: 'default' },
      { ...mkEngine('Causal Analysis', 'Trace root causes', 'You are a causal analysis engine.',
        { ext: { label: 'Causal', icon: 'git-branch', color: NODE_ACCENT_COLORS.causal }, tool: null, data: null },
        NODE_ACCENT_COLORS.causal), renderType: 'engine' },
      { ...mkEngine('Contraindication Check', 'Check contraindications', 'You are a contraindication checker.',
        { ext: { label: 'CI Check', icon: 'alert-triangle', color: NODE_ACCENT_COLORS.contraind }, tool: null, data: null },
        NODE_ACCENT_COLORS.contraind), renderType: 'engine' },
      { ...mkSquare('Patient Report', 'Generate report', 'file-output', NODE_ACCENT_COLORS.report), renderType: 'square' },
    ],
  },
  {
    title: 'Cross-Reference Validation',
    desc: 'Multi-source data → cross-reference → audit trail',
    tag: '4 nodes',
    category: 'Diagnostic',
    nodes: [
      { ...mkData('Lab Panel', 'Labs', 'flask-conical', 'labs-out', 'Lab Data', 'labs', NODE_ACCENT_COLORS.lab), renderType: 'default' },
      { ...mkData('Medication List', 'Meds', 'pill', 'meds-out', 'Medications', 'medications', NODE_ACCENT_COLORS.meds), renderType: 'default' },
      { ...mkEngine('Cross-Reference', 'Cross-reference findings', 'You are a clinical cross-reference engine.',
        { ext: { label: 'X-Ref', icon: 'search', color: NODE_ACCENT_COLORS.crossref }, tool: null, data: null },
        NODE_ACCENT_COLORS.crossref), renderType: 'engine' },
      { ...mkSquare('Audit Trail', 'Log reasoning chain', 'list-ordered', NODE_ACCENT_COLORS.audit), renderType: 'square' },
    ],
    topology: [
      { from: 0, to: 2 }, { from: 1, to: 2 }, // Labs, Meds → Cross-Ref
      { from: 2, to: 3 }, // Cross-Ref → Audit
    ],
  },

  /* ─── PHARMACOLOGY ─── */
  {
    title: 'Drug Interaction Analysis',
    desc: 'Medication list → interaction screen → mechanism of action → safety check',
    tag: '5 nodes',
    category: 'Pharmacology',
    nodes: [
      { ...mkData('Medication List', 'Meds', 'pill', 'meds-out', 'Medications', 'medications', NODE_ACCENT_COLORS.meds), renderType: 'default' },
      { ...mkEngine('Drug Interaction Screen', 'Screen interactions', 'You are a drug interaction screening engine.',
        { ext: { label: 'DI Screen', icon: 'shield-alert', color: NODE_ACCENT_COLORS.interaction }, tool: null, data: null },
        NODE_ACCENT_COLORS.interaction), renderType: 'engine' },
      { ...mkEngine('Mechanism of Action', 'Map pathways', 'You are a mechanism of action analyzer.',
        { ext: { label: 'MoA', icon: 'dna', color: NODE_ACCENT_COLORS.mechanism }, tool: null, data: null },
        NODE_ACCENT_COLORS.mechanism), renderType: 'engine' },
      { ...mkEngine('Safety Threshold', 'Validate safety', 'You are a safety threshold engine.',
        { ext: { label: 'Safety', icon: 'shield-check', color: NODE_ACCENT_COLORS.safety }, tool: null, data: null },
        NODE_ACCENT_COLORS.safety), renderType: 'engine' },
      { ...mkSquare('Clinical Summary', 'Summary report', 'file-text', NODE_ACCENT_COLORS.summary), renderType: 'square' },
    ],
  },
  {
    title: 'Dose Optimization',
    desc: 'Patient data → dose-response modeling → risk-benefit → recommendation',
    tag: '5 nodes',
    category: 'Pharmacology',
    nodes: [
      { ...mkData('Patient History', 'History', 'user', 'history-out', 'History', 'history', NODE_ACCENT_COLORS.history), renderType: 'default' },
      { ...mkData('Medication List', 'Meds', 'pill', 'meds-out', 'Medications', 'medications', NODE_ACCENT_COLORS.meds), renderType: 'default' },
      { ...mkEngine('Dose-Response Model', 'Model dose-response', 'You are a dose-response modeling engine.',
        { ext: { label: 'DR Model', icon: 'trending-up', color: NODE_ACCENT_COLORS.doseresp }, tool: null, data: null },
        NODE_ACCENT_COLORS.doseresp), renderType: 'engine' },
      { ...mkEngine('Risk-Benefit Analysis', 'Weigh risks vs benefits', 'You are a risk-benefit analysis engine.',
        { ext: { label: 'Risk/Ben', icon: 'scale', color: NODE_ACCENT_COLORS.riskben }, tool: null, data: null },
        NODE_ACCENT_COLORS.riskben), renderType: 'engine' },
      { ...mkSquare('Treatment Recommendation', 'Treatment plan', 'clipboard', NODE_ACCENT_COLORS.treatment), renderType: 'square' },
    ],
    topology: [
      { from: 0, to: 2 }, { from: 1, to: 2 }, // History, Meds → Dose-Response
      { from: 2, to: 3 }, // Dose-Response → Risk-Benefit
      { from: 3, to: 4 }, // Risk-Benefit → Treatment
    ],
  },
  {
    title: 'Comparative Treatment',
    desc: 'Multi-option treatment comparison with evidence grading',
    tag: '4 nodes',
    category: 'Pharmacology',
    nodes: [
      { ...mkData('Medication List', 'Meds', 'pill', 'meds-out', 'Medications', 'medications', NODE_ACCENT_COLORS.meds), renderType: 'default' },
      { ...mkEngine('Comparative Efficacy', 'Compare treatments', 'You are a comparative efficacy engine.',
        { ext: { label: 'Efficacy', icon: 'bar-chart-2', color: NODE_ACCENT_COLORS.efficacy }, tool: null, data: null },
        NODE_ACCENT_COLORS.efficacy), renderType: 'engine' },
      { ...mkEngine('Evidence Grading', 'Grade evidence', 'You are an evidence grading engine.',
        { ext: { label: 'Evidence', icon: 'award', color: NODE_ACCENT_COLORS.evidence }, tool: null, data: null },
        NODE_ACCENT_COLORS.evidence), renderType: 'engine' },
      { ...mkSquare('Treatment Recommendation', 'Treatment plan', 'clipboard', NODE_ACCENT_COLORS.treatment), renderType: 'square' },
    ],
  },

  /* ─── TREATMENT ─── */
  {
    title: 'Treatment Planning',
    desc: 'Complete intake → analysis → treatment recommendation pipeline',
    tag: '6 nodes',
    category: 'Treatment',
    nodes: [
      { ...mkData('Lab Panel', 'Labs', 'flask-conical', 'labs-out', 'Lab Data', 'labs', NODE_ACCENT_COLORS.lab), renderType: 'default' },
      { ...mkData('Symptom Profile', 'Symptoms', 'activity', 'symptoms-out', 'Symptoms', 'symptoms', NODE_ACCENT_COLORS.symptoms), renderType: 'default' },
      { ...mkEngine('Differential Diagnosis', 'DDx', 'You are a differential diagnosis engine.',
        { ext: { label: 'DDx', icon: 'crosshair', color: NODE_ACCENT_COLORS.diffdiag }, tool: null, data: null },
        NODE_ACCENT_COLORS.diffdiag), renderType: 'engine' },
      { ...mkEngine('Hypothesis Testing', 'Test hypotheses', 'You are a hypothesis testing engine.',
        { ext: { label: 'HypTest', icon: 'flask-round', color: NODE_ACCENT_COLORS.hypothesis }, tool: null, data: null },
        NODE_ACCENT_COLORS.hypothesis), renderType: 'engine' },
      { ...mkEngine('Risk-Benefit Analysis', 'Risk/benefit', 'You are a risk-benefit analysis engine.',
        { ext: { label: 'Risk/Ben', icon: 'scale', color: NODE_ACCENT_COLORS.riskben }, tool: null, data: null },
        NODE_ACCENT_COLORS.riskben), renderType: 'engine' },
      { ...mkSquare('Treatment Recommendation', 'Treatment plan', 'clipboard', NODE_ACCENT_COLORS.treatment), renderType: 'square' },
    ],
    topology: [
      { from: 0, to: 2 }, { from: 1, to: 2 }, // Labs, Symptoms → DDx
      { from: 2, to: 3 }, // DDx → Hypothesis
      { from: 3, to: 4 }, // Hypothesis → Risk-Benefit
      { from: 4, to: 5 }, // Risk-Benefit → Treatment
    ],
  },
  {
    title: 'Patient Report Generator',
    desc: 'Analysis results → patient-friendly report with recommendations',
    tag: '3 nodes',
    category: 'Treatment',
    nodes: [
      { ...mkEngine('Differential Diagnosis', 'DDx', 'You are a differential diagnosis engine.',
        { ext: { label: 'DDx', icon: 'crosshair', color: NODE_ACCENT_COLORS.diffdiag }, tool: null, data: null },
        NODE_ACCENT_COLORS.diffdiag), renderType: 'engine' },
      { ...mkSquare('Clinical Summary', 'Clinical summary', 'file-text', NODE_ACCENT_COLORS.summary), renderType: 'square' },
      { ...mkSquare('Patient Report', 'Patient report', 'file-output', NODE_ACCENT_COLORS.report), renderType: 'square' },
    ],
  },
  {
    title: 'Safety Review',
    desc: 'Drug safety validation with contraindication and threshold checks',
    tag: '4 nodes',
    category: 'Treatment',
    nodes: [
      { ...mkData('Medication List', 'Meds', 'pill', 'meds-out', 'Medications', 'medications', NODE_ACCENT_COLORS.meds), renderType: 'default' },
      { ...mkEngine('Contraindication Check', 'CI check', 'You are a contraindication checker.',
        { ext: { label: 'CI Check', icon: 'alert-triangle', color: NODE_ACCENT_COLORS.contraind }, tool: null, data: null },
        NODE_ACCENT_COLORS.contraind), renderType: 'engine' },
      { ...mkEngine('Safety Threshold', 'Safety validation', 'You are a safety threshold engine.',
        { ext: { label: 'Safety', icon: 'shield-check', color: NODE_ACCENT_COLORS.safety }, tool: null, data: null },
        NODE_ACCENT_COLORS.safety), renderType: 'engine' },
      { ...mkSquare('Audit Trail', 'Audit log', 'list-ordered', NODE_ACCENT_COLORS.audit), renderType: 'square' },
    ],
  },

  /* ─── RESEARCH ─── */
  {
    title: 'Literature Review',
    desc: 'Hypothesis → evidence search → comparative analysis → grading',
    tag: '4 nodes',
    category: 'Research',
    nodes: [
      { ...mkEngine('Hypothesis Testing', 'Test hypotheses', 'You are a hypothesis testing engine.',
        { ext: { label: 'HypTest', icon: 'flask-round', color: NODE_ACCENT_COLORS.hypothesis }, tool: null, data: null },
        NODE_ACCENT_COLORS.hypothesis), renderType: 'engine' },
      { ...mkEngine('Cross-Reference', 'Cross-reference', 'You are a clinical cross-reference engine.',
        { ext: { label: 'X-Ref', icon: 'search', color: NODE_ACCENT_COLORS.crossref }, tool: null, data: null },
        NODE_ACCENT_COLORS.crossref), renderType: 'engine' },
      { ...mkEngine('Evidence Grading', 'Grade evidence', 'You are an evidence grading engine.',
        { ext: { label: 'Evidence', icon: 'award', color: NODE_ACCENT_COLORS.evidence }, tool: null, data: null },
        NODE_ACCENT_COLORS.evidence), renderType: 'engine' },
      { ...mkSquare('Data Export', 'Export results', 'download', NODE_ACCENT_COLORS.export), renderType: 'square' },
    ],
  },
  {
    title: 'Mechanism Investigation',
    desc: 'Compound analysis → mechanism mapping → causal reasoning',
    tag: '4 nodes',
    category: 'Research',
    nodes: [
      { ...mkData('Medication List', 'Compounds', 'pill', 'meds-out', 'Medications', 'medications', NODE_ACCENT_COLORS.meds), renderType: 'default' },
      { ...mkEngine('Mechanism of Action', 'Map mechanisms', 'You are a mechanism of action analyzer.',
        { ext: { label: 'MoA', icon: 'dna', color: NODE_ACCENT_COLORS.mechanism }, tool: null, data: null },
        NODE_ACCENT_COLORS.mechanism), renderType: 'engine' },
      { ...mkEngine('Causal Analysis', 'Trace causality', 'You are a causal analysis engine.',
        { ext: { label: 'Causal', icon: 'git-branch', color: NODE_ACCENT_COLORS.causal }, tool: null, data: null },
        NODE_ACCENT_COLORS.causal), renderType: 'engine' },
      { ...mkSquare('Clinical Summary', 'Summary', 'file-text', NODE_ACCENT_COLORS.summary), renderType: 'square' },
    ],
  },
  {
    title: 'Full Clinical Workup',
    desc: 'Complete intake → all analyses → full report with audit trail',
    tag: '8 nodes',
    category: 'Research',
    nodes: [
      { ...mkData('Lab Panel', 'Labs', 'flask-conical', 'labs-out', 'Lab Data', 'labs', NODE_ACCENT_COLORS.lab), renderType: 'default' },
      { ...mkData('Medication List', 'Meds', 'pill', 'meds-out', 'Medications', 'medications', NODE_ACCENT_COLORS.meds), renderType: 'default' },
      { ...mkData('Symptom Profile', 'Symptoms', 'activity', 'symptoms-out', 'Symptoms', 'symptoms', NODE_ACCENT_COLORS.symptoms), renderType: 'default' },
      { ...mkEngine('Differential Diagnosis', 'DDx', 'You are a differential diagnosis engine.',
        { ext: { label: 'DDx', icon: 'crosshair', color: NODE_ACCENT_COLORS.diffdiag }, tool: null, data: null },
        NODE_ACCENT_COLORS.diffdiag), renderType: 'engine' },
      { ...mkEngine('Drug Interaction Screen', 'DI Screen', 'You are a drug interaction screening engine.',
        { ext: { label: 'DI Screen', icon: 'shield-alert', color: NODE_ACCENT_COLORS.interaction }, tool: null, data: null },
        NODE_ACCENT_COLORS.interaction), renderType: 'engine' },
      { ...mkEngine('Risk-Benefit Analysis', 'Risk/benefit', 'You are a risk-benefit analysis engine.',
        { ext: { label: 'Risk/Ben', icon: 'scale', color: NODE_ACCENT_COLORS.riskben }, tool: null, data: null },
        NODE_ACCENT_COLORS.riskben), renderType: 'engine' },
      { ...mkSquare('Treatment Recommendation', 'Treatment plan', 'clipboard', NODE_ACCENT_COLORS.treatment), renderType: 'square' },
      { ...mkSquare('Audit Trail', 'Audit log', 'list-ordered', NODE_ACCENT_COLORS.audit), renderType: 'square' },
    ],
    topology: [
      { from: 0, to: 3 }, { from: 2, to: 3 }, // Labs, Symptoms → DDx
      { from: 1, to: 4 },                       // Meds → DI Screen
      { from: 3, to: 5 }, { from: 4, to: 5 },  // DDx, DI Screen → Risk-Benefit
      { from: 5, to: 6 },                       // Risk-Benefit → Treatment
      { from: 5, to: 7 },                       // Risk-Benefit → Audit
    ],
  },
];

/* ═══════════════════════════════════════════════════
   CORTIXHEALTH PRELOADED MODULES (14 wellness pipelines)
   ═══════════════════════════════════════════════════ */
export const HEALTH_PRELOADED_MODULES: PipelineModule[] = [

  /* ─── SUPPLEMENT PLANNING (3) ─── */
  {
    title: 'Daily Supplement Stack',
    desc: 'Build personalized daily supplement routine based on health goals and nutrient gaps',
    tag: '5 nodes', category: 'Supplement Planning',
    nodes: [
      { ...mkTrigger('Chat Input', 'User wellness query', 'message-square', 'small'), renderType: 'smRounded' },
      { ...mkData('Health Goals', 'Wellness objectives', 'target', 'goals-out', 'Goals', 'any', HEALTH_ACCENT_COLORS.goals), renderType: 'rect' },
      { ...mkData('Current Supplements', 'Active regimen', 'pill', 'supps-out', 'Supplements', 'any', HEALTH_ACCENT_COLORS.supplements), renderType: 'rect' },
      { ...mkEngine('Supplement Stack Builder', 'Build supplement stack', 'You are a supplement specialist. Design evidence-based supplement stacks.', { ext: null, tool: null, data: null }, HEALTH_ACCENT_COLORS.stackbuilder, 'layers'), renderType: 'engine' },
      { ...mkSquare('Wellness Summary', 'Output summary', 'file-text', HEALTH_ACCENT_COLORS.wellnessSummary), renderType: 'square' },
    ],
    topology: [{ from: 0, to: 3 }, { from: 1, to: 3 }, { from: 2, to: 3 }, { from: 3, to: 4 }],
  },
  {
    title: 'Interaction Checker',
    desc: 'Screen supplements against medications and other supplements for safety',
    tag: '4 nodes', category: 'Supplement Planning',
    nodes: [
      { ...mkData('Current Supplements', 'Active regimen', 'pill', 'supps-out', 'Supplements', 'any', HEALTH_ACCENT_COLORS.supplements), renderType: 'rect' },
      { ...mkData('Health Conditions', 'Current conditions', 'clipboard', 'conditions-out', 'Conditions', 'any', HEALTH_ACCENT_COLORS.conditions), renderType: 'rect' },
      { ...mkEngine('CortixHealth', 'Interaction screening', 'You are a supplement safety screener. Check all compounds for interactions.', { ext: null, tool: null, data: null }, HEALTH_ACCENT_COLORS.supplements), renderType: 'engine' },
      { ...mkSquare('Wellness Summary', 'Safety report', 'file-text', HEALTH_ACCENT_COLORS.wellnessSummary), renderType: 'square' },
    ],
    topology: [{ from: 0, to: 2 }, { from: 1, to: 2 }, { from: 2, to: 3 }],
  },
  {
    title: 'Mineral Balance',
    desc: 'Analyze mineral intake and recommend adjustments based on symptoms',
    tag: '4 nodes', category: 'Supplement Planning',
    nodes: [
      { ...mkTrigger('Chat Input', 'Symptom description', 'message-square', 'small'), renderType: 'smRounded' },
      { ...mkData('Current Supplements', 'Active regimen', 'pill', 'supps-out', 'Supplements', 'any', HEALTH_ACCENT_COLORS.supplements), renderType: 'rect' },
      { ...mkEngine('Mineral Balance', 'Mineral analysis', 'You are a mineral balance specialist. Analyze intake and recommend adjustments.', { ext: null, tool: null, data: null }, HEALTH_ACCENT_COLORS.mineral, 'gem'), renderType: 'engine' },
      { ...mkSquare('Wellness Summary', 'Mineral report', 'file-text', HEALTH_ACCENT_COLORS.wellnessSummary), renderType: 'square' },
    ],
    topology: [{ from: 0, to: 2 }, { from: 1, to: 2 }, { from: 2, to: 3 }],
  },

  /* ─── NUTRITION (3) ─── */
  {
    title: 'Meal Plan Builder',
    desc: 'Weekly meal plans aligned with dietary goals and restrictions',
    tag: '5 nodes', category: 'Nutrition',
    nodes: [
      { ...mkTrigger('Chat Input', 'Dietary goals', 'message-square', 'small'), renderType: 'smRounded' },
      { ...mkData('Dietary Restrictions', 'Allergies and preferences', 'utensils', 'diet-out', 'Dietary', 'any', HEALTH_ACCENT_COLORS.dietary), renderType: 'rect' },
      { ...mkPill('Filter', 'Review dietary profile', 'Review & confirm', 'Does this look right?', HEALTH_ACCENT_COLORS.filter), renderType: 'pill' },
      { ...mkEngine('Meal Planner', 'Build meal plan', 'You are a nutrition specialist. Create personalized weekly meal plans.', { ext: null, tool: null, data: null }, HEALTH_ACCENT_COLORS.mealplan, 'utensils'), renderType: 'engine' },
      { ...mkSquare('Weekly Schedule', 'Meal schedule', 'calendar', HEALTH_ACCENT_COLORS.schedule), renderType: 'square' },
    ],
    topology: [{ from: 0, to: 2 }, { from: 1, to: 2 }, { from: 2, to: 3 }, { from: 3, to: 4 }],
  },
  {
    title: 'Nutrient Gap Analysis',
    desc: 'Identify nutritional deficiencies and recommend solutions',
    tag: '4 nodes', category: 'Nutrition',
    nodes: [
      { ...mkTrigger('Chat Input', 'Current diet description', 'message-square', 'small'), renderType: 'smRounded' },
      { ...mkData('Dietary Restrictions', 'Current diet info', 'utensils', 'diet-out', 'Dietary', 'any', HEALTH_ACCENT_COLORS.dietary), renderType: 'rect' },
      { ...mkEngine('Nutrient Gap Analysis', 'Find gaps', 'You are a nutritional analyst. Identify nutrient gaps and recommend solutions.', { ext: null, tool: null, data: null }, HEALTH_ACCENT_COLORS.nutrientgap, 'search'), renderType: 'engine' },
      { ...mkSquare('Wellness Summary', 'Nutrient report', 'file-text', HEALTH_ACCENT_COLORS.wellnessSummary), renderType: 'square' },
    ],
    topology: [{ from: 0, to: 2 }, { from: 1, to: 2 }, { from: 2, to: 3 }],
  },
  {
    title: 'Anti-Inflammatory Protocol',
    desc: 'Food and supplement plan targeting inflammation markers',
    tag: '5 nodes', category: 'Nutrition',
    nodes: [
      { ...mkData('Health Conditions', 'Inflammation markers', 'clipboard', 'conditions-out', 'Conditions', 'any', HEALTH_ACCENT_COLORS.conditions), renderType: 'rect' },
      { ...mkData('Current Supplements', 'Active regimen', 'pill', 'supps-out', 'Supplements', 'any', HEALTH_ACCENT_COLORS.supplements), renderType: 'rect' },
      { ...mkEngine('CortixHealth', 'Anti-inflammatory analysis', 'You are an inflammation specialist. Design anti-inflammatory protocols.', { ext: null, tool: null, data: null }, HEALTH_ACCENT_COLORS.immune), renderType: 'engine' },
      { ...mkEngine('Meal Planner', 'Anti-inflammatory meals', 'You are a nutrition specialist. Create anti-inflammatory meal plans.', { ext: null, tool: null, data: null }, HEALTH_ACCENT_COLORS.mealplan, 'utensils'), renderType: 'engine' },
      { ...mkSquare('Weekly Schedule', 'Combined plan', 'calendar', HEALTH_ACCENT_COLORS.schedule), renderType: 'square' },
    ],
    topology: [{ from: 0, to: 2 }, { from: 1, to: 2 }, { from: 2, to: 3 }, { from: 3, to: 4 }],
  },

  /* ─── MOVEMENT & RECOVERY (3) ─── */
  {
    title: 'Exercise Routine Builder',
    desc: 'Custom routine based on fitness level, goals, and equipment',
    tag: '4 nodes', category: 'Movement & Recovery',
    nodes: [
      { ...mkTrigger('Chat Input', 'Fitness goals', 'message-square', 'small'), renderType: 'smRounded' },
      { ...mkData('Activity Level', 'Current fitness', 'activity', 'activity-out', 'Activity', 'any', HEALTH_ACCENT_COLORS.activity), renderType: 'rect' },
      { ...mkEngine('Exercise Routine', 'Build routine', 'You are a fitness specialist. Design custom exercise routines.', { ext: null, tool: null, data: null }, HEALTH_ACCENT_COLORS.exercise, 'dumbbell'), renderType: 'engine' },
      { ...mkSquare('Weekly Schedule', 'Exercise plan', 'calendar', HEALTH_ACCENT_COLORS.schedule), renderType: 'square' },
    ],
    topology: [{ from: 0, to: 2 }, { from: 1, to: 2 }, { from: 2, to: 3 }],
  },
  {
    title: 'Sleep Optimization',
    desc: 'Evening routine, supplements, and habits for better sleep',
    tag: '4 nodes', category: 'Movement & Recovery',
    nodes: [
      { ...mkTrigger('Chat Input', 'Sleep issues', 'message-square', 'small'), renderType: 'smRounded' },
      { ...mkData('Health Conditions', 'Relevant conditions', 'clipboard', 'conditions-out', 'Conditions', 'any', HEALTH_ACCENT_COLORS.conditions), renderType: 'rect' },
      { ...mkEngine('Sleep Optimization', 'Optimize sleep', 'You are a sleep specialist. Design sleep optimization protocols.', { ext: null, tool: null, data: null }, HEALTH_ACCENT_COLORS.sleep, 'moon'), renderType: 'engine' },
      { ...mkSquare('Wellness Summary', 'Sleep plan', 'file-text', HEALTH_ACCENT_COLORS.wellnessSummary), renderType: 'square' },
    ],
    topology: [{ from: 0, to: 2 }, { from: 1, to: 2 }, { from: 2, to: 3 }],
  },
  {
    title: 'Recovery Protocol',
    desc: 'Post-workout or illness recovery with nutrition and rest',
    tag: '4 nodes', category: 'Movement & Recovery',
    nodes: [
      { ...mkTrigger('Chat Input', 'Recovery needs', 'message-square', 'small'), renderType: 'smRounded' },
      { ...mkData('Activity Level', 'Exercise baseline', 'activity', 'activity-out', 'Activity', 'any', HEALTH_ACCENT_COLORS.activity), renderType: 'rect' },
      { ...mkEngine('Recovery Protocol', 'Build recovery plan', 'You are a recovery specialist. Design recovery protocols.', { ext: null, tool: null, data: null }, HEALTH_ACCENT_COLORS.recovery, 'heart-pulse'), renderType: 'engine' },
      { ...mkSquare('Wellness Summary', 'Recovery plan', 'file-text', HEALTH_ACCENT_COLORS.wellnessSummary), renderType: 'square' },
    ],
    topology: [{ from: 0, to: 2 }, { from: 1, to: 2 }, { from: 2, to: 3 }],
  },

  /* ─── NATURAL REMEDIES (3) ─── */
  {
    title: 'Herbal Formulation',
    desc: 'Evidence-based herbal combinations for specific health goals',
    tag: '5 nodes', category: 'Natural Remedies',
    nodes: [
      { ...mkTrigger('Chat Input', 'Health concern', 'message-square', 'small'), renderType: 'smRounded' },
      { ...mkData('Health Conditions', 'Conditions', 'clipboard', 'conditions-out', 'Conditions', 'any', HEALTH_ACCENT_COLORS.conditions), renderType: 'rect' },
      { ...mkPill('Filter', 'Confirm symptoms', 'Review & confirm', 'Does this look right?', HEALTH_ACCENT_COLORS.filter), renderType: 'pill' },
      { ...mkEngine('Herbal Formulation', 'Match herbs', 'You are an herbal medicine specialist. Recommend evidence-based herbal formulations.', { ext: null, tool: null, data: null }, HEALTH_ACCENT_COLORS.herbal, 'leaf'), renderType: 'engine' },
      { ...mkSquare('Wellness Summary', 'Herbal plan', 'file-text', HEALTH_ACCENT_COLORS.wellnessSummary), renderType: 'square' },
    ],
    topology: [{ from: 0, to: 2 }, { from: 1, to: 2 }, { from: 2, to: 3 }, { from: 3, to: 4 }],
  },
  {
    title: 'Homeopathic Remedy Finder',
    desc: 'Match symptoms to remedies with potency guidance',
    tag: '4 nodes', category: 'Natural Remedies',
    nodes: [
      { ...mkTrigger('Chat Input', 'Symptom description', 'message-square', 'small'), renderType: 'smRounded' },
      { ...mkData('Health Conditions', 'Background', 'clipboard', 'conditions-out', 'Conditions', 'any', HEALTH_ACCENT_COLORS.conditions), renderType: 'rect' },
      { ...mkEngine('Homeopathic Remedy Finder', 'Find remedies', 'You are a homeopathic specialist. Match symptoms to remedies. Note evidence levels honestly.', { ext: null, tool: null, data: null }, HEALTH_ACCENT_COLORS.homeopathic, 'flask-conical'), renderType: 'engine' },
      { ...mkSquare('Wellness Summary', 'Remedy report', 'file-text', HEALTH_ACCENT_COLORS.wellnessSummary), renderType: 'square' },
    ],
    topology: [{ from: 0, to: 2 }, { from: 1, to: 2 }, { from: 2, to: 3 }],
  },
  {
    title: 'Immune Support Protocol',
    desc: 'Seasonal or reactive immune support with supplements and lifestyle',
    tag: '5 nodes', category: 'Natural Remedies',
    nodes: [
      { ...mkTrigger('Chat Input', 'Immune concern', 'message-square', 'small'), renderType: 'smRounded' },
      { ...mkData('Current Supplements', 'Active regimen', 'pill', 'supps-out', 'Supplements', 'any', HEALTH_ACCENT_COLORS.supplements), renderType: 'rect' },
      { ...mkData('Health Conditions', 'Conditions', 'clipboard', 'conditions-out', 'Conditions', 'any', HEALTH_ACCENT_COLORS.conditions), renderType: 'rect' },
      { ...mkEngine('Immune Support', 'Build immune protocol', 'You are an immune support specialist. Design immune protocols.', { ext: null, tool: null, data: null }, HEALTH_ACCENT_COLORS.immune, 'shield'), renderType: 'engine' },
      { ...mkSquare('Wellness Summary', 'Immune plan', 'file-text', HEALTH_ACCENT_COLORS.wellnessSummary), renderType: 'square' },
    ],
    topology: [{ from: 0, to: 3 }, { from: 1, to: 3 }, { from: 2, to: 3 }, { from: 3, to: 4 }],
  },

  /* ─── WELLNESS TRACKING (2) ─── */
  {
    title: 'Weekly Wellness Summary',
    desc: 'Aggregate progress across all active plans',
    tag: '3 nodes', category: 'Wellness Tracking',
    nodes: [
      { ...mkEngine('CortixHealth', 'Aggregate findings', 'You are a wellness summarizer. Synthesize all plan data into a clear summary.', { ext: null, tool: null, data: null }), renderType: 'engine' },
      { ...mkSquare('Wellness Summary', 'Weekly overview', 'file-text', HEALTH_ACCENT_COLORS.wellnessSummary), renderType: 'square' },
      { ...mkSquare('Progress Report', 'Progress tracker', 'trending-up', HEALTH_ACCENT_COLORS.progress), renderType: 'square' },
    ],
  },
  {
    title: 'Progress Report',
    desc: 'Before-and-after comparison with actionable next steps',
    tag: '3 nodes', category: 'Wellness Tracking',
    nodes: [
      { ...mkEngine('CortixHealth', 'Progress analysis', 'You are a progress analyst. Compare before and after data with actionable next steps.', { ext: null, tool: null, data: null }), renderType: 'engine' },
      { ...mkSquare('Progress Report', 'Comparison report', 'trending-up', HEALTH_ACCENT_COLORS.progress), renderType: 'square' },
      { ...mkSquare('Export Plan', 'Exportable report', 'download', HEALTH_ACCENT_COLORS.exportplan), renderType: 'square' },
    ],
  },

  /* ─── BIOMETRIC INTELLIGENCE (3) ─── */
  {
    title: 'Morning Readiness Protocol',
    desc: 'Bracelet data → HRV + sleep analysis → readiness score → adjusted daily plan',
    tag: '6 nodes', category: 'Biometric Intelligence',
    nodes: [
      { ...mkData('Bracelet Feed', 'Live biometrics', 'watch', 'bio-out', 'Biometrics', 'any', HEALTH_ACCENT_COLORS.bracelet), renderType: 'rect' },
      { ...mkEngine('HRV Interpreter', 'Analyze HRV', 'You are an HRV analyst.', { ext: null, tool: null, data: null }, HEALTH_ACCENT_COLORS.hrv, 'heart-pulse'), renderType: 'engine' },
      { ...mkEngine('Sleep Analyzer', 'Analyze sleep', 'You are a sleep analyst.', { ext: null, tool: null, data: null }, HEALTH_ACCENT_COLORS.sleepStages, 'moon'), renderType: 'engine' },
      { ...mkEngine('Readiness Score', 'Daily readiness', 'You are a readiness analyst.', { ext: null, tool: null, data: null }, HEALTH_ACCENT_COLORS.readiness, 'gauge'), renderType: 'engine' },
      { ...mkEngine('CortixHealth', 'Adjust daily plan', 'Adjust supplement timing, exercise intensity, and recovery based on readiness.', { ext: null, tool: null, data: null }), renderType: 'engine' },
      { ...mkSquare('Wellness Summary', 'Daily readiness report', 'file-text', HEALTH_ACCENT_COLORS.wellnessSummary), renderType: 'square' },
    ],
    topology: [{ from: 0, to: 1 }, { from: 0, to: 2 }, { from: 1, to: 3 }, { from: 2, to: 3 }, { from: 3, to: 4 }, { from: 4, to: 5 }],
  },
  {
    title: 'Stress Detection & Response',
    desc: 'Biometric strain tracking → stress pattern detection → adaptogen protocol',
    tag: '5 nodes', category: 'Biometric Intelligence',
    nodes: [
      { ...mkData('Bracelet Feed', 'Live biometrics', 'watch', 'bio-out', 'Biometrics', 'any', HEALTH_ACCENT_COLORS.bracelet), renderType: 'rect' },
      { ...mkEngine('Strain Monitor', 'Track strain', 'You are a strain analyst.', { ext: null, tool: null, data: null }, HEALTH_ACCENT_COLORS.strain, 'activity'), renderType: 'engine' },
      { ...mkEngine('Deficiency Mapper', 'Map stress symptoms', 'Map stress markers to nutrient needs.', { ext: null, tool: null, data: null }, HEALTH_ACCENT_COLORS.interactionGraph, 'crosshair'), renderType: 'engine' },
      { ...mkEngine('Supplement Stack Builder', 'Adaptogen stack', 'Build stress-response supplement protocol.', { ext: null, tool: null, data: null }, HEALTH_ACCENT_COLORS.stackbuilder, 'layers'), renderType: 'engine' },
      { ...mkSquare('Protocol Card', 'Stress protocol', 'file-text', HEALTH_ACCENT_COLORS.verifiedFormulation), renderType: 'square' },
    ],
    topology: [{ from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3 }, { from: 3, to: 4 }],
  },
  {
    title: 'Recovery Optimization',
    desc: 'Post-workout biometrics → recovery assessment → nutrition + supplement protocol',
    tag: '5 nodes', category: 'Biometric Intelligence',
    nodes: [
      { ...mkData('Bracelet Feed', 'Post-workout data', 'watch', 'bio-out', 'Biometrics', 'any', HEALTH_ACCENT_COLORS.bracelet), renderType: 'rect' },
      { ...mkEngine('Strain Monitor', 'Assess training load', 'You are a strain analyst.', { ext: null, tool: null, data: null }, HEALTH_ACCENT_COLORS.strain, 'activity'), renderType: 'engine' },
      { ...mkEngine('Recovery Protocol', 'Build recovery plan', 'Design recovery protocol.', { ext: null, tool: null, data: null }, HEALTH_ACCENT_COLORS.recovery, 'heart-pulse'), renderType: 'engine' },
      { ...mkEngine('Product Matcher', 'Match to verified products', 'Match recovery supplements to verified products.', { ext: null, tool: null, data: null }, HEALTH_ACCENT_COLORS.verifiedFormulation, 'check-circle'), renderType: 'engine' },
      { ...mkSquare('Order Builder', 'Recovery order', 'shopping-cart', HEALTH_ACCENT_COLORS.orderBuilder), renderType: 'square' },
    ],
    topology: [{ from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3 }, { from: 3, to: 4 }],
  },

  /* ─── VERIFIED PRODUCT PIPELINES (3) ─── */
  {
    title: 'Full Stack Builder with Verified Products',
    desc: 'Health goals → knowledge query → supplement stack → product matching → quality verification → order',
    tag: '7 nodes', category: 'Verified Products',
    nodes: [
      { ...mkTrigger('Chat Input', 'Health goals', 'message-square', 'small'), renderType: 'smRounded' },
      { ...mkData('Health Conditions', 'Current conditions', 'clipboard', 'conditions-out', 'Conditions', 'any', HEALTH_ACCENT_COLORS.conditions), renderType: 'rect' },
      { ...mkEngine('Knowledge Query', 'Query compound DB', 'Query knowledge graphs for compounds.', { ext: null, tool: null, data: null }, HEALTH_ACCENT_COLORS.compoundDb, 'search'), renderType: 'engine' },
      { ...mkEngine('Supplement Stack Builder', 'Design stack', 'Build evidence-based supplement stack.', { ext: null, tool: null, data: null }, HEALTH_ACCENT_COLORS.stackbuilder, 'layers'), renderType: 'engine' },
      { ...mkEngine('Product Matcher', 'Match verified products', 'Match to verified manufacturer products.', { ext: null, tool: null, data: null }, HEALTH_ACCENT_COLORS.verifiedFormulation, 'check-circle'), renderType: 'engine' },
      { ...mkEngine('Quality Verifier', 'Verify certifications', 'Validate GMP, CoA, third-party testing.', { ext: null, tool: null, data: null }, HEALTH_ACCENT_COLORS.qualityCert, 'shield-check'), renderType: 'engine' },
      { ...mkSquare('Order Builder', 'Final order', 'shopping-cart', HEALTH_ACCENT_COLORS.orderBuilder), renderType: 'square' },
    ],
    topology: [{ from: 0, to: 2 }, { from: 1, to: 2 }, { from: 2, to: 3 }, { from: 3, to: 4 }, { from: 4, to: 5 }, { from: 5, to: 6 }],
  },
  {
    title: 'Lab Results → Protocol',
    desc: 'Upload bloodwork → interpret → identify gaps → match products → generate protocol',
    tag: '6 nodes', category: 'Verified Products',
    nodes: [
      { ...mkData('Manual Vitals', 'Lab results upload', 'clipboard', 'vitals-out', 'Vitals', 'any', HEALTH_ACCENT_COLORS.manualVitals), renderType: 'rect' },
      { ...mkEngine('Deficiency Mapper', 'Interpret labs', 'Map lab values to nutrient status.', { ext: null, tool: null, data: null }, HEALTH_ACCENT_COLORS.interactionGraph, 'crosshair'), renderType: 'engine' },
      { ...mkEngine('Knowledge Query', 'Cross-reference evidence', 'Query evidence base for recommendations.', { ext: null, tool: null, data: null }, HEALTH_ACCENT_COLORS.compoundDb, 'search'), renderType: 'engine' },
      { ...mkEngine('Supplement Stack Builder', 'Build correction stack', 'Design targeted supplement protocol.', { ext: null, tool: null, data: null }, HEALTH_ACCENT_COLORS.stackbuilder, 'layers'), renderType: 'engine' },
      { ...mkEngine('Product Matcher', 'Match products', 'Match to verified products.', { ext: null, tool: null, data: null }, HEALTH_ACCENT_COLORS.verifiedFormulation, 'check-circle'), renderType: 'engine' },
      { ...mkSquare('Protocol Card', 'Lab-based protocol', 'file-text', HEALTH_ACCENT_COLORS.verifiedFormulation), renderType: 'square' },
    ],
    topology: [{ from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3 }, { from: 3, to: 4 }, { from: 4, to: 5 }],
  },
  {
    title: 'Biometric-Driven Full Protocol',
    desc: 'Bracelet + labs + goals → full analysis → knowledge-backed protocol → verified products → order',
    tag: '8 nodes', category: 'Verified Products',
    nodes: [
      { ...mkData('Bracelet Feed', 'Biometric data', 'watch', 'bio-out', 'Biometrics', 'any', HEALTH_ACCENT_COLORS.bracelet), renderType: 'rect' },
      { ...mkData('Manual Vitals', 'Lab results', 'clipboard', 'vitals-out', 'Vitals', 'any', HEALTH_ACCENT_COLORS.manualVitals), renderType: 'rect' },
      { ...mkData('Health Goals', 'Wellness objectives', 'target', 'goals-out', 'Goals', 'any', HEALTH_ACCENT_COLORS.goals), renderType: 'rect' },
      { ...mkEngine('Readiness Score', 'Assess current state', 'Synthesize biometrics into readiness.', { ext: null, tool: null, data: null }, HEALTH_ACCENT_COLORS.readiness, 'gauge'), renderType: 'engine' },
      { ...mkEngine('Deficiency Mapper', 'Map gaps', 'Identify deficiencies from all data.', { ext: null, tool: null, data: null }, HEALTH_ACCENT_COLORS.interactionGraph, 'crosshair'), renderType: 'engine' },
      { ...mkEngine('Supplement Stack Builder', 'Full protocol', 'Build comprehensive supplement protocol.', { ext: null, tool: null, data: null }, HEALTH_ACCENT_COLORS.stackbuilder, 'layers'), renderType: 'engine' },
      { ...mkEngine('Product Matcher', 'Verified products', 'Match all to verified products.', { ext: null, tool: null, data: null }, HEALTH_ACCENT_COLORS.verifiedFormulation, 'check-circle'), renderType: 'engine' },
      { ...mkSquare('Order Builder', 'Complete order', 'shopping-cart', HEALTH_ACCENT_COLORS.orderBuilder), renderType: 'square' },
    ],
    topology: [{ from: 0, to: 3 }, { from: 1, to: 4 }, { from: 2, to: 4 }, { from: 3, to: 5 }, { from: 4, to: 5 }, { from: 5, to: 6 }, { from: 6, to: 7 }],
  },
];
