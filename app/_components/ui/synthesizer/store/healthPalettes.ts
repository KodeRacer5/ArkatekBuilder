/**
 * healthPalettes.ts — EXPLORE + BUILD palette structures for CortixHealth sidebar
 *
 * EXPLORE (default): GOAL -> ACTION -> INPUT -> KNOWLEDGE -> ORGANIZE -> CART
 * CUSTOMIZE (toggle): Domain-organized research view (domains + Action + Organize + Cart)
 *
 * Nested type: Record<string, ClinicalNodeData[] | Record<string, ClinicalNodeData[]>>
 * - Array value -> flat node list (L1 -> nodes)
 * - Object value -> sub-categories (L1 -> L2 -> nodes)
 *
 * Knowledge: 33 databases (was 16)
 * Engines: color-coded by function group (neon accents)
 */

import type { ClinicalNodeData } from '../canvas/canvas.types';
import {
  mkEngine, mkTrigger, mkData, mkSquare, mkPill, mkSplitter, mkMerger, mkNote,
} from './useNodeTypesStore';

export type NestedPalette = Record<string, ClinicalNodeData[] | Record<string, ClinicalNodeData[]>>;

/* ══════════════════════════════════════════════════════════════
   ENGINE ACCENT COLORS — neon palette by function group
   ══════════════════════════════════════════════════════════════ */
const NEON = {
  analyzer: '#00e5ff',   // electric cyan
  assessor: '#b388ff',   // neon violet
  finder:   '#69ff47',   // neon green
  screener: '#ff3d71',   // neon red
  tracker:  '#4bab13',   // brand green (was neon amber)
  tool:     '#ea80fc',   // neon magenta
  custom:   '#1de9b6',   // neon teal
} as const;

/* ══════════════════════════════════════════════════════════════
   SHARED NODE REFERENCES
   ══════════════════════════════════════════════════════════════ */

// ACTION
const cortixHealth = mkEngine('CortixHealth', 'Wellness AI engine - core processor', 'You are the CortixHealth wellness reasoning engine. Provide evidence-based wellness analysis. You inform, never prescribe. The patient and their healthcare provider make all decisions.');
const orchestrator = mkPill('Orchestrator', 'Analyzes goal and patient data to build optimal pipeline', 'Pipeline builder', 'Agent-guided flow');
const chatInput = mkTrigger('Chat Input', 'User wellness query trigger', 'message-square', 'small');
const goalInput = mkTrigger('Goal Input', 'Define wellness goal or health objective', 'message-square', 'small');
const note = mkNote();

// ─── INPUT: Patient Data ─────────────────────────────────────
const healthGoals = mkData('Health Goals', 'Objectives and targets', 'target', 'goals-out', 'Goals', 'any');
const currentSupplements = mkData('Current Supplements', 'Active supplement regimen', 'pill', 'supps-out', 'Supplements', 'any');
const dietaryRestrictions = mkData('Dietary Restrictions', 'Allergies and dietary preferences', 'utensils', 'diet-out', 'Dietary', 'any');
const activityLevel = mkData('Activity Level', 'Exercise frequency and fitness baseline', 'activity', 'activity-out', 'Activity', 'any');
const healthConditions = mkData('Health Conditions', 'Current conditions and medical history', 'clipboard', 'conditions-out', 'Conditions', 'any');
const allergies = mkData('Allergies', 'Known allergies and sensitivities', 'alert-triangle', 'allergies-out', 'Allergies', 'any');
const braceletFeed = mkData('Bracelet Feed', 'stream live biometric data', 'watch', 'bio-out', 'Biometrics', 'any');
const wearableImport = mkData('Wearable Import', 'sync device data', 'download-cloud', 'wearable-out', 'Wearable', 'any');
const manualVitals = mkData('Manual Vitals', 'enter lab values', 'edit', 'vitals-out', 'Vitals', 'any');
const customInput = mkData('Custom Input', 'Custom patient data source', 'plus-circle', 'custom-in-out', 'Custom', 'any');

