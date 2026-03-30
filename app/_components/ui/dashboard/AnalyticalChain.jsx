'use client'
import React, { useEffect, useCallback, useState, useRef } from 'react'
import {
  ReactFlow, Background, Handle, Position,
  useNodesState, useEdgesState,
  ReactFlowProvider, useReactFlow,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useMetoStore } from '@/app/_lib/store/metoStore'

const STORAGE_KEY = 'pj_banner_node_positions'
const DOSE_STORAGE_KEY = 'pj_dose_pipeline_state'

// ─── Protocol data (from protocols page) ─────────────────────────────────────
const PROTOCOLS = [
  // Clinical / widely used
  { id:'bpc157',     label:'BPC-157',       category:'Healing',         vialMg:5,    reconMl:2,   doseMcg:250,  freq:'daily',    route:'SC',          cycleWeeks:8  },
  { id:'tb500',      label:'TB-500',         category:'Healing',         vialMg:5,    reconMl:2,   doseMcg:2000, freq:'2x/week',  route:'SC',          cycleWeeks:6  },
  { id:'ghkcu',      label:'GHK-Cu',         category:'Longevity',       vialMg:50,   reconMl:5,   doseMcg:1000, freq:'daily',    route:'SC/topical',  cycleWeeks:12 },
  { id:'pda',        label:'PDA',            category:'Healing',         vialMg:5,    reconMl:2,   doseMcg:250,  freq:'daily',    route:'SC/oral',     cycleWeeks:8  },
  { id:'mgf',        label:'MGF',            category:'Healing',         vialMg:2,    reconMl:1,   doseMcg:100,  freq:'3x/week',  route:'SC/IM',       cycleWeeks:6  },
  { id:'semax',      label:'Semax',          category:'Cognitive',       vialMg:30,   reconMl:3,   doseMcg:400,  freq:'daily',    route:'Intranasal',  cycleWeeks:4  },
  { id:'selank',     label:'Selank',         category:'Cognitive',       vialMg:5,    reconMl:1,   doseMcg:250,  freq:'daily',    route:'Intranasal',  cycleWeeks:4  },
  { id:'kpv',        label:'KPV',            category:'Anti-inflam.',    vialMg:10,   reconMl:2,   doseMcg:250,  freq:'daily',    route:'SC/oral',     cycleWeeks:8  },
  { id:'pt141',      label:'PT-141',         category:'Sexual Health',   vialMg:10,   reconMl:2,   doseMcg:1750, freq:'as needed',route:'SC',          cycleWeeks:0  },
  { id:'cjc1295',    label:'CJC-1295',       category:'GH Secretagogue', vialMg:2,    reconMl:1,   doseMcg:100,  freq:'3x/week',  route:'SC',          cycleWeeks:12 },
  { id:'ipamorelin', label:'Ipamorelin',     category:'GH Secretagogue', vialMg:2,    reconMl:1,   doseMcg:200,  freq:'daily',    route:'SC',          cycleWeeks:12 },
  { id:'ghrp2',      label:'GHRP-2',         category:'GH Secretagogue', vialMg:5,    reconMl:2,   doseMcg:100,  freq:'3x/day',   route:'SC',          cycleWeeks:8  },
  { id:'sermorelin', label:'Sermorelin',     category:'GH Secretagogue', vialMg:6,    reconMl:3,   doseMcg:200,  freq:'daily',    route:'SC',          cycleWeeks:12 },
  { id:'tesamorelin',label:'Tesamorelin',    category:'GH Secretagogue', vialMg:1,    reconMl:0.5, doseMcg:2000, freq:'daily',    route:'SC',          cycleWeeks:26 },
  { id:'igf1lr3',    label:'IGF-1 LR3',      category:'GH/IGF',          vialMg:1,    reconMl:1,   doseMcg:50,   freq:'5x/week',  route:'SC/IM',       cycleWeeks:4  },
  { id:'igf1des',    label:'IGF-1 DES',      category:'GH/IGF',          vialMg:1,    reconMl:1,   doseMcg:50,   freq:'5x/week',  route:'IM',          cycleWeeks:4  },
  { id:'epithalon',  label:'Epithalon',      category:'Longevity',       vialMg:10,   reconMl:2,   doseMcg:5000, freq:'daily',    route:'SC',          cycleWeeks:2  },
  { id:'nad',        label:'NAD+',           category:'Longevity',       vialMg:500,  reconMl:5,   doseMcg:500000,freq:'daily',   route:'IV/SC',       cycleWeeks:4  },
  { id:'pinealon',   label:'Pinealon',       category:'Nootropic',       vialMg:10,   reconMl:2,   doseMcg:5000, freq:'daily',    route:'SC/IN',       cycleWeeks:2, exp:true },
  { id:'dihexa',     label:'Dihexa',         category:'Nootropic',       vialMg:10,   reconMl:2,   doseMcg:10000,freq:'daily',    route:'Oral/topical',cycleWeeks:8, exp:true },
  { id:'cerebrolysin',label:'Cerebrolysin',  category:'Nootropic',       vialMg:215,  reconMl:10,  doseMcg:5000, freq:'5x/week',  route:'IM/IV',       cycleWeeks:4  },
  { id:'ss31',       label:'SS-31',          category:'Mitochondrial',   vialMg:30,   reconMl:3,   doseMcg:10000,freq:'daily',    route:'SC',          cycleWeeks:12 },
  { id:'motsc',      label:'MOTS-c',         category:'Mitochondrial',   vialMg:10,   reconMl:2,   doseMcg:5000, freq:'3x/week',  route:'SC',          cycleWeeks:8  },
  { id:'humanin',    label:'Humanin',        category:'Mitochondrial',   vialMg:5,    reconMl:2,   doseMcg:2000, freq:'3x/week',  route:'SC',          cycleWeeks:8, exp:true },
  { id:'semaglutide',label:'Semaglutide',    category:'GLP-1',           vialMg:3,    reconMl:1.5, doseMcg:250,  freq:'weekly',   route:'SC',          cycleWeeks:52 },
  { id:'tirzepatide',label:'Tirzepatide',    category:'GLP-1/GIP',       vialMg:5,    reconMl:1,   doseMcg:2500, freq:'weekly',   route:'SC',          cycleWeeks:52 },
  { id:'bpc157tb500',label:'BPC-157 + TB-500',category:'Stack',          vialMg:5,    reconMl:2,   doseMcg:500,  freq:'daily',    route:'SC',          cycleWeeks:6  },
  { id:'ll37',       label:'LL-37',          category:'Immune',          vialMg:50,   reconMl:5,   doseMcg:100,  freq:'3x/week',  route:'SC',          cycleWeeks:8  },
  { id:'thymosin1',  label:'Thymosin α1',    category:'Immune',          vialMg:1.6,  reconMl:1,   doseMcg:1600, freq:'2x/week',  route:'SC',          cycleWeeks:6  },
  { id:'fox04dri',   label:'FOXO4-DRI',      category:'Senolytic',       vialMg:10,   reconMl:2,   doseMcg:1000, freq:'3x/week',  route:'SC/IV',       cycleWeeks:4, exp:true },

  // ── Fat Loss / Metabolic ──────────────────────────────────────────────────────
  { id:'amino1mq',   label:'5-Amino-1MQ',    category:'Metabolic',       vialMg:50,   reconMl:5,   doseMcg:50000, freq:'daily',   route:'Oral/SC',     cycleWeeks:8  },
  { id:'aod9604',    label:'AOD-9604',        category:'Fat Loss',        vialMg:5,    reconMl:3,   doseMcg:300,   freq:'daily',   route:'SC',          cycleWeeks:12 },
  { id:'hghfrag',    label:'HGH Frag 176-191',category:'Fat Loss',        vialMg:5,    reconMl:2,   doseMcg:500,   freq:'2x/day',  route:'SC',          cycleWeeks:12, exp:true },
  { id:'bam15',      label:'BAM15',           category:'Metabolic',       vialMg:5,    reconMl:2,   doseMcg:1000,  freq:'daily',   route:'Oral',        cycleWeeks:8,  exp:true },
  { id:'tesofensine',label:'Tesofensin',      category:'Metabolic',       vialMg:5,    reconMl:10,  doseMcg:500,   freq:'daily',   route:'Oral',        cycleWeeks:12 },
  { id:'slu332',     label:'SLU-PP-332',      category:'Exercise Mimetic',vialMg:5,    reconMl:3,   doseMcg:1000,  freq:'2x/day',  route:'Oral/SC',     cycleWeeks:8,  exp:true },
  { id:'mk677',      label:'MK-677 (Ibutamoren)',category:'GH Secretagogue',vialMg:250, reconMl:25, doseMcg:25000, freq:'daily',   route:'Oral',        cycleWeeks:16 },

  // ── GLP-1 / Weight Loss Advanced ─────────────────────────────────────────────
  { id:'cagrilintide',label:'Cagrilintide',   category:'Amylin Analog',   vialMg:5,    reconMl:3,   doseMcg:2400,  freq:'weekly',  route:'SC',          cycleWeeks:26 },
  { id:'retatrutide', label:'Retatrutide',    category:'GLP-1/GIP/Gcg',   vialMg:10,   reconMl:2,   doseMcg:4000,  freq:'weekly',  route:'SC',          cycleWeeks:24, exp:true },
  { id:'survodutide', label:'Survodutide',    category:'GLP-1/Glucagon',  vialMg:10,   reconMl:2,   doseMcg:6000,  freq:'weekly',  route:'SC',          cycleWeeks:26, exp:true },
  { id:'glp2',        label:'GLP-2',          category:'GI/Gut',          vialMg:5,    reconMl:2,   doseMcg:400,   freq:'daily',   route:'SC',          cycleWeeks:8  },

  // ── GH Secretagogues (additional) ────────────────────────────────────────────
  { id:'cjc1295dac', label:'CJC-1295 DAC',   category:'GH Secretagogue', vialMg:2,    reconMl:1,   doseMcg:2000,  freq:'2x/week', route:'SC',          cycleWeeks:12 },
  { id:'hexarelin',  label:'Hexarelin',       category:'GH Secretagogue', vialMg:2,    reconMl:1,   doseMcg:100,   freq:'3x/day',  route:'SC',          cycleWeeks:8  },
  { id:'ghrp6',      label:'GHRP-6',          category:'GH Secretagogue', vialMg:5,    reconMl:2,   doseMcg:100,   freq:'3x/day',  route:'SC',          cycleWeeks:8  },
  { id:'pegmgf',     label:'PEG-MGF',         category:'Muscle/Healing',  vialMg:2,    reconMl:2,   doseMcg:200,   freq:'2x/week', route:'SC',          cycleWeeks:6  },

  // ── Reproductive / Hormonal ───────────────────────────────────────────────────
  { id:'gonadorelin', label:'Gonadorelin',    category:'HPT Axis',        vialMg:2,    reconMl:2,   doseMcg:100,   freq:'3x/week', route:'SC',          cycleWeeks:12 },
  { id:'kisspeptin',  label:'Kisspeptin-10',  category:'Reproductive',    vialMg:10,   reconMl:2,   doseMcg:1000,  freq:'2x/week', route:'SC/IV',       cycleWeeks:8,  exp:true },
  { id:'oxytocin',    label:'Oxytocin',       category:'Hormonal',        vialMg:5,    reconMl:5,   doseMcg:10,    freq:'as needed',route:'SC/IN',      cycleWeeks:0  },

  // ── Skin / Aesthetic ──────────────────────────────────────────────────────────
  { id:'melanotan2',  label:'Melanotan II',   category:'Melanogenesis',   vialMg:10,   reconMl:2,   doseMcg:250,   freq:'daily',   route:'SC',          cycleWeeks:4  },
  { id:'snap8',       label:'Snap-8',         category:'Anti-aging/Skin', vialMg:200,  reconMl:20,  doseMcg:0,     freq:'daily',   route:'Topical',     cycleWeeks:12, exp:true },

  // ── Neuroprotection / Cognitive (additional) ──────────────────────────────────
  { id:'ara290',      label:'ARA-290',        category:'Neuroprotection', vialMg:15,   reconMl:1,   doseMcg:1500,  freq:'5x/week', route:'SC',          cycleWeeks:8,  exp:true },
  { id:'pe2228',      label:'PE-22-28',       category:'Antidepressant',  vialMg:10,   reconMl:2,   doseMcg:500,   freq:'daily',   route:'SC/IN',       cycleWeeks:8,  exp:true },
  { id:'p21',         label:'P21',            category:'Nootropic',       vialMg:10,   reconMl:2,   doseMcg:100,   freq:'daily',   route:'IN',          cycleWeeks:4,  exp:true },
  { id:'dsip',        label:'DSIP',           category:'Sleep',           vialMg:5,    reconMl:2,   doseMcg:200,   freq:'nightly', route:'SC/IN',       cycleWeeks:4  },
  { id:'methyleneblue',label:'Methylene Blue', category:'Mitochondrial',  vialMg:500,  reconMl:50,  doseMcg:50000, freq:'daily',   route:'Oral/IV',     cycleWeeks:8  },
  { id:'melatonin',   label:'Melatonin',      category:'Sleep/Circadian', vialMg:10,   reconMl:10,  doseMcg:3000,  freq:'nightly', route:'Oral/SC',     cycleWeeks:0  },

  // ── Immune / Thymic ───────────────────────────────────────────────────────────
  { id:'thymalin',    label:'Thymalin',       category:'Thymic/Immune',   vialMg:10,   reconMl:1,   doseMcg:5000,  freq:'daily',   route:'SC',          cycleWeeks:1  },
  { id:'at11',        label:'Alpha Thymosin 11 (AT11)',category:'Immune', vialMg:10,   reconMl:2,   doseMcg:5000,  freq:'3x/week', route:'SC',          cycleWeeks:6,  exp:true },
  { id:'thymosinb4',  label:'Thymosin Beta-4',category:'Healing/Immune',  vialMg:5,    reconMl:2,   doseMcg:2000,  freq:'2x/week', route:'SC',          cycleWeeks:6  },
  { id:'tb4frag14',   label:'TB4 Frag 1-4',   category:'Healing',         vialMg:5,    reconMl:2,   doseMcg:500,   freq:'daily',   route:'SC',          cycleWeeks:8,  exp:true },
  { id:'tb4frag1723', label:'TB4 Frag 17-23', category:'Healing',         vialMg:5,    reconMl:2,   doseMcg:500,   freq:'daily',   route:'SC',          cycleWeeks:8,  exp:true },

  // ── Longevity (additional) ────────────────────────────────────────────────────
  { id:'naepithalon', label:'NA-Epithalon Amidate',category:'Longevity',  vialMg:50,   reconMl:5,   doseMcg:5000,  freq:'daily',   route:'SC',          cycleWeeks:2  },
  { id:'namotsc',     label:'NA-MOTS-C',      category:'Mitochondrial',   vialMg:10,   reconMl:2,   doseMcg:5000,  freq:'3x/week', route:'SC',          cycleWeeks:8,  exp:true },
  { id:'betanad',     label:'β-NAD+',         category:'Longevity',       vialMg:500,  reconMl:5,   doseMcg:500000,freq:'daily',   route:'SC/IV',       cycleWeeks:4  },

  // ── Experimental / Research ───────────────────────────────────────────────────
  { id:'ace031',      label:'ACE-031',        category:'Myostatin Inhibitor',vialMg:1, reconMl:1,   doseMcg:1000,  freq:'2x/week', route:'SC',          cycleWeeks:12, exp:true },
  { id:'pnc27',       label:'PNC-27',         category:'Anti-tumor',      vialMg:10,   reconMl:2,   doseMcg:1000,  freq:'3x/week', route:'SC/IV',       cycleWeeks:8,  exp:true },
  { id:'curcumin',    label:'Curcumin (inj.)',category:'Anti-inflammatory',vialMg:200, reconMl:10,  doseMcg:100000,freq:'3x/week', route:'IV/IM',       cycleWeeks:8  },
  { id:'test_cyp',   label:'Test. Cypionate', category:'Testosterone',    vialMg:2000, reconMl:10,  doseMcg:100000,freq:'2x/week', route:'IM/SC',       cycleWeeks:52 },
  { id:'test_enan',  label:'Test. Enanthate', category:'Testosterone',    vialMg:2000, reconMl:10,  doseMcg:100000,freq:'2x/week', route:'IM/SC',       cycleWeeks:52 },
  { id:'test_prop',  label:'Test. Propionate',category:'Testosterone',    vialMg:1000, reconMl:10,  doseMcg:50000, freq:'EOD',     route:'IM',          cycleWeeks:10 },
  { id:'sustanon',   label:'Sustanon 250',    category:'Testosterone',    vialMg:250,  reconMl:1,   doseMcg:250000,freq:'EOD',     route:'IM',          cycleWeeks:10 },
  { id:'nebido',     label:'Nebido (TU)',      category:'Testosterone',    vialMg:1000, reconMl:4,   doseMcg:1000000,freq:'10wk',   route:'IM',          cycleWeeks:52 },
  { id:'test_gel',   label:'Testosterone Gel',category:'Testosterone',    vialMg:50,   reconMl:5,   doseMcg:50000, freq:'daily',   route:'Topical',     cycleWeeks:52 },

  // ── Anabolic / Androgenic Compounds ─────────────────────────────────────────
  { id:'winstrol_oral', label:'Winstrol (oral)',  category:'Anabolic',    vialMg:500,  reconMl:50,  doseMcg:40000, freq:'daily',   route:'Oral',        cycleWeeks:6  },
  { id:'winstrol_inj',  label:'Winstrol (inj.)', category:'Anabolic',    vialMg:500,  reconMl:10,  doseMcg:50000, freq:'EOD',     route:'IM/SC',       cycleWeeks:6  },
  { id:'deca',       label:'Deca-Durabolin',  category:'Anabolic',        vialMg:2000, reconMl:10,  doseMcg:200000,freq:'weekly',  route:'IM',          cycleWeeks:14 },
  { id:'npp',        label:'NPP (Nandrolone)',category:'Anabolic',        vialMg:1000, reconMl:10,  doseMcg:100000,freq:'EOD',     route:'IM',          cycleWeeks:10 },
  { id:'equipoise',  label:'Equipoise (EQ)',  category:'Anabolic',        vialMg:2000, reconMl:10,  doseMcg:400000,freq:'weekly',  route:'IM',          cycleWeeks:14 },
  { id:'anavar',     label:'Anavar (Oxandrolone)',category:'Anabolic',    vialMg:400,  reconMl:40,  doseMcg:40000, freq:'daily',   route:'Oral',        cycleWeeks:8  },
  { id:'dianabol',   label:'Dianabol (Dbol)', category:'Anabolic',        vialMg:300,  reconMl:30,  doseMcg:30000, freq:'daily',   route:'Oral',        cycleWeeks:5  },
  { id:'masteron',   label:'Masteron (Prop)', category:'Anabolic',        vialMg:1000, reconMl:10,  doseMcg:100000,freq:'EOD',     route:'IM',          cycleWeeks:10 },
  { id:'primobolan', label:'Primobolan',      category:'Anabolic',        vialMg:1000, reconMl:10,  doseMcg:400000,freq:'weekly',  route:'IM',          cycleWeeks:12 },
  { id:'tren_ace',   label:'Trenbolone Ace',  category:'Anabolic',        vialMg:1000, reconMl:10,  doseMcg:100000,freq:'EOD',     route:'IM',          cycleWeeks:8  },
  { id:'anadrol',    label:'Anadrol (Oxy)',   category:'Anabolic',        vialMg:500,  reconMl:10,  doseMcg:50000, freq:'daily',   route:'Oral',        cycleWeeks:5  },

  // ── PCT — SERMs ──────────────────────────────────────────────────────────────
  { id:'nolvadex',   label:'Nolvadex (Tamox.)',category:'PCT · SERM',     vialMg:600,  reconMl:60,  doseMcg:20000, freq:'daily',   route:'Oral',        cycleWeeks:4  },
  { id:'clomid',     label:'Clomid (Clomiphene)',category:'PCT · SERM',   vialMg:1500, reconMl:30,  doseMcg:50000, freq:'daily',   route:'Oral',        cycleWeeks:4  },
  { id:'enclomiphene',label:'Enclomiphene',   category:'PCT · SERM',      vialMg:750,  reconMl:30,  doseMcg:25000, freq:'daily',   route:'Oral',        cycleWeeks:5  },

  // ── PCT — Aromatase Inhibitors ───────────────────────────────────────────────
  { id:'arimidex',   label:'Arimidex (Anastrozole)',category:'PCT · AI',  vialMg:14,   reconMl:28,  doseMcg:500,   freq:'EOD',     route:'Oral',        cycleWeeks:12 },
  { id:'aromasin',   label:'Aromasin (Exemestane)',category:'PCT · AI',   vialMg:375,  reconMl:30,  doseMcg:12500, freq:'EOD',     route:'Oral',        cycleWeeks:8  },
  { id:'letrozole',  label:'Letrozole (Femara)',category:'PCT · AI',      vialMg:75,   reconMl:30,  doseMcg:2500,  freq:'EOD',     route:'Oral',        cycleWeeks:6  },

  // ── PCT — Gonadotropins & Support ────────────────────────────────────────────
  { id:'hcg',        label:'HCG',             category:'PCT · Gonado.',   vialMg:5000, reconMl:5,   doseMcg:500000,freq:'EOD',     route:'SC',          cycleWeeks:2  },
  { id:'dhea',       label:'DHEA',            category:'PCT · Support',   vialMg:1500, reconMl:30,  doseMcg:50000, freq:'daily',   route:'Oral',        cycleWeeks:8  },
  { id:'ashwagandha',label:'Ashwagandha (KSM)',category:'PCT · Support',  vialMg:18000,reconMl:60,  doseMcg:300000,freq:'daily',   route:'Oral',        cycleWeeks:8  },
]

