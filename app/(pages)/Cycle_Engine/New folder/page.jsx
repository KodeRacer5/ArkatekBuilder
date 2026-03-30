'use client'
import React, { useEffect, useCallback, useRef, useState, Suspense } from 'react'
import {
  ReactFlow, Background, Controls, MiniMap, addEdge,
  applyNodeChanges, useNodesState, useEdgesState,
  Handle, Position, Panel, ReactFlowProvider, NodeResizer
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import TopBar from '@/app/_components/ui/dashboard/top-bar'

const HL = (c) => ({ width:10,height:10,background:'var(--canvas-bg,#0c0e14)',border:`2px solid ${c}`,borderRadius:'50%',boxShadow:`0 0 8px ${c}66` })
const HW = { width:10,height:10,background:'var(--canvas-bg,#0c0e14)',border:'2px solid rgba(255,255,255,0.35)',borderRadius:'50%' }

const COMPOUNDS = [
  { id:'bpc157', name:'BPC-157', cat:'Signaling',  color:'#fb4934', dose:250, unit:'mcg', freq:'Daily',   route:'SubQ',        adh:88,  next:'Today 7am',
    mechanism:'Pentadecapeptide from human gastric juice. Promotes tissue repair via NO pathways, angiogenesis, and VEGF expression.',
    stack:'Synergistic with TB-500 for accelerated healing. Avoid concurrent NSAIDs.',
    days:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30] },
  { id:'tb500',  name:'TB-500',  cat:'Signaling',  color:'#83a598', dose:2,   unit:'mg',  freq:'Mon/Thu', route:'SubQ',        adh:75,  next:'Thu',
    mechanism:'Thymosin Beta-4 fragment. Systemic healing via actin upregulation and angiogenesis. Not site-specific.',
    stack:'Complements BPC-157. BPC-157 = local. TB-500 = systemic. Powerful for chronic injuries.',
    days:[2,5,9,12,16,19,23,26,30] },
  { id:'ghkcu',  name:'GHK-Cu',  cat:'Longevity',  color:'#fabd2f', dose:1,   unit:'mg',  freq:'Daily',   route:'SubQ/Topical',adh:100, next:'Today 7am',
    mechanism:'Copper peptide naturally present in human plasma. Stimulates collagen synthesis and wound healing.',
    stack:'Pairs well with BPC-157 for tissue repair. Anti-fibrotic properties complement peptide stacks.',
    days:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30] },
  { id:'semax',  name:'Semax',   cat:'Cognitive',  color:'#8ec07c', dose:400, unit:'mcg', freq:'Daily',   route:'Intranasal',  adh:60,  next:'Today AM',
    mechanism:'ACTH(4-7) analog. Upregulates BDNF and has neuroprotective effects. Developed in Russia.',
    stack:'Stack with Selank for anxiolytic balance. Avoid stacking with stimulants.',
    days:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30] },
]

const TAKEN = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]
const MISSED = [6,10]
const TODAY = 17

// ─── Sparkline ────────────────────────────────────────────────────────────────
function Sparkline({ data, color, width=120, height=32 }) {
  const max=Math.max(...data), min=Math.min(...data)
  const pts=data.map((v,i)=>{
    const x=(i/(data.length-1))*width
    const y=height-((v-min)/(max-min||1))*(height-4)-2
    return `${x},${y}`
  }).join(' ')
  return (
    <svg width={width} height={height} style={{display:'block'}}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" opacity="0.85"/>
      <polyline points={`0,${height} ${pts} ${width},${height}`} fill={`${color}15`} stroke="none"/>
    </svg>
  )
}

// ─── Node: Full Compound Card (all data) ──────────────────────────────────────
function CompoundCardNode({ data }) {
  const c = data.color
  const [mult, setMult] = useState(100)
  const adjDose = data.unit==='mcg' ? Math.round(data.dose*mult/100) : +(data.dose*mult/100).toFixed(1)
  const sparkData = useRef(Array.from({length:12},()=>Math.round(data.dose*(0.65+Math.random()*0.7))))
  return (
    <div style={{background:'linear-gradient(155deg,rgba(62,58,56,0.97) 0%,rgba(26,26,26,0.99) 100%)',backdropFilter:'blur(28px) saturate(160%)',WebkitBackdropFilter:'blur(28px) saturate(160%)',boxShadow:'0 24px 64px rgba(0,0,0,0.75),inset 0 1px 0 rgba(235,219,178,0.09),inset 0 -1px 0 rgba(0,0,0,0.45)',border:`1px solid ${c}33`,borderRadius:18,minWidth:280,maxWidth:300,fontFamily:'-apple-system,sans-serif',overflow:'hidden'}}>
      <Handle type="target" position={Position.Left} style={HL(c)}/>
      <Handle type="source" position={Position.Right} style={HL(c)}/>
      {/* Header */}
      <div style={{padding:'10px 14px',borderBottom:`1px dashed ${c}22`,display:'flex',alignItems:'center',gap:8}}>
        <div style={{width:30,height:30,borderRadius:7,background:`${c}18`,border:`1px solid ${c}44`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:700,color:c,flexShrink:0}}>{data.icon}</div>
        <div style={{flex:1}}>
          <div style={{fontSize:13,fontWeight:500,color:'#ebdbb2'}}>{data.name}</div>
          <div style={{fontSize:9,color:'#665c54',textTransform:'uppercase',letterSpacing:'0.08em'}}>{data.cat}</div>
        </div>
        <span style={{fontSize:9,padding:'2px 6px',borderRadius:4,background:`${c}15`,border:`1px solid ${c}33`,color:c}}>{data.route}</span>
      </div>
      {/* Sparkline */}
      <div style={{padding:'8px 14px 4px',borderBottom:`1px dashed ${c}11`}}>
        <Sparkline data={sparkData.current} color={c} width={252} height={28}/>
        <div style={{display:'flex',justifyContent:'space-between',fontSize:8,color:'#665c54',marginTop:1}}>
          <span>Wk 1</span><span>Wk 4</span><span>Wk 8</span><span>Wk 12</span>
        </div>
      </div>
      {/* Body */}
      <div style={{padding:'10px 14px'}}>
        <div style={{fontSize:9,fontWeight:500,letterSpacing:'0.1em',textTransform:'uppercase',color:'#665c54',borderBottom:'1px dashed rgba(255,255,255,0.06)',paddingBottom:4,marginBottom:8}}>Mechanism</div>
        <div style={{fontSize:10,color:'#a89984',lineHeight:1.6,marginBottom:10}}>{data.mechanism}</div>
        <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:6,padding:'8px 10px',marginBottom:10}}>
          <div style={{fontSize:9,fontWeight:500,letterSpacing:'0.1em',textTransform:'uppercase',color:'#665c54',marginBottom:6}}>Dosing Protocol</div>
          {[['Dose',`${adjDose} ${data.unit}`],['Frequency',data.freq],['Route',data.route],['Timing','Morning']].map(([k,v])=>(
            <div key={k} style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
              <span style={{fontSize:10,color:'#665c54'}}>{k}</span>
              <span style={{fontSize:10,fontWeight:500,color:k==='Dose'?c:'#ebdbb2'}}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{fontSize:9,fontWeight:500,letterSpacing:'0.1em',textTransform:'uppercase',color:'#665c54',marginBottom:4}}>Stack Notes</div>
        <div style={{fontSize:10,color:'#a89984',lineHeight:1.5,padding:'6px 8px',background:'rgba(255,255,255,0.02)',borderRadius:5,borderLeft:`2px solid ${c}44`,marginBottom:10}}>{data.stack}</div>
        <div style={{fontSize:9,fontWeight:500,letterSpacing:'0.1em',textTransform:'uppercase',color:'#665c54',marginBottom:4}}>Dose Adjust</div>
        <div style={{display:'flex',alignItems:'center',gap:8}} className="nopan">
          <input type="range" min="50" max="200" step="10" value={mult}
            onChange={e=>setMult(parseInt(e.target.value))}
            style={{flex:1,accentColor:c,cursor:'pointer'}}/>
          <span style={{fontSize:11,fontWeight:500,color:c,minWidth:52,textAlign:'right'}}>{adjDose} {data.unit}</span>
        </div>
        <div style={{marginTop:10}}>
          <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:3}}>
            <span style={{fontSize:10,color:'#a89984'}}>Adherence</span>
            <div style={{flex:1,height:3,background:'rgba(255,255,255,0.06)',borderRadius:2,overflow:'hidden'}}>
              <div style={{height:'100%',width:`${data.adh}%`,background:data.adh>=80?'#b8bb26':data.adh>=60?'#fabd2f':'#fb4934',borderRadius:2}}/>
            </div>
            <span style={{fontSize:10,color:data.adh>=80?'#b8bb26':data.adh>=60?'#fabd2f':'#fb4934',fontWeight:500}}>{data.adh}%</span>
          </div>
          <div style={{fontSize:9,color:'#665c54',textAlign:'right'}}>Next: {data.next}</div>
        </div>
      </div>
    </div>
  )
}