// ─── INPUT: Knowledge — Singles (9, unchanged) ───────────────
const compoundDb = mkData('Compound Database', 'lookup supplement profiles', 'database', 'compound-out', 'Compounds', 'any');
const interactionDb = mkData('Interaction Database', 'check supplement conflicts', 'git-branch', 'interaction-out', 'Interactions', 'any');
const evidenceBase = mkData('Evidence Base', 'find research studies', 'book-open', 'evidence-out', 'Evidence', 'any');
const formulationDb = mkData('Formulation Database', 'verify manufacturer formulations', 'flask-conical', 'formulation-out', 'Formulations', 'any');
const nutritionDb = mkData('Nutrition Database', 'lookup food and nutrient data', 'apple', 'nutrition-db-out', 'Nutrition', 'any');
const botanicalDb = mkData('Botanical Database', 'lookup herbal compounds', 'leaf', 'botanical-db-out', 'Botanicals', 'any');
const mineralDb = mkData('Mineral Database', 'check mineral levels', 'gem', 'mineral-db-out', 'Minerals', 'any');
const exerciseSci = mkData('Exercise Science', 'lookup fitness data', 'dumbbell', 'exercise-sci-out', 'Exercise', 'any');
const customKnowledge = mkData('Custom Knowledge', 'add custom reference', 'plus-circle', 'custom-know-out', 'Custom', 'any');

// ─── INPUT: Knowledge — Pathway Maps split (2, was 1) ────────
const metabolicPathways = mkData('Metabolic Pathways', 'trace metabolic routes', 'map', 'metabolic-path-out', 'Metabolic', 'any');
const hormonalPathways = mkData('Hormonal Pathways', 'trace hormone routes', 'trending-up', 'hormonal-path-out', 'Hormonal', 'any');

// ─── INPUT: Knowledge — Sleep Research split (2, was 1) ──────
const sleepArchitecture = mkData('Sleep Architecture', 'lookup sleep stage data', 'bed', 'sleep-arch-out', 'Sleep Stages', 'any');
const circadianResearch = mkData('Circadian Research', 'lookup body clock data', 'clock', 'circadian-out', 'Circadian', 'any');

// ─── INPUT: Knowledge — Gut Health: All + 3 individual ───────
const gutHealthDb = mkData('Gut Health Database', 'lookup all gut data', 'layers', 'gut-db-out', 'Gut Data', 'any');
const microbiomeRef = mkData('Microbiome Reference', 'lookup microbiome data', 'layers', 'microbiome-out', 'Microbiome', 'any');
const probioticsRef = mkData('Probiotics Reference', 'lookup probiotic strains', 'flask-conical', 'probiotics-out', 'Probiotics', 'any');
const dysbiosisRef = mkData('Dysbiosis Reference', 'lookup gut imbalance data', 'shield-alert', 'dysbiosis-out', 'Dysbiosis', 'any');

// ─── INPUT: Knowledge — Hormone: All + 3 individual ─────────
const hormoneRef = mkData('Hormone Reference', 'lookup all hormone data', 'trending-up', 'hormone-ref-out', 'Hormones', 'any');
const thyroidRef = mkData('Thyroid Reference', 'lookup thyroid panels', 'activity', 'thyroid-ref-out', 'Thyroid', 'any');
const adrenalRef = mkData('Adrenal Reference', 'lookup adrenal and cortisol', 'zap', 'adrenal-ref-out', 'Adrenal', 'any');
const sexHormoneRef = mkData('Sex Hormone Reference', 'lookup sex hormone panels', 'trending-up', 'sex-hormone-out', 'Sex Hormones', 'any');

// ─── INPUT: Knowledge — Toxin: All + 3 individual ───────────
const toxinDb = mkData('Toxin Database', 'lookup all toxin data', 'shield-alert', 'toxin-db-out', 'Toxins', 'any');
const heavyMetalsRef = mkData('Heavy Metals Reference', 'lookup heavy metal exposure', 'shield', 'heavy-metals-out', 'Heavy Metals', 'any');
const moldMycotoxinRef = mkData('Mold & Mycotoxin Reference', 'lookup mold toxins', 'bug', 'mold-out', 'Mold', 'any');
const envChemicals = mkData('Environmental Chemicals', 'lookup chemical exposure', 'flask-round', 'env-chem-out', 'Chemicals', 'any');

