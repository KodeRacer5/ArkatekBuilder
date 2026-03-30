/**
 * CortixEngine Node Recipes — Universal Template + Config Table
 *
 * One template. One schema. Config rows define specialization.
 * Add a node type = add a row. Logic never changes.
 */

export interface NodeRecipe {
  role: string;
  task: string;
  focus: 'findings' | 'flags' | 'values' | 'sources' | 'findings+flags';
  model?: string;  // override per node, otherwise use global
  temperature?: number;
  maxTokens?: number;
}

/**
 * Config table — every thinking node's specialization in 3 fields.
 * Key = node label (matches ClinicalNodeData.label)
 */
export const NODE_RECIPES: Record<string, NodeRecipe> = {

  /* ═══ APPRAISE (6) ═══ */
  'Differential Diagnosis': {
    role: 'diagnostic analyst',
    task: 'Identify and rank probable conditions based on all available patient data, symptoms, labs, and history. Provide differential diagnoses ordered by likelihood.',
    focus: 'findings',
  },
  'Drug Interaction Screen': {
    role: 'pharmacology screener',
    task: 'Screen all compounds in the patient regimen for drug-drug, drug-supplement, and supplement-supplement interactions. Flag severity and mechanism.',
    focus: 'flags',
  },
  'Mechanism of Action': {
    role: 'biochemical analyst',
    task: 'Trace the pharmacological and biochemical pathways of identified compounds. Map receptor activity, metabolic routes, and downstream effects.',
    focus: 'findings',
  },
  'Contraindication Check': {
    role: 'safety screener',
    task: 'Cross-reference patient conditions, allergies, and current regimen against known contraindications. Flag absolute and relative contraindications.',
    focus: 'flags',
  },
  'Cross-Reference': {
    role: 'evidence validator',
    task: 'Cross-reference upstream findings against multiple corroborating sources. Validate or challenge each finding with supporting evidence.',
    focus: 'sources',
  },
  'Causal Analysis': {
    role: 'causal reasoning analyst',
    task: 'Trace causal chains between patient symptoms, lab values, medications, and conditions. Identify root causes and contributing factors.',
    focus: 'findings',
  },

  /* ═══ APPLY (6) ═══ */
  'Hypothesis Testing': {
    role: 'hypothesis analyst',
    task: 'Formulate and evaluate clinical hypotheses based on upstream findings. Test each against available evidence and assign confidence scores.',
    focus: 'findings',
  },
  'Dose-Response Model': {
    role: 'dosage analyst',
    task: 'Calculate optimal dosing based on patient weight, age, hepatic/renal function, and published therapeutic ranges. Account for drug interactions.',
    focus: 'values',
  },
  'Comparative Efficacy': {
    role: 'treatment comparator',
    task: 'Compare treatment options by efficacy, side effect profile, cost, and patient-specific factors. Rank alternatives with evidence.',
    focus: 'findings',
  },
  'Risk-Benefit Analysis': {
    role: 'risk assessor',
    task: 'Weigh therapeutic benefits against risks and adverse effects for each treatment option. Consider patient-specific risk factors.',
    focus: 'findings+flags',
  },
  'Safety Threshold': {
    role: 'safety threshold analyst',
    task: 'Evaluate all compounds against LD50 values, maximum recommended doses, and published toxicity thresholds. Flag any values approaching limits.',
    focus: 'flags',
  },
  'Evidence Grading': {
    role: 'evidence grader',
    task: 'Grade all upstream findings by evidence quality: systematic review, RCT, cohort, case study, expert opinion. Assign confidence levels.',
    focus: 'findings',
  },

  /* ═══ ASSESS (5) ═══ */
  'Clinical Summary': {
    role: 'clinical summarizer',
    task: 'Synthesize all pipeline findings, flags, and values into a clear clinical summary. Highlight critical flags and key findings.',
    focus: 'findings',
  },
  'Treatment Recommendation': {
    role: 'treatment planner',
    task: 'Based on all upstream analysis, recommend specific treatment protocols with compounds, dosing, timing, and monitoring parameters.',
    focus: 'findings',
  },
  'Patient Report': {
    role: 'clinical report writer',
    task: 'Generate a patient-facing report summarizing condition, treatment plan, and follow-up instructions in accessible language.',
    focus: 'findings',
  },
  'Data Export': {
    role: 'data formatter',
    task: 'Structure all pipeline findings into exportable format with complete data fields, values, and cross-references.',
    focus: 'values',
  },
  'Audit Trail': {
    role: 'audit documenter',
    task: 'Document the complete analytical pathway: which nodes executed, what each found, confidence levels, and reasoning chains.',
    focus: 'findings',
  },

  /* ═══ CORE ═══ */
  'CortixEngine': {
    role: 'clinical reasoning engine',
    task: 'Analyze the provided clinical data using multi-variable reasoning. Identify patterns, correlations, and clinically significant findings.',
    focus: 'findings',
  },

  /* ═══ ORGANIZE (Filter only — Splitter/Merger/Combine are programmatic) ═══ */
  'Filter': {
    role: 'clinical data filter',
    task: 'Review the upstream data and filter for clinically relevant items only. Remove noise, duplicates, and low-confidence findings. Present filtered results for clinician review.',
    focus: 'findings',
  },

  /* ═══════════════════════════════════════════════════
     CORTIXHEALTH NODES (wellness vertical)
     ═══════════════════════════════════════════════════ */

  /* ═══ CORTIXHEALTH CORE ═══ */
  'CortixHealth': {
    role: 'wellness reasoning engine',
    task: 'Analyze health data and provide evidence-based wellness guidance. Use plain English. Every recommendation must be traceable to research.',
    focus: 'findings',
  },

  /* ═══ NUTRITION ═══ */
  'Meal Planner': {
    role: 'nutrition specialist',
    task: 'Create personalized weekly meal plans aligned with dietary goals, restrictions, allergies, and macro targets. Include preparation guidance.',
    focus: 'findings',
  },
  'Supplement Stack Builder': {
    role: 'supplement specialist',
    task: 'Design evidence-based daily supplement stacks based on health goals and nutrient gaps. Include dosing, timing, and interaction notes.',
    focus: 'findings',
  },
  'Nutrient Gap Analysis': {
    role: 'nutritional analyst',
    task: 'Identify nutritional deficiencies from current diet. Recommend food-based solutions first, supplements second. Provide evidence.',
    focus: 'findings',
  },
  'Hydration Tracker': {
    role: 'hydration specialist',
    task: 'Calculate personalized daily hydration needs based on activity level, climate, body weight, and health conditions.',
    focus: 'values',
  },
  'Calorie & Macro Calculator': {
    role: 'nutrition calculator',
    task: 'Compute personalized calorie and macronutrient targets based on goals, activity level, and body composition.',
    focus: 'values',
  },

  /* ═══ MOVEMENT ═══ */
  'Exercise Routine': {
    role: 'fitness specialist',
    task: 'Design custom exercise routines based on fitness level, goals, available equipment, and time constraints. Include warm-up and cool-down.',
    focus: 'findings',
  },
  'Recovery Protocol': {
    role: 'recovery specialist',
    task: 'Design recovery protocols combining nutrition, rest, supplementation, and gentle movement. Consider the type and intensity of activity.',
    focus: 'findings',
  },
  'Flexibility Program': {
    role: 'mobility specialist',
    task: 'Design flexibility and mobility programs for injury prevention, range of motion improvement, and overall wellness.',
    focus: 'findings',
  },
  'Sleep Optimization': {
    role: 'sleep specialist',
    task: 'Optimize sleep through evening routines, supplement timing, environment adjustments, and habit modifications backed by research.',
    focus: 'findings',
  },
  'Stress Management': {
    role: 'stress management specialist',
    task: 'Recommend adaptogen protocols, breathing techniques, and lifestyle modifications for stress reduction. All recommendations backed by research.',
    focus: 'findings',
  },

  /* ═══ REMEDIES ═══ */
  'Herbal Formulation': {
    role: 'herbal medicine specialist',
    task: 'Recommend evidence-based herbal combinations with preparation methods, dosing guidance, and contraindications. Cite traditional and clinical evidence separately.',
    focus: 'findings',
  },
  'Homeopathic Remedy Finder': {
    role: 'homeopathic specialist',
    task: 'Match symptoms to homeopathic remedies with potency guidance. Be honest about evidence levels. Note traditional use separately from clinical evidence.',
    focus: 'findings',
  },
  'Essential Oil Protocol': {
    role: 'aromatherapy specialist',
    task: 'Recommend essential oil protocols with safety guidelines, dilution ratios, application methods, and contraindications.',
    focus: 'findings',
  },
  'Mineral Balance': {
    role: 'mineral balance specialist',
    task: 'Analyze mineral intake patterns and recommend adjustments based on symptoms, lab values, and cofactor dependencies.',
    focus: 'findings',
  },
  'Detox Support': {
    role: 'detoxification specialist',
    task: 'Design evidence-based detox support protocols. No pseudoscience. Focus on liver support, hydration, fiber, and evidence-backed compounds.',
    focus: 'findings',
  },
  'Immune Support': {
    role: 'immune support specialist',
    task: 'Design seasonal or reactive immune support protocols with supplements, herbs, and lifestyle adjustments. Evidence-based only.',
    focus: 'findings',
  },

  /* ═══ HEALTH SAFETY ═══ */
  'Supplement-Drug Screening': {
    role: 'supplement safety screener',
    task: 'Cross-reference all supplements against prescription and OTC medications for known interactions. Flag severity and mechanism.',
    focus: 'flags',
  },
  'Pregnancy & Nursing Flags': {
    role: 'pregnancy safety specialist',
    task: 'Screen all compounds for pregnancy and nursing safety. Flag anything not established as safe. Err on the side of caution.',
    focus: 'flags',
  },
  'Contraindication Alerts': {
    role: 'contraindication screener',
    task: 'Flag health conditions where specific supplements or remedies are not recommended. Include absolute and relative contraindications.',
    focus: 'flags',
  },
  'Upper Limit Monitor': {
    role: 'dosage safety monitor',
    task: 'Track cumulative intake of all supplements against established tolerable upper limits. Flag any values approaching or exceeding limits.',
    focus: 'flags',
  },

  /* ═══ HEALTH RESULTS ═══ */
  'Wellness Summary': {
    role: 'wellness summarizer',
    task: 'Synthesize all pipeline findings into a clear, friendly wellness summary. Highlight key recommendations and any safety flags.',
    focus: 'findings',
  },
  'Progress Report': {
    role: 'progress analyst',
    task: 'Compare before-and-after data with actionable next steps. Highlight improvements and areas needing attention.',
    focus: 'findings',
  },
  'Shopping List': {
    role: 'shopping list generator',
    task: 'Generate organized shopping lists from meal plans and supplement stacks. Group by store section. Include quantities.',
    focus: 'values',
  },
  'Weekly Schedule': {
    role: 'schedule organizer',
    task: 'Combine meal plans, supplement timing, exercise routines, and wellness activities into one clear weekly schedule.',
    focus: 'findings',
  },
  'Export Plan': {
    role: 'plan exporter',
    task: 'Structure all wellness plans into a clean, exportable format. Include supplement protocols, meal plans, and exercise routines.',
    focus: 'values',
  },

  /* ═══ BIOMETRICS ═══ */
  'HRV Interpreter': {
    role: 'HRV analyst',
    task: 'Interpret heart rate variability data in context of autonomic nervous system balance, stress load, and recovery status. Flag concerning trends and recommend adjustments.',
    focus: 'findings',
  },
  'Sleep Analyzer': {
    role: 'sleep data analyst',
    task: 'Interpret sleep stage distribution, efficiency, latency, and disturbances. Identify patterns affecting deep sleep and REM. Correlate with supplement timing and lifestyle factors.',
    focus: 'findings',
  },
  'Readiness Score': {
    role: 'readiness analyst',
    task: 'Synthesize HRV, sleep quality, resting heart rate, and skin temperature into an actionable daily readiness assessment. Recommend activity intensity and recovery priorities.',
    focus: 'values',
  },
  'Strain Monitor': {
    role: 'strain analyst',
    task: 'Assess cumulative physical and mental strain from activity, sleep debt, and stress markers. Flag overtraining risk. Recommend deload or recovery protocols.',
    focus: 'flags',
  },

  /* ═══ KNOWLEDGE ═══ */
  'Knowledge Query': {
    role: 'knowledge graph query engine',
    task: 'Query verified compound databases for relationships, interactions, bioavailability data, cofactor dependencies, and contraindications. Return structured, sourced results only.',
    focus: 'findings',
  },
  'Deficiency Mapper': {
    role: 'deficiency analyst',
    task: 'Map symptom clusters to potential nutrient deficiencies using verified medical knowledge. Rank by likelihood. Include recommended lab tests to confirm. Cross-reference with current supplement intake.',
    focus: 'findings',
  },

  /* ═══ COMMERCE ═══ */
  'Product Matcher': {
    role: 'product matching engine',
    task: 'Match supplement recommendations to specific verified products from approved manufacturers. Include dosage form, bioavailability notes, and any excipient concerns. Prioritize products with third-party testing.',
    focus: 'findings',
  },
  'Quality Verifier': {
    role: 'quality verification engine',
    task: 'Validate product quality certifications: GMP compliance, Certificate of Analysis, third-party testing (USP, NSF, ConsumerLab), heavy metal testing, and manufacturer provenance.',
    focus: 'flags',
  },
  'Price Optimizer': {
    role: 'price optimization engine',
    task: 'Compare pricing across verified suppliers for recommended products. Factor in per-serving cost, subscription discounts, and shipping. Recommend best value without compromising quality verification.',
    focus: 'values',
  },
  'Order Builder': {
    role: 'order generation engine',
    task: 'Compile all recommended verified products into a complete order with quantities, dosing schedule, monthly cost estimate, and reorder timing.',
    focus: 'values',
  },
  'Protocol Card': {
    role: 'protocol formatter',
    task: 'Format the complete wellness protocol into a clean, shareable card: supplements with verified product links, dosing, timing, meal plan summary, exercise schedule, and safety notes.',
    focus: 'findings',
  },
};