// Freq → injections per week
const FREQ_PER_WEEK = {
  'daily': 7, '2x/week': 2, '3x/week': 3, '5x/week': 5,
  'weekly': 1, 'as needed': 1, '3x/day': 21, 'EOD': 3.5, '10wk': 0.1,
  'nightly': 7, '2x/day': 14,
}

// ─── Meto constants ───────────────────────────────────────────────────────────
const TRIADS = [
  { id:'energy',     label:'Energy',        color:'#fabd2f', icon:'EN' },
  { id:'resiliency', label:'Resiliency',     color:'#b8bb26', icon:'RS' },
  { id:'endurance',  label:'Endurance',      color:'#83a598', icon:'ED' },
  { id:'detox',      label:'Detoxification', color:'#d3869b', icon:'DX' },
  { id:'potency',    label:'Potency',        color:'#fe8019', icon:'PT' },
]
const RC = { low:'#b8bb26', moderate:'#fabd2f', high:'#fb4934' }
const hw = (c) => ({ width:7,height:7,background:'var(--gb-bg)',border:`1.5px solid ${c}88`,borderRadius:'50%' })
const HW = { width:7,height:7,background:'var(--gb-bg)',border:'1.5px solid var(--gb-bg-3)',borderRadius:'50%' }
const AC = '#458588' // accent color for dose pipeline

