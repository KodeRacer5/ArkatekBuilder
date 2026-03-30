'use client'
import { Handle, Position } from '@xyflow/react'
import { MoreVertical } from 'lucide-react'

// ─── Risk colors ──────────────────────────────────────────────────────────────
const RC = { low: '#b8bb26', moderate: '#fabd2f', high: '#fb4934' }

// ─── Shared primitives ────────────────────────────────────────────────────────
const cardBase = (borderColor) => ({
  background: 'var(--gb-node-bg)',
  border: `1px solid ${borderColor || 'var(--gb-node-border)'}`,
  borderRadius: 10,
  minWidth: 260,
  maxWidth: 320,
  fontFamily: '-apple-system, system-ui, sans-serif',
  boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
  overflow: 'hidden',
  cursor: 'grab',
})

const hBase = { width: 10, height: 10, background: 'var(--gb-bg)', border: '2px solid var(--gb-bg-4)', borderRadius: '50%' }
const hCol  = (c) => ({ ...hBase, borderColor: c })

function Header({ icon, name, type, accent = 'var(--gb-fg-1)' }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, padding:'11px 12px 9px' }}>
      <div style={{
        width:34, height:34, borderRadius:8, flexShrink:0,
        background:'var(--gb-bg-1)', border:'1px solid var(--gb-bg-2)',
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:11, fontWeight:800, color:accent,
      }}>{icon}</div>
      <div style={{ flex:1, overflow:'hidden' }}>
        <div style={{ fontSize:13, fontWeight:700, color:'var(--gb-fg-1)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{name}</div>
        <div style={{ fontSize:10, color:'var(--gb-fg-4)', marginTop:1 }}>{type}</div>
      </div>
      <MoreVertical size={13} color="var(--gb-bg-4)" style={{ flexShrink:0 }}/>
    </div>
  )
}

