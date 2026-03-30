/**
 * Extension Pack node definitions — HTML prototype alignment
 * 15 categories matching extData from the v2 prototype exactly.
 * Icon cycling uses prototype's 4-color palette: EC, EL, ED, EA.
 * Engine nodes pass display icon (6th param) — CanvasNodeEngine forces 'bot' on canvas.
 */

import type { ClinicalNodeData } from '../../canvas/canvas.types';
import type { Extension } from '../../../../components/CortixContext';
import { mkEngine, mkData, mkDataIO } from '../../store/useNodeTypesStore';
import { HEALTH_ACCENT_COLORS } from '../../canvas/canvas.constants';

/* ── Prototype icon color cycling (cool blue-gray) ── */
const EC = '#a0afc3';
const EL = '#b8c5d6';
const ED = '#8a9ab0';
const EA = '#92a8c4';

/* ═══════════════════════════════════════════════════
   EXTENSION PACK CATEGORIES (15 total, ~70 nodes)
   Exact match to HTML prototype extData object
   ═══════════════════════════════════════════════════ */

export const EXTENSION_PACKS: Record<string, { label: string; accent: string; nodes: ClinicalNodeData[] }> = {
  /* ─── 5 A's (sidebar mirrors) ─── */
  acquire: {
    label: 'Acquire',
    accent: EC,
    nodes: [
      mkData('Lab Panel', 'enter or paste lab values', 'flask-conical',
        'labs-out', 'Lab Data', 'labs', EC),
      mkData('Medication List', 'current drugs & doses', 'pill',
        'meds-out', 'Medications', 'medications', EL),
      mkData('Symptom Profile', 'chief complaint & details', 'activity',
        'symptoms-out', 'Symptoms', 'symptoms', ED),
      mkData('Patient History', 'conditions, allergies, background', 'user',
        'history-out', 'History', 'history', EA),
      mkData('Clinical Imaging', 'upload scans & studies', 'image',
        'imaging-out', 'Imaging', 'imaging', EC),
      mkData('Document Upload', 'import clinical files', 'file-input',
        'doc-out', 'Document', 'any', EL),
    ],
  },
  organize: {
    label: 'Organize',
    accent: EC,
    nodes: [
      mkDataIO('Filter', 'isolate relevant data', 'filter',
        'filter-out', 'Filtered', 'any', EC),
      mkDataIO('Split', 'separate compound inputs', 'git-fork',
        'split-out', 'Split', 'any', EL),
      mkDataIO('Combine', 'merge related records', 'layers',
        'combine-out', 'Combined', 'any', ED),
      mkDataIO('Merge', 'unify patient timeline', 'merge',
        'merge-out', 'Merged', 'any', EA),
    ],
  },
  appraise: {
    label: 'Appraise',
    accent: EC,
    nodes: [
      mkEngine('Differential Diagnosis', 'rank possible conditions',
        'You are a differential diagnosis engine.', undefined, EC, 'crosshair'),
      mkEngine('Drug Interaction Screen', 'cross-compound safety',
        'You are a drug interaction screener.', undefined, EL, 'shield-alert'),
      mkEngine('Mechanism of Action', 'pathway analysis',
        'You are a mechanism of action analyzer.', undefined, ED, 'dna'),
      mkEngine('Contraindication Check', 'adverse risk flags',
        'You are a contraindication checker.', undefined, EA, 'alert-triangle'),
      mkEngine('Cross-Reference', 'guidelines & literature',
        'You are a clinical cross-reference engine.', undefined, EC, 'search'),
      mkEngine('Causal Analysis', 'trace symptom origins',
        'You are a causal analysis engine.', undefined, EL, 'git-branch'),
    ],
  },
  apply: {
    label: 'Apply',
    accent: EC,
    nodes: [
      mkEngine('Hypothesis Testing', 'clinical scenario modeling',
        'You are a hypothesis testing engine.', undefined, EC, 'flask-round'),
      mkEngine('Dose-Response Model', 'patient-specific dosing',
        'You are a dose-response modeling engine.', undefined, EL, 'trending-up'),
      mkEngine('Comparative Efficacy', 'treatment comparison',
        'You are a comparative efficacy engine.', undefined, ED, 'bar-chart-2'),
      mkEngine('Risk-Benefit Analysis', 'outcome weighing',
        'You are a risk-benefit analysis engine.', undefined, EA, 'scale'),
      mkEngine('Safety Threshold', 'toxicity boundaries',
        'You are a safety threshold engine.', undefined, EC, 'shield-check'),
      mkEngine('Evidence Grading', 'source quality ranking',
        'You are an evidence grading engine.', undefined, EL, 'award'),
    ],
  },
  assess: {
    label: 'Assess',
    accent: EC,
    nodes: [
      mkDataIO('Clinical Summary', 'findings overview', 'file-text',
        'summary-out', 'Summary', 'any', EC),
      mkDataIO('Treatment Recommendation', 'action plan', 'clipboard',
        'rec-out', 'Recommendation', 'any', EL),
      mkDataIO('Patient Report', 'exportable documentation', 'file-output',
        'report-out', 'Report', 'any', ED),
      mkDataIO('Data Export', 'PDF, HL7, FHIR', 'download',
        'export-out', 'Exported', 'any', EA),
      mkDataIO('Audit Trail', 'reasoning verification', 'list-ordered',
        'audit-out', 'Audit', 'any', EC),
    ],
  },

  /* ─── Specialized Extension Packs ─── */
  clinical: {
    label: 'Clinical',
    accent: EC,
    nodes: [
      mkEngine('Analyze Clinical Data', 'autonomous reasoning engine',
        'You are a clinical data analyzer.', undefined, EC, 'list-checks'),
      mkEngine('Analyze Root Cause', 'symptom cluster mapping',
        'You are a root cause analyzer.', undefined, EL, 'search-code'),
      mkEngine('Build Treatment Protocol', 'dosing schedules & timing',
        'You are a treatment protocol builder.', undefined, ED, 'clipboard-list'),
      mkEngine('Analyze Lab Panels', 'functional ranges & flagging',
        'You are a lab panel analyzer.', undefined, EA, 'test-tubes'),
      mkEngine('Screen Drug Interactions', 'severity grading & alternatives',
        'You are a drug interaction screener.', undefined, EC, 'shield-alert'),
      mkEngine('Calculate Therapeutic Dosage', 'weight & organ-adjusted',
        'You are a therapeutic dosage calculator.', undefined, EL, 'calculator'),
    ],
  },
  pathways: {
    label: 'Pathways',
    accent: EC,
    nodes: [
      mkEngine('Analyze Metabolic Pathways', 'Krebs, detox phases',
        'You are a metabolic pathway analyzer.', undefined, EC, 'workflow'),
      mkEngine('Analyze Methylation Patterns', 'MTHFR & SNP interpretation',
        'You are a methylation pattern analyzer.', undefined, EL, 'dna'),
      mkEngine('Analyze Hormonal Patterns', 'estrogen, cortisol, thyroid',
        'You are a hormonal pattern analyzer.', undefined, ED, 'heart-pulse'),
      mkEngine('Analyze Adrenal Function', 'HPA axis & stress response',
        'You are an adrenal function analyzer.', undefined, EA, 'zap'),
    ],
  },
  nutrition: {
    label: 'Nutrition',
    accent: EC,
    nodes: [
      mkEngine('Look Up Nutrients', 'supplement reference data',
        'You are a nutrient database specialist.', undefined, EC, 'droplets'),
      mkEngine('Search Mineral Database', 'essential minerals & cofactors',
        'You are a mineral database specialist.', undefined, EL, 'gem'),
      mkEngine('Build Nutrition Plan', 'calorie-based meal planning',
        'You are a nutrition plan builder.', undefined, ED, 'utensils'),
      mkEngine('Search Food Interaction Database', 'absorption & drug conflicts',
        'You are a food interaction specialist.', undefined, EA, 'apple'),
    ],
  },
  natmed: {
    label: 'NatMed',
    accent: EC,
    nodes: [
      mkEngine('Search Botanical Database', 'herbal compounds & actions',
        'You are a botanical database specialist.', undefined, EC, 'leaf'),
      mkEngine('Search Homeopathic Materia Medica', 'remedies & potencies',
        'You are a homeopathic materia medica specialist.', undefined, EL, 'flower-2'),
      mkEngine('Search Essential Oils Reference', 'therapeutic use & dilution',
        'You are an essential oils specialist.', undefined, ED, 'droplet'),
      mkEngine('Analyze Microbiome Data', 'gut flora & dysbiosis',
        'You are a microbiome data analyzer.', undefined, EA, 'microscope'),
    ],
  },
  allergy: {
    label: 'Allergy',
    accent: EC,
    nodes: [
      mkEngine('Screen Allergy Interactions', 'drug, food, environmental',
        'You are an allergy interaction screener.', undefined, EC, 'alert-circle'),
      mkEngine('Analyze Sensitivity Patterns', 'IgE, IgG, elimination tracking',
        'You are a sensitivity pattern analyzer.', undefined, EL, 'scan-eye'),
      mkEngine('Cross-Reference Allergen Database', 'compound ingredient screening',
        'You are an allergen database specialist.', undefined, ED, 'search-check'),
    ],
  },
  exercise: {
    label: 'Exercise',
    accent: EC,
    nodes: [
      mkEngine('Build Exercise Protocol', 'rehab & conditioning programs',
        'You are an exercise protocol designer.', undefined, EC, 'dumbbell'),
      mkEngine('Analyze Movement Patterns', 'functional assessment',
        'You are a movement pattern analyzer.', undefined, EL, 'move'),
      mkEngine('Build Recovery Plan', 'post-treatment recovery',
        'You are a recovery plan designer.', undefined, ED, 'bed'),
      mkEngine('Screen Exercise Contraindications', 'activity restrictions by condition',
        'You are an exercise contraindication screener.', undefined, EA, 'shield-off'),
    ],
  },
  dataout: {
    label: 'DataOut',
    accent: EC,
    nodes: [
      mkEngine('Simulate Treatment Options', 'model outcomes & scenarios',
        'You are a treatment simulation engine.', undefined, EC, 'play-circle'),
      mkEngine('Track Patient Progress', 'longitudinal monitoring',
        'You are a patient progress tracker.', undefined, EL, 'trending-up'),
      mkEngine('Manage Clinical References', 'citations & literature',
        'You are a clinical reference manager.', undefined, ED, 'bookmark'),
      mkEngine('Parse Lab Reports', 'automated PDF & CSV extraction',
        'You are a lab report parser.', undefined, EA, 'file-scan'),
    ],
  },
  skills: {
    label: 'Skills',
    accent: ED,
    nodes: [
      mkEngine('Create Custom Skill', 'build your own configuration',
        'You are a custom skill processor.', undefined, ED, 'plus-circle'),
    ],
  },
  web: {
    label: 'Web',
    accent: EC,
    nodes: [
      mkData('Search Web Sources', 'query external data', 'globe',
        'web-out', 'Results', 'any', EC),
      mkData('Fetch Web Content', 'retrieve specific pages', 'download-cloud',
        'fetch-out', 'Content', 'any', EL),
      mkData('Search PubMed Literature', 'biomedical research', 'book-open',
        'pubmed-out', 'Literature', 'any', ED),
      mkData('Search Clinical Trials', 'ClinicalTrials.gov', 'clipboard-list',
        'trials-out', 'Trials', 'any', EA),
      mkData('Search Cochrane Reviews', 'systematic reviews', 'library',
        'cochrane-out', 'Reviews', 'any', EC),
      mkData('Search NDNR Archive', 'naturopathic research', 'archive',
        'ndnr-out', 'Articles', 'any', EL),
      mkData('Deep Research Mining', 'advanced data extraction', 'pickaxe',
        'research-out', 'Research', 'any', ED),
    ],
  },
  system: {
    label: 'System',
    accent: EC,
    nodes: [
      mkDataIO('Store Session Memory', 'persistent context', 'hard-drive',
        'mem-out', 'Stored', 'any', EC),
      mkData('Recall Past Sessions', 'session retrieval', 'history',
        'recall-out', 'Recalled', 'any', EL),
      mkDataIO('Connect EHR Systems', 'health record sync', 'plug',
        'ehr-out', 'EHR Data', 'any', ED),
      mkDataIO('Send Patient Reports', 'patient communication', 'send',
        'send-out', 'Sent', 'any', EA),
      mkDataIO('Export Clinical Data', 'PDF, HL7, FHIR output', 'upload',
        'export-out', 'Exported', 'any', EC),
      mkDataIO('Log Audit Trail', 'reasoning documentation', 'scroll-text',
        'log-out', 'Logged', 'any', EL),
    ],
  },
};