// ─── INPUT: Knowledge — Longevity: All + 3 individual ───────
const longevityRes = mkData('Longevity Research', 'lookup all aging data', 'clock', 'longevity-res-out', 'Longevity', 'any');
const nadResearch = mkData('NAD+ Research', 'lookup NAD+ pathways', 'flame', 'nad-out', 'NAD+', 'any');
const telomereResearch = mkData('Telomere Research', 'lookup telomere health', 'dna', 'telomere-out', 'Telomeres', 'any');
const mitoResearch = mkData('Mitochondrial Research', 'lookup mitochondrial function', 'microscope', 'mito-out', 'Mitochondria', 'any');

// ─── INPUT: Knowledge — Skin & Beauty: All + 3 individual ───
const skinBeautySci = mkData('Skin & Beauty Science', 'lookup all skin data', 'sparkles', 'skin-sci-out', 'Skin Science', 'any');
const collagenRef = mkData('Collagen Reference', 'lookup collagen types', 'sparkles', 'collagen-out', 'Collagen', 'any');
const nutricosmRef = mkData('Nutricosmetics Reference', 'lookup nutricosmetic compounds', 'flower-2', 'nutricosm-out', 'Nutricosmetics', 'any');
const skinBarrierRef = mkData('Skin Barrier Reference', 'lookup skin barrier data', 'shield-half', 'skin-barrier-out', 'Skin Barrier', 'any');

// ─── ENGINES: Analyzers (15) — #00e5ff electric cyan ─────────
const biometricAnalyzer = mkEngine('Biometric Analyzer', 'analyze body signals', 'You are a biometric analysis engine. Analyze heart rate, HRV, SpO2, and biometric data to identify patterns. Present findings with evidence. Never prescribe.', undefined, NEON.analyzer);
const sleepAnalyzer = mkEngine('Sleep Analyzer', 'analyze sleep stages', 'You are a sleep analysis engine. Analyze sleep stages, duration, efficiency. Present findings with evidence. Never prescribe.', undefined, NEON.analyzer);
const nutritionAnalyzer = mkEngine('Nutrition Analyzer', 'analyze diet intake', 'You are a nutrition analysis engine. Analyze dietary intake and nutritional adequacy. Present findings with evidence. Never prescribe.', undefined, NEON.analyzer);
const stackAnalyzer = mkEngine('Stack Analyzer', 'analyze supplement combos', 'You are a supplement stack analysis engine. Analyze combinations for synergies, redundancies, conflicts. Present findings with evidence. Never prescribe.', undefined, NEON.analyzer);
const botanicalAnalyzer = mkEngine('Botanical Analyzer', 'analyze herbal compounds', 'You are a botanical analysis engine. Analyze herbal compounds, mechanisms, dosing. Present findings with evidence. Never prescribe.', undefined, NEON.analyzer);
const mineralAnalyzer = mkEngine('Mineral Analyzer', 'analyze mineral balance', 'You are a mineral analysis engine. Analyze mineral intake and bioavailability against optimal ranges. Present findings with evidence. Never prescribe.', undefined, NEON.analyzer);
const gutAnalyzer = mkEngine('Gut Analyzer', 'analyze gut health', 'You are a gut analysis engine. Analyze microbiome composition, digestive markers, gut barrier integrity. Present findings with evidence. Never prescribe.', undefined, NEON.analyzer);
const hormoneAnalyzer = mkEngine('Hormone Analyzer', 'analyze hormone levels', 'You are a hormone analysis engine. Analyze thyroid panels, cortisol patterns, sex hormones. Present findings with evidence. Never prescribe.', undefined, NEON.analyzer);
const liverAnalyzer = mkEngine('Liver Analyzer', 'analyze detox function', 'You are a liver analysis engine. Analyze liver enzymes, detoxification capacity, toxin clearance. Present findings with evidence. Never prescribe.', undefined, NEON.analyzer);
const heartAnalyzer = mkEngine('Heart Analyzer', 'analyze heart markers', 'You are a cardiovascular analysis engine. Analyze lipid panels, inflammatory markers, blood pressure. Present findings with evidence. Never prescribe.', undefined, NEON.analyzer);
const skinAnalyzer = mkEngine('Skin Analyzer', 'analyze skin health', 'You are a skin health analysis engine. Analyze collagen status, nutrient deficiencies affecting skin/hair/nails. Present findings with evidence. Never prescribe.', undefined, NEON.analyzer);
const deficiencyAnalyzer = mkEngine('Deficiency Analyzer', 'find nutrient gaps', 'You are a deficiency analysis engine. Analyze dietary data, symptoms, lab values for nutrient deficiencies. Present findings with evidence. Never prescribe.', undefined, NEON.analyzer);
const biomarkerAnalyzer = mkEngine('Biomarker Analyzer', 'find lab anomalies', 'You are a biomarker analysis engine. Analyze lab panels and wearable data for anomalies and trends. Present findings with evidence. Never prescribe.', undefined, NEON.analyzer);
const inflammationAnalyzer = mkEngine('Inflammation Analyzer', 'find inflammation', 'You are an inflammation analysis engine. Analyze hs-CRP, cytokines, inflammatory markers. Present findings with evidence. Never prescribe.', undefined, NEON.analyzer);
const toxinAnalyzer = mkEngine('Toxin Analyzer', 'find toxin exposure', 'You are a toxin analysis engine. Analyze for heavy metals, mycotoxins, environmental chemicals. Present findings with evidence. Never prescribe.', undefined, NEON.analyzer);

