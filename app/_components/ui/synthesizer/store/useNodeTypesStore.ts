/**
 * useNodeTypesStore — node palette data (10-category prototype alignment)
 * Source: CortixEngineSynthesizer.tsx lines 118-236 → restructured for v3
 *
 * Palette organized by prototype categories:
 * Nodes → Acquire → Organize → Appraise → Apply → Assess →
 * Custom Modules → Skills → Web → System
 *
 * v3 rules:
 * - CortixEngine is ALWAYS labeled "CortixEngine" — function name in subtitle
 * - Sub-port labels: Extension, Tool, Data (not Memory)
 * - Data sub-port is ALWAYS null
 * - All nodes have action: true (rod+button)
 * - Icon for CortixEngine: bot (Lucide)
 * - Factories exported for reuse by preloadedModules.ts / extensionPackData.ts
 */

import type { ClinicalNodeData, CanvasConnectionPort, PortDataType, EngineSubPorts } from '../canvas/canvas.types';
import { CanvasNodeRenderType } from '../canvas/canvas.types';
import { NODE_ACCENT_COLORS, HEALTH_ACCENT_COLORS } from '../canvas/canvas.constants';

/* ═══════════════════════════════════════════════════
   HELPER FACTORIES — exported for reuse
   ═══════════════════════════════════════════════════ */

/** Default rect card (backward-compatible, now with action + accentColor) */
export const mkData = (
  label: string, desc: string, icon: string,
  outId: string, outLabel: string, outType: PortDataType,
  accentColor?: string,
): ClinicalNodeData => ({
  label, category: 'data', shape: 'rect', description: desc, icon,
  inputPorts: [],
  outputPorts: [{ id: outId, label: outLabel, dataType: outType }],
  execution: { status: 'idle', running: false },
  render: { type: CanvasNodeRenderType.Default },
  action: true,
  ...(accentColor ? { accentColor } : {}),
});

/** Data node with BOTH input and output ports — for pipeline pass-through nodes
 *  (Assess nodes, output nodes that can chain into further processing) */
export const mkDataIO = (
  label: string, desc: string, icon: string,
  outId: string, outLabel: string, outType: PortDataType,
  accentColor?: string,
): ClinicalNodeData => ({
  label, category: 'data', shape: 'rect', description: desc, icon,
  inputPorts: [{ id: 'data-in', label: 'Data', dataType: 'any' }],
  outputPorts: [{ id: outId, label: outLabel, dataType: outType }],
  execution: { status: 'idle', running: false },
  render: { type: CanvasNodeRenderType.Default },
  action: true,
  ...(accentColor ? { accentColor } : {}),
});

/** CortixEngine node — ALWAYS labeled "CortixEngine", subtitle = function name
 *  icon defaults to 'bot' but can be overridden for extension panel display
 *  (CanvasNodeEngine.tsx always forces 'bot' on canvas regardless) */
export const mkEngine = (
  subtitle: string, desc: string, prompt: string,
  subs?: EngineSubPorts, accentColor?: string, icon?: string, engineLabel?: string,
): ClinicalNodeData => ({
  label: engineLabel || 'CortixEngine',
  category: 'extension',
  shape: 'rect',
  description: desc,
  icon: icon || 'bot',
  inputPorts: [{ id: 'data-in-1', label: 'Input 1', dataType: 'any' }, { id: 'data-in-2', label: 'Input 2', dataType: 'any' }],
  outputPorts: [{ id: 'analysis-out', label: 'Analysis', dataType: 'analysis' }],
  execution: { status: 'idle', running: false },
  systemPrompt: prompt,
  render: { type: CanvasNodeRenderType.Engine },
  action: true,
  subtitle,
  ...(subs ? { subs } : { subs: { ext: null, tool: null, data: null } }),
  ...(accentColor ? { accentColor } : {}),
});

/** Pill node — rounded pill for clinician review / filter gates */
export const mkPill = (
  label: string, desc: string,
  subtitle: string, subtitle2?: string, accentColor?: string,
): ClinicalNodeData => ({
  label, category: 'validation', shape: 'rect', description: desc, icon: 'list-checks',
  inputPorts: [{ id: 'in', label: 'Input', dataType: 'any' }],
  outputPorts: [{ id: 'out', label: 'Output', dataType: 'analysis' }],
  execution: { status: 'idle', running: false },
  render: { type: CanvasNodeRenderType.Pill },
  action: true,
  subtitle,
  ...(subtitle2 ? { subtitle2 } : {}),
  ...(accentColor ? { accentColor } : {}),
});

/** Trigger node — rounded left edge, for trigger/input events */
export const mkTrigger = (
  label: string, desc: string, icon: string,
  size: 'normal' | 'small' = 'normal', accentColor?: string,
): ClinicalNodeData => ({
  label, category: 'data', shape: 'rect', description: desc, icon,
  inputPorts: [],
  outputPorts: [{ id: 'trigger-out', label: 'Trigger', dataType: 'any' }],
  execution: { status: 'idle', running: false },
  render: { type: size === 'small' ? CanvasNodeRenderType.SmRounded : CanvasNodeRenderType.Rounded },
  action: true,
  ...(accentColor ? { accentColor } : {}),
});

/** Tall vertical merger — multi-input combiner */
export const mkMerger = (
  label: string, desc: string, icon: string,
  inputCount: number, accentColor?: string,
): ClinicalNodeData => {
  const ins: CanvasConnectionPort[] = [];
  for (let i = 0; i < inputCount; i++) {
    ins.push({ id: `merge-in-${i}`, label: `Input ${i + 1}`, dataType: 'any' });
  }
  return {
    label, category: 'extension', shape: 'rect', description: desc, icon,
    inputPorts: ins,
    outputPorts: [{ id: 'merged-out', label: 'Merged', dataType: 'analysis' }],
    execution: { status: 'idle', running: false },
    render: { type: CanvasNodeRenderType.Tall },
    action: true,
    ...(accentColor ? { accentColor } : {}),
  };
};

