'use client'
import React, { useState, useCallback, useEffect } from 'react'
import {
  ReactFlow, addEdge, useNodesState, useEdgesState,
  ReactFlowProvider, Background, BackgroundVariant, Handle, Position, MarkerType,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import Dock from '@/app/_components/ui/dashboard/Dock'
import '@/app/_components/ui/dashboard/Dock.css'
import {
  Home, Library, FlaskConical, Microscope, Info,
  Syringe, Atom, CalendarDays, ClipboardList, MessageSquare,
  Plus, LayoutGrid, Download, Clock,
} from 'lucide-react'

// ── Gruvbox tokens ────────────────────────────────────────────────────────────
const G = {
  bg:     '#282828', bgS:   '#32302f', bg1:   '#3c3836',
  fg:     '#ebdbb2', fgM:   '#a89984', fgL:   '#7c6f64',
  yellow: '#d79921', yHi:   '#fabd2f',
  red:    '#fb4934', green: '#b8bb26', teal:  '#83a598',
  aqua:   '#8ec07c', blue:  '#458588',
}

// ── APEX Vertical config ──────────────────────────────────────────────────────
const VERTICALS = [
  { id:'debt',       label:'Debt',       color:'#fb4934', icon:'D', desc:'Restructure · SBA Match · Credit Lines' },
  { id:'retirement', label:'Retirement', color:'#d3869b', icon:'R', desc:'401k · GOALL · IUL Comparison' },
  { id:'expense',    label:'Expense',    color:'#fabd2f', icon:'E', desc:'Energy · Healthcare · Payroll' },
  { id:'asset',      label:'Asset',      color:'#8ec07c', icon:'A', desc:'Protection · Optimization · Growth' },
  { id:'money',      label:'Money',      color:'#83a598', icon:'M', desc:'R&D Credits · SETC · FICA' },
  { id:'security',   label:'Security',   color:'#b8bb26', icon:'S', desc:'Cyber · Compliance · Risk' },
]

const INTEGRATIONS = [
  { id:'qbo',   label:'QuickBooks', domain:'quickbooks.intuit.com', color:'#2CA01C', vertical:['debt','expense','asset','money'] },
  { id:'plaid', label:'Plaid',      domain:'plaid.com',             color:'#00C8E0', vertical:['debt','money'] },
  { id:'gusto', label:'Gusto',      domain:'gusto.com',             color:'#F45D48', vertical:['retirement','security'] },
  { id:'stripe',label:'Stripe',     domain:'stripe.com',            color:'#6772E5', vertical:['money'] },
  { id:'irs',   label:'IRS',        domain:'irs.gov',               color:'#83a598', vertical:['money','security'], gov:true },
  { id:'sba',   label:'SBA',        domain:'sba.gov',               color:'#83a598', vertical:['debt'],             gov:true },
  { id:'grants',label:'Grants.gov', domain:'grants.gov',            color:'#8ec07c', vertical:['money','debt'],     gov:true },
  { id:'dsire', label:'DSIRE',      domain:'dsireusa.org',          color:'#b8bb26', vertical:['expense'],          gov:true },
]

// ── SVG icon paths ────────────────────────────────────────────────────────────
const ICONS = {
  home:    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>,
  apex:    <><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></>,
  connect: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
  report:  <><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
  about:   <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="8" strokeWidth="2.5"/><line x1="12" y1="12" x2="12" y2="16"/></>,
  debt:    <><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></>,
  retire:  <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
  expense: <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></>,
  asset:   <><circle cx="12" cy="12" r="10"/></>,
  money:   <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></>,
  security:<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>,
}

const DockSVG = ({ path, size=20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {path}
  </svg>
)

// ── Handle style helper ───────────────────────────────────────────────────────
const hw = (c) => ({
  width:8, height:8, background:G.bg,
  border:`1.5px solid ${c}`, borderRadius:'50%',
  boxShadow:`0 0 6px ${c}66`,
})

// ── NODE: Integration Source ──────────────────────────────────────────────────
function IntegrationNode({ data }) {
  const { label, domain, color, gov, connected } = data
  const favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
  return (
    <div style={{
      width:140, padding:'10px 12px',
      background: connected ? `${color}22` : 'rgba(60,56,54,0.95)',
      border:`1.5px solid ${connected ? color+'99' : color+'55'}`,
      borderRadius:10, fontFamily:'-apple-system,sans-serif',
      boxShadow: `0 0 16px ${color}33, 0 4px 16px rgba(0,0,0,0.7)`,
      transition:'all 0.3s',
    }}>
      <Handle id="out" type="source" position={Position.Right} style={hw(color)}/>
      <div style={{display:'flex',alignItems:'center',gap:8}}>
        <img src={favicon} alt={label}
          style={{width:24,height:24,borderRadius:6,objectFit:'contain',flexShrink:0}}
          onError={e=>{e.target.style.display='none';e.target.nextSibling.style.display='flex'}}
        />
        <div style={{
          width:24,height:24,borderRadius:6,display:'none',flexShrink:0,
          alignItems:'center',justifyContent:'center',
          background:`${color}30`,border:`1px solid ${color}66`,
          fontSize:9,fontWeight:900,color,
        }}>{label.slice(0,2).toUpperCase()}</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:11,fontWeight:700,color:'#ebdbb2',
            whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{label}</div>
          {gov&&<div style={{fontSize:8,color:G.teal,fontWeight:800,letterSpacing:'0.08em'}}>GOV DB</div>}
        </div>
        <div style={{
          width:7,height:7,borderRadius:'50%',flexShrink:0,
          background:connected?G.green:color+'66',
          boxShadow:connected?`0 0 6px ${G.green}`:`0 0 4px ${color}44`,
        }}/>
      </div>
    </div>
  )
}

// ── NODE: Vertical Score Card ─────────────────────────────────────────────────
function VerticalNode({ data }) {
  const { label, color, icon, score, desc } = data
  const lvl = score ?? 0
  const pct = (lvl / 4) * 100
  return (
    <div style={{
      width:160, padding:'14px 16px',
      background:`linear-gradient(145deg,${color}22,rgba(60,56,54,0.95))`,
      border:`2px solid ${color}88`,
      borderRadius:14, fontFamily:'-apple-system,sans-serif',
      boxShadow:`0 0 28px ${color}44, 0 0 8px ${color}22, 0 6px 20px rgba(0,0,0,0.7)`,
    }}>
      <Handle id="in"  type="target" position={Position.Left}  style={hw(color)}/>
      <Handle id="out" type="source" position={Position.Right} style={hw(color)}/>
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
        <div style={{
          width:32,height:32,borderRadius:'50%',flexShrink:0,
          background:`radial-gradient(circle at 35% 30%,${color}55,${color}22)`,
          border:`2px solid ${color}99`,
          display:'flex',alignItems:'center',justifyContent:'center',
          fontSize:14,fontWeight:900,color,
          boxShadow:`0 0 14px ${color}66, inset 0 1px 0 rgba(255,255,255,0.15)`,
        }}>{icon}</div>
        <div>
          <div style={{fontSize:13,fontWeight:800,color:'#ebdbb2'}}>{label}</div>
          <div style={{fontSize:9,color:G.fgM,lineHeight:1.3,marginTop:1}}>{desc}</div>
        </div>
      </div>
      <div style={{height:4,background:'rgba(168,153,132,0.2)',borderRadius:2,overflow:'hidden'}}>
        <div style={{height:'100%',width:`${pct}%`,background:color,borderRadius:2,
          boxShadow:`0 0 8px ${color}`,transition:'width 0.5s'}}/>
      </div>
      <div style={{display:'flex',justifyContent:'space-between',marginTop:5}}>
        <span style={{fontSize:9,color:G.fgM,fontWeight:600}}>APEX Score</span>
        <span style={{fontSize:9,fontWeight:800,color}}>{lvl}/4</span>
      </div>
    </div>
  )
}

// ── NODE: APEX Intelligence (center hub) ─────────────────────────────────────
function APEXHubNode({ data }) {
  const { activeVertical } = data
  const v = VERTICALS.find(v => v.id === activeVertical)
  const color = v?.color ?? G.yellow
  return (
    <div style={{
      width:220, padding:'16px',
      background:`linear-gradient(145deg,${G.bg1}f0,${G.bgS}f8)`,
      border:`1px solid ${color}55`,
      borderRadius:16, fontFamily:'-apple-system,sans-serif',
      boxShadow:`0 0 32px ${color}22, 0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(235,219,178,0.08)`,
    }}>
      <Handle id="in-l" type="target" position={Position.Left}  style={{...hw(G.yellow),top:'40%'}}/>
      <Handle id="in-g" type="target" position={Position.Left}  style={{...hw(G.teal),  top:'65%'}}/>
      <Handle id="out"  type="source" position={Position.Right} style={hw(G.green)}/>
      {/* Header */}
      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
        <div style={{
          width:34,height:34,borderRadius:10,flexShrink:0,
          background:`linear-gradient(145deg,${G.yellow}22,${G.yellow}08)`,
          border:`1px solid ${G.yellow}44`,
          display:'flex',alignItems:'center',justifyContent:'center',
          boxShadow:`0 0 14px ${G.yellow}22`,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={G.yellow} strokeWidth="1.8" strokeLinecap="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
          </svg>
        </div>
        <div>
          <div style={{fontSize:13,fontWeight:800,color:G.fg,letterSpacing:'-0.01em'}}>APEX Intelligence</div>
          <div style={{fontSize:8,color:G.yellow,fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',marginTop:1}}>Living Financial Position</div>
        </div>
      </div>
      {/* Vertical pills */}
      <div style={{display:'flex',flexWrap:'wrap',gap:4,marginBottom:10}}>
        {VERTICALS.map(v => (
          <div key={v.id} style={{
            fontSize:8,fontWeight:700,padding:'2px 6px',borderRadius:4,
            background:`${v.color}18`, border:`1px solid ${v.color}35`, color:v.color,
            letterSpacing:'0.04em',
          }}>{v.label}</div>
        ))}
      </div>
      <div style={{fontSize:9,color:G.fgM,lineHeight:1.6,borderTop:`1px solid rgba(168,153,132,0.1)`,paddingTop:8}}>
        Connect data sources to begin analysis. CortixEngine queries all 20 integrations automatically.
      </div>
    </div>
  )
}

// ── NODE: Output Report ──────────────────────────────────────────────────────
function OutputNode({ data }) {
  const { label, color, icon, desc } = data
  return (
    <div style={{
      width:150, padding:'10px 12px',
      background:`${G.bg1}cc`,
      border:`1px solid ${color}35`,
      borderLeft:`3px solid ${color}`,
      borderRadius:10, fontFamily:'-apple-system,sans-serif',
      boxShadow:'0 4px 14px rgba(0,0,0,0.5)',
    }}>
      <Handle id="in" type="target" position={Position.Left} style={hw(color)}/>
      <div style={{fontSize:11,fontWeight:700,color:G.fg,marginBottom:3}}>{icon} {label}</div>
      <div style={{fontSize:9,color:G.fgL,lineHeight:1.5}}>{desc}</div>
    </div>
  )
}

// ── Node types registry ───────────────────────────────────────────────────────
const NODE_TYPES = {
  integration: IntegrationNode,
  vertical:    VerticalNode,
  apexHub:     APEXHubNode,
  output:      OutputNode,
}

// ── Initial nodes — financial canvas layout ──────────────────────────────────
const INIT_NODES = [
  // Private integrations — left column top
  { id:'qbo',    type:'integration', position:{x:40,  y:60 }, data:{...INTEGRATIONS[0]} },
  { id:'plaid',  type:'integration', position:{x:40,  y:140}, data:{...INTEGRATIONS[1]} },
  { id:'gusto',  type:'integration', position:{x:40,  y:220}, data:{...INTEGRATIONS[2]} },
  { id:'stripe', type:'integration', position:{x:40,  y:300}, data:{...INTEGRATIONS[3]} },
  // Government integrations — left column bottom
  { id:'irs',    type:'integration', position:{x:40,  y:420}, data:{...INTEGRATIONS[4]} },
  { id:'sba',    type:'integration', position:{x:40,  y:500}, data:{...INTEGRATIONS[5]} },
  { id:'grants', type:'integration', position:{x:40,  y:580}, data:{...INTEGRATIONS[6]} },
  { id:'dsire',  type:'integration', position:{x:40,  y:660}, data:{...INTEGRATIONS[7]} },
  // APEX Hub — center
  { id:'apex',   type:'apexHub',     position:{x:340, y:280}, data:{activeVertical:null} },
  // Vertical scoring nodes — right of hub
  { id:'v-debt',     type:'vertical', position:{x:660, y:60 }, data:{...VERTICALS[0], score:0} },
  { id:'v-retire',   type:'vertical', position:{x:660, y:200}, data:{...VERTICALS[1], score:0} },
  { id:'v-expense',  type:'vertical', position:{x:660, y:340}, data:{...VERTICALS[2], score:0} },
  { id:'v-asset',    type:'vertical', position:{x:660, y:480}, data:{...VERTICALS[3], score:0} },
  { id:'v-money',    type:'vertical', position:{x:660, y:600}, data:{...VERTICALS[4], score:0} },
  { id:'v-security', type:'vertical', position:{x:660, y:720}, data:{...VERTICALS[5], score:0} },
  // Output nodes — far right
  { id:'out-lfp',   type:'output', position:{x:920, y:180}, data:{label:'Living Financial Position', color:G.green,  icon:'◈', desc:'Continuously updating financial intelligence'} },
  { id:'out-grants',type:'output', position:{x:920, y:320}, data:{label:'Grant Match Results',       color:G.teal,   icon:'🏛', desc:'Federal + state programs auto-matched'} },
  { id:'out-tax',   type:'output', position:{x:920, y:460}, data:{label:'Tax Credit Finder',          color:G.yellow, icon:'💰', desc:'R&D, SETC, FICA opportunities ranked'} },
  { id:'out-report',type:'output', position:{x:920, y:590}, data:{label:'APEX Report',               color:G.aqua,   icon:'📄', desc:'Full vertical breakdown + savings plan'} },
]

const mkEdge = (s, t, sh='out', th='in', c=G.fgL) => ({
  id:`${s}-${t}`, source:s, target:t, sourceHandle:sh, targetHandle:th,
  type:'smoothstep',
  style:{stroke:`${c}66`,strokeWidth:1.5},
  markerEnd:{type:MarkerType.ArrowClosed,width:10,height:10,color:`${c}66`},
  animated:false,
})

const INIT_EDGES = [
  // Integrations → APEX Hub
  mkEdge('qbo',    'apex','out','in-l',G.yellow),
  mkEdge('plaid',  'apex','out','in-l',G.yellow),
  mkEdge('gusto',  'apex','out','in-l',G.yellow),
  mkEdge('stripe', 'apex','out','in-l',G.yellow),
  mkEdge('irs',    'apex','out','in-g',G.teal),
  mkEdge('sba',    'apex','out','in-g',G.teal),
  mkEdge('grants', 'apex','out','in-g',G.teal),
  mkEdge('dsire',  'apex','out','in-g',G.teal),
  // APEX Hub → Verticals
  mkEdge('apex','v-debt',    'out','in',VERTICALS[0].color),
  mkEdge('apex','v-retire',  'out','in',VERTICALS[1].color),
  mkEdge('apex','v-expense', 'out','in',VERTICALS[2].color),
  mkEdge('apex','v-asset',   'out','in',VERTICALS[3].color),
  mkEdge('apex','v-money',   'out','in',VERTICALS[4].color),
  mkEdge('apex','v-security','out','in',VERTICALS[5].color),
  // Verticals → Outputs
  mkEdge('v-debt',    'out-lfp',   'out','in',G.green),
  mkEdge('v-expense', 'out-grants','out','in',G.teal),
  mkEdge('v-money',   'out-tax',   'out','in',G.yellow),
  mkEdge('v-asset',   'out-report','out','in',G.aqua),
]

// ── Top bar — mirrors site TopBar with APEX center pill ──────────────────────
function TopBar({ activeVertical, onVertical }) {
  const nav = (href) => window.location.href = href

  const leftItems = [
    { label:'Journal',   icon:<Home size={20} strokeWidth={1.6}/>,        onClick:()=>nav('/') },
    { label:'Bookshelf', icon:<Library size={20} strokeWidth={1.6}/>,     onClick:()=>nav('/bookshelf') },
    { label:'Protocols', icon:<FlaskConical size={20} strokeWidth={1.6}/>,onClick:()=>nav('/protocols') },
    { label:'Research',  icon:<Microscope size={20} strokeWidth={1.6}/>,  onClick:()=>nav('/research') },
    { label:'About',     icon:<Info size={20} strokeWidth={1.6}/>,        onClick:()=>nav('/about') },
  ]

  const rightItems = [
    { label:'New',        icon:<Plus size={20} strokeWidth={1.6}/>,         onClick:()=>{} },
    { label:'Integrations',icon:<LayoutGrid size={20} strokeWidth={1.6}/>,  onClick:()=>{} },
    { label:'Schedule',  icon:<CalendarDays size={20} strokeWidth={1.6}/>, onClick:()=>{} },
    { label:'Export',    icon:<Download size={20} strokeWidth={1.6}/>,     onClick:()=>{} },
    { label:'Chat',      icon:<MessageSquare size={20} strokeWidth={1.6}/>,onClick:()=>nav('/Message_Board') },
  ]

  const dockProps = { spring:{mass:0.05,stiffness:800,damping:18}, magnification:75, distance:120, baseItemSize:42 }

  return (
    <div style={{
      position:'absolute',top:0,left:0,right:0,zIndex:100,
      height:74, display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'0 24px', overflow:'visible',
      background:'rgba(40,40,40,0.85)', backdropFilter:'blur(20px)',
      borderBottom:'1px solid rgba(235,219,178,0.1)',
    }}>
      {/* Left dock */}
      <div style={{width:280,height:74,position:'relative',flexShrink:0}}>
        <div style={{position:'absolute',bottom:0,left:0,right:0,display:'flex',justifyContent:'center'}}>
          <Dock items={leftItems} {...dockProps}/>
        </div>
      </div>

      {/* Center — APEX pill (verticals) */}
      <div style={{flex:'1 1 auto',maxWidth:560,height:64,display:'flex',flexDirection:'column',
        alignItems:'center',justifyContent:'center',gap:6}}>
        <div style={{
          width:'100%',height:'100%',borderRadius:20,
          background:'rgba(60,56,54,0.85)',backdropFilter:'blur(16px)',
          border:'1px solid rgba(215,153,33,0.35)',
          boxShadow:'0 8px 32px rgba(0,0,0,0.5),inset 0 1px 0 rgba(250,189,47,0.15)',
          display:'flex',alignItems:'center',justifyContent:'space-between',
          padding:'0 20px',gap:8,overflow:'hidden',position:'relative',
        }}>
          <div style={{position:'absolute',top:0,left:0,right:0,height:1,
            background:'linear-gradient(90deg,transparent,rgba(250,189,47,0.3),transparent)'}}/>
          <div style={{fontSize:11,fontWeight:700,color:G.yellow,letterSpacing:'0.12em',
            textTransform:'uppercase',whiteSpace:'nowrap',flexShrink:0}}>
            APEX Financial Engine
          </div>
          <div style={{display:'flex',gap:6,alignItems:'center'}}>
            {VERTICALS.map(v=>(
              <div key={v.id} onClick={()=>onVertical(v.id)}
                style={{
                  width:36,height:36,borderRadius:10,cursor:'pointer',
                  display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:2,
                  background: activeVertical===v.id
                    ? `linear-gradient(145deg,${v.color}30,${v.color}15)`
                    : 'rgba(255,255,255,0.04)',
                  border:`1.5px solid ${activeVertical===v.id ? v.color+'80' : 'rgba(235,219,178,0.1)'}`,
                  boxShadow: activeVertical===v.id ? `0 0 10px ${v.color}40` : 'none',
                  transition:'all 0.15s',
                }}>
                <div style={{fontSize:13,fontWeight:900,color:v.color,lineHeight:1}}>{v.icon}</div>
                <div style={{fontSize:6,fontWeight:700,color:v.color,letterSpacing:'0.05em',
                  textTransform:'uppercase',lineHeight:1}}>{v.label.slice(0,3)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right dock */}
      <div style={{width:280,height:74,position:'relative',flexShrink:0}}>
        <div style={{position:'absolute',bottom:0,left:0,right:0,display:'flex',justifyContent:'center'}}>
          <Dock items={rightItems} {...dockProps}/>
        </div>
      </div>
    </div>
  )
}

// ── Bottom node strip ─────────────────────────────────────────────────────────
function BottomStrip({ activeVertical, onVertical }) {
  return (
    <div style={{
      position:'absolute', bottom:20, left:'50%', transform:'translateX(-50%)',
      zIndex:50, display:'flex', gap:10, pointerEvents:'auto',
    }}>
      {VERTICALS.map(v => (
        <div key={v.id} onClick={()=>onVertical(v.id)}
          style={{
            width:64, height:64, borderRadius:12, cursor:'pointer',
            background: activeVertical===v.id
              ? `linear-gradient(145deg,${v.color}25,${v.color}10)`
              : `${G.bgS}cc`,
            border:`2px solid ${activeVertical===v.id ? v.color+'88' : 'rgba(235,219,178,0.12)'}`,
            display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:4,
            backdropFilter:'blur(20px)',
            boxShadow: activeVertical===v.id
              ? `0 0 20px ${v.color}33, 0 4px 16px rgba(0,0,0,0.5)`
              : '0 4px 14px rgba(0,0,0,0.5)',
            transition:'all 0.2s',
          }}>
          <div style={{
            width:28,height:28,borderRadius:'50%',
            background:`${v.color}20`, border:`1.5px solid ${v.color}55`,
            display:'flex',alignItems:'center',justifyContent:'center',
            fontSize:13,fontWeight:900,color:v.color,
          }}>{v.icon}</div>
          <div style={{fontSize:8,fontWeight:700,color:activeVertical===v.id?G.fg:G.fgL,
            letterSpacing:'0.04em',textTransform:'uppercase'}}>{v.label}</div>
        </div>
      ))}
    </div>
  )
}

// ── Canvas inner ─────────────────────────────────────────────────────────────
function APEXCanvas({ activeVertical, setActiveVertical }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(INIT_NODES)
  const [edges, setEdges, onEdgesChange] = useEdgesState(INIT_EDGES)
  const onConnect = useCallback((p) => setEdges(eds => addEdge(p, eds)), [setEdges])

  useEffect(() => {
    if (!activeVertical) return
    setNodes(nds => nds.map(n => {
      if (n.type === 'vertical') {
        const isActive = n.data.id === activeVertical
        return { ...n, data:{ ...n.data, score: isActive ? Math.min((n.data.score||0)+1,4) : n.data.score } }
      }
      return n
    }))
  }, [activeVertical])

  return (
    <div style={{width:'100%',height:'100%',
      backgroundImage:'linear-gradient(rgba(69,133,136,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(69,133,136,0.07) 1px,transparent 1px)',
      backgroundSize:'60px 60px',
    }}>
      <ReactFlow
        nodes={nodes} edges={edges}
        onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={NODE_TYPES}
        defaultViewport={{ x: 120, y: 60, zoom: 0.85 }}
        minZoom={0.2} maxZoom={2.5}
        proOptions={{hideAttribution:true}}
        style={{width:'100%',height:'100%',background:'transparent'}}
        onInit={(instance) => {
          setTimeout(() => instance.fitView({ padding: 0.18, includeHiddenNodes: false }), 150)
        }}
      >
        <Background color="transparent" />
      </ReactFlow>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
function APEXPageInner() {
  const [activeVertical, setActiveVertical] = useState(null)

  useEffect(() => {
    console.log('[APEX] nodes:', INIT_NODES.length, 'edges:', INIT_EDGES.length)
  }, [])

  return (
    <div style={{
      width:'100vw', height:'100vh', overflow:'hidden',
      background:'#1d2021', position:'fixed', top:0, left:0,
      fontFamily:'-apple-system,sans-serif',
    }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .react-flow__attribution { display: none !important; }
        .react-flow__controls {
          background: rgba(50,48,47,0.9) !important;
          border: 1px solid rgba(235,219,178,0.15) !important;
          border-radius: 8px !important;
          bottom: 100px !important;
        }
        .react-flow__controls-button {
          background: transparent !important;
          border-bottom: 1px solid rgba(235,219,178,0.08) !important;
          color: #a89984 !important; fill: #a89984 !important;
        }
        .react-flow__edge-path { stroke-opacity: 0.85 !important; }
        .react-flow__edge-path:hover { stroke-opacity: 1 !important; }
      `}</style>

      {/* TopBar — site nav */}
      <TopBar activeVertical={activeVertical} onVertical={setActiveVertical}/>

      {/* Canvas — below the 74px topbar */}
      <div style={{position:'absolute',top:74,left:0,right:0,bottom:0}}>
        <APEXCanvas activeVertical={activeVertical} setActiveVertical={setActiveVertical}/>
      </div>

      {/* Bottom strip */}
      <BottomStrip activeVertical={activeVertical} onVertical={setActiveVertical}/>

      {/* Watermark */}
      <div style={{
        position:'fixed',bottom:6,left:'50%',transform:'translateX(-50%)',
        zIndex:200,pointerEvents:'none',
        fontSize:9,color:'rgba(168,153,132,0.15)',fontWeight:500,
        letterSpacing:'0.12em',textTransform:'uppercase',
      }}>
        CortixEngine Financial · ArkatekBuilder · Adaptive Financial Intelligence System
      </div>
    </div>
  )
}

  return (
    <div style={{
      width:'100vw', height:'100vh', overflow:'hidden',
      background:`radial-gradient(ellipse at 40% 40%, ${G.bgS} 0%, ${G.bg} 60%, #1d2021 100%)`,
      position:'fixed', top:0, left:0, fontFamily:'-apple-system,sans-serif',
    }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .apex-active .dock-item {
          background: linear-gradient(145deg,rgba(250,189,47,0.25),rgba(250,189,47,0.12)) !important;
          border-color: rgba(250,189,47,0.40) !important;
          box-shadow: 0 6px 18px rgba(250,189,47,0.22), inset 0 1px 0 rgba(250,189,47,0.28) !important;
        }
        .react-flow__attribution { display: none !important; }
        .react-flow__controls { background: ${G.bgS}cc !important; border: 1px solid rgba(235,219,178,0.12) !important; border-radius: 8px !important; }
        .react-flow__controls-button { background: transparent !important; border-bottom: 1px solid rgba(235,219,178,0.08) !important; color: ${G.fgM} !important; }
        .react-flow__minimap { background: ${G.bg}dd !important; border: 1px solid rgba(235,219,178,0.1) !important; border-radius: 8px !important; }
        .react-flow__edge-path { stroke-opacity: 0.7; }
      `}</style>

      {/* Top bar — three docks */}
      <TopBar
        activeView={activeView}
        onView={setActiveView}
        activeVertical={activeVertical}
        onVertical={setActiveVertical}
      />

      {/* React Flow Canvas — always mounted as background */}
      <div style={{position:'absolute',inset:0,zIndex:1,width:'100%',height:'100%',pointerEvents:'auto'}}>
        <APEXCanvas
          activeVertical={activeVertical}
          setActiveVertical={setActiveVertical}
        />
      </div>

      {/* Bottom strip */}
      <BottomStrip activeVertical={activeVertical} onVertical={setActiveVertical}/>

      {/* CortixEngine brand — bottom center watermark */}
      <div style={{
        position:'absolute', bottom:8, left:'50%', transform:'translateX(-50%)',
        zIndex:100, pointerEvents:'none',
        fontSize:9, color:'rgba(168,153,132,0.2)',
        fontWeight:500, letterSpacing:'0.1em', textTransform:'uppercase',
        fontFamily:'-apple-system,sans-serif',
      }}>
        CortixEngine Financial · ArkatekBuilder · Adaptive Financial Intelligence System
      </div>
    </div>
  )
}

export default function APEXPage() {
  return (
    <ReactFlowProvider>
      <APEXPageInner/>
    </ReactFlowProvider>
  )
}