function Field({ label, value, color }) {
  if (!value && value !== 0) return null
  return (
    <div style={{ padding:'6px 12px', borderTop:'1px dashed var(--gb-bg-1)' }}>
      <span style={{ fontSize:11, fontWeight:700, color:'var(--gb-fg-3)' }}>{label}: </span>
      <span style={{ fontSize:11, color: color || 'var(--gb-fg-2)' }}>{value}</span>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. MetaConfigNode
// ─────────────────────────────────────────────────────────────────────────────
export function MetaConfigNode({ data }) {
  const a = data.active || false
  const accent = '#83a598'
  return (
    <div style={cardBase(a ? accent + '88' : undefined)}>
      <Handle type="source" position={Position.Right} id="config"   style={hCol(accent)}/>
      <Handle type="source" position={Position.Bottom} id="config_b" style={hCol(accent)}/>
      <Header icon="CFG" name="Assessment Config" type="MetaConfigNode" accent={accent}/>
      <Field label="Sections" value={data.sections || '5 active'}/>
      <Field label="Triads"   value={data.triads   || '5 enabled'}/>
      <Field label="Mode"     value={data.mode     || 'auto-detect'} color={a ? accent : undefined}/>
      <Field label="Status"   value={a ? 'Active' : 'Standby'} color={a ? '#b8bb26' : 'var(--gb-fg-4)'}/>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. MetaInputNode
// ─────────────────────────────────────────────────────────────────────────────
export function MetaInputNode({ data }) {
  const c = data.color || '#83a598'
  const f = data.filled || false
  return (
    <div style={cardBase(f ? c + '66' : undefined)}>
      <Handle type="target" position={Position.Left}  id="config" style={hCol(c)}/>
      <Handle type="source" position={Position.Right}         style={hCol(c)}/>
      <Header icon={data.icon || 'IN'} name={data.label} type="Input Data" accent={c}/>
      <Field label="Status" value={f ? 'Ready' : 'Awaiting input'} color={f ? '#b8bb26' : 'var(--gb-fg-4)'}/>
      {f && <Field label="Source" value="User intake form"/>}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. MetaEngineNode
// ─────────────────────────────────────────────────────────────────────────────
export function MetaEngineNode({ data }) {
  const a = data.active || false
  const accent = 'var(--gb-fg-1)'
  return (
    <div style={{
      ...cardBase(a ? 'var(--gb-fg-2)' : 'var(--gb-node-border)'),
      boxShadow: a ? '0 0 28px rgba(235,219,178,0.06), 0 4px 20px rgba(0,0,0,0.6)' : undefined,
    }}>
      <Handle type="target" position={Position.Left} id="payload"    style={hBase}/>
      <Handle type="target" position={Position.Top}  id="config"     style={hBase}/>
      <Handle type="source" position={Position.Right} id="raw_scores" style={hBase}/>
      <Header icon="MC" name="Metabolic Code" type="Scoring Engine" accent={a ? 'var(--gb-fg-0)' : 'var(--gb-fg-4)'}/>
      <Field label="Mode"       value={a ? (data.mode === 'lab' ? 'Lab Mode' : 'Non-Lab Mode') : 'Awaiting data'} color={a ? 'var(--gb-fg-0)' : undefined}/>
      {a && <Field label="Weights"    value={data.mode === 'lab' ? '0.4 / 0.2 / 0.4' : '0.6 / 0.4'}/>}
      <Field label="Tech Stack" value="JS Rules Engine / Python FastAPI"/>
      <Field label="Status"     value={a ? 'Processing' : 'Idle'} color={a ? '#b8bb26' : 'var(--gb-fg-4)'}/>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. MetaFlagNode
// ─────────────────────────────────────────────────────────────────────────────
export function MetaFlagNode({ data }) {
  const flags = data.flags || []
  const hasFlags = flags.length > 0
  const urgent = hasFlags && flags.some(f => f.includes('cardio'))
  const accent = urgent ? '#fb4934' : '#fabd2f'
  return (
    <div style={cardBase(hasFlags ? accent + '66' : undefined)}>
      <Handle type="target" position={Position.Left} id="raw_scores" style={hCol(accent)}/>
      <Handle type="target" position={Position.Top}  id="payload"    style={hCol(accent)}/>
      <Handle type="source" position={Position.Right} id="flagged"   style={hCol(accent)}/>
      <Header icon="!!" name="Risk Flags" type="MetaFlagNode" accent={accent}/>
      <Field label="Status" value={hasFlags ? `${flags.length} flag(s) active` : 'No active flags'} color={hasFlags ? accent : '#b8bb26'}/>
      {flags.map((f,i) => <Field key={i} label="Flag" value={f.replace(/_/g,' ')} color="#fb4934"/>)}
      <Field label="Rules" value="Diabetes · Hypertension · Cardio floors"/>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. MetaScoreNode
// ─────────────────────────────────────────────────────────────────────────────
export function MetaScoreNode({ data }) {
  const c = data.color || '#83a598'
  const s = data.scored || false
  const rc = data.risk_level ? RC[data.risk_level] : null
  return (
    <div style={cardBase(s ? c + '66' : undefined)}>
      <Handle type="target" position={Position.Left}  id="flagged"    style={hCol(c)}/>
      <Handle type="source" position={Position.Right} id="triad_card" style={hCol(c)}/>
      <Header icon={data.icon} name={data.label} type="Triad Score" accent={c}/>
      {s ? (
        <>
          <Field label="Composite"   value={`${Math.round(data.composite_score)} / 100`} color={rc || c}/>
          <Field label="Risk Level"  value={data.risk_level?.toUpperCase()} color={rc}/>
          {data.symptom_score != null && <Field label="Symptom Score" value={Math.round(data.symptom_score)}/>}
          {data.vitals_score  != null && <Field label="Vitals Score"  value={Math.round(data.vitals_score)}/>}
          {data.lab_score     != null && <Field label="Lab Score"     value={Math.round(data.lab_score)}/>}
        </>
      ) : (
        <Field label="Status" value="Awaiting engine output" color="var(--gb-fg-4)"/>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. MetaResultNode
// ─────────────────────────────────────────────────────────────────────────────
export function MetaResultNode({ data }) {
  const accent = '#d3869b'
  const r = data.ready || false
  const score = data.overall_risk_index ?? null
  const rc = score != null ? (score >= 70 ? '#fb4934' : score >= 50 ? '#fabd2f' : '#b8bb26') : null
  return (
    <div style={cardBase(r ? accent + '66' : undefined)}>
      <Handle type="target" position={Position.Left} id="triad_cards" style={hCol(accent)}/>
      <Handle type="target" position={Position.Top}  id="flagged_in"  style={hCol(accent)}/>
      <Handle type="source" position={Position.Right} id="result"     style={hCol(accent)}/>
      <Header icon="RES" name="Result & UX Payload" type="MetaResultNode" accent={accent}/>
      <Field label="Status"   value={r ? 'Complete' : 'Awaiting scored triads'} color={r ? '#b8bb26' : 'var(--gb-fg-4)'}/>
      {r && score != null && <Field label="Overall Risk Index" value={`${Math.round(score)} / 100`} color={rc}/>}
      {r && <Field label="Mode"   value={data.mode === 'lab' ? 'Lab Mode' : 'Non-Lab Mode'}/>}
      {r && (data.global_flags||[]).length > 0 && <Field label="Global Flags" value={data.global_flags.join(', ')} color="#fb4934"/>}
      <Field label="Output" value="triads · overall · flags · notes"/>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. MetaStorageNode
// ─────────────────────────────────────────────────────────────────────────────
export function MetaStorageNode({ data }) {
  const accent = '#b8bb26'
  const s = data.stored || false
  return (
    <div style={cardBase(s ? accent + '66' : undefined)}>
      <Handle type="target" position={Position.Left} id="result" style={hCol(accent)}/>
      <Header icon="DB" name="History Storage" type="MetaStorageNode" accent={accent}/>
      <Field label="Tech Stack"   value="IndexedDB · pj_results"/>
      <Field label="Status"       value={s ? 'Stored' : 'Ready'} color={s ? '#b8bb26' : 'var(--gb-fg-4)'}/>
      {s && <Field label="Stored At"     value={data.stored_at}/>}
      {s && <Field label="Assessment ID" value={data.assessment_id}/>}
      <Field label="Scalability"  value="Local · browser-persisted"/>
    </div>
  )
}