// ─── ENGINES: Assessors (6) — #b388ff neon violet ────────────
const exerciseAssessor = mkEngine('Exercise Assessor', 'rate fitness state', 'You are an exercise assessment engine. Assess current fitness, exercise capacity, training readiness. Present findings with evidence. Never prescribe.', undefined, NEON.assessor);
const recoveryAssessor = mkEngine('Recovery Assessor', 'rate recovery status', 'You are a recovery assessment engine. Assess post-workout and illness recovery status. Present findings with evidence. Never prescribe.', undefined, NEON.assessor);
const sleepAssessor = mkEngine('Sleep Assessor', 'rate sleep quality', 'You are a sleep assessment engine. Assess sleep quality, identify disruption patterns. Present findings with evidence. Never prescribe.', undefined, NEON.assessor);
const stressAssessor = mkEngine('Stress Assessor', 'rate stress levels', 'You are a stress assessment engine. Assess stress from HRV, cortisol, behavioral signals. Present findings with evidence. Never prescribe.', undefined, NEON.assessor);
const readinessAssessor = mkEngine('Readiness Assessor', 'rate daily readiness', 'You are a readiness assessment engine. Synthesize HRV, sleep, resting HR into readiness data. Present findings with evidence. Never prescribe.', undefined, NEON.assessor);
const longevityAssessor = mkEngine('Longevity Assessor', 'rate cellular health', 'You are a longevity assessment engine. Assess oxidative stress, NAD+, mitochondrial function, aging markers. Present findings with evidence. Never prescribe.', undefined, NEON.assessor);