/** Splitter — single-in, multi-out */
export const mkSplitter = (
  label: string, desc: string, icon: string,
  outputCount: number, accentColor?: string,
): ClinicalNodeData => {
  const outs: CanvasConnectionPort[] = [];
  for (let i = 0; i < outputCount; i++) {
    outs.push({ id: `split-out-${i}`, label: `Output ${i + 1}`, dataType: 'analysis' });
  }
  return {
    label, category: 'extension', shape: 'rect', description: desc, icon,
    inputPorts: [{ id: 'split-in', label: 'Input', dataType: 'any' }],
    outputPorts: outs,
    execution: { status: 'idle', running: false },
    render: { type: CanvasNodeRenderType.Splitter },
    action: true,
    ...(accentColor ? { accentColor } : {}),
  };
};

/** Dual output — If/Else, Router */
export const mkDualOut = (
  label: string, desc: string, icon: string,
  prompt: string, accentColor?: string,
): ClinicalNodeData => ({
  label, category: 'extension', shape: 'rect', description: desc, icon,
  inputPorts: [{ id: 'eval-in', label: 'Input', dataType: 'any' }],
  outputPorts: [
    { id: 'true-out', label: 'True', dataType: 'analysis' },
    { id: 'false-out', label: 'False', dataType: 'analysis' },
  ],
  execution: { status: 'idle', running: false },
  systemPrompt: prompt,
  render: { type: CanvasNodeRenderType.DualOut },
  action: true,
  ...(accentColor ? { accentColor } : {}),
});

/** Square utility block */
export const mkSquare = (
  label: string, desc: string, icon: string, accentColor?: string,
): ClinicalNodeData => ({
  label, category: 'output', shape: 'rect', description: desc, icon,
  inputPorts: [{ id: 'in', label: 'Input', dataType: 'any' }],
  outputPorts: [{ id: 'out', label: 'Output', dataType: 'analysis' }],
  execution: { status: 'idle', running: false },
  render: { type: CanvasNodeRenderType.Square },
  action: true,
  ...(accentColor ? { accentColor } : {}),
});

/** Sticky note — canvas annotation, no ports, no action */
export const mkNote = (): ClinicalNodeData => ({
  label: 'Note',
  category: 'custom',
  shape: 'rect',
  description: 'Sticky note — annotate your canvas with text notes',
  icon: 'sticky-note',
  inputPorts: [],
  outputPorts: [],
  execution: { status: 'idle', running: false },
  render: { type: CanvasNodeRenderType.StickyNote, options: { color: 0 } },
  action: false,
  userInput: "## I'm a note\n**Double click** to edit me.",
});

/** Legacy circle processor (backward-compat for existing nodes) */
export const mkProc = (
  label: string, desc: string, icon: string,
  ins: CanvasConnectionPort[], outs: CanvasConnectionPort[], prompt: string,
): ClinicalNodeData => ({
  label, category: 'extension', shape: 'circle', description: desc, icon,
  inputPorts: ins, outputPorts: outs,
  execution: { status: 'idle', running: false },
  systemPrompt: prompt,
  render: { type: CanvasNodeRenderType.Circle },
  action: true,
});

/* ═══════════════════════════════════════════════════
   NODE PALETTE — 10 categories (prototype alignment)
   ═══════════════════════════════════════════════════ */