// ─── Node: Individual Dose Dial ───────────────────────────────────────────────
function DoseDialNode({ data }) {
  const c = data.color || '#fabd2f'
  const [val, setVal] = useState(100)
  const dragging = useRef(false)
  const startY = useRef(0), startVal = useRef(100)
  const min=50, max=200
  const pct=(val-min)/(max-min)
  const totalArc=270, startAng=-135
  const currentAng=startAng+pct*totalArc
  const rad=d=>d*Math.PI/180
  const cx=60,cy=60,R=44
  const arcPt=(deg)=>({x:cx+R*Math.cos(rad(deg)),y:cy+R*Math.sin(rad(deg))})
  const descArc=(from,to)=>{
    const s=arcPt(from),e=arcPt(to),large=to-from>180?1:0
    return `M${s.x},${s.y} A${R},${R} 0 ${large} 1 ${e.x},${e.y}`
  }
  const ndlPt=arcPt(currentAng)
  const ndlShort={x:cx+(R-10)*Math.cos(rad(currentAng)),y:cy+(R-10)*Math.sin(rad(currentAng))}
  const adjDose = data.unit==='mcg' ? Math.round(data.dose*val/100) : +(data.dose*val/100).toFixed(1)

  const onMouseDown=(e)=>{e.stopPropagation();dragging.current=true;startY.current=e.clientY;startVal.current=val}
  const onMouseMove=useCallback((e)=>{
    if(!dragging.current)return
    const dy=startY.current-e.clientY
    setVal(v=>Math.min(max,Math.max(min,Math.round((startVal.current+dy*1.5)/5)*5)))
  },[])
  const onMouseUp=useCallback(()=>{dragging.current=false},[])
  useEffect(()=>{
    window.addEventListener('mousemove',onMouseMove)
    window.addEventListener('mouseup',onMouseUp)
    return()=>{window.removeEventListener('mousemove',onMouseMove);window.removeEventListener('mouseup',onMouseUp)}
  },[onMouseMove,onMouseUp])

  return (
    <div style={{background:'linear-gradient(155deg,rgba(62,58,56,0.97) 0%,rgba(26,26,26,0.99) 100%)',backdropFilter:'blur(28px) saturate(160%)',WebkitBackdropFilter:'blur(28px) saturate(160%)',boxShadow:'0 24px 64px rgba(0,0,0,0.75),inset 0 1px 0 rgba(235,219,178,0.09),inset 0 -1px 0 rgba(0,0,0,0.45)',border:`1px solid ${c}33`,borderRadius:18,minWidth:160,fontFamily:'-apple-system,sans-serif',overflow:'hidden',textAlign:'center'}}>
      <Handle type="target" position={Position.Left} style={HL(c)}/>
      <Handle type="source" position={Position.Right} style={HL(c)}/>
      <div style={{padding:'10px 14px 4px',borderBottom:`1px dashed ${c}22`}}>
        <div style={{fontSize:11,fontWeight:500,color:'#ebdbb2'}}>{data.name}</div>
        <div style={{fontSize:9,color:'#665c54',textTransform:'uppercase',letterSpacing:'0.08em'}}>{data.cat}</div>
      </div>
      <div style={{padding:'10px',userSelect:'none'}} className="nopan">
        <svg width="120" height="120" style={{display:'block',margin:'0 auto',cursor:'ns-resize'}} onMouseDown={onMouseDown}>
          <circle cx={cx} cy={cy} r={R+8} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
          <path d={descArc(startAng,startAng+totalArc)} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="8" strokeLinecap="round"/>
          <path d={descArc(startAng,currentAng)} fill="none" stroke={c} strokeWidth="8" strokeLinecap="round" opacity="0.9"/>
          {Array.from({length:9},(_,i)=>{
            const a=startAng+(i/8)*totalArc
            const i1={x:cx+(R-4)*Math.cos(rad(a)),y:cy+(R-4)*Math.sin(rad(a))}
            const o1={x:cx+(R+4)*Math.cos(rad(a)),y:cy+(R+4)*Math.sin(rad(a))}
            return <line key={i} x1={i1.x} y1={i1.y} x2={o1.x} y2={o1.y} stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" strokeLinecap="round"/>
          })}
          <circle cx={cx} cy={cy} r="28" fill="rgba(0,0,0,0.25)" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
          <circle cx={cx} cy={cy} r="18" fill={`${c}10`} stroke={`${c}33`} strokeWidth="1"/>
          <line x1={ndlShort.x} y1={ndlShort.y} x2={ndlPt.x} y2={ndlPt.y} stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
          <circle cx={cx} cy={cy} r="4" fill={c}/>
          <text x={cx} y={cy+4} textAnchor="middle" fontSize="10" fontWeight="500" fill={c}>{val}%</text>
        </svg>
        <div style={{fontSize:16,fontWeight:500,color:c,marginTop:2}}>{adjDose} {data.unit}</div>
        <div style={{fontSize:9,color:'#665c54',marginTop:2}}>drag to adjust</div>
      </div>
    </div>
  )
}

// ─── Node: Master Dial ────────────────────────────────────────────────────────
function MasterDialNode({ data }) {
  const [val, setVal] = useState(100)
  const dragging = useRef(false)
  const startY = useRef(0), startVal = useRef(100)
  const min=50, max=200
  const pct=(val-min)/(max-min)
  const totalArc=270, startAng=-135
  const currentAng=startAng+pct*totalArc
  const rad=d=>d*Math.PI/180
  const cx=120,cy=120,R=100
  const arcPt=(deg)=>({x:cx+R*Math.cos(rad(deg)),y:cy+R*Math.sin(rad(deg))})
  const descArc=(from,to)=>{
    const s=arcPt(from),e=arcPt(to),large=to-from>180?1:0
    return `M${s.x},${s.y} A${R},${R} 0 ${large} 1 ${e.x},${e.y}`
  }
  const ndlPt=arcPt(currentAng)
  const ndlShort={x:cx+(R-28)*Math.cos(rad(currentAng)),y:cy+(R-28)*Math.sin(rad(currentAng))}
  const dialColor=val>130?'#fb4934':val>100?'#fabd2f':val<80?'#83a598':'#b8bb26'

  const onMouseDown=(e)=>{e.stopPropagation();dragging.current=true;startY.current=e.clientY;startVal.current=val}
  const onMouseMove=useCallback((e)=>{
    if(!dragging.current)return
    const dy=startY.current-e.clientY
    setVal(v=>Math.min(max,Math.max(min,Math.round((startVal.current+dy*1.5)/5)*5)))
  },[])
  const onMouseUp=useCallback(()=>{dragging.current=false},[])
  useEffect(()=>{
    window.addEventListener('mousemove',onMouseMove)
    window.addEventListener('mouseup',onMouseUp)
    return()=>{window.removeEventListener('mousemove',onMouseMove);window.removeEventListener('mouseup',onMouseUp)}
  },[onMouseMove,onMouseUp])

  return (
    <div style={{background:'linear-gradient(155deg,rgba(62,58,56,0.97) 0%,rgba(26,26,26,0.99) 100%)',backdropFilter:'blur(28px) saturate(160%)',WebkitBackdropFilter:'blur(28px) saturate(160%)',boxShadow:'0 24px 64px rgba(0,0,0,0.75),inset 0 1px 0 rgba(235,219,178,0.09),inset 0 -1px 0 rgba(0,0,0,0.45)',border:`1px solid ${dialColor}33`,borderRadius:20,minWidth:300,fontFamily:'-apple-system,sans-serif',overflow:'hidden',textAlign:'center'}}>
      <Handle type="target" position={Position.Left} style={HL(dialColor)}/>
      <Handle type="source" position={Position.Right} style={HL(dialColor)}/>
      <div style={{padding:'12px 16px 4px',borderBottom:`1px dashed ${dialColor}22`,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <div style={{fontSize:12,fontWeight:500,color:'#ebdbb2',textAlign:'left'}}>Master Dose Dial</div>
          <div style={{fontSize:9,color:'#665c54',textAlign:'left',textTransform:'uppercase',letterSpacing:'0.1em'}}>Global multiplier</div>
        </div>
        <div style={{fontSize:24,fontWeight:500,color:dialColor}}>{val}%</div>
      </div>
      <div style={{padding:'16px',userSelect:'none'}} className="nopan">
        <svg width="240" height="240" style={{display:'block',margin:'0 auto',cursor:'ns-resize'}} onMouseDown={onMouseDown}>
          <circle cx={cx} cy={cy} r={R+10} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
          <path d={descArc(startAng,startAng+totalArc)} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" strokeLinecap="round"/>
          <path d={descArc(startAng,currentAng)} fill="none" stroke={dialColor} strokeWidth="12" strokeLinecap="round" opacity="0.9"/>
          {Array.from({length:11},(_,i)=>{
            const a=startAng+(i/10)*totalArc
            const i1={x:cx+(R-18)*Math.cos(rad(a)),y:cy+(R-18)*Math.sin(rad(a))}
            const o1={x:cx+(R-8)*Math.cos(rad(a)),y:cy+(R-8)*Math.sin(rad(a))}
            return <line key={i} x1={i1.x} y1={i1.y} x2={o1.x} y2={o1.y} stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeLinecap="round"/>
          })}
          <circle cx={cx} cy={cy} r="62" fill="rgba(0,0,0,0.3)" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
          <circle cx={cx} cy={cy} r="48" fill={`${dialColor}08`} stroke={`${dialColor}22`} strokeWidth="1"/>
          <circle cx={cx} cy={cy} r="28" fill={`${dialColor}12`} stroke={`${dialColor}33`} strokeWidth="1.5"/>
          <line x1={ndlShort.x} y1={ndlShort.y} x2={ndlPt.x} y2={ndlPt.y} stroke={dialColor} strokeWidth="3" strokeLinecap="round"/>
          <circle cx={cx} cy={cy} r="6" fill={dialColor}/>
          <text x={cx} y={cy+5} textAnchor="middle" fontSize="20" fontWeight="500" fill={dialColor}>{val}%</text>
          <text x={cx} y={cy+20} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.3)">DOSE</text>
          <text x={arcPt(startAng).x-8} y={arcPt(startAng).y+4} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.2)">50</text>
          <text x={arcPt(startAng+totalArc).x+8} y={arcPt(startAng+totalArc).y+4} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.2)">200</text>
        </svg>
        <div style={{display:'flex',flexDirection:'column',gap:4,marginTop:8}}>
          {COMPOUNDS.map(b=>{
            const adj=b.unit==='mcg'?Math.round(b.dose*val/100):+(b.dose*val/100).toFixed(1)
            return (
              <div key={b.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'4px 8px',background:'rgba(255,255,255,0.03)',borderRadius:6}}>
                <div style={{display:'flex',alignItems:'center',gap:6}}>
                  <div style={{width:6,height:6,borderRadius:'50%',background:b.color}}/>
                  <span style={{fontSize:10,color:'#a89984'}}>{b.name}</span>
                </div>
                <span style={{fontSize:10,fontWeight:500,color:b.color}}>{adj} {b.unit}</span>
              </div>
            )
          })}
        </div>
        <div style={{fontSize:9,color:'#665c54',marginTop:8}}>Drag knob up/down to adjust</div>
      </div>
    </div>
  )
}