// ─── ENGINES: Finders (5) — #69ff47 neon green ──────────────
const evidenceFinder = mkEngine('Evidence Finder', 'find research', 'You are an evidence finding engine. Search and retrieve peer-reviewed research relevant to the query. Present findings with citations. Never prescribe.', undefined, NEON.finder);
const remedyFinder = mkEngine('Remedy Finder', 'find remedies', 'You are a remedy finding engine. Match symptom profiles to evidence-based remedies. Present findings with evidence. Never prescribe.', undefined, NEON.finder);
const botanicalFinder = mkEngine('Botanical Finder', 'find herbal matches', 'You are a botanical finding engine. Match conditions to herbal compounds with dosing and evidence. Present findings with evidence. Never prescribe.', undefined, NEON.finder);
const nutritionFinder = mkEngine('Nutrition Finder', 'find food sources', 'You are a nutrition finding engine. Find food sources that address specific nutrient needs. Present findings with evidence. Never prescribe.', undefined, NEON.finder);
const mineralFinder = mkEngine('Mineral Finder', 'find mineral sources', 'You are a mineral finding engine. Find mineral sources and bioavailable supplementation options. Present findings with evidence. Never prescribe.', undefined, NEON.finder);

// ─── ENGINES: Screeners (2) — #ff3d71 neon red ──────────────
const interactionCheck = mkEngine('Interaction Check', 'screen for conflicts', 'You are an interaction screening engine. Cross-reference supplements against medications for interactions. Present all findings including severity. Never hide items. Never prescribe.', undefined, NEON.screener);
const pregnancyScreener = mkEngine('Pregnancy Screener', 'screen pregnancy safety', 'You are a pregnancy safety screening engine. Screen supplements for pregnancy and lactation safety. Present all findings. Never hide items. Never prescribe.', undefined, NEON.screener);

// ─── ENGINES: Trackers (3) — #4bab13 brand green ─────────────
const strainTracker = mkEngine('Strain Tracker', 'track cumulative strain', 'You are a strain tracking engine. Track cumulative training load and strain over time. Present findings with evidence. Never prescribe.', undefined, NEON.tracker);
const dosageTracker = mkEngine('Dosage Tracker', 'track daily intake', 'You are a dosage tracking engine. Track daily intake against upper limits and flag thresholds. Present findings with evidence. Never prescribe.', undefined, NEON.tracker);
const hydrationTracker = mkEngine('Hydration Tracker', 'track fluid levels', 'You are a hydration tracking engine. Track fluid intake against activity and conditions. Present findings with evidence. Never prescribe.', undefined, NEON.tracker);

// ─── ENGINES: Tools (3) — #ea80fc neon magenta ──────────────
const immuneProfiler = mkEngine('Immune Profiler', 'profile immune status', 'You are an immune profiling engine. Profile immune status from health history, labs, symptoms. Present findings with evidence. Never prescribe.', undefined, NEON.tool);
const deficiencyMapper = mkEngine('Deficiency Mapper', 'map symptom clusters', 'You are a deficiency mapping engine. Map symptom clusters to nutrient deficiencies. Present findings with evidence. Never prescribe.', undefined, NEON.tool);
const macroCalculator = mkEngine('Macro Calculator', 'calculate macros', 'You are a macronutrient calculation engine. Compute calorie and macro targets from body comp, activity, goals. Present calculations with reasoning. Never prescribe.', undefined, NEON.tool);

// ─── ENGINES: Custom (1) — #1de9b6 neon teal ────────────────
const customEngine = mkEngine('Custom Engine', 'custom analysis', 'You are a custom analysis engine. The user will define your purpose and analysis focus.', undefined, NEON.custom);

// ─── OUTPUTS: Body & Physical ────────────────────────────────
const energyOpt = mkSquare('Energy Optimization', 'optimize energy', 'zap');
const sleepOpt = mkSquare('Sleep Optimization', 'optimize sleep', 'moon');
const recoveryOpt = mkSquare('Recovery Optimization', 'optimize recovery', 'heart-pulse');
const exerciseOpt = mkSquare('Exercise Optimization', 'optimize fitness', 'dumbbell');
const hydrationOpt = mkSquare('Hydration Optimization', 'optimize hydration', 'droplets');
const weightOpt = mkSquare('Weight Optimization', 'optimize weight', 'scale');
const flexibilityOpt = mkSquare('Flexibility Optimization', 'optimize mobility', 'move');
const painReduction = mkSquare('Pain Reduction', 'reduce pain', 'shield');

