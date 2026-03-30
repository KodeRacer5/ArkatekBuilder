'use client'
import React, { useState, useCallback, useRef, useEffect } from 'react'
import {
  ReactFlow, addEdge, useNodesState, useEdgesState, useReactFlow,
  ReactFlowProvider, Controls, MiniMap, Background, BackgroundVariant,
  Handle, Position, MarkerType, Panel,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

// ── DREAMS Domain ─────────────────────────────────────────────────────────────
const DEREGULATED = ['TX','OH','PA','IL','NY','NJ','MA','CT','MD','ME','NH','DC','DE','MI','OR']

const hw = (c) => ({ width:8,height:8,background:'#1a1a22',border:`1.5px solid ${c}`,borderRadius:'50%',boxShadow:`0 0 6px ${c}66` })
const HW = { width:8,height:8,background:'#1a1a22',border:'1.5px solid rgba(255,255,255,0.35)',borderRadius:'50%' }

// ── Node Palette Definition ────────────────────────────────────────────────────
const PALETTE = {
  'INTAKE': [
    { type:'rect', label:'Business Profile', desc:'Name, state, industry, employee count', icon:'🏢', color:'#83a598', ports:{out:['profile-out']} },
    { type:'rect', label:'Financial Data',   desc:'Revenue, debt load, cash flow',         icon:'💼', color:'#fabd2f', ports:{out:['fin-out']} },
    { type:'rect', label:'Benefits Data',    desc:'Current healthcare, 401k, payroll',     icon:'📋', color:'#d3869b', ports:{out:['ben-out']} },
    { type:'rect', label:'Utility Bills',    desc:'Energy provider, monthly kWh, cost',    icon:'⚡', color:'#fabd2f', ports:{out:['util-out']} },
    { type:'rect', label:'IT Infrastructure',desc:'Cloud spend, software subscriptions',   icon:'🖥', color:'#83a598', ports:{out:['it-out']} },
  ],
  'ANALYSIS': [
    { type:'circle', label:'Debt Analyzer',       desc:'Restructure opportunities + SBA match', icon:'D', color:'#fb4934', ports:{in:['fin-in'],out:['debt-out']} },
    { type:'circle', label:'Retirement Optimizer', desc:'401k vs GOALL vs IUL comparison',      icon:'R', color:'#d3869b', ports:{in:['ben-in'],out:['ret-out']} },
    { type:'circle', label:'Expense Optimizer',    desc:'Energy, healthcare, payroll reduction', icon:'E', color:'#fabd2f', ports:{in:['util-in','ben-in'],out:['exp-out']} },
    { type:'circle', label:'Asset Appraiser',      desc:'Protection, optimization, growth',     icon:'A', color:'#8ec07c', ports:{in:['fin-in'],out:['ast-out']} },
    { type:'circle', label:'Credit Recovery',      desc:'R&D credits, SETC, FICA reduction',    icon:'M', color:'#83a598', ports:{in:['profile-in'],out:['cred-out']} },
    { type:'circle', label:'Security Auditor',     desc:'Cyber, compliance, risk scoring',      icon:'S', color:'#b8bb26', ports:{in:['it-in'],out:['sec-out']} },
  ],
  'SCORING': [
    { type:'circle', label:'DREAM Score Engine', desc:'Composite savings score 0–100',         icon:'⚙', color:'#ffffff', ports:{in:['any-in'],out:['score-out']} },
    { type:'circle', label:'Gap Detector',        desc:'Flags missing data, asks questions',   icon:'!', color:'#fb4934', ports:{in:['any-in'],out:['gap-out']} },
    { type:'circle', label:'Signal Detector',     desc:'Auto-detects savings opportunities',   icon:'◈', color:'#fabd2f', ports:{in:['profile-in'],out:['sig-out']} },
  ],
  'OUTPUT': [
    { type:'rect', label:'Savings Report',    desc:'Full vertical breakdown PDF',              icon:'📄', color:'#b8bb26', ports:{in:['score-in']} },
    { type:'rect', label:'Gap List',          desc:'Ordered questions for agent meeting',      icon:'📝', color:'#fb4934', ports:{in:['gap-in']} },
    { type:'rect', label:'Living Appraisal',  desc:'Signed savings plan + monitor activation',icon:'✍', color:'#b8bb26', ports:{in:['score-in']} },
    { type:'rect', label:'Agent Briefing',    desc:'Pre-meeting intelligence summary',         icon:'🎯', color:'#83a598', ports:{in:['any-in']} },
  ],
}

// ── Scoring simulation ────────────────────────────────────────────────────────
async function simulateNode(nodeData, upstreamResults) {
  await new Promise(r => setTimeout(r, 400 + Math.random() * 800))
  const emp = parseInt(nodeData.businessProfile?.employeeCount) || 10
  const savings = Math.round(3000 + Math.random() * 15000) * Math.max(emp * 0.3, 1)
  return { savings, score: Math.round(40 + Math.random() * 55), status: 'complete' }
}

// ── NODE: Circle (analysis / scoring) ─────────────────────────────────────────
function CircleNode({ data, selected }) {
  const c = data.color || '#a89984'
  const st = data.status || 'idle'
  const glowColor = st==='complete'?c:st==='running'?c:'transparent'
  return (
    <div style={{width:90,height:90,borderRadius:'50%',background:st==='complete'?`radial-gradient(circle at 35% 30%,${c}22,#1a1a2e)`:'rgba(20,20,32,0.96)',border:`2px solid ${st==='complete'?c+'99':st==='running'?c+'55':selected?c+'44':'rgba(255,255,255,0.15)'}`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',boxShadow:st==='complete'?`0 0 24px ${c}44,0 0 8px ${c}22`:'0 4px 16px rgba(0,0,0,0.6)',transition:'all 0.3s',position:'relative',fontFamily:'DM Sans,system-ui,sans-serif'}}>
      {(data.ports?.in||[]).map((p,i)=>(<Handle key={p} id={p} type="target" position={Position.Left} style={{...hw(c),top:`${30+i*25}%`}}/>))}
      {(data.ports?.out||[]).map((p,i)=>(<Handle key={p} id={p} type="source" position={Position.Right} style={{...hw(c),top:`${30+i*25}%`}}/>))}
      <div style={{fontSize:18,fontWeight:900,color:st==='complete'?c:'rgba(255,255,255,0.6)',lineHeight:1}}>{data.icon}</div>
      <div style={{fontSize:8,fontWeight:600,color:st==='complete'?c:'rgba(255,255,255,0.4)',textAlign:'center',marginTop:4,maxWidth:70,lineHeight:1.2}}>{data.label}</div>
      {st==='running'&&<div style={{position:'absolute',inset:-4,borderRadius:'50%',border:`2px solid ${c}`,borderTopColor:'transparent',animation:'spin 1s linear infinite'}}/>}
    </div>
  )
}

const NODE_TYPES = { rect: RectNode, circle: CircleNode }

// ── NODE: Rect (data input / output) ──────────────────────────────────────────
function RectNode({ data, selected }) {
  const c = data.color || '#a89984'
  const st = data.status || 'idle'
  const borderColor = st==='complete'?c+'99':st==='running'?c+'66':st==='error'?'#fb493466':selected?c+'44':'rgba(255,255,255,0.1)'
  const bg = st==='complete'?`${c}0e`:st==='running'?`${c}07`:'rgba(26,26,34,0.96)'
  return (
    <div style={{background:bg,border:`1.5px solid ${borderColor}`,borderRadius:10,minWidth:170,maxWidth:220,fontFamily:'DM Sans,system-ui,sans-serif',overflow:'hidden',transition:'all 0.3s',boxShadow:st==='complete'?`0 0 16px ${c}22,0 4px 16px rgba(0,0,0,0.6)`:'0 4px 16px rgba(0,0,0,0.5)'}}>
      {(data.ports?.in||[]).map((p,i)=>(<Handle key={p} id={p} type="target" position={Position.Left} style={{...hw(c),top:`${25+i*20}%`}}/>))}
      {(data.ports?.out||[]).map((p,i)=>(<Handle key={p} id={p} type="source" position={Position.Right} style={{...hw(c),top:`${25+i*20}%`}}/>))}
      <div style={{padding:'8px 12px',display:'flex',alignItems:'center',gap:8,borderBottom:`1px solid ${c}18`}}>
        <div style={{width:24,height:24,borderRadius:6,background:`${c}18`,border:`1px solid ${c}33`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,flexShrink:0}}>{data.icon}</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:11,fontWeight:600,color:'#ebdbb2',lineHeight:1.2}}>{data.label}</div>
          <div style={{fontSize:8,color:'rgba(255,255,255,0.3)',marginTop:1,lineHeight:1.2,overflow:'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis'}}>{data.desc}</div>
        </div>
        {st==='running'&&<div style={{width:8,height:8,borderRadius:'50%',border:`1.5px solid ${c}`,borderTopColor:'transparent',animation:'spin 0.8s linear infinite',flexShrink:0}}/>}
        {st==='complete'&&<div style={{fontSize:9,color:c}}>✓</div>}
      </div>
      {st==='complete'&&data.result&&(
        <div style={{padding:'6px 12px',fontSize:9,color:c,fontWeight:600}}>
          {data.result.savings?`$${Math.round(data.result.savings).toLocaleString()}/yr · Score ${data.result.score}`:'Complete'}
        </div>
      )}
      {data.configOpen&&(
        <div style={{padding:'8px 12px',borderTop:`1px solid rgba(255,255,255,0.06)`}} className="nopan">
          {Object.entries(data.config||{}).map(([k,v])=>(
            <div key={k} style={{marginBottom:5}}>
              <div style={{fontSize:8,color:'rgba(255,255,255,0.3)',marginBottom:2,textTransform:'uppercase',letterSpacing:'0.08em'}}>{k}</div>
              <input value={v} onChange={e=>data.onConfig?.(k,e.target.value)}
                style={{width:'100%',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:5,padding:'4px 7px',fontSize:10,color:'#ebdbb2',outline:'none',fontFamily:'inherit',boxSizing:'border-box'}}/>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
function DREAMScoreCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges])

  return (
    <div style={{ width: '100%', height: '100%', background: '#0d1117' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={NODE_TYPES}
        fitView
      >
        <Background variant={BackgroundVariant.Dots} color="rgba(255,255,255,0.05)" gap={24} />
        <Controls />
        <MiniMap style={{ background: '#0a0f1a' }} />
      </ReactFlow>
    </div>
  )
}

export default function DREAMScorePage() {
  return (
    <ReactFlowProvider>
      <div style={{ width: '100vw', height: '100vh', background: '#0d1117' }}>
        <DREAMScoreCanvas />
      </div>
    </ReactFlowProvider>
  )
}