export const NODE_PALETTE: Record<string, ClinicalNodeData[]> = {
  /* ─── NODES ─── */
  'Action': [
    mkEngine('CortixEngine', 'CortixEngine — main AI processor node',
      'You are the CortixEngine clinical reasoning processor.',
      { ext: null, tool: null, data: null }),
    mkTrigger('Chat Input', 'Incoming chat message trigger', 'message-square', 'small'),
    mkTrigger('Clinician Input', 'Manual clinician data entry trigger', 'message-square', 'small'),
    mkTrigger('Goal Input', 'Define patient goal or treatment objective', 'message-square', 'small'),
    mkNote(),
  ],

  /* ─── ACQUIRE ─── */
  'Acquire': [
    mkData('Lab Panel', 'Patient laboratory results & panels', 'flask-conical',
      'labs-out', 'Lab Data', 'labs', NODE_ACCENT_COLORS.lab),
    mkData('Medication List', 'Current compounds, dosages & schedules', 'pill',
      'meds-out', 'Medications', 'medications', NODE_ACCENT_COLORS.meds),
    mkData('Symptom Profile', 'Presenting symptoms & timeline', 'activity',
      'symptoms-out', 'Symptoms', 'symptoms', NODE_ACCENT_COLORS.symptoms),
    mkData('Patient History', 'Medical history & intake records', 'user',
      'history-out', 'History', 'history', NODE_ACCENT_COLORS.history),
    mkData('Clinical Imaging', 'Medical imaging & radiology results', 'image',
      'imaging-out', 'Imaging', 'imaging'),
    mkData('Document Upload', 'Upload clinical documents for processing', 'file-input',
      'doc-out', 'Document', 'any'),
  ],

  /* ─── ORGANIZE ─── */
  'Organize': [
    mkPill('Filter', 'Clinician review gate — filter data by criteria',
      'Review & filter', 'Requires clinician approval', NODE_ACCENT_COLORS.filter),
    mkSplitter('Split', 'Route data to multiple downstream paths', 'git-fork',
      2, NODE_ACCENT_COLORS.split),
    mkMerger('Combine', 'Merge multiple data streams into one', 'layers',
      2, NODE_ACCENT_COLORS.combine),
    mkMerger('Merge', 'Combine and deduplicate data from multiple sources', 'merge',
      2, NODE_ACCENT_COLORS.merge),
  ],

  /* ─── APPRAISE ─── (icon fixes per prototype) */
  'Appraise': [
    mkEngine('Differential Diagnosis',
      'CortixEngine — generate and rank differential diagnoses from clinical data',
      'You are a differential diagnosis engine. Analyze symptoms, labs, and history to generate ranked differentials with supporting evidence.',
      { ext: { label: 'DDx', icon: 'crosshair', color: NODE_ACCENT_COLORS.diffdiag }, tool: null, data: null },
      NODE_ACCENT_COLORS.diffdiag),
    mkEngine('Drug Interaction Screen',
      'CortixEngine — cross-reference compound interactions and contraindications',
      'You are a drug interaction screening engine. Flag contraindications, synergies, timing conflicts, and severity levels.',
      { ext: { label: 'DI Screen', icon: 'shield-alert', color: NODE_ACCENT_COLORS.interaction }, tool: null, data: null },
      NODE_ACCENT_COLORS.interaction),
    mkEngine('Mechanism of Action',
      'CortixEngine — map metabolic pathways and pharmacodynamics',
      'You are a mechanism of action analyzer. Map CYP450 enzymes, receptor binding, metabolites, and clearance routes.',
      { ext: { label: 'MoA', icon: 'dna', color: NODE_ACCENT_COLORS.mechanism }, tool: null, data: null },
      NODE_ACCENT_COLORS.mechanism),
    mkEngine('Contraindication Check',
      'CortixEngine — verify contraindications against patient profile',
      'You are a contraindication checker. Cross-reference medications, conditions, and patient demographics for contraindications.',
      { ext: { label: 'CI Check', icon: 'alert-triangle', color: NODE_ACCENT_COLORS.contraind }, tool: null, data: null },
      NODE_ACCENT_COLORS.contraind),
    mkEngine('Cross-Reference',
      'CortixEngine — cross-reference findings against clinical databases',
      'You are a clinical cross-reference engine. Verify findings against monographs, guidelines, and peer-reviewed literature.',
      { ext: { label: 'X-Ref', icon: 'search', color: NODE_ACCENT_COLORS.crossref }, tool: null, data: null },
      NODE_ACCENT_COLORS.crossref),
    mkEngine('Causal Analysis',
      'CortixEngine — trace symptom chains to root causes',
      'You are a causal analysis engine. Map symptom chains, identify root causes, and assess probability of causal relationships.',
      { ext: { label: 'Causal', icon: 'git-branch', color: NODE_ACCENT_COLORS.causal }, tool: null, data: null },
      NODE_ACCENT_COLORS.causal),
  ],

  /* ─── APPLY ─── (icon fixes per prototype) */
  'Apply': [
    mkEngine('Hypothesis Testing',
      'CortixEngine — test clinical hypotheses against patient data',
      'You are a hypothesis testing engine. Evaluate clinical hypotheses using Bayesian reasoning and available evidence.',
      { ext: { label: 'HypTest', icon: 'flask-round', color: NODE_ACCENT_COLORS.hypothesis }, tool: null, data: null },
      NODE_ACCENT_COLORS.hypothesis),
    mkEngine('Dose-Response Model',
      'CortixEngine — model dosage-response relationships',
      'You are a dose-response modeling engine. Calculate therapeutic windows, absorption curves, and optimal dosing.',
      { ext: { label: 'DR Model', icon: 'trending-up', color: NODE_ACCENT_COLORS.doseresp }, tool: null, data: null },
      NODE_ACCENT_COLORS.doseresp),
    mkEngine('Comparative Efficacy',
      'CortixEngine — compare treatment efficacy across alternatives',
      'You are a comparative efficacy engine. Rank treatment alternatives by evidence quality, effect size, and patient applicability.',
      { ext: { label: 'Efficacy', icon: 'bar-chart-2', color: NODE_ACCENT_COLORS.efficacy }, tool: null, data: null },
      NODE_ACCENT_COLORS.efficacy),
    mkEngine('Risk-Benefit Analysis',
      'CortixEngine — weigh risks against benefits for treatment options',
      'You are a risk-benefit analysis engine. Quantify NNT, NNH, relative risks, and patient-specific risk factors.',
      { ext: { label: 'Risk/Ben', icon: 'scale', color: NODE_ACCENT_COLORS.riskben }, tool: null, data: null },
      NODE_ACCENT_COLORS.riskben),
    mkEngine('Safety Threshold',
      'CortixEngine — validate dosage and treatment safety parameters',
      'You are a safety threshold engine. Validate against LD50, therapeutic index, organ function, and adverse event profiles.',
      { ext: { label: 'Safety', icon: 'shield-check', color: NODE_ACCENT_COLORS.safety }, tool: null, data: null },
      NODE_ACCENT_COLORS.safety),
    mkEngine('Evidence Grading',
      'CortixEngine — grade evidence quality and strength of recommendations',
      'You are an evidence grading engine. Apply GRADE framework, assess study quality, and synthesize strength of recommendations.',
      { ext: { label: 'Evidence', icon: 'award', color: NODE_ACCENT_COLORS.evidence }, tool: null, data: null },
      NODE_ACCENT_COLORS.evidence),
  ],

  /* ─── ASSESS ─── (icon fixes per prototype) */
  'Assess': [
    mkSquare('Clinical Summary', 'Generate structured clinical summary report', 'file-text',
      NODE_ACCENT_COLORS.summary),
    mkSquare('Treatment Recommendation', 'Synthesize treatment plan with rationale', 'clipboard',
      NODE_ACCENT_COLORS.treatment),
    mkSquare('Patient Report', 'Plain language report for patient communication', 'file-output',
      NODE_ACCENT_COLORS.report),
    mkSquare('Data Export', 'Export results as PDF/HTML/HL7/FHIR', 'download',
      NODE_ACCENT_COLORS.export),
    mkSquare('Audit Trail', 'Complete reasoning chain for compliance review', 'list-ordered',
      NODE_ACCENT_COLORS.audit),
  ],

  /* ─── CUSTOM MODULES ─── */
  'Custom Modules': [
    {
      label: 'My Modules',
      category: 'custom',
      shape: 'rect',
      description: 'Load a preloaded module, modify it, and save as custom',
      icon: 'folder',
      inputPorts: [{ id: 'in', label: 'Input', dataType: 'any' }],
      outputPorts: [{ id: 'out', label: 'Output', dataType: 'analysis' }],
      execution: { status: 'idle', running: false },
      editable: true,
      systemPrompt: 'You are a clinical analysis assistant.',
      render: { type: CanvasNodeRenderType.Default },
      action: true,
    },
  ],

  /* ─── SKILLS ─── */
  'Skills': [
    {
      label: 'Create Custom Skill',
      category: 'custom',
      shape: 'rect',
      description: 'Define a reusable skill with custom prompts and tools',
      icon: 'circle-plus',
      inputPorts: [{ id: 'in', label: 'Input', dataType: 'any' }],
      outputPorts: [{ id: 'out', label: 'Output', dataType: 'analysis' }],
      execution: { status: 'idle', running: false },
      editable: true,
      systemPrompt: 'You are a custom skill processor.',
      render: { type: CanvasNodeRenderType.Default },
      action: true,
    },
  ],

  /* ─── WEB ─── */
  'Web': [
    mkData('Search Web Sources', 'Search the web for clinical information', 'globe',
      'web-out', 'Results', 'any'),
    mkData('Fetch Web Content', 'Retrieve content from a specific URL', 'cloud-download',
      'fetch-out', 'Content', 'any'),
    mkData('Search PubMed Literature', 'Search PubMed for peer-reviewed literature', 'book-open',
      'pubmed-out', 'Literature', 'any'),
    mkData('Search Clinical Trials', 'Search clinical trial registries', 'clipboard-list',
      'trials-out', 'Trials', 'any'),
    mkData('Search Cochrane Reviews', 'Search Cochrane systematic reviews', 'library',
      'cochrane-out', 'Reviews', 'any'),
    mkData('Search NDNR Archive', 'Search naturopathic literature archive', 'archive',
      'ndnr-out', 'Articles', 'any'),
    mkData('Deep Research Mining', 'Deep web research and data extraction', 'pickaxe',
      'research-out', 'Research', 'any'),
  ],

  /* ─── SYSTEM ─── */
  'System': [
    mkData('Store Session Memory', 'Save current session data to memory', 'hard-drive',
      'mem-out', 'Stored', 'any'),
    mkData('Recall Past Sessions', 'Retrieve data from previous sessions', 'history',
      'recall-out', 'Recalled', 'any'),
    mkData('Connect EHR Systems', 'Interface with electronic health record systems', 'plug',
      'ehr-out', 'EHR Data', 'any'),
    mkData('Send Patient Reports', 'Send generated reports to recipients', 'send',
      'send-out', 'Sent', 'any'),
    mkData('Export Clinical Data', 'Export clinical data in standard formats', 'upload',
      'export-out', 'Exported', 'any'),
    mkData('Log Audit Trail', 'Record actions to the audit log', 'scroll-text',
      'log-out', 'Logged', 'any'),
  ],
};