// ─── OUTPUTS: Nutrition & Supplementation ────────────────────
const deficiencyOpt = mkSquare('Deficiency Optimization', 'fill nutrient gaps', 'search');
const nutritionOpt = mkSquare('Nutrition Optimization', 'optimize diet', 'utensils');
const supplementOpt = mkSquare('Supplement Optimization', 'optimize stack', 'layers');
const mineralOpt = mkSquare('Mineral Optimization', 'optimize minerals', 'gem');
const botanicalOpt = mkSquare('Botanical Optimization', 'optimize herbal protocol', 'leaf');
const dosageOpt = mkSquare('Dosage Optimization', 'optimize dosages', 'gauge');

// ─── OUTPUTS: Body Systems ───────────────────────────────────
const digestionOpt = mkSquare('Digestion Optimization', 'optimize digestion', 'layers');
const immuneOpt = mkSquare('Immune Optimization', 'optimize immunity', 'shield');
const heartOpt = mkSquare('Heart Optimization', 'optimize heart health', 'heart-pulse');
const hormoneOpt = mkSquare('Hormone Optimization', 'optimize hormones', 'trending-up');
const bloodPressureOpt = mkSquare('Blood Pressure Optimization', 'optimize blood pressure', 'activity');
const circadianOpt = mkSquare('Circadian Optimization', 'optimize body clock', 'clock');
const inflammationReduction = mkSquare('Inflammation Reduction', 'reduce inflammation', 'shield-alert');
const detoxOpt = mkSquare('Detox Optimization', 'optimize detox', 'recycle');

// ─── OUTPUTS: Internal Health ────────────────────────────────
const liverOpt = mkSquare('Liver Optimization', 'optimize liver', 'shield');
const kidneyOpt = mkSquare('Kidney Optimization', 'optimize kidneys', 'droplet');
const thyroidOpt = mkSquare('Thyroid Optimization', 'optimize thyroid', 'trending-up');
const gutOpt = mkSquare('Gut Optimization', 'optimize gut', 'layers');
const skinOpt = mkSquare('Skin Optimization', 'optimize skin', 'sparkles');

// ─── OUTPUTS: Mind & Mood ────────────────────────────────────
const focusOpt = mkSquare('Focus Optimization', 'optimize focus', 'crosshair');
const moodOpt = mkSquare('Mood Optimization', 'optimize mood', 'smile');
const stressReduction = mkSquare('Stress Reduction', 'reduce stress', 'wind');

// ─── OUTPUTS: Safety ─────────────────────────────────────────
const interactionSafety = mkSquare('Interaction Safety', 'verify safe combos', 'shield-alert');
const pregnancySafety = mkSquare('Pregnancy Safety', 'verify pregnancy safe', 'sparkles');

// ─── OUTPUTS: Terminal ───────────────────────────────────────
const shoppingList = mkSquare('Shopping List', 'compile purchases', 'shopping-cart');
const customOutput = mkSquare('Custom Output', 'custom results', 'plus-circle');

// ─── ORGANIZE ────────────────────────────────────────────────
const split = mkSplitter('Split', 'Route data to multiple paths', 'git-fork', 2);
const combine = mkMerger('Combine', 'Merge multiple inputs into one', 'git-merge', 2);


/* ══════════════════════════════════════════════════════════════
   KNOWLEDGE — full 33-node array (reused by both palettes)
   ══════════════════════════════════════════════════════════════ */
const KNOWLEDGE_ALL: ClinicalNodeData[] = [
  // Singles (9)
  compoundDb, interactionDb, evidenceBase, formulationDb, nutritionDb,
  botanicalDb, mineralDb, exerciseSci, customKnowledge,
  // Pathway splits (2)
  metabolicPathways, hormonalPathways,
  // Sleep splits (2)
  sleepArchitecture, circadianResearch,
  // Gut Health: parent + 3 (4)
  gutHealthDb, microbiomeRef, probioticsRef, dysbiosisRef,
  // Hormone: parent + 3 (4)
  hormoneRef, thyroidRef, adrenalRef, sexHormoneRef,
  // Toxin: parent + 3 (4)
  toxinDb, heavyMetalsRef, moldMycotoxinRef, envChemicals,
  // Longevity: parent + 3 (4)
  longevityRes, nadResearch, telomereResearch, mitoResearch,
  // Skin & Beauty: parent + 3 (4)
  skinBeautySci, collagenRef, nutricosmRef, skinBarrierRef,
];