// ─── Default positions ────────────────────────────────────────────────────────
const DEFAULT_POSITIONS = {
  in_subject:    { x: 320, y: 20  },
  in_vitals:     { x: 320, y: 68  },
  in_lifestyle:  { x: 320, y: 116 },
  in_symptoms:   { x: 320, y: 164 },
  in_labs:       { x: 320, y: 212 },
  engine:        { x: 480, y: 100 },
  tr_energy:     { x: 650, y: 10  },
  tr_resiliency: { x: 650, y: 62  },
  tr_endurance:  { x: 650, y: 114 },
  tr_detox:      { x: 650, y: 166 },
  tr_potency:    { x: 650, y: 218 },
  overall:       { x: 830, y: 100 },
  dose_lookup:   { x: 1050, y: 10  },
  dose_config:   { x: 1220, y: 10  },
  dose_calc:     { x: 1390, y: 10  },
  dose_schedule: { x: 1220, y: 140 },
}

function loadPositions() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}') } catch { return {} }
}
function savePositions(p) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)) } catch {}
}
function loadDoseState() {
  try { return JSON.parse(localStorage.getItem(DOSE_STORAGE_KEY)||'null') } catch { return null }
}
function saveDoseState(s) {
  try { localStorage.setItem(DOSE_STORAGE_KEY, JSON.stringify(s)) } catch {}
}