/* ═══════════════════════════════════════════════════
   CORTIXHEALTH EXTENSION PACKS (wellness vertical)
   ═══════════════════════════════════════════════════ */

const HG = HEALTH_ACCENT_COLORS;

export const HEALTH_EXTENSION_PACKS: Record<string, { label: string; accent: string; nodes: ClinicalNodeData[] }> = {

  profile: {
    label: 'Profile',
    accent: HG.goals,
    nodes: [
      mkData('Health Goals', 'wellness objectives and targets', 'target',
        'goals-out', 'Goals', 'any', HG.goals),
      mkData('Current Supplements', 'active supplement regimen', 'pill',
        'supps-out', 'Supplements', 'any', HG.supplements),
      mkData('Dietary Restrictions', 'allergies and preferences', 'utensils',
        'diet-out', 'Dietary', 'any', HG.dietary),
      mkData('Activity Level', 'exercise and fitness baseline', 'activity',
        'activity-out', 'Activity', 'any', HG.activity),
      mkData('Health Conditions', 'current conditions and history', 'clipboard',
        'conditions-out', 'Conditions', 'any', HG.conditions),
      mkData('Allergies', 'known allergies and sensitivities', 'alert-triangle',
        'allergies-out', 'Allergies', 'any', HG.allergies),
    ],
  },

  supplements: {
    label: 'Supplements',
    accent: HG.stackbuilder,
    nodes: [
      mkEngine('Supplement Stack Builder', 'personalized daily routine',
        'You are a supplement specialist. Design evidence-based stacks.', undefined, HG.stackbuilder, 'layers'),
      mkEngine('Interaction Checker', 'supplement safety screening',
        'You are a supplement interaction screener. Cross-reference all compounds.', undefined, HG.supplements, 'shield-alert'),
      mkEngine('Mineral Balance', 'mineral intake optimization',
        'You are a mineral balance specialist. Analyze and recommend adjustments.', undefined, HG.mineral, 'gem'),
      mkEngine('Dosage Calculator', 'safe dosage ranges',
        'You are a dosage specialist. Provide established safe ranges with upper limits.', undefined, HG.stackbuilder, 'calculator'),
    ],
  },

  nutrition: {
    label: 'Nutrition',
    accent: HG.mealplan,
    nodes: [
      mkEngine('Meal Planner', 'weekly meal plans',
        'You are a nutrition specialist. Create personalized meal plans.', undefined, HG.mealplan, 'utensils'),
      mkEngine('Nutrient Gap Analysis', 'identify deficiencies',
        'You are a nutritional analyst. Find and address nutrient gaps.', undefined, HG.nutrientgap, 'search'),
      mkEngine('Anti-Inflammatory Protocol', 'inflammation targeting',
        'You are an inflammation specialist. Design anti-inflammatory protocols.', undefined, HG.immune, 'flame'),
      mkEngine('Hydration Tracker', 'daily hydration needs',
        'You are a hydration specialist. Calculate personalized needs.', undefined, HG.hydration, 'droplets'),
      mkEngine('Calorie & Macro Calculator', 'calorie and macro targets',
        'You are a macro specialist. Compute targets based on goals and activity.', undefined, HG.macros, 'calculator'),
    ],
  },

  movement: {
    label: 'Movement',
    accent: HG.exercise,
    nodes: [
      mkEngine('Exercise Routine Builder', 'custom workout programs',
        'You are a fitness specialist. Design custom routines.', undefined, HG.exercise, 'dumbbell'),
      mkEngine('Recovery Protocol', 'post-workout recovery',
        'You are a recovery specialist. Design recovery protocols.', undefined, HG.recovery, 'heart-pulse'),
      mkEngine('Flexibility Program', 'stretching and mobility',
        'You are a mobility specialist. Design flexibility programs.', undefined, HG.flexibility, 'move'),
      mkEngine('Sleep Optimization', 'better sleep protocols',
        'You are a sleep specialist. Optimize sleep patterns.', undefined, HG.sleep, 'moon'),
      mkEngine('Stress Management', 'adaptogen and lifestyle protocols',
        'You are a stress management specialist. Design stress reduction plans.', undefined, HG.stress, 'wind'),
    ],
  },

  remedies: {
    label: 'Remedies',
    accent: HG.herbal,
    nodes: [
      mkEngine('Herbal Formulation', 'evidence-based herbal combinations',
        'You are an herbal medicine specialist. Recommend formulations.', undefined, HG.herbal, 'leaf'),
      mkEngine('Homeopathic Remedy Finder', 'symptom-to-remedy matching',
        'You are a homeopathic specialist. Match symptoms to remedies honestly.', undefined, HG.homeopathic, 'flask-conical'),
      mkEngine('Essential Oil Protocol', 'therapeutic applications',
        'You are an aromatherapy specialist. Design oil protocols safely.', undefined, HG.essentialoil, 'droplet'),
      mkEngine('Detox Support', 'evidence-based detox protocols',
        'You are a detoxification specialist. No pseudoscience.', undefined, HG.detox, 'recycle'),
      mkEngine('Immune Support', 'seasonal immune protocols',
        'You are an immune support specialist. Design protocols.', undefined, HG.immune, 'shield'),
    ],
  },

  safety: {
    label: 'Safety',
    accent: HG.allergies,
    nodes: [
      mkEngine('Supplement-Drug Screening', 'cross-reference against medications',
        'You screen supplements against prescription and OTC medications.', undefined, HG.allergies, 'shield-alert'),
      mkEngine('Pregnancy & Nursing Flags', 'safety during pregnancy',
        'You flag compounds not safe during pregnancy or nursing.', undefined, HG.dietary, 'alert-triangle'),
      mkEngine('Contraindication Alerts', 'condition-based restrictions',
        'You flag conditions where supplements are not recommended.', undefined, HG.allergies, 'x-circle'),
      mkEngine('Upper Limit Monitor', 'tolerable upper limits',
        'You track cumulative intake against established upper limits.', undefined, HG.conditions, 'trending-up'),
    ],
  },

  results: {
    label: 'Results',
    accent: HG.wellnessSummary,
    nodes: [
      mkDataIO('Wellness Summary', 'aggregate plan overview', 'file-text',
        'summary-out', 'Summary', 'any', HG.wellnessSummary),
      mkDataIO('Progress Report', 'before-and-after comparison', 'trending-up',
        'progress-out', 'Progress', 'any', HG.progress),
      mkDataIO('Shopping List', 'auto-generated from plans', 'list',
        'shopping-out', 'Shopping', 'any', HG.shopping),
      mkDataIO('Weekly Schedule', 'combined wellness schedule', 'calendar',
        'schedule-out', 'Schedule', 'any', HG.schedule),
      mkDataIO('Export Plan', 'shareable documents', 'download',
        'export-out', 'Exported', 'any', HG.exportplan),
    ],
  },

  web: {
    label: 'Web',
    accent: EC,
    nodes: [
      mkData('Search Web Sources', 'query wellness research', 'globe',
        'web-out', 'Results', 'any', EC),
      mkData('Fetch Web Content', 'retrieve specific pages', 'download-cloud',
        'fetch-out', 'Content', 'any', EL),
      mkData('Search PubMed Literature', 'nutrition & supplement research', 'book-open',
        'pubmed-out', 'Literature', 'any', ED),
      mkData('Search NDNR Archive', 'naturopathic research', 'archive',
        'ndnr-out', 'Articles', 'any', EL),
    ],
  },

  system: {
    label: 'System',
    accent: EC,
    nodes: [
      mkDataIO('Store Session Memory', 'persistent context', 'hard-drive',
        'mem-out', 'Stored', 'any', EC),
      mkData('Recall Past Sessions', 'session retrieval', 'history',
        'recall-out', 'Recalled', 'any', EL),
      mkDataIO('Export Wellness Data', 'download plans and reports', 'upload',
        'export-out', 'Exported', 'any', EC),
      mkDataIO('Log Activity', 'track wellness activities', 'scroll-text',
        'log-out', 'Logged', 'any', EL),
    ],
  },
};