/* ══════════════════════════════════════════════════════════════
   EXPLORE PALETTE (default - beginner / goal-seeker)
   GOAL -> ACTION -> INPUT -> KNOWLEDGE -> ORGANIZE -> CART
   ══════════════════════════════════════════════════════════════ */

export const HEALTH_PALETTE_EXPLORE: NestedPalette = {
  'Goal': {
    'Body & Physical': [energyOpt, sleepOpt, recoveryOpt, exerciseOpt, hydrationOpt, weightOpt, flexibilityOpt, painReduction],
    'Nutrition & Supplementation': [deficiencyOpt, nutritionOpt, supplementOpt, mineralOpt, botanicalOpt, dosageOpt],
    'Body Systems': [digestionOpt, immuneOpt, heartOpt, hormoneOpt, bloodPressureOpt, circadianOpt, inflammationReduction, detoxOpt],
    'Internal Health': [liverOpt, kidneyOpt, thyroidOpt, gutOpt, skinOpt],
    'Mind & Mood': [focusOpt, moodOpt, stressReduction],
    'Safety': [interactionSafety, pregnancySafety],
  },
  'Action': [cortixHealth, orchestrator, chatInput, goalInput, note],
  'Engines': {
    'Analyzers': [biometricAnalyzer, sleepAnalyzer, nutritionAnalyzer, stackAnalyzer, botanicalAnalyzer, mineralAnalyzer, gutAnalyzer, hormoneAnalyzer, liverAnalyzer, heartAnalyzer, skinAnalyzer, deficiencyAnalyzer, biomarkerAnalyzer, inflammationAnalyzer, toxinAnalyzer],
    'Assessors': [exerciseAssessor, recoveryAssessor, sleepAssessor, stressAssessor, readinessAssessor, longevityAssessor],
    'Finders': [evidenceFinder, remedyFinder, botanicalFinder, nutritionFinder, mineralFinder],
    'Screeners': [interactionCheck, pregnancyScreener],
    'Trackers & Tools': [immuneProfiler, deficiencyMapper, strainTracker, dosageTracker, hydrationTracker, macroCalculator, customEngine],
  },
  'Input': [healthGoals, currentSupplements, dietaryRestrictions, activityLevel, healthConditions, allergies, braceletFeed, wearableImport, manualVitals, customInput],
  'Knowledge': KNOWLEDGE_ALL,
  'Organize': [split, combine],
  'Cart': [shoppingList, customOutput],
};


/* ══════════════════════════════════════════════════════════════
   BUILD PALETTE (advanced - researcher / domain-organized)
   ACTION -> ENGINES -> INPUT -> ... -> ORGANIZE -> CART
   ══════════════════════════════════════════════════════════════ */

