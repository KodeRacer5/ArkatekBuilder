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

// Default positions — offset right to clear the logo (~300px left)
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
}

function loadPositions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

function savePositions(positions) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(positions)) } catch {}
}

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
  mini_input:   MiniInputNode,
  mini_engine:  MiniEngineNode,
  mini_triad:   (props) => <MiniTriadNode {...props} onEdit={props.data.onEdit}/>,
  mini_overall: MiniOverallNode,
}

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

function BannerCanvasInner({ height }) {
  const { results } = useMetoStore()
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges] = useEdgesState([])
  const [editTriad, setEditTriad] = useState(null)
  const { setViewport } = useReactFlow()
  const handleEdit = useCallback((d)=>setEditTriad(d),[])
  const savedPositionsRef = useRef(loadPositions())

  // Track drags and persist to localStorage
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

  useEffect(()=>{
    const {nodes:n,edges:e}=buildMetoGraph(results, handleEdit, savedPositionsRef.current)
    setNodes(n);setEdges(e)
  },[results,handleEdit])

  // Set viewport once on mount only — don't fight user pan
  const viewportSet = useRef(false)
  useEffect(()=>{
    if (!viewportSet.current) {
      viewportSet.current = true
      setTimeout(()=>setViewport({x:0,y:0,zoom:1}),50)
    }
  },[])

  return (
    <div style={{width:'100%',height,position:'relative'}}>
      <style>{`
        .banner-canvas .react-flow__attribution{display:none}
        .banner-canvas .react-flow__node{background:transparent!important;border:none!important;box-shadow:none!important;padding:0!important;pointer-events:auto!important}
        .banner-canvas .react-flow__handle{opacity:0}
        .banner-canvas .react-flow__edge.animated path{animation-duration:2.5s;stroke-dasharray:4 3}
      `}</style>
      <div className="banner-canvas" style={{width:'100%',height:'100%'}}>
        <ReactFlow
          nodes={nodes} edges={edges} nodeTypes={nodeTypes}
          onNodesChange={handleNodesChange}
          nodesDraggable={true} nodesConnectable={false} elementsSelectable={false}
          panOnDrag={false} panOnScroll={false}
          zoomOnScroll={false} zoomOnPinch={false} zoomOnDoubleClick={false}
          preventScrolling={false}
          nodeExtent={[[0, 0], [1600, 280]]}
          translateExtent={[[0, 0], [1600, 280]]}
          style={{background:'transparent',pointerEvents:'none'}} proOptions={{hideAttribution:true}}>
          <Background color="var(--gb-dot-grid)" gap={24} size={1.5}/>
        </ReactFlow>
      </div>
      {editTriad&&<EditPopover triad={editTriad} onClose={()=>setEditTriad(null)}/>}
      {/* Discreet reset button — bottom right corner */}
      <button
        onClick={()=>{ localStorage.removeItem(STORAGE_KEY); savedPositionsRef.current={}; const {nodes:n,edges:e}=buildMetoGraph(results,handleEdit,{}); setNodes(n);setEdges(e) }}
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
