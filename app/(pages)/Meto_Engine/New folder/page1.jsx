'use client'
import React, { useEffect, useState } from 'react'
import {
  ReactFlow, Background, Controls, Handle, Position,
  useNodesState, useEdgesState, ReactFlowProvider,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import TopBar from '@/app/_components/ui/dashboard/top-bar'

// ─── Constants ────────────────────────────────────────────────────────────────
const TRIADS = [
  { id: 'energy',     label: 'Energy',        color: '#f59e0b', icon: 'EN' },
  { id: 'resiliency', label: 'Resiliency',     color: '#10b981', icon: 'RS' },
  { id: 'endurance',  label: 'Endurance',      color: '#3b82f6', icon: 'ED' },
  { id: 'detox',      label: 'Detoxification', color: '#8b5cf6', icon: 'DX' },
  { id: 'potency',    label: 'Potency',        color: '#ec4899', icon: 'PT' },
]
const INPUT_NODES = [
  { id: 'subject',   label: 'Subject Profile', color: '#94a3b8', icon: 'SP' },
  { id: 'vitals',    label: 'Biometrics',      color: '#64748b', icon: 'BM' },
  { id: 'lifestyle', label: 'Lifestyle',       color: '#64748b', icon: 'LS' },
  { id: 'symptoms',  label: 'Symptoms',        color: '#94a3b8', icon: 'SX' },
  { id: 'labs',      label: 'Lab Panel',       color: '#0ea5e9', icon: 'LP' },
]
const RISK_COLORS = { low: '#10b981', moderate: '#f59e0b', high: '#ef4444' }
const HW  = { width:8,height:8,background:'var(--canvas-bg, #0c0e14)',border:'1.5px solid rgba(255,255,255,0.4)',borderRadius:'50%' }
const hw  = (c) => ({ width:8,height:8,background:'var(--canvas-bg, #0c0e14)',border:`1.5px solid ${c}88`,borderRadius:'50%',boxShadow:`0 0 6px ${c}44` })

// ─── Symptoms ─────────────────────────────────────────────────────────────────
const SYMPTOMS = {
  Energy:[
    {id:'sym_energy_fatigue_morning',label:'Morning fatigue'},
    {id:'sym_energy_midday_crash',label:'Midday energy crash'},
    {id:'sym_energy_weight_gain',label:'Unexplained weight gain'},
    {id:'sym_energy_sugar_cravings',label:'Sugar / carb cravings'},
    {id:'sym_energy_cold_intolerance',label:'Cold intolerance'},
    {id:'sym_energy_sleep_poor',label:'Poor sleep quality'},
  ],
  Resiliency:[
    {id:'sym_resiliency_bloating',label:'Bloating after meals'},
    {id:'sym_resiliency_heartburn',label:'Heartburn / reflux'},
    {id:'sym_resiliency_alter_bowel',label:'Altered bowel habits'},
    {id:'sym_resiliency_frequent_illness',label:'Frequent illness'},
    {id:'sym_resiliency_brain_fog',label:'Brain fog'},
    {id:'sym_resiliency_anxiety',label:'Anxiety / mood swings'},
  ],
  Endurance:[
    {id:'sym_endurance_exertion_dyspnea',label:'Shortness of breath on exertion'},
    {id:'sym_endurance_chest_tightness',label:'Chest tightness'},
    {id:'sym_endurance_poor_exercise_tolerance',label:'Poor exercise tolerance'},
    {id:'sym_endurance_palpitations',label:'Palpitations'},
  ],
  Detox:[
    {id:'sym_detox_chemical_sensitivity',label:'Chemical sensitivity'},
    {id:'sym_detox_fluid_retention',label:'Fluid retention'},
    {id:'sym_detox_headache',label:'Frequent headaches'},
    {id:'sym_detox_skin_rash',label:'Skin rashes / reactions'},
  ],
  Potency:[
    {id:'sym_potency_low_libido',label:'Low libido'},
    {id:'sym_potency_erection_or_cycle',label:'Erection / cycle issues'},
    {id:'sym_potency_mood_irritability',label:'Mood / irritability'},
    {id:'sym_potency_hot_flashes',label:'Hot flashes / night sweats'},
    {id:'sym_potency_muscle_loss',label:'Muscle loss'},
  ],
}
const ALL_SYMS = Object.values(SYMPTOMS).flat()
const TRIAD_SYM_IDS = Object.fromEntries(
  Object.entries(SYMPTOMS).map(([k,v]) => [k.toLowerCase(), v.map(s=>s.id)])
)

// ─────────────────────────────────────────────────────────────────────────────
// NODE COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function MetaConfigNode({ data }) {
  const c = '#7E57C2', a = data.active || false
  return (
    <div style={{background:a?`${c}18`:'var(--gb-bg-soft)',border:`1.5px solid ${a?c+'99':c+'33'}`,borderRadius:12,minWidth:200,padding:'10px 14px',boxShadow:a?`0 0 24px ${c}22,0 4px 16px rgba(0,0,0,0.5)`:'0 4px 14px rgba(0,0,0,0.4)',transition:'all 0.4s ease'}}>
      <Handle type="source" position={Position.Right} id="config" style={hw(c)}/>
      <Handle type="source" position={Position.Bottom} id="config_b" style={{...hw(c),bottom:-4,left:'50%'}}/>
      <div style={{display:'flex',alignItems:'center',gap:9}}>
        <div style={{width:30,height:30,borderRadius:8,background:`${c}22`,border:`1px solid ${c}55`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:800,color:c,flexShrink:0}}>CFG</div>
        <div>
          <div style={{fontSize:7,fontWeight:700,letterSpacing:'0.18em',textTransform:'uppercase',color:`${c}99`,marginBottom:2}}>MetaConfigNode</div>
          <div style={{fontSize:12,fontWeight:700,color:a?'#fff':'rgba(255,255,255,0.35)'}}>Assessment Config</div>
        </div>
      </div>
      <div style={{marginTop:8,paddingTop:7,borderTop:`1px solid ${c}22`}}>
        {[['Sections','5 active'],['Triads','5 enabled'],['Mode',data.mode||'auto-detect']].map(([k,v])=>(
          <div key={k} style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
            <span style={{fontSize:8,color:'rgba(255,255,255,0.3)'}}>{k}</span>
            <span style={{fontSize:8,fontWeight:600,color:a?`${c}cc`:'rgba(255,255,255,0.2)'}}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function MetaInputNode({ data }) {
  const c = data.color||'#42A5F5', f = data.filled||false
  return (
    <div style={{background:f?`${c}18`:'var(--gb-bg-soft)',border:`1.5px solid ${f?c:c+'44'}`,borderRadius:10,padding:'7px 12px',minWidth:160,boxShadow:f?`0 0 18px ${c}30,0 4px 14px rgba(0,0,0,0.5)`:'0 4px 14px rgba(0,0,0,0.4)',transition:'all 0.4s ease'}}>
      <Handle type="target" position={Position.Left} id="config" style={hw(c)}/>
      <Handle type="source" position={Position.Right} style={hw(c)}/>
      <div style={{display:'flex',alignItems:'center',gap:8}}>
        <div style={{width:26,height:26,borderRadius:6,flexShrink:0,background:`${c}${f?'28':'12'}`,border:`1px solid ${c}${f?'66':'33'}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:800,color:f?c:`${c}66`,transition:'all 0.4s'}}>{data.icon||'IN'}</div>
        <div>
          <div style={{fontSize:11,fontWeight:600,color:f?'#fff':'rgba(255,255,255,0.4)',transition:'color 0.4s'}}>{data.label}</div>
          <div style={{fontSize:8,color:f?`${c}cc`:'rgba(255,255,255,0.2)',marginTop:1}}>{f?'Ready':'Awaiting input'}</div>
        </div>
      </div>
    </div>
  )
}

function MetaEngineNode({ data }) {
  const a = data.active||false
  return (
    <div style={{background:a?'rgba(255,255,255,0.06)':'var(--gb-bg-soft)',border:`2px solid ${a?'rgba(255,255,255,0.7)':'rgba(255,255,255,0.2)'}`,borderRadius:16,minWidth:200,padding:'14px 18px',boxShadow:a?'0 0 40px rgba(255,255,255,0.12),0 0 80px rgba(255,255,255,0.04)':'0 4px 20px rgba(0,0,0,0.5)',transition:'all 0.5s ease',textAlign:'center'}}>
      <Handle type="target" position={Position.Left} id="payload" style={HW}/>
      <Handle type="target" position={Position.Top} id="config" style={{...HW,top:-4,left:'50%'}}/>
      <Handle type="source" position={Position.Right} id="raw_scores" style={HW}/>
      <div style={{fontSize:9,fontWeight:700,letterSpacing:'0.2em',textTransform:'uppercase',color:a?'rgba(255,255,255,0.5)':'rgba(255,255,255,0.2)',marginBottom:6}}>Scoring Engine</div>
      <div style={{fontSize:16,fontWeight:800,color:a?'#fff':'rgba(255,255,255,0.3)',transition:'color 0.5s'}}>Metabolic Code</div>
      <div style={{fontSize:9,color:a?'rgba(255,255,255,0.45)':'rgba(255,255,255,0.15)',marginTop:4}}>
        {a?(data.mode==='lab'?'Lab Mode · 0.4 / 0.2 / 0.4':'Non-Lab · 0.6 / 0.4'):'Awaiting data'}
      </div>
    </div>
  )
}

function MetaFlagNode({ data }) {
  const c = (data.flags||[]).some(f=>f.includes('cardio'))?'#ef4444':'#FFB74D'
  const hasFlags = (data.flags||[]).length > 0
  return (
    <div style={{background:hasFlags?`${c}12`:'var(--gb-bg-soft)',border:`1.5px solid ${hasFlags?c+'77':c+'33'}`,borderRadius:10,minWidth:185,padding:'9px 13px',boxShadow:hasFlags?`0 0 18px ${c}20,0 3px 12px rgba(0,0,0,0.4)`:'0 4px 14px rgba(0,0,0,0.3)',transition:'all 0.4s ease'}}>
      <Handle type="target" position={Position.Left} id="raw_scores" style={hw(c)}/>
      <Handle type="target" position={Position.Top} id="payload" style={{...hw(c),top:-4,left:'35%'}}/>
      <Handle type="target" position={Position.Top} id="config_in" style={{...hw(c),top:-4,left:'65%'}}/>
      <Handle type="source" position={Position.Right} id="flagged" style={hw(c)}/>
      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:hasFlags?7:0}}>
        <div style={{width:28,height:28,borderRadius:7,background:`${c}18`,border:`1px solid ${c}44`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:800,color:c,flexShrink:0}}>{hasFlags?'!!':'!'}</div>
        <div>
          <div style={{fontSize:7,fontWeight:700,letterSpacing:'0.15em',textTransform:'uppercase',color:`${c}88`,marginBottom:1}}>MetaFlagNode</div>
          <div style={{fontSize:11,fontWeight:700,color:hasFlags?'#fff':'rgba(255,255,255,0.35)'}}>Risk Flags</div>
        </div>
      </div>
      {hasFlags
        ? (data.flags||[]).map((f,i)=>(
            <div key={i} style={{fontSize:8,fontWeight:600,color:'#ef4444',letterSpacing:'0.06em',paddingLeft:4,borderLeft:'2px solid #ef444488',marginBottom:2}}>
              {f.replace(/_/g,' ').toUpperCase()}
            </div>
          ))
        : <div style={{fontSize:8,color:'rgba(255,255,255,0.2)'}}>No active flags</div>
      }
    </div>
  )
}

function MetaScoreNode({ data }) {
  const c = data.color||'#26A69A', s = data.scored||false
  const risk = data.risk_level||null, rc = risk?RISK_COLORS[risk]:null
  const score = data.composite_score??null
  return (
    <div style={{background:s?`${c}14`:'var(--gb-bg-soft)',border:`1.5px solid ${s?c+'88':c+'33'}`,borderRadius:12,minWidth:180,boxShadow:s?`0 0 24px ${c}22,0 4px 16px rgba(0,0,0,0.5)`:'0 4px 14px rgba(0,0,0,0.4)',transition:'all 0.5s ease',overflow:'hidden'}}>
      <Handle type="target" position={Position.Left} id="flagged" style={hw(c)}/>
      <Handle type="source" position={Position.Right} id="triad_card" style={hw(c)}/>
      <div style={{padding:'10px 14px 8px',borderBottom:`1px solid ${c}22`,display:'flex',alignItems:'center',gap:10}}>
        <div style={{width:32,height:32,borderRadius:8,flexShrink:0,background:`${c}${s?'22':'0e'}`,border:`1.5px solid ${c}${s?'55':'22'}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:800,color:s?c:`${c}44`,transition:'all 0.5s'}}>{data.icon}</div>
        <div>
          <div style={{fontSize:13,fontWeight:700,color:s?'#fff':'rgba(255,255,255,0.3)',transition:'color 0.5s'}}>{data.label}</div>
          {s&&risk&&<div style={{fontSize:9,fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:rc,marginTop:2}}>{risk}</div>}
        </div>
        {s&&score!==null&&(
          <div style={{marginLeft:'auto',textAlign:'right'}}>
            <div style={{fontSize:22,fontWeight:800,color:rc||c,lineHeight:1}}>{Math.round(score)}</div>
            <div style={{fontSize:7,color:'rgba(255,255,255,0.3)',marginTop:2}}>/ 100</div>
          </div>
        )}
      </div>
      {s&&(
        <div style={{padding:'7px 14px 8px',display:'flex',gap:8}}>
          {[['SX',data.symptom_score],['VT',data.vitals_score],['LB',data.lab_score]].map(([lbl,val])=>
            val!=null?(
              <div key={lbl} style={{flex:1,textAlign:'center'}}>
                <div style={{fontSize:10,fontWeight:700,color:c}}>{Math.round(val)}</div>
                <div style={{fontSize:7,color:'rgba(255,255,255,0.25)',letterSpacing:'0.08em'}}>{lbl}</div>
              </div>
            ):null
          )}
        </div>
      )}
    </div>
  )
}

function MetaResultNode({ data }) {
  const c = '#AB47BC', r = data.ready||false
  const overall = data.overall_risk_index??null
  const oc = overall!==null?(overall>=70?'#ef4444':overall>=50?'#f59e0b':'#10b981'):c
  return (
    <div style={{background:r?`${c}12`:'var(--gb-bg-soft)',border:`2px solid ${r?c+'77':c+'33'}`,borderRadius:14,minWidth:210,boxShadow:r?`0 0 32px ${c}18,0 4px 20px rgba(0,0,0,0.5)`:'0 4px 14px rgba(0,0,0,0.4)',transition:'all 0.5s ease'}}>
      <Handle type="target" position={Position.Left} id="triad_cards" style={hw(c)}/>
      <Handle type="target" position={Position.Top} id="flagged_in" style={{...hw(c),top:-4,left:'35%'}}/>
      <Handle type="target" position={Position.Top} id="payload_in" style={{...hw(c),top:-4,left:'65%'}}/>
      <Handle type="source" position={Position.Right} id="result" style={hw(c)}/>
      <div style={{padding:'11px 14px 9px',borderBottom:`1px solid ${c}22`,display:'flex',alignItems:'center',gap:10}}>
        <div style={{width:34,height:34,borderRadius:9,background:`${c}${r?'22':'0e'}`,border:`1.5px solid ${c}${r?'66':'22'}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:800,color:r?c:`${c}44`,flexShrink:0,transition:'all 0.5s'}}>RES</div>
        <div>
          <div style={{fontSize:7,fontWeight:700,letterSpacing:'0.15em',textTransform:'uppercase',color:`${c}88`,marginBottom:1}}>MetaResultNode</div>
          <div style={{fontSize:12,fontWeight:700,color:r?'#fff':'rgba(255,255,255,0.3)'}}>Result &amp; UX Payload</div>
        </div>
        {r&&overall!==null&&(
          <div style={{marginLeft:'auto',textAlign:'right'}}>
            <div style={{fontSize:24,fontWeight:800,color:oc,lineHeight:1}}>{Math.round(overall)}</div>
            <div style={{fontSize:7,color:'rgba(255,255,255,0.3)',marginTop:1}}>ORI</div>
          </div>
        )}
      </div>
      <div style={{padding:'7px 14px 10px'}}>
        {r?(
          <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
            {(data.triads||[]).map(t=>(
              <div key={t.id} style={{padding:'2px 7px',borderRadius:4,background:`${t.accent_color||c}22`,border:`1px solid ${t.accent_color||c}44`,fontSize:8,fontWeight:700,color:t.accent_color||c}}>{t.label}</div>
            ))}
          </div>
        ):(
          <div style={{fontSize:8,color:'rgba(255,255,255,0.2)'}}>Awaiting scored triads</div>
        )}
        {r&&(data.global_flags||[]).length>0&&(
          <div style={{marginTop:6,padding:'4px 8px',background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.25)',borderRadius:5}}>
            {data.global_flags.map(f=>(
              <div key={f} style={{fontSize:7,color:'#ef4444',fontWeight:600}}>{f.replace(/_/g,' ').toUpperCase()}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function MetaStorageNode({ data }) {
  const c = '#66BB6A', s = data.stored||false
  return (
    <div style={{background:s?`${c}14`:'var(--gb-bg-soft)',border:`1.5px solid ${s?c+'88':c+'33'}`,borderRadius:10,minWidth:185,padding:'9px 13px',boxShadow:s?`0 0 20px ${c}18,0 4px 14px rgba(0,0,0,0.4)`:'0 4px 12px rgba(0,0,0,0.3)',transition:'all 0.5s ease'}}>
      <Handle type="target" position={Position.Left} id="result" style={hw(c)}/>
      <div style={{display:'flex',alignItems:'center',gap:9}}>
        <div style={{width:28,height:28,borderRadius:7,background:`${c}${s?'22':'0e'}`,border:`1px solid ${c}${s?'55':'22'}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:800,color:s?c:`${c}44`,flexShrink:0,transition:'all 0.5s'}}>DB</div>
        <div>
          <div style={{fontSize:7,fontWeight:700,letterSpacing:'0.15em',textTransform:'uppercase',color:`${c}88`,marginBottom:1}}>MetaStorageNode</div>
          <div style={{fontSize:11,fontWeight:700,color:s?'#fff':'rgba(255,255,255,0.3)'}}>History Storage</div>
        </div>
      </div>
      <div style={{marginTop:7,paddingTop:6,borderTop:`1px solid ${c}22`}}>
        {s?(
          <>
            <div style={{fontSize:8,color:`${c}cc`,fontWeight:600}}>Stored — {data.stored_at||'just now'}</div>
            <div style={{fontSize:7,color:'rgba(255,255,255,0.3)',marginTop:2}}>ID: {data.assessment_id||'—'}</div>
          </>
        ):(
          <div style={{fontSize:8,color:'rgba(255,255,255,0.2)'}}>pj_results · IndexedDB</div>
        )}
      </div>
    </div>
  )
}

const nodeTypes = {
  meta_config:  MetaConfigNode,
  meta_input:   MetaInputNode,
  meta_engine:  MetaEngineNode,
  meta_flag:    MetaFlagNode,
  meta_score:   MetaScoreNode,
  meta_result:  MetaResultNode,
  meta_storage: MetaStorageNode,
}

// ─────────────────────────────────────────────────────────────────────────────
// CANVAS BUILDER
// ─────────────────────────────────────────────────────────────────────────────
function buildBaseGraph() {
  const nodes = [], edges = []

  // Config — col 0
  nodes.push({ id:'config', type:'meta_config', position:{x:0,y:200}, data:{active:false,mode:'auto-detect'} })

  // Inputs — col 1
  INPUT_NODES.forEach((inp,i) => {
    nodes.push({ id:`input_${inp.id}`, type:'meta_input', position:{x:240,y:i*88}, data:{...inp,filled:false} })
    edges.push({ id:`e_cfg_${inp.id}`, source:'config', target:`input_${inp.id}`, sourceHandle:'config', targetHandle:'config', type:'smoothstep', animated:false, style:{stroke:'#7E57C244',strokeWidth:1} })
  })

  // Engine — col 2
  const midY = ((INPUT_NODES.length-1)*88)/2
  nodes.push({ id:'engine', type:'meta_engine', position:{x:500,y:midY-14}, data:{active:false,mode:'non_lab'} })
  INPUT_NODES.forEach(inp => {
    edges.push({ id:`e_${inp.id}_eng`, source:`input_${inp.id}`, target:'engine', targetHandle:'payload', type:'smoothstep', animated:false, style:{stroke:'rgba(255,255,255,0.07)',strokeWidth:1} })
  })
  edges.push({ id:'e_cfg_eng', source:'config', target:'engine', sourceHandle:'config_b', targetHandle:'config', type:'smoothstep', animated:false, style:{stroke:'#7E57C233',strokeWidth:1} })

  // FlagNode — col 3
  nodes.push({ id:'flags', type:'meta_flag', position:{x:760,y:midY-16}, data:{flags:[]} })
  edges.push({ id:'e_eng_flags', source:'engine', target:'flags', sourceHandle:'raw_scores', targetHandle:'raw_scores', type:'smoothstep', animated:false, style:{stroke:'rgba(255,255,255,0.1)',strokeWidth:1} })

  // Score nodes — col 4
  TRIADS.forEach((t,i) => {
    const y = i*102 - 46
    nodes.push({ id:`score_${t.id}`, type:'meta_score', position:{x:1010,y}, data:{...t,scored:false} })
    edges.push({ id:`e_flags_${t.id}`, source:'flags', target:`score_${t.id}`, sourceHandle:'flagged', targetHandle:'flagged', type:'smoothstep', animated:false, style:{stroke:`${t.color}33`,strokeWidth:1} })
  })

  // Result — col 5
  const resultY = ((TRIADS.length-1)*102)/2 - 46
  nodes.push({ id:'result', type:'meta_result', position:{x:1260,y:resultY}, data:{ready:false} })
  TRIADS.forEach(t => {
    edges.push({ id:`e_${t.id}_res`, source:`score_${t.id}`, target:'result', sourceHandle:'triad_card', targetHandle:'triad_cards', type:'smoothstep', animated:false, style:{stroke:`${t.color}22`,strokeWidth:1} })
  })

  // Storage — col 6
  nodes.push({ id:'storage', type:'meta_storage', position:{x:1530,y:resultY+18}, data:{stored:false} })
  edges.push({ id:'e_res_store', source:'result', target:'storage', sourceHandle:'result', targetHandle:'result', type:'smoothstep', animated:false, style:{stroke:'#66BB6A33',strokeWidth:1} })

  return { nodes, edges }
}

// ─────────────────────────────────────────────────────────────────────────────
// SCORING ENGINE
// ─────────────────────────────────────────────────────────────────────────────
function runScoringEngine(form) {
  const { subject, biometrics, lifestyle, labs, symptom_responses } = form
  const hasLabs = !form.skipLabs && labs && Object.values(labs).some(v=>v!=='')
  const mode = hasLabs ? 'lab' : 'non_lab'

  const symScore = (ids) => {
    const items = symptom_responses.filter(s=>ids.includes(s.item_id))
    if (!items.length) return 50
    return (items.reduce((a,b)=>a+b.value,0)/(items.length*4))*100
  }
  const vitScore = (tid) => {
    if (!biometrics) return 50
    const sbp=Number(biometrics.systolic_bp_mm_hg)||120
    const dbp=Number(biometrics.diastolic_bp_mm_hg)||80
    const hr=Number(biometrics.resting_hr_bpm)||70
    const bmi=subject?Number(subject.weight_kg)/((Number(subject.height_cm)/100)**2):25
    if (tid==='endurance') return Math.min(100,Math.max(0,((sbp-110)/50)*40+((dbp-70)/20)*20+((hr-60)/40)*20+Math.max(0,bmi-22)*1.5))
    if (tid==='energy')    return Math.min(100,Math.max(0,(bmi-22)*3+(hr-65)*0.5+20))
    if (tid==='detox')     { const ph=Number(biometrics.urine_ph)||6.8; return Math.min(100,Math.max(0,Math.abs(ph-6.8)*30+20)) }
    return 40
  }
  const labScore = (tid) => {
    if (!hasLabs) return null
    const l = labs
    const v = (k) => l[k]!==''?Number(l[k]):null
    const avg = (arr) => { const f=arr.filter(x=>x!==null); return f.length?f.reduce((a,b)=>a+b,0)/f.length:null }
    const clamp = (n) => Math.min(100,Math.max(0,n))
    if (tid==='energy')    return avg([v('fasting_glucose_mg_dl')!=null?clamp((v('fasting_glucose_mg_dl')-85)*3):null,v('fasting_insulin_uIU_ml')!=null?clamp((v('fasting_insulin_uIU_ml')-5)*5):null,v('hba1c_pct')!=null?clamp((v('hba1c_pct')-5.0)*40):null,v('tsh_uIU_ml')!=null?clamp(Math.abs(v('tsh_uIU_ml')-2.0)*15):null,v('vitamin_d_25oh_ng_ml')!=null?clamp((50-v('vitamin_d_25oh_ng_ml'))*1.5):null])
    if (tid==='endurance') return avg([v('triglycerides_mg_dl')!=null?clamp((v('triglycerides_mg_dl')-100)*0.7):null,v('hdl_mg_dl')!=null?clamp((60-v('hdl_mg_dl'))*1.5):null,v('ldl_c_mg_dl')!=null?clamp((v('ldl_c_mg_dl')-100)*0.6):null,v('hs_crp_mg_l')!=null?clamp(v('hs_crp_mg_l')*15):null])
    if (tid==='detox')     return avg([v('alt_u_l')!=null?clamp((v('alt_u_l')-25)*2):null,v('ast_u_l')!=null?clamp((v('ast_u_l')-22)*2):null,v('ggt_u_l')!=null?clamp((v('ggt_u_l')-20)*2):null,v('uric_acid_mg_dl')!=null?clamp((v('uric_acid_mg_dl')-5.5)*15):null])
    if (tid==='potency')   return avg([v('total_testosterone_ng_dl')!=null?clamp((600-v('total_testosterone_ng_dl'))*0.15):null,v('free_testosterone_pg_ml')!=null?clamp((15-v('free_testosterone_pg_ml'))*10):null,v('dhea_s_ug_dl')!=null?clamp((300-v('dhea_s_ug_dl'))*0.2):null])
    if (tid==='resiliency') return avg([v('hs_crp_mg_l')!=null?clamp(v('hs_crp_mg_l')*15):null,v('vitamin_d_25oh_ng_ml')!=null?clamp((50-v('vitamin_d_25oh_ng_ml'))*1.5):null])
    return 50
  }
  const riskLevel = (s) => s>=70?'high':s>=45?'moderate':'low'

  const triads = TRIADS.map(t => {
    const sym=symScore(TRIAD_SYM_IDS[t.id])
    const vit=vitScore(t.id)
    const lab=labScore(t.id)
    const composite=mode==='lab'&&lab!==null?sym*0.4+vit*0.2+lab*0.4:sym*0.6+vit*0.4
    const flags=[]
    let risk=riskLevel(composite)
    if (t.id==='energy'&&lifestyle?.known_diabetes) risk='high'
    if (t.id==='endurance'&&(lifestyle?.known_hypertension||Number(biometrics?.systolic_bp_mm_hg)>=140||Number(biometrics?.diastolic_bp_mm_hg)>=90)) risk='high'
    const chest=symptom_responses.find(s=>s.item_id==='sym_endurance_chest_tightness')
    if (t.id==='endurance'&&chest?.value>=3) { risk='high'; flags.push('urgent_followup_possible_cardio') }
    if (t.id==='detox'&&lab!==null&&(Number(labs.alt_u_l)>50||Number(labs.ast_u_l)>44)) risk='high'
    return { ...t, accent_color:t.color, scores:{ symptom_score:sym, vitals_score:vit, lab_score:lab, composite_score:composite, risk_level:risk }, flags }
  })
  const overall_risk_index = triads.reduce((a,t)=>a+t.scores.composite_score,0)/triads.length
  return { mode, triads, overall:{ overall_risk_index, mode, global_flags:triads.flatMap(t=>t.flags) } }
}

function applyToCanvas(setNodes, setEdges, results, filledSections) {
  setNodes(nds => nds.map(n => {
    if (n.id==='config') return {...n,data:{...n.data,active:filledSections.length>0,mode:results?.mode||'auto-detect'}}
    if (n.type==='meta_input') return {...n,data:{...n.data,filled:filledSections.includes(n.id.replace('input_',''))}}
    if (n.id==='engine'&&results) return {...n,data:{...n.data,active:true,mode:results.mode}}
    if (n.id==='flags'&&results) { const fl=results.triads.flatMap(t=>t.flags); return {...n,data:{flags:fl,urgent:fl.some(f=>f.includes('cardio'))}} }
    if (n.type==='meta_score'&&results) { const t=results.triads.find(t=>`score_${t.id}`===n.id); if (t) return {...n,data:{...n.data,scored:true,...t.scores,symptom_score:t.scores.symptom_score,vitals_score:t.scores.vitals_score,lab_score:t.scores.lab_score}} }
    if (n.id==='result'&&results) return {...n,data:{ready:true,overall_risk_index:results.overall.overall_risk_index,triads:results.triads.map(t=>({id:t.id,label:t.label,accent_color:t.color})),global_flags:results.overall.global_flags,mode:results.mode}}
    if (n.id==='storage'&&results) return {...n,data:{stored:true,stored_at:new Date().toLocaleTimeString(),assessment_id:`mc_${Date.now()}`}}
    return n
  }))
  if (results) {
    setEdges(eds => eds.map(e => {
      const t=TRIADS.find(t=>e.id.includes(t.id))
      return {...e,animated:true,style:{stroke:t?`${t.color}88`:'rgba(255,255,255,0.28)',strokeWidth:1.4}}
    }))
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// FORM DEFAULT
// ─────────────────────────────────────────────────────────────────────────────
const FORM_DEFAULT = {
  subject:    { sex:'male',age:'',height_cm:'',weight_kg:'',waist_cm:'',hip_cm:'',activity_level:'moderate' },
  biometrics: { systolic_bp_mm_hg:'',diastolic_bp_mm_hg:'',resting_hr_bpm:'',spo2_pct:'',urine_ph:'' },
  lifestyle:  { smoking_status:'never',alcohol_units_per_week:'',known_diabetes:false,known_hypertension:false,known_hyperlipidemia:false,exercise_minutes_per_week:'' },
  labs: { fasting_glucose_mg_dl:'',fasting_insulin_uIU_ml:'',hba1c_pct:'',triglycerides_mg_dl:'',hdl_mg_dl:'',ldl_c_mg_dl:'',hs_crp_mg_l:'',tsh_uIU_ml:'',free_t3_pg_ml:'',free_t4_ng_dl:'',vitamin_d_25oh_ng_ml:'',alt_u_l:'',ast_u_l:'',ggt_u_l:'',bilirubin_mg_dl:'',bun_mg_dl:'',creatinine_mg_dl:'',egfr_ml_min_1_73m2:'',uric_acid_mg_dl:'',total_testosterone_ng_dl:'',free_testosterone_pg_ml:'',estradiol_pg_ml:'',dhea_s_ug_dl:'' },
  symptom_responses: ALL_SYMS.map(s=>({item_id:s.id,value:0})),
  skipLabs: false,
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARED UI PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────
const iS = {background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:6,color:'#fff',fontSize:11,padding:'5px 8px',width:'100%',outline:'none'}
const lS = {fontSize:9,fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',color:'rgba(255,255,255,0.35)',marginBottom:3,display:'block'}
const secT = {fontSize:10,fontWeight:700,letterSpacing:'0.15em',textTransform:'uppercase',color:'rgba(255,255,255,0.5)',marginBottom:12,paddingBottom:6,borderBottom:'1px solid rgba(255,255,255,0.08)'}

function F({label,children}) { return <div style={{marginBottom:8}}><span style={lS}>{label}</span>{children}</div> }
function NI({value,onChange,placeholder}) { return <input type="number" value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder||'—'} style={iS}/> }
function Sel({value,onChange,options}) {
  return (
    <select value={value} onChange={e=>onChange(e.target.value)} style={{...iS,cursor:'pointer'}}>
      {options.map(o=><option key={o.value||o} value={o.value||o}>{o.label||o}</option>)}
    </select>
  )
}
function Toggle({value,onChange}) {
  return (
    <button onClick={()=>onChange(!value)} style={{width:36,height:20,borderRadius:10,border:'none',cursor:'pointer',background:value?'#3b82f6':'rgba(255,255,255,0.1)',transition:'background 0.2s',position:'relative',flexShrink:0}}>
      <div style={{width:14,height:14,borderRadius:'50%',background:'#fff',position:'absolute',top:3,left:value?19:3,transition:'left 0.2s'}}/>
    </button>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
function MetoEngineContent() {
  const [form, setForm] = useState(FORM_DEFAULT)
  const [results, setResults] = useState(null)
  const [activeSection, setActiveSection] = useState('subject')
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  useEffect(() => {
    const { nodes:n, edges:e } = buildBaseGraph()
    setNodes(n); setEdges(e)
  }, [])

  // Determine filled sections
  const filled = []
  const sb = form.subject
  if (sb.age&&sb.height_cm&&sb.weight_kg) filled.push('subject')
  const bm = form.biometrics
  if (bm.systolic_bp_mm_hg&&bm.resting_hr_bpm) filled.push('vitals')
  if (form.lifestyle.exercise_minutes_per_week!=='') filled.push('lifestyle')
  if (form.symptom_responses.some(s=>s.value>0)) filled.push('symptoms')
  if (form.skipLabs||Object.values(form.labs).some(v=>v!=='')) filled.push('labs')

  // Live canvas update
  useEffect(() => {
    if (!filled.length) return
    const partial = filled.length>=3 ? runScoringEngine(form) : null
    applyToCanvas(setNodes, setEdges, partial, filled)
  }, [filled.join(','), JSON.stringify(form.symptom_responses), JSON.stringify(form.biometrics)])

  const handleSubmit = () => {
    const r = runScoringEngine(form)
    setResults(r)
    applyToCanvas(setNodes, setEdges, r, ['subject','vitals','lifestyle','symptoms','labs'])
  }

  const upS  = (k,v) => setForm(f=>({...f,subject:{...f.subject,[k]:v}}))
  const upB  = (k,v) => setForm(f=>({...f,biometrics:{...f.biometrics,[k]:v}}))
  const upL  = (k,v) => setForm(f=>({...f,lifestyle:{...f.lifestyle,[k]:v}}))
  const upLb = (k,v) => setForm(f=>({...f,labs:{...f.labs,[k]:v}}))
  const upSy = (id,val) => setForm(f=>({...f,symptom_responses:f.symptom_responses.map(s=>s.item_id===id?{...s,value:Number(val)}:s)}))
  const getSy = (id) => form.symptom_responses.find(s=>s.item_id===id)?.value??0

  const SECTIONS = ['subject','vitals','lifestyle','symptoms','labs']

  return (
    <div style={{width:'100vw',height:'100vh',background:'var(--canvas-bg, #0c0e14)',display:'flex',flexDirection:'column',overflow:'hidden'}}>
      <style>{`
        .react-flow__attribution{display:none}
        .react-flow__node{background:transparent!important;border:none!important;box-shadow:none!important;padding:0!important}
        .react-flow__handle{opacity:0;transition:opacity 0.2s}
        .react-flow__node:hover .react-flow__handle{opacity:1}
        .react-flow__edge.animated path{animation-duration:2s;stroke-dasharray:5 4}
        .react-flow__controls-button{background:var(--gb-bg-1)!important;border-bottom:1px solid rgba(255,255,255,0.08)!important}
        .react-flow__controls-button svg{fill:rgba(255,255,255,0.4)!important}
        .react-flow__controls{border:1px solid rgba(255,255,255,0.08)!important;border-radius:6px!important;overflow:hidden}
        .me-scroll::-webkit-scrollbar{width:4px}
        .me-scroll::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.12);border-radius:2px}
        input[type=number]::-webkit-inner-spin-button{opacity:0.3}
        input::placeholder{color:rgba(255,255,255,0.2)}
        select option{background:var(--gb-bg-1);color:#fff}
      `}</style>

      <TopBar view="list" setView={()=>{}} onUpload={null} searchQuery="" setSearchQuery={()=>{}}/>

      <div style={{flex:1,display:'flex',overflow:'hidden'}}>

        {/* ── Intake panel ── */}
        <div style={{width:320,flexShrink:0,borderRight:'1px solid rgba(255,255,255,0.08)',display:'flex',flexDirection:'column',background:'rgba(10,12,18,0.98)'}}>

          {/* Section nav */}
          <div style={{padding:'10px 10px 6px',borderBottom:'1px solid rgba(255,255,255,0.06)',display:'flex',flexDirection:'column',gap:2}}>
            {SECTIONS.map(sec=>{
              const isFilled = filled.includes(sec)
              const isActive = activeSection===sec
              return (
                <button key={sec} onClick={()=>setActiveSection(sec)}
                  style={{background:isActive?'rgba(255,255,255,0.08)':'transparent',border:'none',cursor:'pointer',padding:'6px 10px',borderRadius:6,fontSize:10,fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',textAlign:'left',width:'100%',color:isActive?'#fff':isFilled?'rgba(255,255,255,0.55)':'rgba(255,255,255,0.28)',transition:'all 0.2s'}}>
                  <span style={{marginRight:6,fontSize:8}}>{isFilled?'●':'○'}</span>
                  {sec.charAt(0).toUpperCase()+sec.slice(1)}
                </button>
              )
            })}
          </div>

          {/* Section content */}
          <div className="me-scroll" style={{flex:1,overflowY:'auto',padding:'14px 14px 18px'}}>

            {activeSection==='subject'&&(
              <>
                <div style={secT}>Subject Profile</div>
                <F label="Sex"><Sel value={form.subject.sex} onChange={v=>upS('sex',v)} options={[{value:'male',label:'Male'},{value:'female',label:'Female'}]}/></F>
                <F label="Age"><NI value={form.subject.age} onChange={v=>upS('age',v)} placeholder="46"/></F>
                <F label="Height (cm)"><NI value={form.subject.height_cm} onChange={v=>upS('height_cm',v)} placeholder="178"/></F>
                <F label="Weight (kg)"><NI value={form.subject.weight_kg} onChange={v=>upS('weight_kg',v)} placeholder="92"/></F>
                <F label="Waist (cm)"><NI value={form.subject.waist_cm} onChange={v=>upS('waist_cm',v)} placeholder="102"/></F>
                <F label="Hip (cm)"><NI value={form.subject.hip_cm} onChange={v=>upS('hip_cm',v)} placeholder="104"/></F>
                <F label="Activity Level"><Sel value={form.subject.activity_level} onChange={v=>upS('activity_level',v)} options={['low','moderate','high']}/></F>
              </>
            )}

            {activeSection==='vitals'&&(
              <>
                <div style={secT}>Biometrics</div>
                <F label="Systolic BP (mmHg)"><NI value={form.biometrics.systolic_bp_mm_hg} onChange={v=>upB('systolic_bp_mm_hg',v)} placeholder="128"/></F>
                <F label="Diastolic BP (mmHg)"><NI value={form.biometrics.diastolic_bp_mm_hg} onChange={v=>upB('diastolic_bp_mm_hg',v)} placeholder="82"/></F>
                <F label="Resting HR (bpm)"><NI value={form.biometrics.resting_hr_bpm} onChange={v=>upB('resting_hr_bpm',v)} placeholder="72"/></F>
                <F label="SpO2 (%)"><NI value={form.biometrics.spo2_pct} onChange={v=>upB('spo2_pct',v)} placeholder="98"/></F>
                <F label="Urine pH"><NI value={form.biometrics.urine_ph} onChange={v=>upB('urine_ph',v)} placeholder="6.0"/></F>
              </>
            )}

            {activeSection==='lifestyle'&&(
              <>
                <div style={secT}>Lifestyle</div>
                <F label="Smoking Status"><Sel value={form.lifestyle.smoking_status} onChange={v=>upL('smoking_status',v)} options={['never','former','current']}/></F>
                <F label="Alcohol (units/week)"><NI value={form.lifestyle.alcohol_units_per_week} onChange={v=>upL('alcohol_units_per_week',v)} placeholder="6"/></F>
                <F label="Exercise (min/week)"><NI value={form.lifestyle.exercise_minutes_per_week} onChange={v=>upL('exercise_minutes_per_week',v)} placeholder="120"/></F>
                {[['known_diabetes','Known Diabetes'],['known_hypertension','Known Hypertension'],['known_hyperlipidemia','Known Hyperlipidemia']].map(([k,lbl])=>(
                  <div key={k} style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
                    <span style={lS}>{lbl}</span>
                    <Toggle value={form.lifestyle[k]} onChange={v=>upL(k,v)}/>
                  </div>
                ))}
              </>
            )}

            {activeSection==='symptoms'&&(
              <>
                <div style={secT}>Symptoms (0–4)</div>
                {Object.entries(SYMPTOMS).map(([group,items])=>{
                  const triad = TRIADS.find(t=>t.label.startsWith(group.slice(0,4)))
                  return (
                    <div key={group} style={{marginBottom:16}}>
                      <div style={{fontSize:9,fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:triad?.color||'rgba(255,255,255,0.4)',marginBottom:8}}>{group}</div>
                      {items.map(sym=>(
                        <div key={sym.id} style={{marginBottom:8}}>
                          <div style={{fontSize:10,color:'rgba(255,255,255,0.6)',marginBottom:4}}>{sym.label}</div>
                          <div style={{display:'flex',gap:5}}>
                            {[0,1,2,3,4].map(v=>{
                              const active=getSy(sym.id)===v
                              const c=triad?.color||'#fff'
                              return (
                                <button key={v} onClick={()=>upSy(sym.id,v)}
                                  style={{width:22,height:22,borderRadius:'50%',border:`1px solid ${active?c:'rgba(255,255,255,0.15)'}`,cursor:'pointer',background:active?`${c}33`:'transparent',color:active?c:'rgba(255,255,255,0.3)',fontSize:8,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,transition:'all 0.15s'}}>
                                  {v}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                })}
              </>
            )}

            {activeSection==='labs'&&(
              <>
                <div style={secT}>Lab Panel</div>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
                  <span style={{fontSize:10,color:'rgba(255,255,255,0.5)'}}>Skip — no labs</span>
                  <Toggle value={form.skipLabs} onChange={v=>setForm(f=>({...f,skipLabs:v}))}/>
                </div>
                {!form.skipLabs&&(
                  <>
                    {[
                      ['Glucose',[['fasting_glucose_mg_dl','Fasting Glucose (mg/dL)'],['fasting_insulin_uIU_ml','Fasting Insulin (uIU/mL)'],['hba1c_pct','HbA1c (%)']]],
                      ['Lipids',[['triglycerides_mg_dl','Triglycerides (mg/dL)'],['hdl_mg_dl','HDL (mg/dL)'],['ldl_c_mg_dl','LDL-C (mg/dL)']]],
                      ['Inflammatory',[['hs_crp_mg_l','hs-CRP (mg/L)']]],
                      ['Thyroid',[['tsh_uIU_ml','TSH (uIU/mL)'],['free_t3_pg_ml','Free T3 (pg/mL)'],['free_t4_ng_dl','Free T4 (ng/dL)']]],
                      ['Vitamins',[['vitamin_d_25oh_ng_ml','Vitamin D 25-OH (ng/mL)']]],
                      ['Liver',[['alt_u_l','ALT (U/L)'],['ast_u_l','AST (U/L)'],['ggt_u_l','GGT (U/L)'],['bilirubin_mg_dl','Bilirubin (mg/dL)']]],
                      ['Kidney',[['bun_mg_dl','BUN (mg/dL)'],['creatinine_mg_dl','Creatinine (mg/dL)'],['egfr_ml_min_1_73m2','eGFR'],['uric_acid_mg_dl','Uric Acid (mg/dL)']]],
                      ['Hormones',[['total_testosterone_ng_dl','Total Testosterone (ng/dL)'],['free_testosterone_pg_ml','Free Testosterone (pg/mL)'],['estradiol_pg_ml','Estradiol (pg/mL)'],['dhea_s_ug_dl','DHEA-S (ug/dL)']]],
                    ].map(([group,fields])=>(
                      <div key={group} style={{marginBottom:12}}>
                        <div style={{fontSize:8,fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:'rgba(255,255,255,0.25)',marginBottom:6}}>{group}</div>
                        {fields.map(([k,lbl])=><F key={k} label={lbl}><NI value={form.labs[k]} onChange={v=>upLb(k,v)}/></F>)}
                      </div>
                    ))}
                  </>
                )}
              </>
            )}
          </div>

          {/* Submit + result summary */}
          <div style={{padding:'10px 14px',borderTop:'1px solid rgba(255,255,255,0.08)'}}>
            <button onClick={handleSubmit}
              style={{width:'100%',padding:'9px 0',borderRadius:8,border:'1px solid rgba(255,255,255,0.25)',background:'rgba(255,255,255,0.08)',color:'#fff',fontSize:11,fontWeight:700,letterSpacing:'0.15em',textTransform:'uppercase',cursor:'pointer',transition:'all 0.2s'}}
              onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.14)';e.currentTarget.style.borderColor='rgba(255,255,255,0.4)'}}
              onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.08)';e.currentTarget.style.borderColor='rgba(255,255,255,0.25)'}}>
              Run Assessment
            </button>
            {results&&(
              <div style={{marginTop:10,textAlign:'center'}}>
                <div style={{fontSize:8,color:'rgba(255,255,255,0.3)',letterSpacing:'0.1em',textTransform:'uppercase'}}>Overall Risk Index</div>
                <div style={{fontSize:28,fontWeight:800,color:results.overall.overall_risk_index>=70?'#ef4444':results.overall.overall_risk_index>=50?'#f59e0b':'#10b981',marginTop:2}}>{Math.round(results.overall.overall_risk_index)}</div>
                <div style={{fontSize:8,color:'rgba(255,255,255,0.25)',marginTop:2}}>{results.mode==='lab'?'Lab Mode':'Non-Lab Mode'}</div>
                {results.overall.global_flags.length>0&&(
                  <div style={{marginTop:7,padding:'5px 8px',background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.3)',borderRadius:6}}>
                    {results.overall.global_flags.map(f=>(
                      <div key={f} style={{fontSize:8,color:'#ef4444',fontWeight:600}}>{f.replace(/_/g,' ').toUpperCase()}</div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Canvas ── */}
        <div style={{flex:1,position:'relative'}}>
          <ReactFlow
            nodes={nodes} edges={edges}
            onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView fitViewOptions={{padding:0.18,maxZoom:0.85}}
            style={{background:'var(--canvas-bg, #0c0e14)'}}
            minZoom={0.15} maxZoom={2}
            proOptions={{hideAttribution:true}}>
            <Background color="rgba(255,255,255,0.04)" gap={28} size={1.2}/>
            <Controls style={{background:'var(--gb-bg-1)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:6}}/>
          </ReactFlow>

          {/* Pipeline legend */}
          <div style={{position:'absolute',top:12,right:12,background:'rgba(10,12,18,0.92)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:8,padding:'9px 12px',backdropFilter:'blur(12px)'}}>
            <div style={{fontSize:7,fontWeight:700,letterSpacing:'0.16em',textTransform:'uppercase',color:'rgba(255,255,255,0.25)',marginBottom:7}}>Pipeline</div>
            {[
              ['MetaConfigNode','#7E57C2'],
              ['MetaInputNode','#42A5F5'],
              ['MetaEngineNode','rgba(255,255,255,0.7)'],
              ['MetaFlagNode','#FFB74D'],
              ['MetaScoreNode','#26A69A'],
              ['MetaResultNode','#AB47BC'],
              ['MetaStorageNode','#66BB6A'],
            ].map(([lbl,c])=>(
              <div key={lbl} style={{display:'flex',alignItems:'center',gap:6,marginBottom:4}}>
                <div style={{width:7,height:7,borderRadius:'50%',background:c,boxShadow:`0 0 5px ${c}66`,flexShrink:0}}/>
                <span style={{fontSize:8,color:'rgba(255,255,255,0.4)'}}>{lbl}</span>
              </div>
            ))}
            <div style={{borderTop:'1px solid rgba(255,255,255,0.07)',marginTop:7,paddingTop:7}}>
              <div style={{fontSize:7,fontWeight:700,letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(255,255,255,0.2)',marginBottom:5}}>Triads</div>
              {TRIADS.map(t=>(
                <div key={t.id} style={{display:'flex',alignItems:'center',gap:6,marginBottom:3}}>
                  <div style={{width:6,height:6,borderRadius:'50%',background:t.color,boxShadow:`0 0 5px ${t.color}66`,flexShrink:0}}/>
                  <span style={{fontSize:8,color:'rgba(255,255,255,0.4)'}}>{t.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default function MetoEnginePage() {
  return (
    <ReactFlowProvider>
      <MetoEngineContent/>
    </ReactFlowProvider>
  )
}