export const HEALTH_PALETTE_BUILD: NestedPalette = {
  'Action': [cortixHealth, orchestrator, chatInput, goalInput, note],
  'Engines': {
    'Analyzers': [biometricAnalyzer, sleepAnalyzer, nutritionAnalyzer, stackAnalyzer, botanicalAnalyzer, mineralAnalyzer, gutAnalyzer, hormoneAnalyzer, liverAnalyzer, heartAnalyzer, skinAnalyzer, deficiencyAnalyzer, biomarkerAnalyzer, inflammationAnalyzer, toxinAnalyzer],
    'Assessors': [exerciseAssessor, recoveryAssessor, sleepAssessor, stressAssessor, readinessAssessor, longevityAssessor],
    'Finders': [evidenceFinder, remedyFinder, botanicalFinder, nutritionFinder, mineralFinder],
    'Screeners': [interactionCheck, pregnancyScreener],
    'Trackers & Tools': [immuneProfiler, deficiencyMapper, strainTracker, dosageTracker, hydrationTracker, macroCalculator, customEngine],
  },
  'Input': [healthGoals, currentSupplements, dietaryRestrictions, activityLevel, healthConditions, allergies, customInput],
  'Biometrics': [braceletFeed, wearableImport, manualVitals],
  'Output': {
    'Body & Physical': [energyOpt, sleepOpt, recoveryOpt, exerciseOpt, hydrationOpt, weightOpt, flexibilityOpt, painReduction],
    'Nutrition & Supplementation': [deficiencyOpt, nutritionOpt, supplementOpt, mineralOpt, botanicalOpt, dosageOpt],
    'Body Systems': [digestionOpt, immuneOpt, heartOpt, hormoneOpt, bloodPressureOpt, circadianOpt, inflammationReduction, detoxOpt],
    'Internal Health': [liverOpt, kidneyOpt, thyroidOpt, gutOpt, skinOpt],
    'Mind & Mood': [focusOpt, moodOpt, stressReduction],
    'Safety': [interactionSafety, pregnancySafety],
  },
  'Knowledge': KNOWLEDGE_ALL,
  'Organize': [split, combine],
  'Body & Physical': {
    'Outcome': [energyOpt, sleepOpt, recoveryOpt, exerciseOpt, hydrationOpt, weightOpt, flexibilityOpt, painReduction],
    'Engines': [biometricAnalyzer, sleepAnalyzer, exerciseAssessor, recoveryAssessor, readinessAssessor, strainTracker, hydrationTracker],
    'Input': [braceletFeed, wearableImport, activityLevel],
    'Knowledge': [exerciseSci, sleepArchitecture, circadianResearch],
  },
  'Nutrition & Supplementation': {
    'Outcome': [deficiencyOpt, nutritionOpt, supplementOpt, mineralOpt, botanicalOpt, dosageOpt, weightOpt],
    'Engines': [nutritionAnalyzer, stackAnalyzer, mineralAnalyzer, botanicalAnalyzer, deficiencyAnalyzer, deficiencyMapper, remedyFinder, nutritionFinder, mineralFinder, dosageTracker, macroCalculator],
    'Input': [currentSupplements, dietaryRestrictions, healthGoals],
    'Knowledge': [compoundDb, formulationDb, nutritionDb, mineralDb, botanicalDb],
  },
  'Body Systems': {
    'Outcome': [digestionOpt, immuneOpt, heartOpt, hormoneOpt, bloodPressureOpt, circadianOpt, inflammationReduction, detoxOpt],
    'Engines': [gutAnalyzer, heartAnalyzer, hormoneAnalyzer, inflammationAnalyzer, immuneProfiler, biomarkerAnalyzer],
    'Input': [healthConditions, manualVitals, braceletFeed],
    'Knowledge': [gutHealthDb, microbiomeRef, probioticsRef, dysbiosisRef, hormoneRef, thyroidRef, adrenalRef, sexHormoneRef, evidenceBase, mineralDb],
  },
  'Internal Health': {
    'Outcome': [liverOpt, kidneyOpt, thyroidOpt, gutOpt, skinOpt],
    'Engines': [liverAnalyzer, skinAnalyzer, toxinAnalyzer, biomarkerAnalyzer, mineralAnalyzer],
    'Input': [manualVitals, healthConditions],
    'Knowledge': [toxinDb, heavyMetalsRef, moldMycotoxinRef, envChemicals, skinBeautySci, collagenRef, nutricosmRef, skinBarrierRef, mineralDb, evidenceBase],
  },
  'Mind & Mood': {
    'Outcome': [focusOpt, moodOpt, stressReduction],
    'Engines': [stressAssessor, gutAnalyzer, botanicalFinder],
    'Input': [braceletFeed, healthConditions],
    'Knowledge': [evidenceBase, gutHealthDb, botanicalDb, hormonalPathways],
  },
  'Cart': [shoppingList, customOutput],
};