/* ═══════════════════════════════════════════════════
   EXTENSION ↔ CANVAS BRIDGE UTILITIES
   ═══════════════════════════════════════════════════ */

/** Derive a stable extension ID from a node's display label.
 *  CortixEngine nodes use subtitle as display; Data nodes use label. */
export function extensionIdFromLabel(label: string, subtitle?: string): string {
  const display = label === 'CortixEngine' ? (subtitle || 'CortixEngine') : label;
  return display.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
}

/** Convert EXTENSION_PACKS into an Extension[] for CortixContext.
 *  Each canvas node becomes one toggleable extension.
 *  Pass platform to get the right pack set. */
export function generateExtensionsFromPacks(platform?: string | null): Extension[] {
  const packs = platform === 'cortixhealth' ? HEALTH_EXTENSION_PACKS : EXTENSION_PACKS;
  const result: Extension[] = [];
  for (const pack of Object.values(packs)) {
    for (const node of pack.nodes) {
      const displayLabel = node.label === 'CortixEngine' || node.label === 'CortixHealth'
        ? (node.subtitle || node.label)
        : node.label;
      result.push({
        id: extensionIdFromLabel(node.label, node.subtitle),
        name: displayLabel,
        description: node.description,
        enabled: false,
        category: pack.label,
        icon: node.icon,
      });
    }
  }
  return result;
}
