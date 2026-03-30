'use client'
import React, { useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { ReactFlow, Background, Controls, MiniMap, addEdge, useNodesState, useEdgesState, Handle, Position, Panel } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import TopBar from '@/app/_components/ui/dashboard/top-bar'

const PROTOCOL_TEMPLATES = {
  bpc157:    '/templates/protocol_bpc157.json',
  tb500:     '/templates/protocol_tb500.json',
  semax:     '/templates/protocol_semax.json',
  ghk_cu:    '/templates/protocol_ghkcu.json',
  khavinson: '/templates/think_tank_khavinson.json',
}
const DEFAULT_TEMPLATE = '/templates/demo_muscle_gain.json'

const W = 'rgba(255,255,255,'
const HANDLE_LEFT  = (c) => ({ width:10, height:10, background:'var(--canvas-bg, #0c0e14)', border:`2px solid ${c}`, borderRadius:'50%', boxShadow:`0 0 8px ${c}66` })
const HANDLE_RIGHT = (c) => ({ width:10, height:10, background:'var(--canvas-bg, #0c0e14)', border:`2px solid ${c}`, borderRadius:'50%', boxShadow:`0 0 8px ${c}66` })
const HW = { width:10, height:10, background:'var(--canvas-bg, #0c0e14)', border:'2px solid rgba(255,255,255,0.5)', borderRadius:'50%', boxShadow:'0 0 8px rgba(255,255,255,0.2)' }

/* ─── ISLAND BOUNDARY NODE — visual box behind all think tank nodes ─── */
function IslandBoundaryNode({ data }) {
  return (
    <div style={{
      width: data.w || 2000, height: data.h || 1200,
      border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: 24, pointerEvents: 'none',
      background: 'transparent',
      boxShadow: '0 0 60px rgba(255,255,255,0.02), inset 0 0 60px rgba(255,255,255,0.01)',
      position: 'relative',
    }}>
      {/* corner accents */}
      {[
        { top:-1, left:-1,   borderWidth:'2px 0 0 2px', borderRadius:'6px 0 0 0' },
        { top:-1, right:-1,  borderWidth:'2px 2px 0 0', borderRadius:'0 6px 0 0' },
        { bottom:-1, left:-1,  borderWidth:'0 0 2px 2px', borderRadius:'0 0 0 6px' },
        { bottom:-1, right:-1, borderWidth:'0 2px 2px 0', borderRadius:'0 0 6px 0' },
      ].map((s,i) => <div key={i} style={{ position:'absolute', width:16, height:16, borderStyle:'solid', borderColor:'rgba(255,255,255,0.55)', ...s }}/>)}
      {/* top label */}
      <div style={{
        position:'absolute', top:-11, left:32,
        background:'var(--canvas-bg, #0c0e14)', padding:'0 14px',
        fontSize:8, fontWeight:700, letterSpacing:'0.2em',
        textTransform:'uppercase', color:'rgba(255,255,255,0.3)',
        whiteSpace:'nowrap', pointerEvents:'none',
      }}>{data.label || 'Think Tank'}</div>
      {/* meta top-right */}
      {(data.meta||[]).map((m,i) => (
        <div key={i} style={{
          position:'absolute', top:16+i*16, right:22,
          fontSize:7.5, letterSpacing:'0.1em',
          color:'rgba(255,255,255,0.18)', textTransform:'uppercase',
          textAlign:'right', pointerEvents:'none',
        }}>{m}</div>
      ))}
    </div>
  )
}

/* ─── ORB NODE — the think tank center, freely draggable ─── */
function OrbNode({ data }) {
  const inst = data.shortName || 'Think Tank'
  return (
    <div style={{ position:'relative', width:330, height:330, cursor:'grab' }}>
      <style>{`
        @keyframes tt-spin  { to { transform: rotate(360deg); } }
        @keyframes tt-spinr { to { transform: rotate(-360deg); } }
        .tt-r1 { animation: tt-spin  14s linear infinite; }
        .tt-r2 { animation: tt-spinr  9s linear infinite; }
      `}</style>
      {/* glow */}
      <div style={{ position:'absolute', inset:-24, borderRadius:'50%', background:'radial-gradient(ellipse,rgba(255,255,255,0.05) 0%,transparent 68%)', pointerEvents:'none' }}/>
      {/* outer ring */}
      <div className="tt-r1" style={{ position:'absolute', inset:0, borderRadius:'50%', border:'1.5px solid rgba(255,255,255,0.45)' }}/>
      {/* inner ring */}
      <div className="tt-r2" style={{ position:'absolute', inset:8, borderRadius:'50%', border:'1px solid rgba(255,255,255,0.18)', borderTopColor:'rgba(255,255,255,0.65)' }}/>
      {/* core glass */}
      <div style={{ position:'absolute', inset:50, borderRadius:'50%', background:'transparent', border:'1px solid rgba(255,255,255,0.1)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:3 }}>
        <div style={{ fontSize:9, fontWeight:700, letterSpacing:'0.18em', color:'rgba(255,255,255,0.85)', textTransform:'uppercase', textAlign:'center', lineHeight:1.6 }}>St. Peter Institute of<br/> Bioregulation and Gerontology</div>
        <div style={{ fontSize:7, letterSpacing:'0.1em', color:'rgba(255,255,255,0.3)', textTransform:'uppercase', textAlign:'center' }}>{inst}</div>
      </div>
      {/* 8 connection handles around the orb */}
      <Handle type="target" position={Position.Left}   id="l"  style={{ ...HW, top:'50%', left:2 }}/>
      <Handle type="source" position={Position.Right}  id="r"  style={{ ...HW, top:'50%', right:2 }}/>
      <Handle type="target" position={Position.Top}    id="t"  style={{ ...HW, top:2, left:'50%' }}/>
      <Handle type="source" position={Position.Bottom} id="b"  style={{ ...HW, bottom:2, left:'50%' }}/>
      <Handle type="target" position={Position.Left}   id="tl" style={{ ...HW, top:'25%', left:18 }}/>
      <Handle type="target" position={Position.Left}   id="bl" style={{ ...HW, top:'75%', left:18 }}/>
      <Handle type="source" position={Position.Right}  id="tr" style={{ ...HW, top:'25%', right:18 }}/>
      <Handle type="source" position={Position.Right}  id="br" style={{ ...HW, top:'75%', right:18 }}/>
    </div>
  )
}

/* ─── SMALL ORB NODE — for Patent Archive etc ─── */
function SmallOrbNode({ data }) {
  return (
    <div style={{ position:'relative', width:180, height:180, cursor:'grab' }}>
      <div style={{ position:'absolute', inset:-16, borderRadius:'50%', background:'radial-gradient(ellipse,rgba(255,255,255,0.04) 0%,transparent 68%)', pointerEvents:'none' }}/>
      <div className="tt-r1" style={{ position:'absolute', inset:0, borderRadius:'50%', border:'1.5px solid rgba(255,255,255,0.4)' }}/>
      <div className="tt-r2" style={{ position:'absolute', inset:6, borderRadius:'50%', border:'1px solid rgba(255,255,255,0.15)', borderTopColor:'rgba(255,255,255,0.55)' }}/>
      <div style={{ position:'absolute', inset:28, borderRadius:'50%', background:'transparent', border:'1px solid rgba(255,255,255,0.08)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:2, padding:'0 10px' }}>
        <div style={{ fontSize:7, fontWeight:700, letterSpacing:'0.14em', color:'rgba(255,255,255,0.35)', textTransform:'uppercase', textAlign:'center' }}>{data.tag||'Archive'}</div>
        <div style={{ fontSize:8.5, fontWeight:700, letterSpacing:'0.05em', color:'rgba(255,255,255,0.85)', textAlign:'center', lineHeight:1.4 }}>{data.label}</div>
        {data.sub && <div style={{ fontSize:6.5, color:'rgba(255,255,255,0.3)', textAlign:'center', marginTop:2, lineHeight:1.4 }}>{data.sub}</div>}
      </div>
      <Handle type="target" position={Position.Left}   id="l"  style={{ ...HW, top:'50%', left:4 }}/>
      <Handle type="source" position={Position.Right}  id="r"  style={{ ...HW, top:'50%', right:4 }}/>
      <Handle type="target" position={Position.Top}    id="t"  style={{ ...HW, top:4, left:'50%' }}/>
      <Handle type="source" position={Position.Bottom} id="b"  style={{ ...HW, bottom:4, left:'50%' }}/>
      <Handle type="target" position={Position.Left}   id="tl" style={{ ...HW, top:'28%', left:16 }}/>
      <Handle type="target" position={Position.Left}   id="bl" style={{ ...HW, top:'72%', left:16 }}/>
      <Handle type="source" position={Position.Right}  id="tr" style={{ ...HW, top:'28%', right:16 }}/>
      <Handle type="source" position={Position.Right}  id="br" style={{ ...HW, top:'72%', right:16 }}/>
    </div>
  )
}

function TTResearcherNode({ data }) {
  return (
    <div style={{ background:'var(--gb-bg-soft)', border:'1.5px solid rgba(255,255,255,0.5)', borderLeft:'3px solid rgba(255,255,255,0.6)', borderRadius:'3px 10px 10px 3px', padding:'8px 12px', minWidth:200, boxShadow:'0 0 14px rgba(255,255,255,0.08), 0 4px 16px rgba(0,0,0,0.6)', cursor:'grab' }}>
      <Handle type="target" position={Position.Left}   style={HW}/>
      <Handle type="source" position={Position.Right}  style={HW}/>
      <Handle type="source" position={Position.Top}    id="t" style={HW}/>
      <Handle type="source" position={Position.Bottom} id="b" style={HW}/>
      <div style={{ fontSize:7, fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(255,255,255,0.3)', marginBottom:3 }}>{data.tag||'Researcher'}</div>
      <div style={{ fontSize:10, fontWeight:700, color:'#fff', whiteSpace:'nowrap' }}>{data.label}</div>
      {data.sub  && <div style={{ fontSize:8, color:'rgba(255,255,255,0.4)', marginTop:2 }}>{data.sub}</div>}
      {data.desc && <div style={{ fontSize:7, color:'rgba(255,255,255,0.22)', marginTop:4, paddingTop:4, borderTop:'1px solid rgba(255,255,255,0.07)', lineHeight:1.5 }}>{data.desc}</div>}
    </div>
  )
}

/* ─── TT DATABASE NODE ─── */
function TTDatabaseNode({ data }) {
  return (
    <div style={{ background:'var(--gb-bg-soft)', border:'1.5px solid rgba(255,255,255,0.5)', borderTop:'2.5px solid rgba(255,255,255,0.6)', borderRadius:10, padding:'8px 12px', minWidth:200, boxShadow:'0 0 14px rgba(255,255,255,0.08), 0 4px 16px rgba(0,0,0,0.6)', cursor:'grab' }}>
      <Handle type="target" position={Position.Left}   style={HW}/>
      <Handle type="source" position={Position.Right}  style={HW}/>
      <Handle type="target" position={Position.Top}    id="t" style={HW}/>
      <Handle type="source" position={Position.Bottom} id="b" style={HW}/>
      <div style={{ fontSize:7, fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(255,255,255,0.3)', marginBottom:3 }}>Database</div>
      <div style={{ fontSize:10, fontWeight:700, color:'#fff', whiteSpace:'nowrap' }}>{data.label}</div>
      {data.sub  && <div style={{ fontSize:8, color:'rgba(255,255,255,0.4)', marginTop:2 }}>{data.sub}</div>}
      {data.desc && <div style={{ fontSize:7, color:'rgba(255,255,255,0.22)', marginTop:4, paddingTop:4, borderTop:'1px solid rgba(255,255,255,0.07)', lineHeight:1.5 }}>{data.desc}</div>}
    </div>
  )
}

/* ─── TT ENGINE NODE ─── */
function TTEngineNode({ data }) {
  return (
    <div style={{ background:'var(--gb-bg-soft)', border:'2px solid rgba(255,255,255,0.55)', borderRadius:12, padding:'10px 14px', minWidth:210, boxShadow:'0 0 24px rgba(255,255,255,0.1), 0 0 8px rgba(255,255,255,0.06), 0 4px 20px rgba(0,0,0,0.6)', cursor:'grab' }}>
      <Handle type="target" position={Position.Left}   style={HW}/>
      <Handle type="source" position={Position.Right}  style={HW}/>
      <Handle type="target" position={Position.Top}    id="t" style={HW}/>
      <Handle type="source" position={Position.Bottom} id="b" style={HW}/>
      <div style={{ fontSize:7, fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(255,255,255,0.45)', marginBottom:3 }}>{data.tag||'CortixEngine'}</div>
      <div style={{ fontSize:13, fontWeight:800, color:'#fff' }}>{data.label}</div>
      {data.sub  && <div style={{ fontSize:8, color:'rgba(255,255,255,0.4)', marginTop:2 }}>{data.sub}</div>}
      {data.desc && <div style={{ fontSize:7, color:'rgba(255,255,255,0.22)', marginTop:4, paddingTop:4, borderTop:'1px solid rgba(255,255,255,0.08)', lineHeight:1.5 }}>{data.desc}</div>}
    </div>
  )
}

/* ─── TT MCP NODE ─── */
function TTMCPNode({ data }) {
  return (
    <div style={{ background:'var(--gb-bg-soft)', border:'1.5px dashed rgba(255,255,255,0.4)', borderRadius:10, padding:'8px 12px', minWidth:185, boxShadow:'0 0 10px rgba(255,255,255,0.06), 0 4px 14px rgba(0,0,0,0.5)', cursor:'grab' }}>
      <Handle type="target" position={Position.Left}   style={HW}/>
      <Handle type="source" position={Position.Right}  style={HW}/>
      <Handle type="target" position={Position.Top}    id="t" style={HW}/>
      <Handle type="source" position={Position.Bottom} id="b" style={HW}/>
      <div style={{ fontSize:7, fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(255,255,255,0.3)', marginBottom:3 }}>MCP Tool</div>
      <div style={{ fontSize:10, fontWeight:700, color:'#fff', whiteSpace:'nowrap' }}>{data.label}</div>
      {data.sub && <div style={{ fontSize:8, color:'rgba(255,255,255,0.4)', marginTop:2 }}>{data.sub}</div>}
    </div>
  )
}

/* ─── TT OUTPUT NODE ─── */
function TTOutputNode({ data }) {
  return (
    <div style={{ background:'var(--gb-bg-soft)', border:'1.5px solid rgba(255,255,255,0.5)', borderRight:'3px solid rgba(255,255,255,0.6)', borderRadius:'10px 3px 3px 10px', padding:'8px 12px', minWidth:200, boxShadow:'0 0 14px rgba(255,255,255,0.08), 0 4px 16px rgba(0,0,0,0.6)', cursor:'grab' }}>
      <Handle type="target" position={Position.Left}   style={HW}/>
      <Handle type="source" position={Position.Right}  style={HW}/>
      <Handle type="source" position={Position.Top}    id="t" style={HW}/>
      <Handle type="source" position={Position.Bottom} id="b" style={HW}/>
      <div style={{ fontSize:7, fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(255,255,255,0.3)', marginBottom:3 }}>{data.tag||'Output'}</div>
      <div style={{ fontSize:10, fontWeight:700, color:'#fff', whiteSpace:'nowrap' }}>{data.label}</div>
      {data.sub  && <div style={{ fontSize:8, color:'rgba(255,255,255,0.4)', marginTop:2 }}>{data.sub}</div>}
      {data.desc && <div style={{ fontSize:7, color:'rgba(255,255,255,0.22)', marginTop:4, paddingTop:4, borderTop:'1px solid rgba(255,255,255,0.07)', lineHeight:1.5 }}>{data.desc}</div>}
    </div>
  )
}

/* ─── PILL NODE ─── */
function PillNode({ data }) {
  const c = data.color || '#a855f7'
  return (
    <div style={{ background:'var(--gb-bg-soft)', border:`1.5px solid ${c}77`, borderRadius:14, padding:'8px 14px', display:'flex', alignItems:'center', gap:10, boxShadow:`0 0 16px ${c}20, 0 2px 10px rgba(0,0,0,0.5)`, minWidth:200, maxWidth:240, cursor:'grab' }}>
      <Handle type="target" position={Position.Left}  style={HANDLE_LEFT(c)}/>
      <Handle type="source" position={Position.Right} style={HANDLE_RIGHT(c)}/>
      <div style={{ width:26, height:26, borderRadius:6, background:`${c}18`, border:`1px solid ${c}44`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:c, flexShrink:0 }}>{data.icon||'N'}</div>
      <div>
        <div style={{ fontSize:12, fontWeight:600, color:'#fff', whiteSpace:'nowrap' }}>{data.label}</div>
        <div style={{ fontSize:9, color:`${c}99` }}>{data.sub||''}</div>
      </div>
    </div>
  )
}

/* ─── ENGINE NODE ─── */
function EngineNode({ data }) {
  const c = data.color || '#ec4899'
  return (
    <div style={{ background:'var(--gb-bg-soft)', border:`2px solid ${c}88`, borderRadius:16, minWidth:260, boxShadow:`0 0 30px ${c}20, 0 0 60px ${c}08, 0 6px 24px rgba(0,0,0,0.5)`, cursor:'grab' }}>
      <Handle type="target" position={Position.Left}  style={HANDLE_LEFT(c)}/>
      <Handle type="source" position={Position.Right} style={HANDLE_RIGHT(c)}/>
      <div style={{ padding:'12px 16px 10px', borderBottom:`1px solid ${c}22`, display:'flex', alignItems:'center', gap:12 }}>
        <div style={{ width:38, height:38, borderRadius:10, background:`${c}15`, border:`1.5px solid ${c}55`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:800, color:c }}>{data.icon||'E'}</div>
        <div>
          <div style={{ fontSize:15, fontWeight:700, color:'#fff' }}>{data.label}</div>
          <div style={{ fontSize:10, color:`${c}bb`, fontWeight:500 }}>{data.sub||'Engine'}</div>
        </div>
      </div>
      <div style={{ padding:'8px 16px 12px' }}>
        {data.tech        && <div style={{ fontSize:11, color:'rgba(255,255,255,0.55)' }}>{data.tech}</div>}
        {data.description && <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', marginTop:3 }}>{data.description}</div>}
      </div>
    </div>
  )
}

/* ─── DATABASE NODE ─── */
function DatabaseNode({ data }) {
  const c = data.color || '#f59e0b'
  return (
    <div style={{ background:'var(--gb-bg-soft)', border:`1.5px solid ${c}77`, borderRadius:12, minWidth:180, boxShadow:`0 0 24px ${c}18, 0 4px 16px rgba(0,0,0,0.5)`, cursor:'grab' }}>
      <Handle type="target" position={Position.Left}  style={HANDLE_LEFT(c)}/>
      <Handle type="source" position={Position.Right} style={HANDLE_RIGHT(c)}/>
      <div style={{ padding:'10px 14px', display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ width:34, height:34, borderRadius:8, background:`${c}12`, border:`1.5px solid ${c}44`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, color:c }}>{data.icon||'DB'}</div>
        <div>
          <div style={{ fontSize:13, fontWeight:600, color:'#fff' }}>{data.label}</div>
          <div style={{ fontSize:9, color:`${c}99` }}>{data.sub||'Database'}</div>
        </div>
      </div>
      {data.tech && <div style={{ padding:'0 14px 8px', fontSize:10, color:'rgba(255,255,255,0.4)' }}>{data.tech}</div>}
    </div>
  )
}

/* ─── ROUTER NODE ─── */
function RouterNode({ data }) {
  const c = data.color || '#06b6d4'
  return (
    <div style={{ background:'var(--gb-bg-soft)', border:`2px solid ${c}88`, width:80, height:80, transform:'rotate(45deg)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 0 24px ${c}25`, cursor:'grab' }}>
      <Handle type="target" position={Position.Left}   style={{ ...HANDLE_LEFT(c),  transform:'rotate(-45deg)', left:-6 }}/>
      <Handle type="source" position={Position.Right}  style={{ ...HANDLE_RIGHT(c), transform:'rotate(-45deg)', right:-6 }}/>
      <Handle type="target" position={Position.Top}    id="top"    style={{ ...HANDLE_LEFT(c),  transform:'rotate(-45deg)', top:-6 }}/>
      <Handle type="source" position={Position.Bottom} id="bottom" style={{ ...HANDLE_RIGHT(c), transform:'rotate(-45deg)', bottom:-6 }}/>
      <div style={{ transform:'rotate(-45deg)', textAlign:'center' }}>
        <div style={{ fontSize:14, fontWeight:800, color:c }}>{data.icon||'\u2194'}</div>
        <div style={{ fontSize:9, fontWeight:700, color:'#fff', whiteSpace:'nowrap', marginTop:2 }}>{data.label}</div>
      </div>
    </div>
  )
}

/* ─── OUTPUT NODE ─── */
function OutputNode({ data }) {
  const c = data.color || '#22d3ee'
  return (
    <div style={{ background:'var(--gb-bg-soft)', border:`1.5px solid ${c}66`, borderRadius:10, minWidth:200, maxWidth:240, padding:'10px 14px', boxShadow:`0 0 20px ${c}15, 0 4px 16px rgba(0,0,0,0.4)`, display:'flex', alignItems:'center', gap:10, cursor:'grab' }}>
      <Handle type="target" position={Position.Left}  style={HANDLE_LEFT(c)}/>
      <Handle type="source" position={Position.Right} style={HANDLE_RIGHT(c)}/>
      <div style={{ width:28, height:28, borderRadius:6, background:`${c}15`, border:`1px solid ${c}44`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:c, flexShrink:0 }}>{data.icon||'O'}</div>
      <div>
        <div style={{ fontSize:12, fontWeight:600, color:'#fff' }}>{data.label}</div>
        <div style={{ fontSize:9, color:`${c}88` }}>{data.sub||''}</div>
      </div>
    </div>
  )
}

/* ─── ARCH NODE ─── */
function ArchNode({ data }) {
  const c = data.color || '#6c757d'
  return (
    <div style={{ background:'var(--gb-bg-soft)', border:`1.5px solid ${c}88`, borderRadius:14, minWidth:200, maxWidth:240, boxShadow:`0 0 20px ${c}15, 0 4px 20px rgba(0,0,0,0.5)`, cursor:'grab' }}>
      <Handle type="target" position={Position.Left}  style={HANDLE_LEFT(c)}/>
      <Handle type="source" position={Position.Right} style={HANDLE_RIGHT(c)}/>
      <div style={{ padding:'10px 12px 8px', borderBottom:`1px solid ${c}22`, display:'flex', alignItems:'center', justifyContent:'space-between', gap:8 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, overflow:'hidden' }}>
          <div style={{ width:32, height:32, borderRadius:8, flexShrink:0, background:`${c}15`, border:`1px solid ${c}44`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:800, color:c }}>{data.icon||'N'}</div>
          <div style={{ overflow:'hidden' }}>
            <div style={{ fontSize:13, fontWeight:600, color:'#fff', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{data.label}</div>
            <div style={{ fontSize:10, color:`${c}aa`, marginTop:1 }}>{data.sub||''}</div>
          </div>
        </div>
        <div style={{ color:'rgba(255,255,255,0.3)', fontSize:16, flexShrink:0 }}>{'\u22EE'}</div>
      </div>
      <div style={{ padding:'8px 12px 10px' }}>
        {data.tech        && <div style={{ fontSize:11, color:'rgba(255,255,255,0.6)', lineHeight:1.4 }}><span style={{ color:`${c}88`, fontSize:10, fontWeight:600 }}>Stack: </span>{data.tech}</div>}
        {data.description && <div style={{ fontSize:10, color:'rgba(255,255,255,0.35)', lineHeight:1.4 }}>{data.description}</div>}
      </div>
    </div>
  )
}

/* ─── NODE TYPE REGISTRY ─── */
const nodeTypes = {
  pill:         PillNode,
  engine:       EngineNode,
  database:     DatabaseNode,
  router:       RouterNode,
  output:       OutputNode,
  arch:         ArchNode,
  island:       IslandBoundaryNode,
  orb:          OrbNode,
  small_orb:    SmallOrbNode,
  tt_researcher: TTResearcherNode,
  tt_database:  TTDatabaseNode,
  tt_engine:    TTEngineNode,
  tt_mcp:       TTMCPNode,
  tt_output:    TTOutputNode,
}

/* ─── EDGE COLOR MAP ─── */
const EDGE_COLORS = {
  data:'#f97316', analysis:'#ec4899', optimize:'#a855f7',
  safety:'#ef4444', protocol:'#22d3ee',
  tt:'rgba(255,255,255,0.35)',
  default:'rgba(255,255,255,0.4)',
}

/* ─── TEMPLATE → RF NODES/EDGES ─── */
function templateToRF(data) {
  const rfNodes = []
  const rfEdges = []

  data.components.forEach(c => {
    /* expand think tank island into individual RF nodes */
    if (c.nodeType === 'thinktank') {
      const p = c.properties || {}
      const ox = c.position.x + 700, oy = c.position.y + 430

      /* island boundary — visual box behind all nodes */
      rfNodes.unshift({
        id: c.id + '_boundary', type:'island',
        position:{ x:ox-820, y:oy-620 },
        data:{
          w: 2000, h: 1200,
          label:`Think Tank · ${p.institution || 'Institute'} · ${p.country || ''}`,
          meta: p.meta || [],
        },
        style:{ zIndex:-1 },
        selectable: false,
        draggable: true,
      })

      /* orb */
      rfNodes.push({ id: c.id + '_orb', type:'orb', position:{ x:ox, y:oy },
        data:{ shortName: p.shortName || p.institution?.slice(0,12) || 'TT', country: p.country || '' } })

      /* researchers — positioned per screenshot layout */
      const rPos = [
        { x:ox-680, y:oy-340 },
        { x:ox-560, y:oy-180 },
        { x:ox-720, y:oy-60  },
        { x:ox-560, y:oy+100 },
        { x:ox-560, y:oy+270 },
      ]
      ;(p.researchers||[]).forEach((r,i) => rfNodes.push({
        id:`${c.id}_r${i}`, type:'tt_researcher',
        position: rPos[i] || { x:ox-600, y:oy+i*160 },
        data:{ label:r.name, tag:r.tag, sub:r.sub, desc:r.desc }
      }))

      /* databases — Patent Archive top center, others bottom */
      const dbPos = [
        { x:ox-180, y:oy+420 },
        { x:ox-400, y:oy+380 },
        { x:ox-90,  y:oy-560 },
      ]
      ;(p.databases||[]).forEach((db,i) => {
        const isOrb = db.name === 'Patent Archive'
        rfNodes.push({
          id:`${c.id}_db${i}`, type: isOrb ? 'small_orb' : 'tt_database',
          position: dbPos[i] || { x:ox+i*250, y:oy+400 },
          data:{ label:db.name, tag: isOrb ? 'Archive' : 'Database', sub:db.sub, desc:db.desc }
        })
      })

      /* engines — center right */
      const ePos = [
        { x:ox+280, y:oy-100 },
        { x:ox+480, y:oy+80  },
      ]
      ;(p.engines||[]).forEach((e,i) => rfNodes.push({
        id:`${c.id}_e${i}`, type:'tt_engine',
        position: ePos[i] || { x:ox+300, y:oy+i*240 },
        data:{ label:e.name, tag:e.tag, sub:e.sub, desc:e.desc }
      }))

      /* mcp tools — right of orb vertical stack per screenshot */
      const tPos = [
        { x:ox+100, y:oy-280 },
        { x:ox+100, y:oy-100 },
        { x:ox+100, y:oy+80  },
      ]
      ;(p.tools||[]).forEach((t,i) => rfNodes.push({
        id:`${c.id}_t${i}`, type:'tt_mcp',
        position: tPos[i] || { x:ox+100, y:oy+i*160 },
        data:{ label:t.name, sub:t.sub }
      }))

      /* outputs — far right column per screenshot */
      const oPos = [
        { x:ox+700, y:oy-300 },
        { x:ox+860, y:oy-140 },
        { x:ox+700, y:oy+20  },
        { x:ox+860, y:oy+180 },
        { x:ox+680, y:oy+380 },
      ]
      ;(p.outputs||[]).forEach((o,i) => rfNodes.push({
        id:`${c.id}_o${i}`, type:'tt_output',
        position: oPos[i] || { x:ox+700, y:oy+i*160 },
        data:{ label:o.name, tag:o.tag, sub:o.sub, desc:o.desc }
      }))
      return
    }

    /* all other node types */
    rfNodes.push({
      id: c.id, type: c.nodeType || 'pill', position: c.position,
      data:{
        label:c.name, color:c.color, icon:c.icon, sub:c.sub,
        tech:c.properties?.tech_stack, description:c.properties?.description,
      }
    })
  })

  data.connections.forEach((conn,i) => {
    const ec = EDGE_COLORS[conn.edgeColor] || EDGE_COLORS.default
    rfEdges.push({
      id:`e${i}`, source:conn.from, target:conn.to,
      sourceHandle:conn.sourceHandle||null, targetHandle:conn.targetHandle||null,
      label:conn.label||'', type:'smoothstep', animated:true,
      style:{ stroke:ec, strokeWidth:1.2 },
      labelStyle:{ fill:'rgba(255,255,255,0.6)', fontSize:9, fontWeight:500 },
      labelBgStyle:{ fill:'var(--gb-bg-soft)', fillOpacity:0.95 },
      labelBgPadding:[5,3], labelBgBorderRadius:3,
    })
  })

  return { rfNodes, rfEdges }
}

function ResearchPageContent() {
  const searchParams = useSearchParams()
  const protocolKey  = searchParams.get('protocol')
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  useEffect(() => {
    const url = (protocolKey && PROTOCOL_TEMPLATES[protocolKey]) || DEFAULT_TEMPLATE
    fetch(url).then(r=>r.json()).then(data => {
      const { rfNodes, rfEdges } = templateToRF(data)
      setNodes(rfNodes)
      setEdges(rfEdges)
    })
  }, [protocolKey])

  const onConnect = useCallback(p => setEdges(e => addEdge({
    ...p, type:'smoothstep', animated:true,
    style:{ stroke:'rgba(255,255,255,0.35)', strokeWidth:1.2 },
  }, e)), [setEdges])

  return (
    <div style={{ width:'100vw', height:'100vh', background:'var(--canvas-bg, #0c0e14)', display:'flex', flexDirection:'column' }}>
      <style>{`
        .react-flow__controls-button { background:var(--gb-bg-1) !important; border-bottom:1px solid rgba(255,255,255,0.08) !important; }
        .react-flow__controls-button svg { fill:rgba(255,255,255,0.4) !important; }
        .react-flow__controls-button:hover svg { fill:rgba(255,255,255,0.85) !important; }
        .react-flow__controls { border:1px solid rgba(255,255,255,0.08) !important; border-radius:6px !important; overflow:hidden; }
        .react-flow__edge.animated path { animation-duration:1.8s; stroke-dasharray:5 3; }
        .react-flow__edge path { filter:drop-shadow(0 0 2px rgba(255,255,255,0.12)); }
        .react-flow__attribution { display:none; }
        .react-flow__node { background:transparent !important; border:none !important; box-shadow:none !important; padding:0 !important; }
        .react-flow__handle { opacity:0; transition:opacity 0.2s; }
        .react-flow__node:hover .react-flow__handle { opacity:1; }
        .react-flow__handle:hover { opacity:1 !important; transform:scale(1.4); }
        .react-flow__connection-line { stroke:rgba(255,255,255,0.5) !important; stroke-width:1.5 !important; }
      `}</style>
      <TopBar view="list" setView={()=>{}} onUpload={null} searchQuery="" setSearchQuery={()=>{}}/>
      <div style={{ flex:1, position:'relative', paddingTop:32 }}>
        <ReactFlow
          nodes={nodes} edges={edges}
          onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView fitViewOptions={{ padding:0.15, maxZoom:0.7 }}
          style={{ background:'var(--canvas-bg, #0c0e14)' }}
          minZoom={0.05} maxZoom={2}
          connectionLineStyle={{ stroke:'rgba(255,255,255,0.5)', strokeWidth:1.5 }}
          connectionLineType="smoothstep"
        >
          <Background color="rgba(255,255,255,0.5)" gap={30} size={1.5}/>
          <Controls style={{ background:'var(--gb-bg-1)de', border:'1px solid rgba(255,255,255,0.08)', borderRadius:6 }}/>
          <MiniMap style={{ background:'var(--gb-bg-1)', border:'1px solid rgba(255,255,255,0.06)' }} nodeColor="#2a2d35"/>
          <Panel position="top-left" style={{ margin:8, marginTop:4 }}>
            <img src="/canvas_logo.png" alt="Logo" style={{ height:70, width:'auto', display:'block' }}/>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  )
}

export default function ResearchPage() {
  return (
    <Suspense fallback={<div style={{ width:'100vw', height:'100vh', background:'var(--canvas-bg, #0c0e14)', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.5)' }}>Loading...</div>}>
      <ResearchPageContent/>
    </Suspense>
  )
}