// ─── Dose calculation ─────────────────────────────────────────────────────────
function calcDose(protocol, overrides={}) {
  const p = { ...protocol, ...overrides }
  const concMcgPerMl = (p.vialMg * 1000) / p.reconMl        // mcg/ml
  const concMcgPerUnit = concMcgPerMl / 100                  // mcg per IU (insulin syringe)
  const unitsPerDose = p.doseMcg / concMcgPerUnit            // IU per injection
  const mlPerDose = p.doseMcg / concMcgPerMl                 // ml per injection
  const perWeek = FREQ_PER_WEEK[p.freq] || 1
  const dosePerWeekMcg = p.doseMcg * perWeek
  const totalDoses = p.cycleWeeks > 0 ? Math.ceil(p.cycleWeeks * perWeek) : null
  const vialsNeeded = totalDoses ? Math.ceil((p.doseMcg * totalDoses) / (p.vialMg * 1000)) : null
  return { concMcgPerMl, unitsPerDose, mlPerDose, perWeek, dosePerWeekMcg, totalDoses, vialsNeeded }
}

function getScheduleDays(freq) {
  const map = {
    'daily':    [0,1,2,3,4,5,6],
    '2x/week':  [1,4],
    '3x/week':  [1,3,5],
    '5x/week':  [1,2,3,4,5],
    'weekly':   [1],
    'as needed':[],
    '3x/day':   [0,1,2,3,4,5,6],
    'EOD':      [0,2,4,6],
  }
  return map[freq] || []
}