/* ═══════════════════════════════════════════════════
   CORTIXHEALTH NODE PALETTE (wellness vertical)
   Categories: Nodes → Profile → Nutrition → Movement → Remedies → Results → Organize
   ═══════════════════════════════════════════════════ */
export const HEALTH_PALETTE: Record<string, ClinicalNodeData[]> = {
  /* ─── CORE NODES ─── */
  'Nodes': [
    mkEngine('CortixHealth', 'CortixHealth — wellness AI engine node',
      'You are the CortixHealth wellness reasoning engine. Provide evidence-based wellness guidance.',
      { ext: null, tool: null, data: null }),
    mkTrigger('Chat Input', 'User wellness query trigger', 'message-square', 'small'),
    mkNote(),
    mkTrigger('Goal Input', 'Define wellness goal or health objective', 'message-square', 'small'),
  ],

  /* ─── PROFILE ─── */
  'Input': [
    mkData('Health Goals', 'Your wellness objectives and targets', 'target',
      'goals-out', 'Goals', 'any', HEALTH_ACCENT_COLORS.goals),
    mkData('Current Supplements', 'Active supplement and vitamin regimen', 'pill',
      'supps-out', 'Supplements', 'any', HEALTH_ACCENT_COLORS.supplements),
    mkData('Dietary Restrictions', 'Allergies, intolerances, and dietary preferences', 'utensils',
      'diet-out', 'Dietary', 'any', HEALTH_ACCENT_COLORS.dietary),
    mkData('Activity Level', 'Exercise frequency, type, and fitness baseline', 'activity',
      'activity-out', 'Activity', 'any', HEALTH_ACCENT_COLORS.activity),
    mkData('Health Conditions', 'Current conditions, chronic issues, and medical history', 'clipboard',
      'conditions-out', 'Conditions', 'any', HEALTH_ACCENT_COLORS.conditions),
    mkData('Allergies', 'Known allergies and sensitivities', 'alert-triangle',
      'allergies-out', 'Allergies', 'any', HEALTH_ACCENT_COLORS.allergies),
  ],

  /* ─── NUTRITION ─── */
  'Nutrition': [
    mkEngine('Meal Planner', 'Build weekly meal plans aligned with dietary goals',
      'You are a nutrition specialist. Create personalized meal plans based on dietary needs, restrictions, and health goals.',
      { ext: null, tool: null, data: null }, HEALTH_ACCENT_COLORS.mealplan, 'utensils'),
    mkEngine('Supplement Stack Builder', 'Build personalized daily supplement routines',
      'You are a supplement specialist. Design evidence-based supplement stacks based on health goals and nutrient gaps.',
      { ext: null, tool: null, data: null }, HEALTH_ACCENT_COLORS.stackbuilder, 'layers'),
    mkEngine('Nutrient Gap Analysis', 'Identify nutritional deficiencies from current diet',
      'You are a nutritional analyst. Identify nutrient gaps and recommend food-based or supplement solutions.',
      { ext: null, tool: null, data: null }, HEALTH_ACCENT_COLORS.nutrientgap, 'search'),
    mkEngine('Hydration Tracker', 'Daily hydration needs based on activity and conditions',
      'You are a hydration specialist. Calculate personalized hydration needs based on activity, climate, and health.',
      { ext: null, tool: null, data: null }, HEALTH_ACCENT_COLORS.hydration, 'droplets'),
    mkEngine('Calorie & Macro Calculator', 'Personalized calorie and macronutrient targets',
      'You are a nutrition calculator. Compute calorie and macronutrient targets based on goals, activity, and body composition.',
      { ext: null, tool: null, data: null }, HEALTH_ACCENT_COLORS.macros, 'calculator'),
  ],

  /* ─── MOVEMENT ─── */
  'Health Plan': [
    mkEngine('Exercise Routine', 'Custom exercise routines for your fitness level',
      'You are a fitness specialist. Design exercise routines based on fitness level, goals, equipment, and time.',
      { ext: null, tool: null, data: null }, HEALTH_ACCENT_COLORS.exercise, 'dumbbell'),
    mkEngine('Recovery Protocol', 'Post-workout and illness recovery plans',
      'You are a recovery specialist. Design recovery protocols combining nutrition, rest, and supplementation.',
      { ext: null, tool: null, data: null }, HEALTH_ACCENT_COLORS.recovery, 'heart-pulse'),
    mkEngine('Flexibility Program', 'Stretching and mobility routines',
      'You are a mobility specialist. Design flexibility programs for injury prevention and range of motion.',
      { ext: null, tool: null, data: null }, HEALTH_ACCENT_COLORS.flexibility, 'move'),
    mkEngine('Sleep Optimization', 'Evening routines and supplements for better sleep',
      'You are a sleep specialist. Optimize sleep through routine, supplement timing, and habit adjustments.',
      { ext: null, tool: null, data: null }, HEALTH_ACCENT_COLORS.sleep, 'moon'),
    mkEngine('Stress Management', 'Adaptogen protocols and lifestyle modifications',
      'You are a stress management specialist. Recommend adaptogens, techniques, and lifestyle changes backed by research.',
      { ext: null, tool: null, data: null }, HEALTH_ACCENT_COLORS.stress, 'wind'),
  ],

  /* ─── REMEDIES ─── */
  'Remedies': [
    mkEngine('Herbal Formulation', 'Evidence-based herbal combinations',
      'You are an herbal medicine specialist. Recommend evidence-based herbal formulations with dosing and preparation guidance.',
      { ext: null, tool: null, data: null }, HEALTH_ACCENT_COLORS.herbal, 'leaf'),
    mkEngine('Homeopathic Remedy Finder', 'Match symptoms to homeopathic remedies',
      'You are a homeopathic specialist. Match symptoms to remedies with potency guidance. Note evidence levels honestly.',
      { ext: null, tool: null, data: null }, HEALTH_ACCENT_COLORS.homeopathic, 'flask-conical'),
    mkEngine('Essential Oil Protocol', 'Therapeutic essential oil applications',
      'You are an aromatherapy specialist. Recommend essential oil protocols with safety guidelines and dilution ratios.',
      { ext: null, tool: null, data: null }, HEALTH_ACCENT_COLORS.essentialoil, 'droplet'),
    mkEngine('Mineral Balance', 'Mineral intake analysis and recommendations',
      'You are a mineral balance specialist. Analyze mineral intake and recommend adjustments based on symptoms and labs.',
      { ext: null, tool: null, data: null }, HEALTH_ACCENT_COLORS.mineral, 'gem'),
    mkEngine('Detox Support', 'Evidence-based detoxification protocols',
      'You are a detoxification specialist. Design evidence-based detox support protocols. No pseudoscience.',
      { ext: null, tool: null, data: null }, HEALTH_ACCENT_COLORS.detox, 'recycle'),
    mkEngine('Immune Support', 'Seasonal and reactive immune protocols',
      'You are an immune support specialist. Design immune protocols with supplements, herbs, and lifestyle adjustments.',
      { ext: null, tool: null, data: null }, HEALTH_ACCENT_COLORS.immune, 'shield'),
  ],

  /* ─── RESULTS ─── */
  'Output': [
    mkSquare('Wellness Summary', 'Aggregate view of all active plans and progress', 'file-text',
      HEALTH_ACCENT_COLORS.wellnessSummary),
    mkSquare('Progress Report', 'Before-and-after comparison with next steps', 'trending-up',
      HEALTH_ACCENT_COLORS.progress),
    mkSquare('Shopping List', 'Auto-generated list from meal plans and supplements', 'list',
      HEALTH_ACCENT_COLORS.shopping),
    mkSquare('Weekly Schedule', 'Combined schedule for meals, supplements, and exercise', 'calendar',
      HEALTH_ACCENT_COLORS.schedule),
    mkSquare('Export Plan', 'Download plans as shareable documents', 'download',
      HEALTH_ACCENT_COLORS.exportplan),
  ],

  /* ─── ORGANIZE ─── */
  'Organize': [
    mkPill('Filter', 'Review gate — confirm recommendations before proceeding',
      'Review & confirm', 'Does this look right?', HEALTH_ACCENT_COLORS.filter),
    mkSplitter('Split', 'Route wellness data to multiple paths', 'git-fork',
      2, HEALTH_ACCENT_COLORS.split),
    mkMerger('Combine', 'Merge multiple wellness inputs into one', 'layers',
      2, HEALTH_ACCENT_COLORS.combine),
    mkMerger('Merge', 'Combine and deduplicate from multiple sources', 'merge',
      2, HEALTH_ACCENT_COLORS.merge),
  ],
};