// ─── Node: Weekly Dosing Calendar ─────────────────────────────────────────────
function WeeklyCalendarNode({ data, selected }) {
  const days = ['MON','TUE','WED','THU','FRI','SAT','SUN']
  const dates = ['31','1','2','3','4','5','6']
  const dotColors = {'BPC-157':'#fb4934','TB-500':'#83a598','GHK-Cu':'#fabd2f','Semax':'#8ec07c'}
  const schedule = {
    'BPC-157': ['taken','taken','missed','taken','sched','sched','sched'],
    'TB-500':  ['taken','none','none','sched','none','none','none'],
    'GHK-Cu':  ['taken','taken','taken','taken','sched','none','none'],
    'Semax':   ['taken','missed','taken','taken','sched','sched','sched'],
  }
  const cs = (s) => {
    const base={width:34,height:26,borderRadius:5,display:'inline-flex',alignItems:'center',justifyContent:'center',fontSize:9,cursor:'pointer',border:'1px solid',transition:'all 0.15s'}
    if(s==='taken')  return {...base,background:'rgba(184,187,38,0.14)',borderColor:'rgba(184,187,38,0.35)',color:'#b8bb26'}
    if(s==='missed') return {...base,background:'rgba(251,73,52,0.1)',borderColor:'rgba(251,73,52,0.3)',color:'#fb4934'}
    if(s==='sched')  return {...base,background:'rgba(255,255,255,0.04)',borderColor:'rgba(255,255,255,0.1)',color:'#665c54'}
    return {...base,background:'transparent',borderColor:'transparent',cursor:'default'}
  }
  return (
    <div style={{background:'linear-gradient(155deg,rgba(62,58,56,0.97) 0%,rgba(26,26,26,0.99) 100%)',backdropFilter:'blur(28px) saturate(160%)',WebkitBackdropFilter:'blur(28px) saturate(160%)',boxShadow:'0 24px 64px rgba(0,0,0,0.75),inset 0 1px 0 rgba(235,219,178,0.09),inset 0 -1px 0 rgba(0,0,0,0.45)',border:'1px solid rgba(235,219,178,0.1)',borderRadius:18,fontFamily:'-apple-system,sans-serif',overflow:'hidden',width:'100%',height:'100%',minWidth:460,minHeight:200}}>
      <NodeResizer minWidth={460} minHeight={200} isVisible={selected} color="rgba(255,255,255,0.25)" handleStyle={{width:10,height:10,borderRadius:2,background:'rgba(255,255,255,0.25)',border:'none'}}/>
      <Handle type="target" position={Position.Left} style={HW}/>
      <div style={{padding:'10px 14px',borderBottom:'1px solid rgba(255,255,255,0.08)',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
        <div style={{fontSize:12,fontWeight:500,color:'#ebdbb2'}}>Dosing Calendar</div>
        <div style={{fontSize:10,color:'#a89984'}}>Week 4 — Mar 31 to Apr 6</div>
        <div style={{display:'flex',gap:10,fontSize:9}}>
          <span style={{color:'#b8bb26'}}>&#9632; taken</span>
          <span style={{color:'#fb4934'}}>&#9632; missed</span>
          <span style={{color:'#665c54'}}>&#9632; sched</span>
        </div>
      </div>
      <div style={{padding:'10px 14px',overflow:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead>
            <tr>
              <th style={{width:86,textAlign:'left',fontSize:9,color:'#665c54',fontWeight:500,padding:'2px 4px',letterSpacing:'0.08em'}}></th>
              {days.map((d,i)=>(
                <th key={d} style={{textAlign:'center',fontSize:9,color:'#665c54',fontWeight:500,padding:'2px 4px',letterSpacing:'0.08em'}}>
                  {d}<br/><span style={{color:'rgba(255,255,255,0.2)',fontSize:8}}>{dates[i]}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(schedule).map(([comp,cells])=>(
              <tr key={comp}>
                <td style={{padding:'3px 4px'}}>
                  <div style={{display:'flex',alignItems:'center',gap:5}}>
                    <div style={{width:6,height:6,borderRadius:'50%',background:dotColors[comp],flexShrink:0}}/>
                    <span style={{fontSize:10,color:'#a89984',whiteSpace:'nowrap'}}>{comp}</span>
                  </div>
                </td>
                {cells.map((s,i)=>(
                  <td key={i} style={{padding:'3px 4px',textAlign:'center'}}>
                    <div style={cs(s)}>{s==='taken'?'✓':s==='missed'?'✗':s==='sched'?'–':''}</div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Node: Big Month Calendar ─────────────────────────────────────────────────
function MonthCalendarNode({ data, selected }) {
  const [view, setView] = useState('month')
  const [currentMonth, setCurrentMonth] = useState(3)
  const [currentYear, setCurrentYear] = useState(2026)
  const [selectedDay, setSelectedDay] = useState(null)
  const [weekOffset, setWeekOffset] = useState(0)
  const fullMonthNames = ['January','February','March','April','May','June','July','August','September','October','November','December']
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate()
  const firstDay = (new Date(currentYear, currentMonth-1, 1).getDay()+6)%7
  const cells = []
  for(let i=0;i<firstDay;i++) cells.push(null)
  for(let d=1;d<=daysInMonth;d++) cells.push(d)
  while(cells.length%7!==0) cells.push(null)

  const getComps = (day) => day ? COMPOUNDS.filter(c=>c.days&&c.days.includes(day)) : []
  const isMissed = (day) => day && day < TODAY && MISSED.includes(day) && currentMonth===3
  const isToday = (day) => day===TODAY && currentMonth===3
  const isPast = (day) => day && day < TODAY && currentMonth===3

  return (
    <div style={{background:'linear-gradient(155deg,rgba(62,58,56,0.97) 0%,rgba(26,26,26,0.99) 100%)',backdropFilter:'blur(28px) saturate(160%)',WebkitBackdropFilter:'blur(28px) saturate(160%)',boxShadow:'0 24px 64px rgba(0,0,0,0.75),inset 0 1px 0 rgba(235,219,178,0.09),inset 0 -1px 0 rgba(0,0,0,0.45)',border:'1px solid rgba(235,219,178,0.1)',borderRadius:20,fontFamily:'-apple-system,sans-serif',overflow:'hidden',width:'100%',height:'100%',minWidth:900,minHeight:700,display:'flex',flexDirection:'column'}}>
      <NodeResizer minWidth={900} minHeight={700} isVisible={selected} color="rgba(255,255,255,0.25)" handleStyle={{width:10,height:10,borderRadius:2,background:'rgba(255,255,255,0.25)',border:'none'}}/>
      <Handle type="target" position={Position.Left} style={HW}/>
      <Handle type="source" position={Position.Right} style={HW}/>
      <div style={{padding:'14px 20px',borderBottom:'1px solid rgba(235,219,178,0.08)',display:'flex',alignItems:'center',gap:12,flexShrink:0,background:'rgba(0,0,0,0.2)'}}>
        <button onClick={()=>view==='week'?setWeekOffset(w=>w-1):setCurrentMonth(m=>m===1?12:m-1)} className="nopan" style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:6,color:'#a89984',cursor:'pointer',padding:'4px 12px',fontSize:14}}>&#8249;</button>
        <div style={{fontSize:22,fontWeight:500,color:'#ebdbb2',minWidth:220}}>
          {view==='year'?currentYear:view==='week'?'Week View':fullMonthNames[currentMonth-1]+' '+currentYear}
        </div>
        <button onClick={()=>view==='week'?setWeekOffset(w=>w+1):setCurrentMonth(m=>m===12?1:m+1)} className="nopan" style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:6,color:'#a89984',cursor:'pointer',padding:'4px 12px',fontSize:14}}>&#8250;</button>
        <div style={{display:'flex',gap:4,marginLeft:8}} className="nopan">
          {['week','month','year'].map(v=>(
            <button key={v} onClick={()=>setView(v)} style={{fontSize:10,padding:'3px 10px',borderRadius:6,cursor:'pointer',border:'1px solid',textTransform:'uppercase',letterSpacing:'0.08em',background:view===v?'rgba(250,189,47,0.15)':'transparent',borderColor:view===v?'rgba(250,189,47,0.4)':'rgba(255,255,255,0.1)',color:view===v?'#fabd2f':'#665c54'}}>{v}</button>
          ))}
        </div>
        <div style={{marginLeft:'auto',display:'flex',gap:14,alignItems:'center'}}>
          {COMPOUNDS.map(c=>(
            <div key={c.id} style={{display:'flex',alignItems:'center',gap:4,fontSize:10,color:'#a89984'}}>
              <div style={{width:7,height:7,borderRadius:'50%',background:c.color}}/>
              {c.name}
            </div>
          ))}
        </div>
      </div>
      {view==='week'&&(
        <div style={{padding:'12px 14px',flex:1,display:'flex',flexDirection:'column',gap:8,overflowY:'auto'}}>
          {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d,i)=>{
            const dayNum=17+weekOffset*7+i
            const comps=COMPOUNDS.filter(c=>c.days&&c.days.includes(dayNum)&&currentMonth===3)
            return (
              <div key={d} style={{background:'rgba(0,0,0,0.2)',borderRadius:12,padding:'12px 16px',border:'1px solid rgba(235,219,178,0.06)'}}>
                <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:comps.length?8:0}}>
                  <div style={{fontSize:16,fontWeight:500,color:'#ebdbb2'}}>{d}</div>
                  <div style={{fontSize:12,color:'#665c54'}}>Mar {dayNum}, 2026</div>
                </div>
                {comps.length>0?(
                  <div style={{display:'flex',flexDirection:'column',gap:6}}>
                    {comps.map(c=>(
                      <div key={c.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px 10px',background:`${c.color}0e`,borderRadius:8,border:`1px solid ${c.color}22`}}>
                        <div style={{display:'flex',alignItems:'center',gap:8}}>
                          <div style={{width:8,height:8,borderRadius:'50%',background:c.color}}/>
                          <span style={{fontSize:13,color:'#ebdbb2',fontWeight:500}}>{c.name}</span>
                          <span style={{fontSize:11,color:'#665c54'}}>{c.route} · {c.freq}</span>
                        </div>
                        <span style={{fontSize:14,fontWeight:500,color:c.color}}>{c.dose} {c.unit}</span>
                      </div>
                    ))}
                  </div>
                ):<div style={{fontSize:12,color:'#504945'}}>No injections scheduled</div>}
              </div>
            )
          })}
        </div>
      )}
      {view==='year'&&(
        <div style={{padding:'12px 14px',flex:1,display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10,overflowY:'auto'}}>
          {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((mn,mi)=>(
            <div key={mn} onClick={()=>{setCurrentMonth(mi+1);setView('month')}} className="nopan"
              style={{background:mi===2?'rgba(250,189,47,0.08)':'rgba(0,0,0,0.2)',borderRadius:12,padding:'14px',border:mi===2?'1px solid rgba(250,189,47,0.3)':'1px solid rgba(235,219,178,0.06)',cursor:'pointer',textAlign:'center'}}>
              <div style={{fontSize:16,fontWeight:500,color:mi===2?'#fabd2f':'#a89984',marginBottom:4}}>{mn}</div>
              <div style={{fontSize:11,color:'#665c54'}}>{currentYear}</div>
              {mi===2&&<div style={{fontSize:10,color:'#fabd2f',marginTop:4}}>Active Cycle</div>}
            </div>
          ))}
        </div>
      )}
      {view==='month'&&<>
      <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',padding:'8px 14px 2px',flexShrink:0}}>
        {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d=>(
          <div key={d} style={{textAlign:'center',fontSize:10,fontWeight:500,color:'#665c54',letterSpacing:'0.1em',textTransform:'uppercase',padding:'4px 0'}}>{d}</div>
        ))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:3,padding:'0 14px 14px',flex:1}}>
        {cells.map((day,i)=>{
          const comps=getComps(day)
          const today=isToday(day)
          const past=isPast(day)
          const missed=isMissed(day)
          return (
            <div key={i} onClick={()=>day&&setSelectedDay(selectedDay===day?null:day)} className="nopan"
              style={{
                minHeight:80,borderRadius:8,padding:'7px 9px',cursor:day?'pointer':'default',
                background:today?'rgba(250,189,47,0.08)':selectedDay===day?'rgba(255,255,255,0.06)':'rgba(255,255,255,0.02)',
                border:today?'1px solid rgba(250,189,47,0.4)':selectedDay===day?'1px solid rgba(255,255,255,0.14)':'1px solid rgba(255,255,255,0.04)',
                opacity:!day?0:1,transition:'all 0.15s',
              }}>
              {day&&<>
                <div style={{fontSize:12,fontWeight:500,color:today?'#fabd2f':past?'rgba(255,255,255,0.5)':'rgba(255,255,255,0.25)',marginBottom:5,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <span>{day}</span>
                  {today&&<span style={{fontSize:8,color:'#fabd2f',letterSpacing:'0.1em'}}>TODAY</span>}
                  {missed&&<span style={{fontSize:10,color:'#fb4934',fontWeight:700}}>!</span>}
                </div>
                <div style={{display:'flex',flexWrap:'wrap',gap:3}}>
                  {comps.map(c=>(
                    <div key={c.id} style={{width:7,height:7,borderRadius:'50%',background:missed?'#fb4934':past?c.color:`${c.color}55`}}/>
                  ))}
                </div>
                {selectedDay===day&&comps.length>0&&(
                  <div style={{marginTop:5,fontSize:8,color:'#a89984',lineHeight:1.5}}>
                    {comps.map(c=>`${c.name} ${c.dose}${c.unit}`).join('\n')}
                  </div>
                )}
              </>}
            </div>
          )
        })}
      </div>
      </>}
    </div>
  )
}

// ─── Node: Cycle Overview ─────────────────────────────────────────────────────
function CycleOverviewNode({ data }) {
  const spark=[62,58,65,70,75,72,80,82,78,85,88,82]
  return (
    <div style={{background:'linear-gradient(155deg,rgba(62,58,56,0.97) 0%,rgba(26,26,26,0.99) 100%)',backdropFilter:'blur(28px) saturate(160%)',WebkitBackdropFilter:'blur(28px) saturate(160%)',boxShadow:'0 24px 64px rgba(0,0,0,0.75),inset 0 1px 0 rgba(235,219,178,0.09),inset 0 -1px 0 rgba(0,0,0,0.45)',border:'1px solid rgba(250,189,47,0.25)',borderRadius:18,minWidth:320,fontFamily:'-apple-system,sans-serif',overflow:'hidden'}}>
      <Handle type="source" position={Position.Right} style={HL('#fabd2f')}/>
      <div style={{padding:'12px 16px',borderBottom:'1px solid rgba(255,255,255,0.06)',display:'flex',alignItems:'center',gap:10}}>
        <div style={{width:36,height:36,borderRadius:9,background:'rgba(250,189,47,0.15)',border:'1px solid rgba(250,189,47,0.3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:'#fabd2f'}}>CYC</div>
        <div style={{flex:1}}>
          <div style={{fontSize:14,fontWeight:500,color:'#ebdbb2'}}>{data.name}</div>
          <div style={{fontSize:10,color:'#a89984',marginTop:1}}>Week {data.week} of {data.total_weeks} · {data.status}</div>
        </div>
        <div style={{textAlign:'right'}}>
          <div style={{fontSize:26,fontWeight:500,color:'#fabd2f',lineHeight:1}}>{data.adherence}%</div>
          <div style={{fontSize:9,color:'#665c54',textTransform:'uppercase',letterSpacing:'0.1em'}}>Adherence</div>
        </div>
      </div>
      <div style={{padding:'8px 16px'}}>
        <Sparkline data={spark} color="#fabd2f" width={288} height={36}/>
        <div style={{display:'flex',justifyContent:'space-between',fontSize:8,color:'#665c54',marginTop:1}}>
          <span>Wk 1</span><span>Wk 4</span><span>Wk 8</span><span>Wk 12</span>
        </div>
      </div>
      <div style={{padding:'4px 16px 10px',display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:6}}>
        {[['Start',data.start],['End',data.end],['Next',data.next_dose]].map(([k,v])=>(
          <div key={k} style={{background:'rgba(255,255,255,0.03)',borderRadius:6,padding:'5px 7px'}}>
            <div style={{fontSize:8,color:'#665c54',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:1}}>{k}</div>
            <div style={{fontSize:10,color:'#ebdbb2',fontWeight:500}}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{padding:'0 16px 10px'}}>
        <div style={{height:3,background:'rgba(255,255,255,0.06)',borderRadius:2,overflow:'hidden'}}>
          <div style={{height:'100%',width:`${Math.round((data.week/data.total_weeks)*100)}%`,background:'linear-gradient(90deg,#fabd2f,#fe8019)',borderRadius:2}}/>
        </div>
        <div style={{fontSize:8,color:'#665c54',marginTop:3,textAlign:'right'}}>{Math.round((data.week/data.total_weeks)*100)}% complete</div>
      </div>
    </div>
  )
}

// ─── Node: Assessment ─────────────────────────────────────────────────────────
function AssessmentNode({ data }) {
  return (
    <div style={{background:'linear-gradient(155deg,rgba(62,58,56,0.97) 0%,rgba(26,26,26,0.99) 100%)',backdropFilter:'blur(28px) saturate(160%)',WebkitBackdropFilter:'blur(28px) saturate(160%)',boxShadow:'0 24px 64px rgba(0,0,0,0.75),inset 0 1px 0 rgba(235,219,178,0.09),inset 0 -1px 0 rgba(0,0,0,0.45)',border:'1px solid rgba(250,189,47,0.3)',borderRadius:18,minWidth:190,fontFamily:'-apple-system,sans-serif',overflow:'hidden'}}>
      <Handle type="source" position={Position.Right} style={HL('#fabd2f')}/>
      <div style={{padding:'10px 14px',borderBottom:'1px dashed rgba(250,189,47,0.15)'}}>
        <div style={{fontSize:8,fontWeight:500,letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(250,189,47,0.6)',marginBottom:2}}>Source Assessment</div>
        <div style={{fontSize:13,fontWeight:500,color:'#ebdbb2'}}>Spring 2026</div>
      </div>
      <div style={{padding:'10px 14px'}}>
        {[['Overall Risk','62 / 100'],['Mode','Lab Mode'],['Endurance','HIGH'],['Energy','MODERATE']].map(([k,v])=>(
          <div key={k} style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
            <span style={{fontSize:9,color:'#665c54'}}>{k}</span>
            <span style={{fontSize:9,fontWeight:500,color:k==='Endurance'?'#fb4934':k==='Energy'?'#fabd2f':'#ebdbb2'}}>{v}</span>
          </div>
        ))}
        <div onClick={()=>window.location.href='/Meto_Engine'} className="nopan" style={{marginTop:8,fontSize:9,padding:'4px 8px',background:'rgba(250,189,47,0.08)',borderRadius:5,color:'rgba(250,189,47,0.8)',textAlign:'center',cursor:'pointer',border:'1px solid rgba(250,189,47,0.18)'}}>
          Open Meto Engine
        </div>
      </div>
    </div>
  )
}

// ─── Node: Adherence ─────────────────────────────────────────────────────────
function AdherenceNode({ data }) {
  return (
    <div style={{background:'linear-gradient(155deg,rgba(62,58,56,0.97) 0%,rgba(26,26,26,0.99) 100%)',backdropFilter:'blur(28px) saturate(160%)',WebkitBackdropFilter:'blur(28px) saturate(160%)',boxShadow:'0 24px 64px rgba(0,0,0,0.75),inset 0 1px 0 rgba(235,219,178,0.09),inset 0 -1px 0 rgba(0,0,0,0.45)',border:'1px solid rgba(235,219,178,0.08)',borderRadius:18,minWidth:220,fontFamily:'-apple-system,sans-serif',overflow:'hidden'}}>
      <Handle type="target" position={Position.Left} style={HW}/>
      <div style={{padding:'10px 14px',borderBottom:'1px solid rgba(255,255,255,0.06)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{fontSize:12,fontWeight:500,color:'#ebdbb2'}}>Adherence</div>
        <div style={{fontSize:18,fontWeight:500,color:'#b8bb26'}}>82%</div>
      </div>
      <div style={{padding:'10px 14px'}}>
        {COMPOUNDS.map(it=>(
          <div key={it.id} style={{marginBottom:8}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:2}}>
              <div style={{display:'flex',alignItems:'center',gap:5}}>
                <div style={{width:5,height:5,borderRadius:'50%',background:it.color}}/>
                <span style={{fontSize:10,color:'#a89984'}}>{it.name}</span>
              </div>
              <span style={{fontSize:10,color:it.adh>=80?'#b8bb26':it.adh>=60?'#fabd2f':'#fb4934'}}>{it.adh}%</span>
            </div>
            <div style={{height:3,background:'rgba(255,255,255,0.05)',borderRadius:2,overflow:'hidden'}}>
              <div style={{height:'100%',width:`${it.adh}%`,background:it.adh>=80?'#b8bb26':it.adh>=60?'#fabd2f':'#fb4934',borderRadius:2}}/>
            </div>
          </div>
        ))}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:5,marginTop:6}}>
          {[['18','Taken','#b8bb26'],['4','Missed','#fb4934']].map(([v,l,c])=>(
            <div key={l} style={{background:`${c}0a`,borderRadius:6,padding:'5px 8px',textAlign:'center',border:`1px solid ${c}18`}}>
              <div style={{fontSize:18,fontWeight:500,color:c}}>{v}</div>
              <div style={{fontSize:8,color:'#665c54',textTransform:'uppercase',letterSpacing:'0.08em'}}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── CycleDashboard constants ─────────────────────────────────────────────────
const CD=[{n:'BPC-157',c:'#fb4934',adh:88,dose:250,u:'mcg'},{n:'TB-500',c:'#83a598',adh:75,dose:2,u:'mg'},{n:'GHK-Cu',c:'#fabd2f',adh:100,dose:1,u:'mg'},{n:'Semax',c:'#8ec07c',adh:60,dose:400,u:'mcg'}]
const CDWKS=['W1','W2','W3','W4','W5','W6','W7','W8','W9','W10','W11','W12']
function cdrng(s){let x=s;return()=>{x=(x*16807)%2147483647;return(x-1)/2147483646}}

function CDChartCanvas({draw,height=100}){
  const ref=useRef(null), wrapRef=useRef(null)
  useEffect(()=>{
    const wrap=wrapRef.current;if(!wrap)return
    const doDraw=()=>{
      const cv=ref.current;if(!cv)return
      const w=Math.max(10,wrap.getBoundingClientRect().width)||500
      cv.width=w;cv.height=height
      const ctx=cv.getContext('2d')
      ctx.clearRect(0,0,w,height)
      draw(ctx,w,height)
    }
    const ro=new ResizeObserver(()=>setTimeout(doDraw,20))
    ro.observe(wrap)
    setTimeout(doDraw,100)
    return()=>ro.disconnect()
  },[draw,height])
  return <div ref={wrapRef} style={{width:'100%'}}><canvas ref={ref} style={{display:'block',width:'100%',height:height+'px'}}/></div>
}

function CDGauge({val,color,dose,unit,name}){
  const ref=useRef(null)
  useEffect(()=>{
    const t=setTimeout(()=>{
      const cv=ref.current;if(!cv)return
      const ctx=cv.getContext('2d'),cx=74,cy=78,r=56,lw=11
      const s=-Math.PI*1.2,e=Math.PI*0.2,arc=e-s
      ctx.clearRect(0,0,148,156)
      ctx.beginPath();ctx.arc(cx,cy,r,s,e);ctx.strokeStyle='rgba(255,255,255,0.06)';ctx.lineWidth=lw;ctx.lineCap='round';ctx.stroke()
      ctx.beginPath();ctx.arc(cx,cy,r,s,s+arc*(val/100));ctx.strokeStyle=color;ctx.lineWidth=lw;ctx.lineCap='round';ctx.stroke()
      ctx.beginPath();ctx.arc(cx,cy,r-17,0,Math.PI*2);ctx.strokeStyle=color+'20';ctx.lineWidth=1.5;ctx.stroke()
      ctx.fillStyle=color;ctx.font='bold 22px -apple-system,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(val+'%',cx,cy-6)
      ctx.fillStyle='rgba(235,219,178,0.35)';ctx.font='9px -apple-system,sans-serif';ctx.fillText('adherence',cx,cy+12)
      ctx.fillStyle=color+'cc';ctx.font='10px -apple-system,sans-serif';ctx.fillText(dose+' '+unit,cx,cy+26)
      const na=s+arc*(val/100)
      ctx.beginPath();ctx.moveTo(cx+(r-5)*Math.cos(na),cy+(r-5)*Math.sin(na));ctx.lineTo(cx+(r+5)*Math.cos(na),cy+(r+5)*Math.sin(na));ctx.strokeStyle=color;ctx.lineWidth=2.5;ctx.lineCap='round';ctx.stroke()
      ctx.beginPath();ctx.arc(cx,cy,4,0,Math.PI*2);ctx.fillStyle=color;ctx.fill()
    },120)
    return()=>clearTimeout(t)
  },[val,color,dose,unit])
  return <div style={{textAlign:'center'}}><canvas ref={ref} width={148} height={156} style={{display:'block'}}/><div style={{fontSize:11,color,fontWeight:500,marginTop:2}}>{name}</div></div>
}

function CycleDashboardNode({data,selected}){
  const [secs,setSecs]=useState(6*3600+23*60+41)
  useEffect(()=>{const t=setInterval(()=>setSecs(s=>s>0?s-1:86399),1000);return()=>clearInterval(t)},[])
  const h=Math.floor(secs/3600),m=Math.floor((secs%3600)/60),sc=secs%60
  const timer=`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sc).padStart(2,'0')}`

  const drawAdh=useCallback((ctx,W,H)=>{
    const bh=Math.floor((H-16)/CD.length)-4,pad=64
    CD.forEach((cp,i)=>{
      const y=8+i*(bh+4),bw=(cp.adh/100)*(W-pad-16)
      ctx.fillStyle='rgba(255,255,255,0.04)';ctx.fillRect(pad,y,W-pad-16,bh)
      const g=ctx.createLinearGradient(pad,0,pad+bw,0);g.addColorStop(0,cp.c+'66');g.addColorStop(1,cp.c)
      ctx.fillStyle=g;ctx.beginPath();if(ctx.roundRect)ctx.roundRect(pad,y,bw,bh,3);else ctx.fillRect(pad,y,bw,bh);ctx.fill()
      ctx.fillStyle='rgba(235,219,178,0.65)';ctx.font='11px -apple-system,sans-serif';ctx.textAlign='left';ctx.fillText(cp.n,2,y+bh/2+4)
      ctx.fillStyle=cp.c;ctx.font='500 11px -apple-system,sans-serif';ctx.fillText(cp.adh+'%',pad+bw+5,y+bh/2+4)
    })
  },[])

  const drawTm=useCallback((ctx,W,H)=>{
    const pl=32,pr=8,pt=8,pb=20,gW=W-pl-pr,gH=H-pt-pb
    for(let i=0;i<=4;i++){const y=pt+(i/4)*gH;ctx.strokeStyle='rgba(255,255,255,0.05)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(pl,y);ctx.lineTo(W-pr,y);ctx.stroke();ctx.fillStyle='rgba(255,255,255,0.22)';ctx.font='8px sans-serif';ctx.textAlign='right';ctx.fillText((100-i*25)+'%',pl-2,y+3)}
    const tx=pl+(4/12)*gW;ctx.strokeStyle='rgba(250,189,47,0.4)';ctx.setLineDash([3,3]);ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(tx,pt);ctx.lineTo(tx,pt+gH);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle='#fabd2f';ctx.font='8px sans-serif';ctx.textAlign='left';ctx.fillText('NOW',tx+2,pt+10)
    CD.forEach((cp,ci)=>{
      const r=cdrng(cp.adh+ci*7)
      const pts=CDWKS.map(()=>Math.min(100,Math.max(20,Math.round(cp.adh+(r()-0.5)*22))))
      ctx.beginPath();pts.forEach((v,i)=>{const x=pl+(i/11)*gW,y=pt+(1-v/100)*gH;i===0?ctx.moveTo(x,y):ctx.lineTo(x,y)})
      ctx.strokeStyle=cp.c;ctx.lineWidth=2;ctx.stroke()
      ctx.beginPath();pts.forEach((v,i)=>{const x=pl+(i/11)*gW,y=pt+(1-v/100)*gH;i===0?ctx.moveTo(x,y):ctx.lineTo(x,y)})
      ctx.lineTo(pl+gW,pt+gH);ctx.lineTo(pl,pt+gH);ctx.closePath();ctx.fillStyle=cp.c+'20';ctx.fill()
    })
    CDWKS.forEach((_,i)=>{if(i%2===0){ctx.fillStyle='rgba(255,255,255,0.2)';ctx.font='8px sans-serif';ctx.textAlign='center';ctx.fillText(CDWKS[i],pl+(i/11)*gW,H-4)}})
  },[])

  const drawHist=useCallback((ctx,W,H)=>{
    const r=cdrng(42),days=Array.from({length:30},()=>Math.round(1+r()*3))
    const bw=Math.floor((W-20)/30)-1
    days.forEach((v,i)=>{const x=10+i*(bw+1),bh=(v/4)*(H-20);ctx.fillStyle='#83a59888';ctx.beginPath();if(ctx.roundRect)ctx.roundRect(x,H-bh-8,bw,bh,2);else ctx.fillRect(x,H-bh-8,bw,bh);ctx.fill()})
    for(let i=1;i<=4;i++){ctx.strokeStyle='rgba(255,255,255,0.05)';ctx.lineWidth=1;const y=(1-i/4)*(H-20)+8;ctx.beginPath();ctx.moveTo(10,y);ctx.lineTo(W-10,y);ctx.stroke();ctx.fillStyle='rgba(255,255,255,0.2)';ctx.font='8px sans-serif';ctx.textAlign='left';ctx.fillText(i,2,y+3)}
  },[])

  const drawArea=useCallback((ctx,W,H)=>{
    const pl=40,pr=8,pt=8,pb=18,gW=W-pl-pr,gH=H-pt-pb
    const r3=cdrng(33),r4=cdrng(55)
    const d1=CDWKS.map((_,i)=>Math.round((i+1)*250*0.88+r3()*200))
    const d2=CDWKS.map((_,i)=>Math.round((i+1)*1000+r4()*500))
    const max=Math.max(...d2)
    [[d1,'#fb4934'],[d2,'#fabd2f']].forEach(([d,c])=>{
      ctx.beginPath();d.forEach((v,i)=>{const x=pl+(i/11)*gW,y=pt+(1-v/max)*gH;i===0?ctx.moveTo(x,y):ctx.lineTo(x,y)})
      ctx.strokeStyle=c;ctx.lineWidth=2;ctx.stroke()
      ctx.lineTo(pl+gW,pt+gH);ctx.lineTo(pl,pt+gH);ctx.closePath();ctx.fillStyle=c+'25';ctx.fill()
    })
    for(let i=0;i<=4;i++){const y=pt+(i/4)*gH;ctx.strokeStyle='rgba(255,255,255,0.05)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(pl,y);ctx.lineTo(W-pr,y);ctx.stroke()}
    CDWKS.forEach((_,i)=>{if(i%2===0){ctx.fillStyle='rgba(255,255,255,0.2)';ctx.font='8px sans-serif';ctx.textAlign='center';ctx.fillText(CDWKS[i],pl+(i/11)*gW,H-4)}})
  },[])

  const drawComp=useCallback((ctx,W,H)=>{
    const metrics=['Adherence','Consistency','Frequency','Timing','Fit']
    const vals=[[88,84,100,79,75],[75,71,57,68,64],[100,95,100,90,85],[60,57,75,54,51]]
    const pl=8,pr=8,pt=18,pb=20,gW=W-pl-pr,gH=H-pt-pb
    const grpW=gW/metrics.length,bW=grpW/(CD.length+1)
    for(let i=0;i<=4;i++){const y=pt+(i/4)*gH;ctx.strokeStyle='rgba(255,255,255,0.05)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(pl,y);ctx.lineTo(W-pr,y);ctx.stroke()}
    metrics.forEach((m,mi)=>{
      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='9px sans-serif';ctx.textAlign='center';ctx.fillText(m,pl+mi*grpW+grpW/2,pt-5)
      CD.forEach((cp,ci)=>{
        const v=vals[ci][mi]/100,x=pl+mi*grpW+(ci+0.5)*bW,bh=v*gH,y=pt+gH-bh
        const g=ctx.createLinearGradient(0,y,0,y+bh);g.addColorStop(0,cp.c);g.addColorStop(1,cp.c+'44')
        ctx.fillStyle=g;ctx.beginPath();if(ctx.roundRect)ctx.roundRect(x,y,bW-1,bh,[2,2,0,0]);else ctx.fillRect(x,y,bW-1,bh);ctx.fill()
      })
    })
  },[])

  const S={background:'rgba(0,0,0,0.22)',borderRadius:14,border:'1px solid rgba(255,255,255,0.07)',padding:'10px 14px',boxShadow:'inset 0 2px 10px rgba(0,0,0,0.35)',marginBottom:10}

  return (
    <div style={{background:'linear-gradient(155deg,rgba(62,58,56,0.97) 0%,rgba(26,26,26,0.99) 100%)',border:'1px solid rgba(235,219,178,0.14)',borderRadius:22,backdropFilter:'blur(32px) saturate(160%)',WebkitBackdropFilter:'blur(32px) saturate(160%)',boxShadow:'0 32px 80px rgba(0,0,0,0.8),inset 0 1px 0 rgba(235,219,178,0.1)',fontFamily:'-apple-system,sans-serif',overflow:'hidden',width:'100%',height:'100%',minWidth:900,minHeight:500,display:'flex',flexDirection:'column',position:'relative'}}>
      <NodeResizer minWidth={900} minHeight={500} isVisible={selected} color="rgba(235,219,178,0.3)" handleStyle={{width:10,height:10,borderRadius:3,background:'rgba(235,219,178,0.3)',border:'none'}}/>
      <Handle type="target" position={Position.Left} style={HW}/>
      <Handle type="source" position={Position.Right} style={HW}/>
      <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,rgba(235,219,178,0.22),transparent)',zIndex:10,pointerEvents:'none'}}/>
      <div style={{padding:'14px 18px 10px',borderBottom:'1px solid rgba(255,255,255,0.07)',background:'rgba(0,0,0,0.2)',flexShrink:0}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
          <div><div style={{fontSize:14,fontWeight:500,color:'#ebdbb2'}}>Spring Healing Stack</div><div style={{fontSize:10,color:'#665c54',marginTop:2}}>Week 4 of 12 · Active · Peak Phase</div></div>
          <div style={{textAlign:'right'}}><div style={{fontSize:18,fontWeight:500,color:'#8ec07c',fontVariantNumeric:'tabular-nums'}}>{timer}</div><div style={{fontSize:9,color:'#665c54',textTransform:'uppercase',letterSpacing:'0.1em'}}>Next: BPC-157</div></div>
        </div>
        <div style={{height:5,background:'rgba(255,255,255,0.05)',borderRadius:3,overflow:'hidden',marginBottom:8}}><div style={{height:'100%',width:'33%',background:'linear-gradient(90deg,#fabd2f,#fe8019)',borderRadius:3}}/></div>
        <div style={{display:'flex',justifyContent:'space-between'}}>
          {[['82%','Adherence','#b8bb26'],['4','Missed','#fb4934'],['33%','Complete','#fabd2f'],['4/12','Week','#a89984']].map(([v,l,c])=>(
            <div key={l} style={{textAlign:'center'}}><div style={{fontSize:17,fontWeight:500,color:c}}>{v}</div><div style={{fontSize:8,color:'#504945',textTransform:'uppercase',letterSpacing:'0.1em'}}>{l}</div></div>
          ))}
        </div>
      </div>
      <div style={{flex:1,overflow:'hidden',padding:'10px 14px',display:'flex',gap:12}}>
        {/* Left col — gauges + adherence bars */}
        <div style={{width:340,flexShrink:0,display:'flex',flexDirection:'column',gap:10,overflowY:'auto'}}>
        <div style={S}>
          <div style={{fontSize:9,letterSpacing:'0.14em',textTransform:'uppercase',color:'#504945',marginBottom:8}}>Compound Adherence</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}} className="nopan">
            {CD.map(cp=><CDGauge key={cp.n} val={cp.adh} color={cp.c} dose={cp.dose} unit={cp.u} name={cp.n}/>)}
          </div>
        </div>
        <div style={S}>
          <div style={{fontSize:9,letterSpacing:'0.14em',textTransform:'uppercase',color:'#504945',marginBottom:6}}>Adherence by Compound</div>
          <div className="nopan"><CDChartCanvas draw={drawAdh} height={100}/></div>
        </div>
        </div>{/* end left col */}
        {/* Right col — charts */}
        <div style={{flex:1,display:'flex',flexDirection:'column',gap:10,overflowY:'auto',minWidth:0}}>
        <div style={S}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
            <div style={{fontSize:9,letterSpacing:'0.14em',textTransform:'uppercase',color:'#504945'}}>12-Week Timeline</div>
            <div style={{display:'flex',gap:8}}>{CD.map(cp=><span key={cp.n} style={{fontSize:9,color:cp.c,display:'flex',alignItems:'center',gap:3}}><span style={{width:10,height:2,background:cp.c,display:'inline-block',borderRadius:1}}/>{cp.n}</span>)}</div>
          </div>
          <div className="nopan"><CDChartCanvas draw={drawTm} height={120}/></div>
        </div>
        <div style={S}>
          <div style={{fontSize:9,letterSpacing:'0.14em',textTransform:'uppercase',color:'#504945',marginBottom:6}}>Daily Injections — Last 30 Days</div>
          <div className="nopan"><CDChartCanvas draw={drawHist} height={80}/></div>
        </div>
        <div style={S}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
            <div style={{fontSize:9,letterSpacing:'0.14em',textTransform:'uppercase',color:'#504945'}}>Cumulative Dose Exposure</div>
            <div style={{display:'flex',gap:8}}><span style={{fontSize:9,color:'#fb4934',display:'flex',alignItems:'center',gap:3}}><span style={{width:10,height:2,background:'#fb4934',display:'inline-block',borderRadius:1}}/>BPC-157</span><span style={{fontSize:9,color:'#fabd2f',display:'flex',alignItems:'center',gap:3}}><span style={{width:10,height:2,background:'#fabd2f',display:'inline-block',borderRadius:1}}/>GHK-Cu</span></div>
          </div>
          <div className="nopan"><CDChartCanvas draw={drawArea} height={100}/></div>
        </div>
        <div style={{...S,marginBottom:0}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
            <div style={{fontSize:9,letterSpacing:'0.14em',textTransform:'uppercase',color:'#504945'}}>Protocol Comparison</div>
            <div style={{display:'flex',gap:6}}>{CD.map(cp=><span key={cp.n} style={{fontSize:9,color:cp.c,display:'flex',alignItems:'center',gap:3}}><span style={{width:8,height:8,background:cp.c+'77',display:'inline-block',borderRadius:2,border:`1px solid ${cp.c}`}}/>{cp.n}</span>)}</div>
          </div>
          <div className="nopan"><CDChartCanvas draw={drawComp} height={120}/></div>
        </div>
        </div>{/* end right col */}
      </div>
    </div>
  )
}


const nodeTypes = {
  cycle_overview:   CycleOverviewNode,
  compound_card:    CompoundCardNode,
  dose_dial:        DoseDialNode,
  master_dial:      MasterDialNode,
  weekly_calendar:  WeeklyCalendarNode,
  month_calendar:   MonthCalendarNode,
  assessment:       AssessmentNode,
  adherence:        AdherenceNode,
  cycle_dashboard:  CycleDashboardNode,
}

function buildInitialGraph() {
  const nodes=[], edges=[]

  nodes.push({ id:'assessment', type:'assessment', position:{x:0,y:340}, data:{}, draggable:true })
  nodes.push({ id:'overview', type:'cycle_overview', position:{x:240,y:0},
    data:{name:'Spring Healing Stack',week:4,total_weeks:12,status:'Active',adherence:82,start:'Mar 17',end:'Jun 9',next_dose:'BPC-157 · 7am'}, draggable:true })

  // Compound cards + individual dials
  COMPOUNDS.forEach((c,i)=>{
    nodes.push({ id:`compound_${c.id}`, type:'compound_card', position:{x:240,y:220+i*380},
      data:{...c,icon:c.name.substring(0,3).toUpperCase()}, draggable:true })
    edges.push({ id:`e_ov_${c.id}`,source:'overview',target:`compound_${c.id}`,type:'smoothstep',animated:true,style:{stroke:`${c.color}44`,strokeWidth:1} })

    nodes.push({ id:`dial_${c.id}`, type:'dose_dial', position:{x:600,y:260+i*380},
      data:{...c,icon:c.name.substring(0,3).toUpperCase()}, draggable:true })
    edges.push({ id:`e_card_dial_${c.id}`,source:`compound_${c.id}`,target:`dial_${c.id}`,type:'smoothstep',animated:false,style:{stroke:`${c.color}33`,strokeWidth:1} })
  })

  // Big month calendar — center stage
  nodes.push({ id:'month_calendar', type:'month_calendar', position:{x:820,y:0}, data:{}, draggable:true, style:{width:1100,height:840} })

  // Weekly dosing calendar below
  nodes.push({ id:'weekly_calendar', type:'weekly_calendar', position:{x:820,y:900}, data:{}, draggable:true, style:{width:600,height:240} })

  // Master dial
  nodes.push({ id:'master_dial', type:'master_dial', position:{x:1980,y:0}, data:{}, draggable:true })

  // Adherence
  nodes.push({ id:'adherence', type:'adherence', position:{x:1980,y:600}, data:{}, draggable:true })

  edges.push({ id:'e_as_ov',   source:'assessment',    target:'overview',        type:'smoothstep',animated:true, style:{stroke:'rgba(250,189,47,0.35)',strokeWidth:1.2} })
  edges.push({ id:'e_ov_mcal', source:'overview',      target:'month_calendar',  type:'smoothstep',animated:false,style:{stroke:'rgba(255,255,255,0.07)',strokeWidth:1} })
  edges.push({ id:'e_ov_wcal', source:'overview',      target:'weekly_calendar', type:'smoothstep',animated:false,style:{stroke:'rgba(255,255,255,0.07)',strokeWidth:1} })
  edges.push({ id:'e_ov_dial', source:'overview',      target:'master_dial',     type:'smoothstep',animated:false,style:{stroke:'rgba(250,189,47,0.2)',strokeWidth:1} })
  edges.push({ id:'e_ov_adh',  source:'overview',      target:'adherence',       type:'smoothstep',animated:false,style:{stroke:'rgba(255,255,255,0.07)',strokeWidth:1} })

  nodes.push({ id:'dashboard', type:'cycle_dashboard', position:{x:0,y:1800}, data:{}, draggable:true, style:{width:1800,height:680} })
  edges.push({ id:'e_ov_db', source:'overview', target:'dashboard', type:'smoothstep', animated:false, style:{stroke:'rgba(235,219,178,0.2)',strokeWidth:1} })

  return {nodes,edges}
}

function CyclePageContent() {
  const {nodes:initN,edges:initE}=buildInitialGraph()
  const [nodes,setNodes]=useNodesState(initN)
  const [edges,setEdges,onEdgesChange]=useEdgesState(initE)
  const nodesRef=useRef(nodes)
  useEffect(()=>{nodesRef.current=nodes},[nodes])

  const onNodesChange=useCallback((changes)=>{
    setNodes(nds=>{const u=applyNodeChanges(changes,nds);nodesRef.current=u;return u})
  },[setNodes])

  const onConnect=useCallback(p=>setEdges(e=>addEdge({...p,type:'smoothstep',animated:true,style:{stroke:'rgba(255,255,255,0.35)',strokeWidth:1.2}},e)),[setEdges])

  const saveLayout=useCallback(()=>{
    const positions=nodesRef.current.map(n=>({id:n.id,position:n.position,style:n.style}))
    localStorage.setItem('pj_cycle_layout',JSON.stringify(positions))
  },[])

  useEffect(()=>{
    const saved=localStorage.getItem('pj_cycle_layout')
    if(saved){
      try{
        const positions=JSON.parse(saved)
        setNodes(nds=>nds.map(n=>{const p=positions.find(p=>p.id===n.id);return p?{...n,position:p.position,style:p.style||n.style}:n}))
      }catch{}
    }
  },[])

  return (
    <div style={{width:'100vw',height:'100vh',background:'var(--canvas-bg,#0c0e14)',display:'flex',flexDirection:'column'}}>
      <style>{`
        .react-flow__controls-button{background:var(--gb-bg-1,#3c3836) !important;border-bottom:1px solid rgba(255,255,255,0.08) !important}
        .react-flow__controls-button svg{fill:rgba(255,255,255,0.4) !important}
        .react-flow__controls-button:hover svg{fill:rgba(255,255,255,0.85) !important}
        .react-flow__controls{border:1px solid rgba(255,255,255,0.08) !important;border-radius:6px !important;overflow:hidden}
        .react-flow__edge.animated path{animation-duration:2s;stroke-dasharray:5 3}
        .react-flow__attribution{display:none}
        .react-flow__node{background:transparent !important;border:none !important;box-shadow:none !important;padding:0 !important}
        .react-flow__handle{opacity:0;transition:opacity 0.2s}
        .react-flow__node:hover .react-flow__handle{opacity:1}
        .react-flow__handle:hover{opacity:1 !important;transform:scale(1.4)}
        .react-flow__connection-line{stroke:rgba(255,255,255,0.5) !important;stroke-width:1.5 !important}
        .react-flow__resize-control.handle{background:rgba(255,255,255,0.25) !important;border:none !important}
        input[type=range]{cursor:pointer}
      `}</style>
      <TopBar view="list" setView={()=>{}} onUpload={null} searchQuery="" setSearchQuery={()=>{}}/>
      <div style={{flex:1,position:'relative'}}>
        <ReactFlow
          nodes={nodes} edges={edges}
          onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView fitViewOptions={{padding:0.08,maxZoom:0.5}}
          style={{background:'var(--canvas-bg,#0c0e14)'}}
          minZoom={0.04} maxZoom={2}
          connectionLineStyle={{stroke:'rgba(255,255,255,0.5)',strokeWidth:1.5}}
          connectionLineType="smoothstep"
          noPanClassName="nopan"
        >
          <Background color="var(--gb-dot-grid,rgba(255,255,255,0.05))" gap={28} size={1.5}/>
          <Controls style={{background:'var(--gb-bg-1,#3c3836)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:6}}/>
          <MiniMap style={{background:'rgba(20,22,30,0.95)',border:'1px solid rgba(255,255,255,0.06)'}} nodeColor="#2a2d35"/>
          <Panel position="top-left" style={{margin:8,marginTop:4}}>
            <img src="/canvas_logo.png" alt="Logo" style={{height:70,width:'auto',display:'block'}}/>
          </Panel>
          <Panel position="top-right" style={{margin:12,marginTop:8,display:'flex',gap:8}}>
            <button onClick={()=>window.location.href='/Meto_Engine'} style={{background:'rgba(250,189,47,0.1)',border:'1px solid rgba(250,189,47,0.28)',borderRadius:6,color:'rgba(250,189,47,0.85)',fontSize:11,fontWeight:700,letterSpacing:'0.1em',padding:'7px 14px',cursor:'pointer',textTransform:'uppercase'}}>
              Meto Engine
            </button>
            <button onClick={saveLayout} style={{background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.18)',borderRadius:6,color:'rgba(255,255,255,0.65)',fontSize:11,fontWeight:700,letterSpacing:'0.1em',padding:'7px 14px',cursor:'pointer',textTransform:'uppercase'}}>
              Save Layout
            </button>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  )
}

export default function CyclePage() {
  return (
    <ReactFlowProvider>
      <Suspense fallback={<div style={{width:'100vw',height:'100vh',background:'var(--canvas-bg,#0c0e14)',display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(255,255,255,0.5)'}}>Loading...</div>}>
        <CyclePageContent/>
      </Suspense>
    </ReactFlowProvider>
  )
}