// ─── Node styles ──────────────────────────────────────────────────────────────
const nodeBase = (active=true) => ({
  background: active ? `${AC}12` : 'var(--gb-bg-soft)',
  border: `1px solid ${active ? AC+'44' : 'rgba(255,255,255,0.08)'}`,
  borderRadius: 8,
  padding: '5px 8px',
  minWidth: 150,
  transition: 'all 0.3s',
  fontFamily: 'monospace',
})
const labelStyle = { fontSize:6, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:`${AC}99`, marginBottom:3 }
const valueStyle = { fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.85)' }
const dimStyle   = { fontSize:8,  color:'rgba(255,255,255,0.35)' }

// ─── NODE: Protocol Lookup ────────────────────────────────────────────────────
function ProtocolLookupNode({ data }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const filtered = PROTOCOLS.filter(p =>
    p.label.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )
  const selected = PROTOCOLS.find(p => p.id === data.selectedId)
  return (
    <div style={{...nodeBase(!!selected), minWidth:155, position:'relative'}}>
      <Handle type="source" position={Position.Right} style={hw(AC)}/>
      <div style={labelStyle}>Protocol</div>
      <div
        onClick={()=>setOpen(o=>!o)}
        style={{fontSize:9,fontWeight:600,color:selected?'rgba(255,255,255,0.9)':'rgba(255,255,255,0.3)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'space-between',gap:4,padding:'2px 0'}}
      >
        <span>{selected ? selected.label : 'Select protocol...'}</span>
        <span style={{fontSize:7,color:`${AC}88`}}>{open?'▲':'▼'}</span>
      </div>
      {selected && <div style={{...dimStyle,marginTop:2}}>{selected.category} · {selected.freq}</div>}
      {open && (
        <div style={{position:'absolute',top:'100%',left:0,zIndex:99999,background:'#1a1d24',border:`1px solid ${AC}44`,borderRadius:8,minWidth:200,maxHeight:180,overflowY:'auto',boxShadow:'0 8px 32px rgba(0,0,0,0.8)',marginTop:4}} onClick={e=>e.stopPropagation()}>
          <input
            autoFocus
            value={search}
            onChange={e=>setSearch(e.target.value)}
            placeholder="Search..."
            style={{width:'100%',background:'transparent',border:'none',borderBottom:`1px solid ${AC}33`,padding:'5px 8px',color:'rgba(255,255,255,0.8)',fontSize:9,outline:'none',boxSizing:'border-box'}}
          />
          {filtered.map(p=>(
            <div key={p.id}
              onClick={()=>{ data.onSelect(p.id); setOpen(false); setSearch('') }}
              style={{padding:'4px 8px',cursor:'pointer',fontSize:9,color:p.id===data.selectedId?AC:'rgba(255,255,255,0.6)',background:p.id===data.selectedId?`${AC}18`:'transparent',display:'flex',justifyContent:'space-between',gap:8}}
              onMouseEnter={e=>e.currentTarget.style.background=`${AC}11`}
              onMouseLeave={e=>e.currentTarget.style.background=p.id===data.selectedId?`${AC}18`:'transparent'}
            >
              <span>{p.label}</span>
              <span style={{color:'rgba(255,255,255,0.25)',fontSize:8}}>{p.exp ? 'PRECLINICAL' : p.category}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── NODE: Vial Config ────────────────────────────────────────────────────────
function VialConfigNode({ data }) {
  const active = !!data.protocol
  const p = data.protocol
  return (
    <div style={{...nodeBase(active), minWidth:145}}>
      <Handle type="target" position={Position.Left} style={hw(AC)}/>
      <Handle type="source" position={Position.Right} style={hw(AC)}/>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:3}}>
        <div style={labelStyle}>Vial Config</div>
        {p?.exp && <div style={{fontSize:6,fontWeight:700,letterSpacing:'0.1em',color:'rgba(255,255,255,0.25)'}}>PRECLINICAL</div>}
      </div>
      {!active ? (
        <div style={dimStyle}>Select protocol first</div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:2}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span style={dimStyle}>Vial</span>
            <span style={{...valueStyle,fontSize:9}}>{p.vialMg}mg</span>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span style={dimStyle}>Recon</span>
            <span style={{...valueStyle,fontSize:9}}>{p.reconMl}mL BAC</span>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span style={dimStyle}>Conc.</span>
            <span style={{...valueStyle,fontSize:9,color:AC}}>{((p.vialMg*1000)/p.reconMl).toFixed(0)} mcg/mL</span>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span style={dimStyle}>Route</span>
            <span style={{...valueStyle,fontSize:8}}>{p.route}</span>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── NODE: Dose Calculator ────────────────────────────────────────────────────
function DoseCalcNode({ data }) {
  const active = !!data.protocol
  const p = data.protocol
  const calc = active ? calcDose(p) : null
  return (
    <div style={{...nodeBase(active), minWidth:155}}>
      <Handle type="target" position={Position.Left} style={hw(AC)}/>
      <Handle type="source" position={Position.Bottom} style={hw(AC)}/>
      <div style={labelStyle}>Dose Calculator</div>
      {!active ? (
        <div style={dimStyle}>Awaiting config</div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:2}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span style={dimStyle}>Dose</span>
            <span style={{...valueStyle,fontSize:9}}>{p.doseMcg >= 1000 ? `${(p.doseMcg/1000).toFixed(2)}mg` : `${p.doseMcg}mcg`}</span>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span style={dimStyle}>Syringe</span>
            <span style={{...valueStyle,fontSize:11,color:AC}}>{calc.unitsPerDose.toFixed(1)} IU</span>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span style={dimStyle}>Volume</span>
            <span style={{...valueStyle,fontSize:9}}>{calc.mlPerDose.toFixed(3)} mL</span>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span style={dimStyle}>Frequency</span>
            <span style={{...valueStyle,fontSize:9}}>{p.freq}</span>
          </div>
          {p.cycleWeeks > 0 && (
            <div style={{borderTop:`1px solid ${AC}22`,marginTop:2,paddingTop:2,display:'flex',justifyContent:'space-between'}}>
              <span style={dimStyle}>Vials/cycle</span>
              <span style={{...valueStyle,fontSize:9,color:'#fabd2f'}}>{calc.vialsNeeded}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── NODE: Injection Schedule ─────────────────────────────────────────────────
function ScheduleNode({ data }) {
  const active = !!data.protocol
  const p = data.protocol
  const days = ['S','M','T','W','T','F','S']
  const injectDays = active ? getScheduleDays(p.freq) : []
  const today = new Date().getDay()
  const calc = active ? calcDose(p) : null
  return (
    <div style={{...nodeBase(active), minWidth:175}}>
      <Handle type="target" position={Position.Top} style={hw(AC)}/>
      <div style={labelStyle}>Injection Schedule</div>
      {!active ? (
        <div style={dimStyle}>No protocol selected</div>
      ) : (
        <>
          <div style={{display:'flex',gap:3,marginBottom:4}}>
            {days.map((d,i)=>{
              const isInject = injectDays.includes(i)
              const isToday = i === today
              return (
                <div key={i} style={{
                  width:18,height:18,borderRadius:4,display:'flex',alignItems:'center',justifyContent:'center',
                  fontSize:7,fontWeight:700,
                  background: isInject ? (isToday?AC:`${AC}33`) : 'rgba(255,255,255,0.04)',
                  color: isInject ? (isToday?'#000':'rgba(255,255,255,0.8)') : 'rgba(255,255,255,0.2)',
                  border: isToday ? `1px solid ${AC}` : '1px solid transparent',
                }}>
                  {d}
                </div>
              )
            })}
          </div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:2}}>
            <span style={dimStyle}>Weekly dose</span>
            <span style={{...valueStyle,fontSize:9}}>{calc.dosePerWeekMcg >= 1000 ? `${(calc.dosePerWeekMcg/1000).toFixed(1)}mg` : `${calc.dosePerWeekMcg}mcg`}</span>
          </div>
          {p.cycleWeeks > 0 && (
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={dimStyle}>Cycle</span>
              <span style={{...valueStyle,fontSize:9}}>{p.cycleWeeks}wk · {calc.totalDoses} injections</span>
            </div>
          )}
          <a href={`/protocols`} style={{display:'block',marginTop:4,textAlign:'center',fontSize:7,color:`${AC}99`,letterSpacing:'0.1em',textTransform:'uppercase',textDecoration:'none',borderTop:`1px solid ${AC}22`,paddingTop:3}}>
            Full Protocol →
          </a>
        </>
      )}
    </div>
  )
}

// ─── Meto nodes (unchanged) ───────────────────────────────────────────────────
function MiniInputNode({ data }) {
  const c = data.color||'#665c54', f = data.filled||false
  return (
    <div style={{background:f?`${c}18`:'var(--gb-bg-soft)',border:`1px solid ${f?c:'var(--gb-bg-2)'}`,borderRadius:7,padding:'4px 8px',minWidth:90,transition:'all 0.4s'}}>
      <Handle type="source" position={Position.Right} style={hw(c)}/>
      <div style={{display:'flex',alignItems:'center',gap:5}}>
        <div style={{width:16,height:16,borderRadius:4,background:`${c}${f?'28':'12'}`,border:`1px solid ${c}${f?'55':'22'}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:6,fontWeight:800,color:f?c:`${c}55`,flexShrink:0}}>{data.icon}</div>
        <div>
          <div style={{fontSize:8,fontWeight:600,color:f?'var(--gb-fg-1)':'var(--gb-fg-4)'}}>{data.label}</div>
          <div style={{fontSize:6,color:f?`${c}aa`:'var(--gb-bg-4)'}}>{f?'Ready':'Pending'}</div>
        </div>
      </div>
    </div>
  )
}
function MiniEngineNode({ data }) {
  const a = data.active||false
  return (
    <div style={{background:a?'var(--gb-bg-1)':'var(--gb-bg-soft)',border:`1.5px solid ${a?'var(--gb-fg-3)':'var(--gb-bg-2)'}`,borderRadius:10,minWidth:110,padding:'6px 10px',textAlign:'center',transition:'all 0.5s'}}>
      <Handle type="target" position={Position.Left} style={HW}/>
      <Handle type="source" position={Position.Right} style={HW}/>
      <div style={{fontSize:6,fontWeight:700,letterSpacing:'0.15em',textTransform:'uppercase',color:a?'var(--gb-fg-4)':'var(--gb-bg-4)',marginBottom:2}}>Engine</div>
      <div style={{fontSize:9,fontWeight:800,color:a?'var(--gb-fg-0)':'var(--gb-bg-3)'}}>Metabolic Code</div>
      <div style={{fontSize:6,color:a?'var(--gb-fg-4)':'var(--gb-bg-3)',marginTop:1}}>{a?(data.mode==='lab'?'Lab Mode':'Non-Lab'):'No data'}</div>
    </div>
  )
}
function MiniTriadNode({ data, onEdit }) {
  const c = data.color||'#83a598', s = data.scored||false
  const rc = data.risk_level?RC[data.risk_level]:null
  return (
    <div onClick={()=>s&&onEdit&&onEdit(data)}
      style={{background:s?`${c}14`:'var(--gb-bg-soft)',border:`1px solid ${s?c+'66':'var(--gb-bg-2)'}`,borderRadius:8,minWidth:120,overflow:'visible',transition:'all 0.4s',cursor:s?'pointer':'default'}}>
      <Handle type="target" position={Position.Left} style={hw(c)}/>
      <Handle type="source" position={Position.Right} style={hw(c)}/>
      <div style={{padding:'4px 8px',display:'flex',alignItems:'center',gap:6}}>
        <div style={{width:18,height:18,borderRadius:5,background:`${c}${s?'22':'0e'}`,border:`1px solid ${c}${s?'44':'18'}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:6,fontWeight:800,color:s?c:`${c}33`,flexShrink:0}}>{data.icon}</div>
        <div style={{flex:1}}>
          <div style={{fontSize:8,fontWeight:700,color:s?'var(--gb-fg-1)':'var(--gb-fg-4)'}}>{data.label}</div>
          {s&&<div style={{fontSize:6,fontWeight:700,color:rc,textTransform:'uppercase',letterSpacing:'0.08em'}}>{data.risk_level}</div>}
        </div>
        {s&&data.composite_score!=null&&<div style={{fontSize:11,fontWeight:800,color:rc||c,lineHeight:1,flexShrink:0}}>{Math.round(data.composite_score)}</div>}
      </div>
    </div>
  )
}
function MiniOverallNode({ data }) {
  const s = data.scored||false, score = data.overall_risk_index??null
  const c = score!=null?(score>=70?'#fb4934':score>=50?'#fabd2f':'#b8bb26'):'var(--gb-bg-3)'
  return (
    <div style={{background:s?`${c}10`:'var(--gb-bg-soft)',border:`1.5px solid ${s?c+'55':'var(--gb-bg-2)'}`,borderRadius:9,minWidth:80,padding:'5px 10px',textAlign:'center',transition:'all 0.5s'}}>
      <Handle type="target" position={Position.Left} style={HW}/>
      <div style={{fontSize:6,fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:'var(--gb-fg-4)',marginBottom:2}}>ORI</div>
      <div style={{fontSize:s?20:14,fontWeight:800,color:s?c:'var(--gb-bg-3)',transition:'all 0.5s'}}>{s&&score!=null?Math.round(score):'—'}</div>
      {s&&<div style={{fontSize:6,color:'var(--gb-fg-4)',marginTop:1}}>{data.mode==='lab'?'Lab':'Non-Lab'}</div>}
    </div>
  )
}

const nodeTypes = {
  mini_input:    MiniInputNode,
  mini_engine:   MiniEngineNode,
  mini_triad:    (props) => <MiniTriadNode {...props} onEdit={props.data.onEdit}/>,
  mini_overall:  MiniOverallNode,
  dose_lookup:   ProtocolLookupNode,
  dose_config:   VialConfigNode,
  dose_calc:     DoseCalcNode,
  dose_schedule: ScheduleNode,
}

// ─── Graph builders ───────────────────────────────────────────────────────────
function buildMetoGraph(results, onEdit, savedPositions) {
  const nodes=[], edges=[]
  const pos = (id) => savedPositions[id] || DEFAULT_POSITIONS[id] || { x:0, y:0 }
  const INPUTS = [
    {id:'subject',  label:'Profile',   color:'#83a598', icon:'SP'},
    {id:'vitals',   label:'Vitals',    color:'#665c54', icon:'BM'},
    {id:'lifestyle',label:'Lifestyle', color:'#665c54', icon:'LS'},
    {id:'symptoms', label:'Symptoms',  color:'#83a598', icon:'SX'},
    {id:'labs',     label:'Labs',      color:'#458588', icon:'LP'},
  ]
  INPUTS.forEach((inp)=>{
    nodes.push({id:`in_${inp.id}`,type:'mini_input',position:pos(`in_${inp.id}`),data:{...inp,filled:!!results}})
    edges.push({id:`e_in_${inp.id}`,source:`in_${inp.id}`,target:'engine',type:'smoothstep',animated:!!results,style:{stroke:results?`${inp.color}66`:'var(--gb-bg-2)',strokeWidth:1}})
  })
  nodes.push({id:'engine',type:'mini_engine',position:pos('engine'),data:{active:!!results,mode:results?.mode}})
  TRIADS.forEach((t)=>{
    const triad=results?.triads.find(tr=>tr.id===t.id), scored=!!triad
    nodes.push({id:`tr_${t.id}`,type:'mini_triad',position:pos(`tr_${t.id}`),data:{...t,scored,onEdit,composite_score:triad?.scores.composite_score??null,risk_level:triad?.scores.risk_level??null}})
    edges.push({id:`e_eng_${t.id}`,source:'engine',target:`tr_${t.id}`,type:'smoothstep',animated:scored,style:{stroke:scored?`${t.color}66`:'var(--gb-bg-2)',strokeWidth:1}})
    edges.push({id:`e_tr_${t.id}`,source:`tr_${t.id}`,target:'overall',type:'smoothstep',animated:scored,style:{stroke:scored?`${t.color}44`:'var(--gb-bg-1)',strokeWidth:1}})
  })
  nodes.push({id:'overall',type:'mini_overall',position:pos('overall'),data:{scored:!!results,overall_risk_index:results?.overall.overall_risk_index??null,mode:results?.mode}})
  return {nodes,edges}
}

function buildDosePipeline(selectedId, onSelect, savedPositions) {
  const pos = (id) => savedPositions[id] || DEFAULT_POSITIONS[id] || { x:0, y:0 }
  const protocol = PROTOCOLS.find(p => p.id === selectedId) || null
  const active = !!protocol
  const edgeStyle = { stroke: active ? `${AC}66` : 'rgba(255,255,255,0.08)', strokeWidth:1 }

  const nodes = [
    { id:'dose_lookup',   type:'dose_lookup',   position:pos('dose_lookup'),   data:{ selectedId, onSelect } },
    { id:'dose_config',   type:'dose_config',   position:pos('dose_config'),   data:{ protocol } },
    { id:'dose_calc',     type:'dose_calc',     position:pos('dose_calc'),     data:{ protocol } },
    { id:'dose_schedule', type:'dose_schedule', position:pos('dose_schedule'), data:{ protocol } },
  ]
  const edges = [
    { id:'e_lookup_config',   source:'dose_lookup', target:'dose_config',   type:'smoothstep', animated:active, style:edgeStyle },
    { id:'e_config_calc',     source:'dose_config', target:'dose_calc',     type:'smoothstep', animated:active, style:edgeStyle },
    { id:'e_calc_schedule',   source:'dose_calc',   target:'dose_schedule', type:'smoothstep', animated:active, style:edgeStyle, sourceHandle:null },
  ]
  return { nodes, edges }
}

// ─── Edit Popover (unchanged) ─────────────────────────────────────────────────
function EditPopover({ triad, onClose }) {
  if (!triad) return null
  const c = triad.color||'#83a598'
  return (
    <div style={{position:'absolute',top:8,left:'50%',transform:'translateX(-50%)',zIndex:9999,background:'var(--gb-bg-soft)',border:`1px solid ${c}55`,borderRadius:12,padding:'12px 16px',minWidth:220,backdropFilter:'blur(20px)',boxShadow:`0 8px 32px rgba(0,0,0,0.7)`}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
        <div style={{fontSize:10,fontWeight:700,color:c,letterSpacing:'0.1em',textTransform:'uppercase'}}>{triad.label}</div>
        <button onClick={onClose} style={{background:'none',border:'none',color:'var(--gb-fg-4)',cursor:'pointer',fontSize:14,lineHeight:1}}>×</button>
      </div>
      <div style={{fontSize:9,color:'var(--gb-fg-3)',marginBottom:8}}>
        Score: <span style={{color:RC[triad.risk_level]||c,fontWeight:700}}>{Math.round(triad.composite_score)} — {triad.risk_level}</span>
      </div>
      <div style={{display:'flex',gap:8,marginBottom:10}}>
        {[['SX',triad.symptom_score],['VT',triad.vitals_score],['LB',triad.lab_score]].map(([lbl,val])=>
          val!=null&&(
            <div key={lbl} style={{flex:1,textAlign:'center',background:`${c}12`,borderRadius:6,padding:'4px 0'}}>
              <div style={{fontSize:10,fontWeight:700,color:c}}>{Math.round(val)}</div>
              <div style={{fontSize:7,color:'var(--gb-fg-4)'}}>{lbl}</div>
            </div>
          )
        )}
      </div>
      <a href="/Meto_Engine" style={{display:'block',textAlign:'center',padding:'6px 0',borderRadius:7,background:`${c}22`,border:`1px solid ${c}44`,color:c,fontSize:9,fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',textDecoration:'none'}}>
        Open Full Canvas
      </a>
    </div>
  )
}

// ─── Main canvas ──────────────────────────────────────────────────────────────
function BannerCanvasInner({ height }) {
  const { results } = useMetoStore()
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges] = useEdgesState([])
  const [editTriad, setEditTriad] = useState(null)
  const [selectedProtocolId, setSelectedProtocolId] = useState(()=>loadDoseState())
  const { setViewport } = useReactFlow()
  const handleEdit = useCallback((d)=>setEditTriad(d),[])
  const savedPositionsRef = useRef(loadPositions())

  const handleNodesChange = useCallback((changes) => {
    onNodesChange(changes)
    let dirty = false
    changes.forEach(c => {
      if (c.type === 'position' && c.position) {
        savedPositionsRef.current[c.id] = c.position
        dirty = true
      }
    })
    if (dirty) savePositions(savedPositionsRef.current)
  }, [onNodesChange])

  const handleProtocolSelect = useCallback((id) => {
    setSelectedProtocolId(id)
    saveDoseState(id)
  }, [])

  useEffect(()=>{
    const { nodes:mn, edges:me } = buildMetoGraph(results, handleEdit, savedPositionsRef.current)
    const { nodes:dn, edges:de } = buildDosePipeline(selectedProtocolId, handleProtocolSelect, savedPositionsRef.current)
    setNodes([...mn, ...dn])
    setEdges([...me, ...de])
  }, [results, handleEdit, selectedProtocolId, handleProtocolSelect])

  const viewportSet = useRef(false)
  useEffect(()=>{
    if (!viewportSet.current) {
      viewportSet.current = true
      setTimeout(()=>setViewport({x:0,y:0,zoom:1}),50)
    }
  },[])

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY)
    savedPositionsRef.current = {}
    const { nodes:mn, edges:me } = buildMetoGraph(results, handleEdit, {})
    const { nodes:dn, edges:de } = buildDosePipeline(selectedProtocolId, handleProtocolSelect, {})
    setNodes([...mn, ...dn])
    setEdges([...me, ...de])
    setViewport({x:0,y:0,zoom:1})
  }

  return (
    <div style={{width:'100%',height,position:'relative'}}>
      <style>{`
        .banner-canvas .react-flow__attribution{display:none}
        .banner-canvas .react-flow__node{background:transparent!important;border:none!important;box-shadow:none!important;padding:0!important;pointer-events:auto!important}
        .banner-canvas .react-flow__handle{opacity:0}
        .banner-canvas .react-flow__edge.animated path{animation-duration:2s;stroke-dasharray:4 3}
        .banner-canvas .react-flow__selection{background:rgba(69,133,136,0.06);border:1px solid rgba(69,133,136,0.35)}
        .banner-canvas .react-flow__nodesselection-rect{background:rgba(69,133,136,0.06);border:1px solid rgba(69,133,136,0.35)}
        .banner-canvas .react-flow__node.selected > *{outline:1px solid rgba(69,133,136,0.5);border-radius:8px}
      `}</style>
      <div className="banner-canvas" style={{width:'100%',height:'100%'}}>
        <ReactFlow
          nodes={nodes} edges={edges} nodeTypes={nodeTypes}
          onNodesChange={handleNodesChange}
          nodesDraggable={true} nodesConnectable={false} elementsSelectable={true}
          selectionOnDrag={true} multiSelectionKeyCode="Control"
          panOnDrag={false} panOnScroll={false}
          zoomOnScroll={false} zoomOnPinch={false} zoomOnDoubleClick={false}
          preventScrolling={false}
          nodeExtent={[[0,0],[1800,300]]}
          translateExtent={[[0,0],[1800,300]]}
          style={{background:'transparent',pointerEvents:'none'}} proOptions={{hideAttribution:true}}>
          <Background color="var(--gb-dot-grid)" gap={24} size={1.5}/>
        </ReactFlow>
      </div>
      {editTriad&&<EditPopover triad={editTriad} onClose={()=>setEditTriad(null)}/>}
      <button
        onClick={handleReset}
        title="Reset node positions"
        style={{position:'absolute',bottom:6,right:8,zIndex:9999,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:5,padding:'2px 7px',color:'rgba(255,255,255,0.2)',fontSize:9,cursor:'pointer',letterSpacing:'0.08em',pointerEvents:'auto',transition:'all 0.2s'}}
        onMouseEnter={e=>{ e.currentTarget.style.color='rgba(255,255,255,0.5)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.25)' }}
        onMouseLeave={e=>{ e.currentTarget.style.color='rgba(255,255,255,0.2)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.1)' }}
      >reset</button>
    </div>
  )
}

export default function AnalyticalChain({ height=420 }) {
  return (
    <ReactFlowProvider>
      <BannerCanvasInner height={height}/>
    </ReactFlowProvider>
  )
}