/* ═══════════════════════════════════════════════════
   CORTIXHEALTH NODE PALETTE (wellness vertical)
   ═══════════════════════════════════════════════════ */

export const HEALTH_NODE_PALETTE: Record<string, ClinicalNodeData[]> = {

  /* ACTION (4 nodes) */
  'Action': [
    mkEngine('CortixHealth', 'Wellness AI engine - core processor', 'You are the CortixHealth wellness reasoning engine. Provide evidence-based wellness analysis. You inform, never prescribe. The patient and their healthcare provider make all decisions.'),
    mkTrigger('Chat Input', 'User wellness query trigger', 'message-square', 'small'),
    mkTrigger('Goal Input', 'Define wellness goal or health objective', 'message-square', 'small'),
    mkNote(),
  ],

  /* INPUT - Patient Profile (10 nodes) */
  'Input': [
    mkData('Health Goals', 'Objectives and targets', 'target', 'goals-out', 'Goals', 'any'),
    mkData('Current Supplements', 'Active supplement regimen', 'pill', 'supps-out', 'Supplements', 'any'),
    mkData('Dietary Restrictions', 'Allergies and dietary preferences', 'utensils', 'diet-out', 'Dietary', 'any'),
    mkData('Activity Level', 'Exercise frequency and fitness baseline', 'activity', 'activity-out', 'Activity', 'any'),
    mkData('Health Conditions', 'Current conditions and medical history', 'clipboard', 'conditions-out', 'Conditions', 'any'),
    mkData('Allergies', 'Known allergies and sensitivities', 'alert-triangle', 'allergies-out', 'Allergies', 'any'),
    mkData('Bracelet Feed', 'Live biometric telemetry', 'watch', 'bio-out', 'Biometrics', 'any'),
    mkData('Wearable Import', 'Device data sync', 'download-cloud', 'wearable-out', 'Wearable', 'any'),
    mkData('Manual Vitals', 'Manual lab and vitals entry', 'edit', 'vitals-out', 'Vitals', 'any'),
    mkData('Custom Input', 'Custom patient data source', 'plus-circle', 'custom-in-out', 'Custom', 'any'),
  ],

  /* KNOWLEDGE - Information Modules (16 nodes) */
  'Knowledge': [
    mkData('Compound Database', 'Verified nutraceutical compound profiles', 'database', 'compound-out', 'Compounds', 'any'),
    mkData('Interaction Database', 'Compound-to-compound interaction data', 'git-branch', 'interaction-out', 'Interactions', 'any'),
    mkData('Pathway Maps', 'Metabolic and hormonal pathway reference', 'map', 'pathway-out', 'Pathways', 'any'),
    mkData('Evidence Base', 'Peer-reviewed research and clinical studies', 'book-open', 'evidence-out', 'Evidence', 'any'),
    mkData('Formulation Database', 'Verified manufacturer formulations with CoA', 'flask-conical', 'formulation-out', 'Formulations', 'any'),
    mkData('Nutrition Database', 'Food composition and nutrient density reference', 'apple', 'nutrition-db-out', 'Nutrition', 'any'),
    mkData('Botanical Database', 'Herbal monographs, traditional use and dosing', 'leaf', 'botanical-db-out', 'Botanicals', 'any'),
    mkData('Mineral Database', 'Mineral bioavailability and RDA reference', 'gem', 'mineral-db-out', 'Minerals', 'any'),
    mkData('Exercise Science', 'Exercise physiology and recovery science', 'dumbbell', 'exercise-sci-out', 'Exercise', 'any'),
    mkData('Sleep Research', 'Sleep architecture and circadian rhythm data', 'moon', 'sleep-res-out', 'Sleep', 'any'),
    mkData('Gut Health Database', 'Microbiome, probiotics and dysbiosis reference', 'layers', 'gut-db-out', 'Gut Data', 'any'),
    mkData('Hormone Reference', 'Thyroid, adrenal and sex hormone panels', 'trending-up', 'hormone-ref-out', 'Hormones', 'any'),
    mkData('Toxin Database', 'Heavy metals, mold and environmental chemicals', 'shield-alert', 'toxin-db-out', 'Toxins', 'any'),
    mkData('Longevity Research', 'NAD+, telomeres and mitochondrial health', 'clock', 'longevity-res-out', 'Longevity', 'any'),
    mkData('Skin & Beauty Science', 'Collagen, nutricosmetics and skin barrier', 'sparkles', 'skin-sci-out', 'Skin Science', 'any'),
    mkData('Custom Knowledge', 'Custom information source', 'plus-circle', 'custom-know-out', 'Custom', 'any'),
  ],

  /* ENGINES - 35 processors */
  'Engines': [
    // Analyzers (11)
    mkEngine('Biometric Analyzer', 'Analyzes biometric data patterns and trends', 'You are a biometric analysis engine. Analyze heart rate, HRV, SpO2, and biometric data to identify patterns. Present findings with evidence. Never prescribe.'),
    mkEngine('Sleep Analyzer', 'Analyzes sleep stage data and quality metrics', 'You are a sleep analysis engine. Analyze sleep stages, duration, efficiency. Present findings with evidence. Never prescribe.'),
    mkEngine('Nutrition Analyzer', 'Analyzes dietary intake against nutritional needs', 'You are a nutrition analysis engine. Analyze dietary intake and nutritional adequacy. Present findings with evidence. Never prescribe.'),
    mkEngine('Stack Analyzer', 'Analyzes supplement combinations for synergy and conflict', 'You are a supplement stack analysis engine. Analyze combinations for synergies, redundancies, conflicts. Present findings with evidence. Never prescribe.'),
    mkEngine('Botanical Analyzer', 'Analyzes herbal compounds and their properties', 'You are a botanical analysis engine. Analyze herbal compounds, mechanisms, dosing. Present findings with evidence. Never prescribe.'),
    mkEngine('Mineral Analyzer', 'Analyzes mineral levels and balance', 'You are a mineral analysis engine. Analyze mineral intake and bioavailability against optimal ranges. Present findings with evidence. Never prescribe.'),
    mkEngine('Gut Analyzer', 'Analyzes gut microbiome and digestive function', 'You are a gut analysis engine. Analyze microbiome composition, digestive markers, gut barrier integrity. Present findings with evidence. Never prescribe.'),
    mkEngine('Hormone Analyzer', 'Analyzes thyroid, adrenal, and sex hormone data', 'You are a hormone analysis engine. Analyze thyroid panels, cortisol patterns, sex hormones. Present findings with evidence. Never prescribe.'),
    mkEngine('Liver Analyzer', 'Analyzes liver function and detox pathways', 'You are a liver analysis engine. Analyze liver enzymes, detoxification capacity, toxin clearance. Present findings with evidence. Never prescribe.'),
    mkEngine('Heart Analyzer', 'Analyzes cardiovascular markers and risk factors', 'You are a cardiovascular analysis engine. Analyze lipid panels, inflammatory markers, blood pressure. Present findings with evidence. Never prescribe.'),
    mkEngine('Skin Analyzer', 'Analyzes skin, hair, and nail health indicators', 'You are a skin health analysis engine. Analyze collagen status, nutrient deficiencies affecting skin/hair/nails. Present findings with evidence. Never prescribe.'),
    // Assessors (6)
    mkEngine('Exercise Assessor', 'Assesses exercise capacity and fitness state', 'You are an exercise assessment engine. Assess current fitness, exercise capacity, training readiness. Present findings with evidence. Never prescribe.'),
    mkEngine('Recovery Assessor', 'Assesses recovery status from exertion or illness', 'You are a recovery assessment engine. Assess post-workout and illness recovery status. Present findings with evidence. Never prescribe.'),
    mkEngine('Sleep Assessor', 'Assesses sleep quality and disruption patterns', 'You are a sleep assessment engine. Assess sleep quality, identify disruption patterns. Present findings with evidence. Never prescribe.'),
    mkEngine('Stress Assessor', 'Assesses stress levels from biometric and behavioral signals', 'You are a stress assessment engine. Assess stress from HRV, cortisol, behavioral signals. Present findings with evidence. Never prescribe.'),
    mkEngine('Readiness Assessor', 'Assesses daily readiness from combined biometric signals', 'You are a readiness assessment engine. Synthesize HRV, sleep, resting HR into readiness data. Present findings with evidence. Never prescribe.'),
    mkEngine('Longevity Assessor', 'Assesses cellular health and aging markers', 'You are a longevity assessment engine. Assess oxidative stress, NAD+, mitochondrial function, aging markers. Present findings with evidence. Never prescribe.'),
    // Scanners (4)
    mkEngine('Deficiency Scanner', 'Scans for nutrient deficiencies from symptoms and data', 'You are a deficiency scanning engine. Scan dietary data, symptoms, lab values for nutrient deficiencies. Present findings with evidence. Never prescribe.'),
    mkEngine('Biomarker Scanner', 'Scans biomarker data for anomalies and patterns', 'You are a biomarker scanning engine. Scan lab panels and wearable data for anomalies and trends. Present findings with evidence. Never prescribe.'),
    mkEngine('Inflammation Scanner', 'Scans for chronic inflammation markers', 'You are an inflammation scanning engine. Scan hs-CRP, cytokines, inflammatory markers. Present findings with evidence. Never prescribe.'),
    mkEngine('Toxin Scanner', 'Scans for heavy metals, mold, and environmental toxins', 'You are a toxin scanning engine. Scan for heavy metals, mycotoxins, environmental chemicals. Present findings with evidence. Never prescribe.'),
    // Finders (5)
    mkEngine('Evidence Finder', 'Finds peer-reviewed research relevant to query', 'You are an evidence finding engine. Search and retrieve peer-reviewed research relevant to the query. Present findings with citations. Never prescribe.'),
    mkEngine('Remedy Finder', 'Finds remedy matches from symptom data', 'You are a remedy finding engine. Match symptom profiles to evidence-based remedies. Present findings with evidence. Never prescribe.'),
    mkEngine('Botanical Finder', 'Finds herbal matches for specific conditions', 'You are a botanical finding engine. Match conditions to herbal compounds with dosing and evidence. Present findings with evidence. Never prescribe.'),
    mkEngine('Nutrition Finder', 'Finds food sources for specific nutrient needs', 'You are a nutrition finding engine. Find food sources that address specific nutrient needs. Present findings with evidence. Never prescribe.'),
    mkEngine('Mineral Finder', 'Finds mineral sources and supplementation options', 'You are a mineral finding engine. Find mineral sources and bioavailable supplementation options. Present findings with evidence. Never prescribe.'),
    // Screeners (2)
    mkEngine('Interaction Check', 'Screens supplement-drug and supplement-supplement interactions', 'You are an interaction screening engine. Cross-reference supplements against medications for interactions. Present all findings including severity. Never hide items. Never prescribe.'),
    mkEngine('Pregnancy Screener', 'Screens supplements for pregnancy and nursing safety', 'You are a pregnancy safety screening engine. Screen supplements for pregnancy and lactation safety. Present all findings. Never hide items. Never prescribe.'),
    // Profiler (1)
    mkEngine('Immune Profiler', 'Profiles immune status from symptoms, labs, and history', 'You are an immune profiling engine. Profile immune status from health history, labs, symptoms. Present findings with evidence. Never prescribe.'),
    // Mapper (1)
    mkEngine('Deficiency Mapper', 'Maps symptom clusters to potential nutrient deficiencies', 'You are a deficiency mapping engine. Map symptom clusters to nutrient deficiencies. Present findings with evidence. Never prescribe.'),
    // Trackers (3)
    mkEngine('Strain Tracker', 'Tracks cumulative physical and mental strain', 'You are a strain tracking engine. Track cumulative training load and strain over time. Present findings with evidence. Never prescribe.'),
    mkEngine('Dosage Tracker', 'Tracks daily supplement intake against safe upper limits', 'You are a dosage tracking engine. Track daily intake against upper limits and flag thresholds. Present findings with evidence. Never prescribe.'),
    mkEngine('Hydration Tracker', 'Tracks hydration levels against activity and conditions', 'You are a hydration tracking engine. Track fluid intake against activity and conditions. Present findings with evidence. Never prescribe.'),
    // Calculator (1)
    mkEngine('Macro Calculator', 'Calculates calorie and macronutrient targets', 'You are a macronutrient calculation engine. Compute calorie and macro targets from body comp, activity, goals. Present calculations with reasoning. Never prescribe.'),
    // Custom (1)
    mkEngine('Custom Engine', 'Custom analysis engine - configure your own', 'You are a custom analysis engine. The user will define your purpose and analysis focus.'),
  ],

  /* OUTPUT - Optimization Goals (34 nodes) */
  'Output': [
    // Body & Physical (8)
    mkSquare('Energy Optimization', 'Optimize energy levels and daily vitality', 'zap'),
    mkSquare('Sleep Optimization', 'Optimize sleep quality and duration', 'moon'),
    mkSquare('Recovery Optimization', 'Optimize post-exertion and illness recovery', 'heart-pulse'),
    mkSquare('Exercise Optimization', 'Optimize fitness and training performance', 'dumbbell'),
    mkSquare('Hydration Optimization', 'Optimize daily hydration and electrolyte balance', 'droplets'),
    mkSquare('Weight Optimization', 'Optimize body composition and metabolism', 'scale'),
    mkSquare('Flexibility Optimization', 'Optimize mobility and range of motion', 'move'),
    mkSquare('Pain Reduction', 'Reduce chronic pain and inflammation', 'shield'),
    // Nutrition & Supplementation (6)
    mkSquare('Deficiency Optimization', 'Optimize nutrient levels and fill gaps', 'search'),
    mkSquare('Nutrition Optimization', 'Optimize dietary intake and food choices', 'utensils'),
    mkSquare('Supplement Optimization', 'Optimize supplement stack and timing', 'layers'),
    mkSquare('Mineral Optimization', 'Optimize mineral intake and balance', 'gem'),
    mkSquare('Botanical Optimization', 'Optimize herbal protocol and formulations', 'leaf'),
    mkSquare('Dosage Optimization', 'Optimize supplement dosages and timing', 'gauge'),
    // Body Systems (8)
    mkSquare('Digestion Optimization', 'Optimize gut health and digestive function', 'layers'),
    mkSquare('Immune Optimization', 'Optimize immune function and resilience', 'shield'),
    mkSquare('Heart Optimization', 'Optimize cardiovascular health markers', 'heart-pulse'),
    mkSquare('Hormone Optimization', 'Optimize hormonal balance and function', 'trending-up'),
    mkSquare('Blood Pressure Optimization', 'Optimize blood pressure and vascular health', 'activity'),
    mkSquare('Circadian Optimization', 'Optimize circadian rhythm and body clock', 'clock'),
    mkSquare('Inflammation Reduction', 'Reduce chronic systemic inflammation', 'shield-alert'),
    mkSquare('Detox Optimization', 'Optimize detoxification pathways', 'recycle'),
    // Internal Health (5)
    mkSquare('Liver Optimization', 'Optimize liver function and detox capacity', 'shield'),
    mkSquare('Kidney Optimization', 'Optimize kidney function and filtration', 'droplet'),
    mkSquare('Thyroid Optimization', 'Optimize thyroid function and metabolism', 'trending-up'),
    mkSquare('Gut Optimization', 'Optimize gut microbiome and barrier integrity', 'layers'),
    mkSquare('Skin Optimization', 'Optimize skin, hair, and nail health', 'sparkles'),
    // Mind & Mood (3)
    mkSquare('Focus Optimization', 'Optimize mental clarity and concentration', 'crosshair'),
    mkSquare('Mood Optimization', 'Optimize emotional wellbeing and balance', 'smile'),
    mkSquare('Stress Reduction', 'Reduce stress and promote calm', 'wind'),
    // Safety (2)
    mkSquare('Interaction Safety', 'Verify safe supplement and medication combinations', 'shield-alert'),
    mkSquare('Pregnancy Safety', 'Verify pregnancy and nursing supplement safety', 'sparkles'),
    // Terminal (2)
    mkSquare('Shopping List', 'All optimization data compiled for purchase', 'shopping-cart'),
    mkSquare('Custom Output', 'Custom optimization output', 'plus-circle'),
  ],

  /* ORGANIZE (3 nodes) */
  'Organize': [
    mkPill('Filter', 'Review gate - confirm before proceeding', 'Review & confirm', 'Does this look right?'),
    mkSplitter('Split', 'Route data to multiple paths', 'git-fork', 2),
    mkMerger('Combine', 'Merge multiple inputs into one', 'git-merge', 2),
  ],
};

/* ═══════════════════════════════════════════════════
   CUSTOM NODE TEMPLATE (legacy export — kept for backward compat)
   ═══════════════════════════════════════════════════ */

export const CUSTOM_NODE_TEMPLATE: ClinicalNodeData = NODE_PALETTE['Custom Modules'][0];
