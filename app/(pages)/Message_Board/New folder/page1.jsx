'use client'
import { useState } from 'react'
import TopBar from '@/app/_components/ui/dashboard/top-bar'

const SPECS = [
  { id:1, ini:'RM', name:'Dr. Rachel Monroe', role:'Longevity MD',      c:'#fb4934', bg:'linear-gradient(145deg,#c0392b,#7a1a14)', st:'online', reply:'Adherence strong at 88% — hold dose through week 6' },
  { id:2, ini:'NJ', name:'Nathan J. RD',      role:'Nutritionist',      c:'#8ec07c', bg:'linear-gradient(145deg,#4a7a2e,#2d5218)', st:'online', reply:'Copper bisglycinate 2mg supports GHK-Cu synthesis' },
  { id:3, ini:'CP', name:'Dr. Claire Park',   role:'Naturopath ND',     c:'#83a598', bg:'linear-gradient(145deg,#2e7d6e,#1a4e44)', st:'away',   reply:'Semax cycling 5/2 prevents receptor downregulation' },
  { id:4, ini:'MT', name:'Marcus T.',          role:'Performance Coach', c:'#b8bb26', bg:'linear-gradient(145deg,#5a7a1a,#384e10)', st:'busy',   reply:'Training split aligned to TB-500 injection days' },
  { id:5, ini:'SV', name:'Dr. Sara Voss',      role:'Chiropractor DC',   c:'#fabd2f', bg:'linear-gradient(145deg,#a07a1a,#604808)', st:'online', reply:'L4-L5 mobility significantly improved — week 4' },
  { id:6, ini:'AK', name:'Dr. Amir Khan',      role:'Functional MD',     c:'#d3869b', bg:'linear-gradient(145deg,#8a3a5a,#5a2038)', st:'online', reply:'ORI score trending down — metabolic panel looks better' },
]

const CHS = [
  { id:'lon', name:'longevity-medicine',  b:3, bc:'#fb4934' },
  { id:'nut', name:'nutrition',            b:7, bc:'#8ec07c' },
  { id:'nat', name:'naturopathic',         b:0, bc:null },
  { id:'chi', name:'chiropractic',         b:1, bc:'#83a598' },
  { id:'per', name:'performance-training', b:0, bc:null },
  { id:'pep', name:'peptide-protocols',    b:2, bc:'#fabd2f' },
  { id:'gen', name:'general',              b:0, bc:null },
]

const LABS = [
  { id:'lab-blood',    name:'blood-panels',        b:2, bc:'#fb4934', icon:'🩸', tip:'Metabolic, hormones, CBC, lipids' },
  { id:'lab-hormone',  name:'hormone-testing',      b:0, bc:null,      icon:'⚗️', tip:'Testosterone, estrogen, thyroid, cortisol' },
  { id:'lab-genetic',  name:'genetic-panels',       b:1, bc:'#d3869b', icon:'🧬', tip:'DNA methylation, APOE, longevity SNPs' },
  { id:'lab-gut',      name:'gut-microbiome',       b:0, bc:null,      icon:'🔬', tip:'Gut Zoomer, microbiome diversity' },
  { id:'lab-inflam',   name:'inflammation-markers', b:3, bc:'#fabd2f', icon:'📊', tip:'CRP, IL-6, homocysteine, Lp(a)' },
  { id:'lab-imaging',  name:'advanced-imaging',     b:0, bc:null,      icon:'🏥', tip:'DEXA, full-body MRI, CT calcium score' },
  { id:'lab-atHome',   name:'at-home-kits',         b:1, bc:'#8ec07c', icon:'📦', tip:'SiPhox, Geviti, Superpower mail-in kits' },
]

const MSGS = [
  { id:1, s:1, t:'10:42 AM', hi:false, txt:'Reviewed your BPC-157 stack. Adherence is strong at 88%. Recommend holding current dose through week 6 before reassessing the loading phase. Good trajectory.', rx:[{e:'👍',n:1}] },
  { id:2, s:2, t:'11:05 AM', hi:false, txt:'Pair your GHK-Cu protocol with increased dietary copper — organ meats, shellfish, or supplemental copper bisglycinate 2mg daily. Supports the peptide\'s collagen synthesis pathway directly.', rx:[] },
  { id:3, s:4, t:'11:28 AM', hi:false, txt:'Adjusted your resistance training split to align heavy compound lifts with TB-500 injection days. Optimal recovery window is 24–36hrs post-injection.', rx:[{e:'👍',n:1},{e:'🔥',n:2}] },
  { id:4, s:1, t:'11:58 AM', hi:true,  txt:'@patient — your ORI score from the Meto Engine returned at 34. That\'s borderline elevated. I\'d like to schedule a follow-up to review your full metabolic panel before we enter peak phase.', rx:[], urgent:true },
  { id:5, s:3, t:'12:14 PM', hi:false, txt:'Semax intranasal at 400mcg daily is appropriate for cognitive support. Consider cycling 5 days on / 2 days off to prevent receptor downregulation. Monitor mood stability and sleep architecture.', rx:[] },
  { id:6, s:5, t:'12:41 PM', hi:false, txt:'Week 4 spinal assessment complete. Significant improvement in L4–L5 mobility. The BPC-157 + TB-500 combination appears to be accelerating soft tissue recovery. Continue current protocol.', rx:[{e:'👍',n:1}] },
]

const SC = { online:'#b8bb26', away:'#fabd2f', busy:'#fb4934' }

// Gruvbox-aligned theme tokens — warm #282828 base
const T = {
  bg:        '#282828',
  rail:      'linear-gradient(180deg,#3c3836 0%,#32302f 100%)',
  side:      'linear-gradient(160deg,#32302f 0%,#2e2c2a 100%)',
  mid:       'linear-gradient(160deg,#2a2826 0%,#262422 100%)',
  card:      'linear-gradient(155deg,rgba(60,56,54,0.98) 0%,rgba(44,42,40,0.99) 100%)',
  border:    'rgba(235,219,178,0.10)',
  borderHi:  'rgba(235,219,178,0.18)',
  text:      '#ebdbb2',
  textMid:   '#a89984',
  textLow:   '#7c6f64',
  accent:    '#fabd2f',
  accentDim: 'rgba(250,189,47,0.14)',
}

function Av({ id, sz=36 }) {
  const s = SPECS.find(x=>x.id===id)
  if(!s) return null
  return (
    <div style={{width:sz,height:sz,borderRadius:'50%',background:s.bg,border:`1.5px solid ${s.c}55`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:sz*0.28,fontWeight:800,color:'rgba(235,219,178,0.9)',flexShrink:0,boxShadow:`0 4px 12px rgba(0,0,0,0.6),0 0 0 1px ${s.c}18,inset 0 1px 0 rgba(235,219,178,0.08)`}}>
      {s.ini}
    </div>
  )
}

// 3D Apple-style icon button for the rail
function RailBtn({ icon, active, badge, title }) {
  return (
    <div title={title} style={{position:'relative',display:'flex',alignItems:'center',justifyContent:'center',
      width:'78%',aspectRatio:'1/1',borderRadius:16,cursor:'pointer',
      background: active
        ? 'linear-gradient(145deg,rgba(250,189,47,0.25),rgba(250,189,47,0.12))'
        : 'linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))',
      border: active ? '1px solid rgba(250,189,47,0.38)' : '1px solid rgba(235,219,178,0.09)',
      boxShadow: active
        ? '0 6px 18px rgba(250,189,47,0.2),inset 0 1px 0 rgba(250,189,47,0.28),inset 0 -1px 0 rgba(0,0,0,0.38)'
        : '0 3px 10px rgba(0,0,0,0.55),inset 0 1px 0 rgba(255,255,255,0.08),inset 0 -1px 0 rgba(0,0,0,0.42)',
      transition:'all 0.15s',
    }}>
      <span style={{fontSize:'clamp(20px,2.2vw,32px)',lineHeight:1,filter: active ? 'none' : 'brightness(0.6)'}}>{icon}</span>
      {badge>0&&(
        <div style={{position:'absolute',top:-4,right:-4,minWidth:20,height:20,borderRadius:10,background:'#fb4934',border:'2px solid #282828',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,fontWeight:800,color:'#fff',padding:'0 4px',boxShadow:'0 2px 8px rgba(251,73,52,0.55)'}}>
          {badge}
        </div>
      )}
    </div>
  )
}

export default function MessageBoardPage() {
  const [ch, setCh] = useState('lon')
  const [tr, setTr] = useState(0)
  const [railTab, setRailTab] = useState('msg')
  const [msg, setMsg] = useState('')
  const [modal, setModal] = useState(false)
  const [done, setDone] = useState(false)
  const [form, setForm] = useState({name:'',email:'',spec:'any',topic:''})

  const iS = {background:'rgba(255,255,255,0.04)',border:`1px solid ${T.border}`,borderRadius:8,color:T.text,fontSize:22,padding:'8px 12px',width:'100%',outline:'none',fontFamily:'-apple-system,sans-serif',boxShadow:'inset 0 2px 8px rgba(0,0,0,0.35)',transition:'border-color 0.15s'}

  const RAIL_ITEMS = [
    { id:'msg',   icon:'💬', badge:13, title:'Messages' },
    { id:'team',  icon:'👥', badge:0,  title:'Team' },
    { id:'thread',icon:'🗨️', badge:0,  title:'Threads' },
  ]
  const RAIL_BOTTOM = [
    { id:'dm',    icon:'✉️', badge:0, title:'Direct Messages' },
    { id:'cfg',   icon:'⚙️', badge:0, title:'Settings' },
  ]

  return (
    <div style={{width:'100vw',height:'100vh',background:'#282828',display:'flex',flexDirection:'column',overflow:'hidden',fontFamily:'-apple-system,sans-serif'}}>
      <style>{`
        .sc::-webkit-scrollbar{width:3px}
        .sc::-webkit-scrollbar-thumb{background:rgba(235,219,178,0.1);border-radius:2px}
        .ch-r:hover{background:rgba(235,219,178,0.04)!important}
        .dm-r:hover{background:rgba(235,219,178,0.04)!important}
        .tr-r:hover{background:rgba(235,219,178,0.03)!important}
        .msg-b:hover{background:rgba(235,219,178,0.025)!important}
        input::placeholder,textarea::placeholder{color:#504945}
        select option{background:#1c1a18;color:#ebdbb2}
        .abtn:hover{background:rgba(235,219,178,0.07)!important;color:#a89984!important}
        .fmtbtn:hover{background:rgba(235,219,178,0.07)!important;color:#a89984!important}
        .rail-btn:hover > div{background:linear-gradient(145deg,rgba(255,255,255,0.09),rgba(255,255,255,0.04))!important;border-color:rgba(235,219,178,0.14)!important}
        .rxbtn:hover{background:rgba(235,219,178,0.07)!important;border-color:rgba(235,219,178,0.2)!important}
        .jump-btn:hover{background:linear-gradient(135deg,rgba(250,189,47,0.14),rgba(250,189,47,0.06))!important;border-color:rgba(250,189,47,0.3)!important;color:#fabd2f!important}
      `}</style>

      <TopBar view="list" setView={()=>{}} onUpload={null} searchQuery="" setSearchQuery={()=>{}}/>

      <div style={{flex:1,display:'flex',overflow:'hidden',minHeight:0}}>

        {/* ── ICON RAIL (far left, 3D Apple style) ── */}
        <div style={{
          width:85,flexShrink:0,
          background:'linear-gradient(180deg,#3c3836 0%,#32302f 100%)',
          borderRight:`1px solid ${T.border}`,
          display:'flex',flexDirection:'column',alignItems:'center',
          paddingTop:12,paddingBottom:14,gap:8,
          boxShadow:`3px 0 20px rgba(0,0,0,0.5),inset -1px 0 0 rgba(235,219,178,0.05),inset 1px 0 0 rgba(255,255,255,0.02)`,
          zIndex:2,
        }}>
          {/* Logo mark */}
          <div style={{
            width:'78%',aspectRatio:'1/1',borderRadius:16,marginBottom:6,flexShrink:0,
            background:'linear-gradient(145deg,rgba(250,189,47,0.28),rgba(250,189,47,0.12))',
            border:'1px solid rgba(250,189,47,0.40)',
            display:'flex',alignItems:'center',justifyContent:'center',
            fontSize:'clamp(13px,1.4vw,20px)',fontWeight:900,color:'#fabd2f',letterSpacing:'-0.03em',
            boxShadow:'0 4px 18px rgba(250,189,47,0.24),inset 0 1px 0 rgba(250,189,47,0.34),inset 0 -1px 0 rgba(0,0,0,0.42)',
          }}>CH</div>

          {/* Divider */}
          <div style={{width:24,height:1,background:'linear-gradient(90deg,transparent,rgba(235,219,178,0.1),transparent)',marginBottom:2}}/>

          {/* Top nav icons */}
          {RAIL_ITEMS.map(item=>(
            <div key={item.id} className="rail-btn" onClick={()=>setRailTab(item.id)} style={{cursor:'pointer',width:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}>
              <RailBtn icon={item.icon} active={railTab===item.id} badge={item.badge} title={item.title}/>
            </div>
          ))}

          {/* Spacer */}
          <div style={{flex:1}}/>

          {/* Bottom icons */}
          {RAIL_BOTTOM.map(item=>(
            <div key={item.id} className="rail-btn" style={{cursor:'pointer',width:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}>
              <RailBtn icon={item.icon} active={false} badge={item.badge} title={item.title}/>
            </div>
          ))}
        </div>

        {/* ── CHANNEL SIDEBAR ── */}
        <div style={{width:335,flexShrink:0,background:T.side,borderRight:`1px solid ${T.border}`,display:'flex',flexDirection:'column',boxShadow:`4px 0 20px rgba(0,0,0,0.45),inset -1px 0 0 rgba(235,219,178,0.04)`}}>
          {/* Workspace header */}
          <div style={{padding:'15px 16px',borderBottom:`1px solid ${T.border}`,background:'rgba(0,0,0,0.2)',display:'flex',alignItems:'center',gap:10,flexShrink:0,cursor:'pointer',
            boxShadow:`inset 0 -1px 0 rgba(235,219,178,0.04),inset 0 1px 0 rgba(235,219,178,0.04)`}}>
            <div style={{flex:1}}>
              <div style={{fontSize:22,fontWeight:800,color:T.text,letterSpacing:'.08em',textTransform:'uppercase'}}>CortixHealth</div>
              <div style={{fontSize:18,color:T.textLow,marginTop:2}}>Practitioner Network</div>
            </div>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{color:T.textLow,flexShrink:0}}><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>

          <div className="sc" style={{flex:1,overflowY:'auto',paddingBottom:10}}>
            {/* Channels */}
            <div style={{fontSize:17,fontWeight:700,letterSpacing:'.13em',color:T.textLow,textTransform:'uppercase',padding:'14px 16px 5px'}}>Channels</div>
            {CHS.map(c=>(
              <div key={c.id} className="ch-r" onClick={()=>setCh(c.id)}
                style={{display:'flex',alignItems:'center',gap:8,padding:'8px 12px',margin:'1px 7px',borderRadius:8,cursor:'pointer',transition:'all 0.15s',
                  background:ch===c.id?'linear-gradient(135deg,rgba(250,189,47,0.14),rgba(250,189,47,0.07))':'transparent',
                  border:ch===c.id?`1px solid rgba(250,189,47,0.22)`:'1px solid transparent',
                  boxShadow:ch===c.id?'inset 0 1px 0 rgba(250,189,47,0.1),0 2px 8px rgba(0,0,0,0.3)':'none',
                }}>
                <span style={{fontSize:27,color:ch===c.id?'rgba(250,189,47,0.75)':'rgba(235,219,178,0.22)',lineHeight:1,fontWeight:300}}>#</span>
                <span style={{fontSize:22,color:ch===c.id?T.text:T.textMid,fontWeight:ch===c.id?600:400,flex:1,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{c.name}</span>
                {c.b>0&&<span style={{fontSize:17,fontWeight:800,padding:'2px 7px',borderRadius:10,background:ch===c.id?`${c.bc}28`:`${c.bc}18`,color:c.bc,border:`1px solid ${c.bc}30`,minWidth:20,textAlign:'center'}}>{c.b}</span>}
              </div>
            ))}

            {/* Lab Analysis */}
            <div style={{fontSize:17,fontWeight:700,letterSpacing:'.13em',color:T.textLow,textTransform:'uppercase',padding:'14px 16px 5px',marginTop:4,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <span>Lab Analysis</span>
              <span style={{fontSize:11,padding:'2px 7px',borderRadius:10,background:'rgba(251,73,52,0.14)',border:'1px solid rgba(251,73,52,0.28)',color:'#fb4934',fontWeight:800}}>7</span>
            </div>
            {LABS.map(l=>(
              <div key={l.id} className="ch-r" onClick={()=>setCh(l.id)}
                title={l.tip}
                style={{display:'flex',alignItems:'center',gap:8,padding:'8px 12px',margin:'1px 7px',borderRadius:8,cursor:'pointer',transition:'all 0.15s',
                  background:ch===l.id?'linear-gradient(135deg,rgba(251,73,52,0.12),rgba(251,73,52,0.05))':'transparent',
                  border:ch===l.id?'1px solid rgba(251,73,52,0.22)':'1px solid transparent',
                  boxShadow:ch===l.id?'inset 0 1px 0 rgba(251,73,52,0.08),0 2px 8px rgba(0,0,0,0.3)':'none',
                }}>
                <span style={{fontSize:16,lineHeight:1,width:20,textAlign:'center',flexShrink:0}}>{l.icon}</span>
                <span style={{fontSize:22,color:ch===l.id?'rgba(251,73,52,0.6)':'rgba(235,219,178,0.18)',lineHeight:1,fontWeight:300,flexShrink:0}}>#</span>
                <span style={{fontSize:22,color:ch===l.id?T.text:T.textMid,fontWeight:ch===l.id?600:400,flex:1,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{l.name}</span>
                {l.b>0&&<span style={{fontSize:17,fontWeight:800,padding:'2px 7px',borderRadius:10,background:l.bc?`${l.bc}20`:'rgba(235,219,178,0.08)',color:l.bc||T.textMid,border:`1px solid ${l.bc?l.bc+'30':'rgba(235,219,178,0.12)'}`,minWidth:20,textAlign:'center'}}>{l.b}</span>}
              </div>
            ))}

            {/* DMs */}
            <div style={{fontSize:17,fontWeight:700,letterSpacing:'.13em',color:T.textLow,textTransform:'uppercase',padding:'14px 16px 5px',marginTop:4,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <span>Direct Messages</span>
              <span style={{fontSize:17,padding:'3px 8px',borderRadius:5,border:`1px solid ${T.border}`,color:T.textMid,cursor:'pointer',fontWeight:700,letterSpacing:'.05em',textTransform:'none',
                background:'rgba(255,255,255,0.04)',boxShadow:'inset 0 1px 0 rgba(255,255,255,0.04)'}}>New DM</span>
            </div>
            {SPECS.map(s=>(
              <div key={s.id} className="dm-r" style={{display:'flex',alignItems:'center',gap:10,padding:'8px 12px',margin:'1px 7px',borderRadius:8,cursor:'pointer',transition:'background 0.15s'}}>
                <div style={{position:'relative',flexShrink:0}}>
                  <Av id={s.id} sz={34}/>
                  <div style={{position:'absolute',bottom:1,right:1,width:9,height:9,borderRadius:'50%',background:SC[s.st],border:'2px solid #32302f',boxShadow:`0 0 5px ${SC[s.st]}99`}}/>
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:22,color:T.textMid,fontWeight:500,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{s.name}</div>
                  <div style={{fontSize:18,color:T.textLow,marginTop:1}}>{s.role}</div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{padding:'12px',borderTop:`1px solid ${T.border}`,background:'rgba(0,0,0,0.2)',flexShrink:0,
            boxShadow:'inset 0 1px 0 rgba(235,219,178,0.04)'}}>
            <button onClick={()=>setModal(true)} style={{width:'100%',padding:'11px',borderRadius:9,
              border:'1px solid rgba(250,189,47,0.32)',
              background:'linear-gradient(135deg,rgba(250,189,47,0.16),rgba(250,189,47,0.07))',
              color:'#fabd2f',fontSize:18,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',cursor:'pointer',
              boxShadow:'0 3px 14px rgba(250,189,47,0.14),inset 0 1px 0 rgba(250,189,47,0.22),inset 0 -1px 0 rgba(0,0,0,0.3)',
              fontFamily:'-apple-system,sans-serif',transition:'all 0.2s'}}>
              Request Consultation
            </button>
          </div>
        </div>

        {/* ── CENTER MESSAGES ── */}
        <div style={{flex:1,display:'flex',flexDirection:'column',background:T.mid,borderRight:`1px solid ${T.border}`,minWidth:0}}>
          {/* Channel header */}
          <div style={{padding:'13px 24px',borderBottom:`1px solid ${T.border}`,display:'flex',alignItems:'center',gap:14,
            background:'rgba(0,0,0,0.25)',flexShrink:0,
            boxShadow:`0 2px 16px rgba(0,0,0,0.35),inset 0 -1px 0 rgba(235,219,178,0.04),inset 0 1px 0 rgba(235,219,178,0.03)`}}>
            <div style={{width:42,height:42,borderRadius:11,
              background:'linear-gradient(145deg,rgba(251,73,52,0.18),rgba(251,73,52,0.08))',
              border:'1px solid rgba(251,73,52,0.28)',
              display:'flex',alignItems:'center',justifyContent:'center',fontSize:34,fontWeight:300,color:'rgba(251,73,52,0.85)',flexShrink:0,
              boxShadow:'inset 0 1px 0 rgba(255,255,255,0.06),inset 0 -1px 0 rgba(0,0,0,0.4)'}}>#</div>
            <div style={{flex:1}}>
              <div style={{fontSize:27,fontWeight:600,color:T.text}}>{CHS.find(c=>c.id===ch)?.name}</div>
              <div style={{fontSize:18,color:T.textLow,marginTop:2}}>6 specialists · 3 active consultations · Peptide Protocol support</div>
            </div>
            <div style={{display:'flex',gap:7,alignItems:'center'}}>
              <button style={{fontSize:18,padding:'6px 14px',borderRadius:7,
                border:'1px solid rgba(184,187,38,0.25)',
                background:'linear-gradient(135deg,rgba(184,187,38,0.12),rgba(184,187,38,0.06))',
                color:'#b8bb26',cursor:'pointer',fontWeight:700,letterSpacing:'.06em',fontFamily:'-apple-system,sans-serif',
                display:'flex',alignItems:'center',gap:5,
                boxShadow:'inset 0 1px 0 rgba(184,187,38,0.12),0 2px 6px rgba(0,0,0,0.3)'}}>
                <span>✓</span> Mark as read
              </button>
              <button style={{fontSize:18,padding:'6px 14px',borderRadius:7,
                border:`1px solid ${T.border}`,
                background:'rgba(255,255,255,0.04)',
                color:T.textLow,cursor:'pointer',fontWeight:700,letterSpacing:'.06em',fontFamily:'-apple-system,sans-serif',
                display:'flex',alignItems:'center',gap:5,
                boxShadow:'inset 0 1px 0 rgba(255,255,255,0.04)'}}>
                <span>🔔</span> Mute channel
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="sc" style={{flex:1,overflowY:'auto',padding:'20px 24px 16px'}}>
            {/* Pinned */}
            <div style={{
              background:'linear-gradient(145deg,rgba(92,84,52,0.38) 0%,rgba(68,62,36,0.30) 100%)',
              backdropFilter:'blur(16px) saturate(130%)',
              WebkitBackdropFilter:'blur(16px) saturate(130%)',
              border:'1px solid rgba(250,189,47,0.24)',
              borderRadius:14,padding:'12px 16px',marginBottom:22,
              display:'flex',gap:12,alignItems:'flex-start',
              boxShadow:'0 4px 20px rgba(0,0,0,0.3),inset 0 1px 0 rgba(250,189,47,0.1),inset 0 -1px 0 rgba(0,0,0,0.2)',
              position:'relative',overflow:'hidden',
            }}>
              <div style={{position:'absolute',top:0,left:20,right:20,height:1,background:'linear-gradient(90deg,transparent,rgba(250,189,47,0.22),transparent)',pointerEvents:'none'}}/>
              <span style={{fontSize:22,marginTop:1,flexShrink:0}}>📌</span>
              <div style={{flex:1}}>
                <div style={{fontSize:17,fontWeight:800,letterSpacing:'.12em',color:'rgba(250,189,47,0.78)',textTransform:'uppercase',marginBottom:5}}>Pinned Messages</div>
                <span style={{fontSize:22,color:T.textMid,lineHeight:1.65}}>Complete your Meto Engine assessment before your first consultation. Your protocol data and ORI score will be shared securely with your assigned clinician.</span>
              </div>
              <span style={{fontSize:27,color:T.textLow,cursor:'pointer',flexShrink:0,marginTop:-2}}>&times;</span>
            </div>

            {MSGS.map(m=>{
              const sp = SPECS.find(x=>x.id===m.s)
              if(!sp) return null
              return (
                <div key={m.id} className="msg-b" style={{display:'flex',gap:14,marginBottom:16,padding:'8px 10px',borderRadius:12,transition:'background 0.15s',position:'relative',alignItems:'flex-start'}}>
                  <div style={{flexShrink:0,paddingTop:3}}><Av id={m.s} sz={44}/></div>
                  <div style={{minWidth:0,maxWidth:'82%'}}>
                    {/* Name row */}
                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:7,flexWrap:'wrap'}}>
                      <span style={{fontSize:23,fontWeight:700,color:T.text}}>{sp.name}</span>
                      <span style={{fontSize:18,color:T.textLow}}>{m.t}</span>
                      {m.urgent&&<span style={{fontSize:17,padding:'2px 8px',borderRadius:4,fontWeight:700,
                        background:'rgba(251,73,52,0.16)',border:'1px solid rgba(251,73,52,0.32)',color:'#fb4934',letterSpacing:'.06em',
                        boxShadow:'0 0 8px rgba(251,73,52,0.18)'}}>URGENT</span>}
                      <span style={{fontSize:17,padding:'3px 10px',borderRadius:5,fontWeight:700,letterSpacing:'.06em',
                        background:`${sp.c}14`,border:`1px solid ${sp.c}28`,color:sp.c}}>{sp.role}</span>
                      {m.urgent&&<div style={{width:20,height:20,borderRadius:'50%',
                        background:'rgba(251,73,52,0.18)',border:'1px solid rgba(251,73,52,0.45)',
                        display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,
                        boxShadow:'0 0 10px rgba(251,73,52,0.3)'}}>
                        <div style={{width:7,height:7,borderRadius:'50%',background:'#fb4934'}}/>
                      </div>}
                    </div>
                    {/* Glass bubble — inline width, not full */}
                    <div style={{
                      display:'inline-block',
                      background: m.hi
                        ? 'linear-gradient(145deg,rgba(250,189,47,0.14) 0%,rgba(215,153,33,0.07) 100%)'
                        : 'linear-gradient(145deg,rgba(92,84,76,0.48) 0%,rgba(68,62,56,0.38) 100%)',
                      backdropFilter:'blur(20px) saturate(140%)',
                      WebkitBackdropFilter:'blur(20px) saturate(140%)',
                      border: m.hi
                        ? '1px solid rgba(250,189,47,0.30)'
                        : '1px solid rgba(235,219,178,0.14)',
                      borderRadius:'4px 16px 16px 16px',
                      padding:'12px 18px',
                      fontSize:23,
                      color: m.hi ? T.text : 'rgba(189,174,147,0.94)',
                      lineHeight:1.7,
                      boxShadow: m.hi
                        ? '0 6px 24px rgba(0,0,0,0.35),inset 0 1px 0 rgba(250,189,47,0.1),inset 0 -1px 0 rgba(0,0,0,0.28)'
                        : '0 6px 24px rgba(0,0,0,0.28),inset 0 1px 0 rgba(235,219,178,0.09),inset 0 -1px 0 rgba(0,0,0,0.22)',
                      maxWidth:'100%',
                      wordBreak:'break-word',
                      position:'relative',
                    }}>
                      <div style={{position:'absolute',top:0,left:14,right:14,height:1,background:m.hi?'linear-gradient(90deg,transparent,rgba(250,189,47,0.28),transparent)':'linear-gradient(90deg,transparent,rgba(235,219,178,0.14),transparent)',borderRadius:1,pointerEvents:'none'}}/>
                      {m.txt.includes('@patient')
                        ? <>{m.txt.split('@patient')[0]}<span style={{color:'#fabd2f',fontWeight:700,background:'rgba(250,189,47,0.12)',padding:'0 4px',borderRadius:3}}>@patient</span>{m.txt.split('@patient')[1]}</>
                        : m.txt}
                    </div>
                    {/* Reactions */}
                    {m.rx&&m.rx.length>0&&(
                      <div style={{display:'flex',gap:5,marginTop:7,flexWrap:'wrap'}}>
                        {m.rx.map((r,i)=>(
                          <button key={i} className="rxbtn" style={{display:'inline-flex',alignItems:'center',gap:5,padding:'4px 12px',borderRadius:20,
                            border:`1px solid rgba(235,219,178,0.15)`,
                            background:'linear-gradient(145deg,rgba(80,73,69,0.55),rgba(60,56,54,0.45))',
                            backdropFilter:'blur(8px)',WebkitBackdropFilter:'blur(8px)',
                            cursor:'pointer',fontSize:22,color:T.textMid,fontFamily:'-apple-system,sans-serif',transition:'all 0.15s',
                            boxShadow:'0 2px 8px rgba(0,0,0,0.25),inset 0 1px 0 rgba(235,219,178,0.08)'}}>
                            <span>{r.e}</span><span style={{fontSize:21,fontWeight:700}}>{r.n}</span>
                          </button>
                        ))}
                        <button className="rxbtn" style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:30,height:30,borderRadius:20,
                          border:`1px solid rgba(235,219,178,0.11)`,
                          background:'linear-gradient(145deg,rgba(80,73,69,0.45),rgba(60,56,54,0.35))',
                          backdropFilter:'blur(8px)',WebkitBackdropFilter:'blur(8px)',
                          cursor:'pointer',fontSize:23,color:T.textLow,
                          fontFamily:'-apple-system,sans-serif',transition:'all 0.15s'}}>☺</button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* ── Floating Pill Input Bar ── */}
          <div style={{padding:'0 24px 20px',background:'transparent',flexShrink:0,position:'relative'}}>
            <div style={{
              borderRadius:18,
              background:'linear-gradient(160deg,#3c3836 0%,#32302f 100%)',
              border:`1px solid rgba(235,219,178,0.22)`,
              boxShadow:'0 10px 36px rgba(0,0,0,0.5),0 2px 8px rgba(0,0,0,0.35),inset 0 1px 0 rgba(235,219,178,0.13),inset 0 -1px 0 rgba(0,0,0,0.35)',
              overflow:'hidden',
            }}>
              {/* Top row — text input */}
              <div style={{padding:'13px 18px 11px',borderBottom:`1px solid rgba(235,219,178,0.09)`}}>
                <input value={msg} onChange={e=>setMsg(e.target.value)}
                  placeholder={`Message #${CHS.find(c=>c.id===ch)?.name}...`}
                  style={{width:'100%',background:'none',border:'none',outline:'none',color:T.text,fontSize:23,fontFamily:'-apple-system,sans-serif',lineHeight:1.5}}/>
              </div>
              {/* Bottom row — toolbar */}
              <div style={{padding:'8px 14px 10px',display:'flex',alignItems:'center',gap:4}}>
                <button className="fmtbtn" style={{width:28,height:28,borderRadius:6,border:`1px solid rgba(235,219,178,0.11)`,background:'rgba(235,219,178,0.05)',color:T.textLow,cursor:'pointer',fontSize:23,display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.15s',flexShrink:0}}>📎</button>
                <div style={{width:1,height:16,background:'rgba(235,219,178,0.1)',margin:'0 4px',flexShrink:0}}/>
                {[
                  {l:'B',fw:800,fs:'normal',td:'none'},
                  {l:'I',fw:400,fs:'italic',td:'none'},
                  {l:'S',fw:600,fs:'normal',td:'line-through'},
                ].map(f=>(
                  <button key={f.l} className="fmtbtn" style={{fontSize:21,width:26,height:26,borderRadius:5,border:`1px solid rgba(235,219,178,0.11)`,background:'rgba(235,219,178,0.05)',color:T.textLow,cursor:'pointer',fontWeight:f.fw,fontStyle:f.fs,textDecoration:f.td,transition:'all 0.15s',fontFamily:'-apple-system,sans-serif',flexShrink:0}}>{f.l}</button>
                ))}
                <button className="fmtbtn" style={{width:26,height:26,borderRadius:5,border:`1px solid rgba(235,219,178,0.11)`,background:'rgba(235,219,178,0.05)',color:T.textLow,cursor:'pointer',fontSize:23,display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.15s',flexShrink:0}}>🔗</button>
                <button className="fmtbtn" style={{width:26,height:26,borderRadius:5,border:`1px solid rgba(235,219,178,0.11)`,background:'rgba(235,219,178,0.05)',color:T.textLow,cursor:'pointer',fontSize:22,display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.15s',flexShrink:0,fontFamily:'monospace',fontWeight:700}}>ƒ</button>
                <button className="fmtbtn" style={{width:26,height:26,borderRadius:5,border:`1px solid rgba(235,219,178,0.11)`,background:'rgba(235,219,178,0.05)',color:T.textLow,cursor:'pointer',fontSize:21,display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.15s',flexShrink:0}}>≡</button>
                <button className="fmtbtn" style={{width:26,height:26,borderRadius:5,border:`1px solid rgba(235,219,178,0.11)`,background:'rgba(235,219,178,0.05)',color:T.textLow,cursor:'pointer',fontSize:21,display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.15s',flexShrink:0}}>⌨</button>
                <div style={{width:1,height:16,background:'rgba(235,219,178,0.1)',margin:'0 4px',flexShrink:0}}/>
                {['Protocol','Lab Results','Schedule'].map(a=>(
                  <button key={a} className="abtn" style={{fontSize:18,padding:'4px 10px',borderRadius:6,border:`1px solid rgba(235,219,178,0.11)`,background:'rgba(235,219,178,0.05)',color:T.textMid,cursor:'pointer',fontWeight:700,letterSpacing:'.04em',fontFamily:'-apple-system,sans-serif',transition:'all 0.15s',flexShrink:0,whiteSpace:'nowrap'}}>{a}</button>
                ))}
                <span style={{fontSize:18,color:T.textLow,marginLeft:6,flexShrink:0,fontWeight:600}}>Aa</span>
                <span style={{fontSize:23,color:T.textLow,cursor:'pointer',padding:'0 4px',flexShrink:0}}>☺</span>
                <button onClick={()=>setMsg('')} style={{
                  marginLeft:'auto',height:32,width:32,borderRadius:9,flexShrink:0,
                  border:'1px solid rgba(250,189,47,0.42)',
                  background:'linear-gradient(145deg,rgba(250,189,47,0.30),rgba(215,153,33,0.20))',
                  color:'#fabd2f',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',
                  boxShadow:'0 4px 12px rgba(250,189,47,0.22),inset 0 1px 0 rgba(250,189,47,0.32),inset 0 -1px 0 rgba(0,0,0,0.3)',
                  fontSize:23,transition:'all 0.15s',
                }}>▶</button>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT THREADS ── */}
        <div style={{width:375,flexShrink:0,background:T.side,display:'flex',flexDirection:'column',
          boxShadow:`-3px 0 18px rgba(0,0,0,0.4),inset 1px 0 0 rgba(235,219,178,0.04)`}}>
          <div style={{padding:'14px 16px',borderBottom:`1px solid ${T.border}`,display:'flex',alignItems:'center',justifyContent:'space-between',
            background:'rgba(0,0,0,0.2)',flexShrink:0,
            boxShadow:'inset 0 -1px 0 rgba(235,219,178,0.04),inset 0 1px 0 rgba(235,219,178,0.03)'}}>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <span style={{fontSize:23,color:T.textLow}}>💬</span>
              <span style={{fontSize:22,fontWeight:700,color:T.textMid,letterSpacing:'.05em',textTransform:'uppercase'}}>Threads</span>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <span style={{fontSize:18,padding:'3px 10px',borderRadius:10,
                background:'rgba(250,189,47,0.15)',border:'1px solid rgba(250,189,47,0.30)',
                color:'#fabd2f',fontWeight:800}}>{SPECS.length}</span>
              <span style={{fontSize:26,color:T.textLow,cursor:'pointer'}}>&times;</span>
            </div>
          </div>

          <div className="sc" style={{flex:1,overflowY:'auto'}}>
            {SPECS.map((sp,i)=>(
              <div key={sp.id} className="tr-r" onClick={()=>setTr(i)}
                style={{display:'flex',gap:11,padding:'13px 14px',borderBottom:`1px solid ${T.border}`,cursor:'pointer',transition:'all 0.15s',
                  borderLeft:tr===i?'3px solid rgba(250,189,47,0.55)':'3px solid transparent',
                  background:tr===i?'linear-gradient(135deg,rgba(250,189,47,0.08),rgba(250,189,47,0.03))':'transparent',
                  boxShadow:tr===i?'inset 0 1px 0 rgba(250,189,47,0.06)':'none'}}>
                <div style={{position:'relative',flexShrink:0}}>
                  <Av id={sp.id} sz={36}/>
                  <div style={{position:'absolute',bottom:0,right:0,width:10,height:10,borderRadius:'50%',background:SC[sp.st],border:'2px solid #32302f'}}/>
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:3}}>
                    <span style={{fontSize:21,fontWeight:600,color:T.textMid}}>{sp.name}</span>
                    <span style={{fontSize:17,color:T.textLow}}>{MSGS.find(m=>m.s===sp.id)?.t||'--'}</span>
                  </div>
                  <div style={{fontSize:17,color:T.textLow,marginBottom:2}}>Latest reply:</div>
                  <div style={{fontSize:18,color:'rgba(168,153,132,0.6)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{sp.reply}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Jump to latest */}
          <div style={{padding:'12px 14px 16px',borderTop:`1px solid ${T.border}`,background:'rgba(0,0,0,0.2)',flexShrink:0,
            boxShadow:'inset 0 1px 0 rgba(235,219,178,0.04)'}}>
            <div className="jump-btn" style={{borderRadius:9,padding:'11px 14px',textAlign:'center',
              background:'linear-gradient(135deg,rgba(60,56,54,0.9),rgba(44,42,40,0.95))',
              border:`1px solid ${T.border}`,color:T.textMid,fontSize:21,fontWeight:700,
              letterSpacing:'.08em',cursor:'pointer',textTransform:'uppercase',
              boxShadow:'inset 0 1px 0 rgba(235,219,178,0.06),0 2px 8px rgba(0,0,0,0.3)',
              transition:'all 0.15s'}}>
              → Jump to Latest
            </div>
          </div>
        </div>
      </div>

      {/* ── MODAL ── */}
      {modal&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.78)',backdropFilter:'blur(14px)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}}>
          <div style={{background:T.card,border:`1px solid ${T.borderHi}`,borderRadius:20,padding:'28px 32px',width:480,
            boxShadow:'0 32px 80px rgba(0,0,0,0.85),inset 0 1px 0 rgba(235,219,178,0.09),inset 0 -1px 0 rgba(0,0,0,0.45)',position:'relative'}}>
            <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,rgba(235,219,178,0.18),transparent)',borderRadius:'20px 20px 0 0'}}/>
            {!done?(
              <>
                <div style={{fontSize:26,fontWeight:700,color:T.text,marginBottom:4}}>Request a Consultation</div>
                <div style={{fontSize:21,color:T.textLow,marginBottom:20}}>Connect with a specialist on the CortixHealth network</div>
                <div style={{display:'flex',flexDirection:'column',gap:13}}>
                  <div><div style={{fontSize:16,color:T.textMid,marginBottom:5,fontWeight:700,textTransform:'uppercase',letterSpacing:'.1em'}}>Your Name</div><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Full name" style={iS}/></div>
                  <div><div style={{fontSize:16,color:T.textMid,marginBottom:5,fontWeight:700,textTransform:'uppercase',letterSpacing:'.1em'}}>Email</div><input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="your@email.com" style={iS}/></div>
                  <div>
                    <div style={{fontSize:16,color:T.textMid,marginBottom:5,fontWeight:700,textTransform:'uppercase',letterSpacing:'.1em'}}>Specialist Type</div>
                    <select value={form.spec} onChange={e=>setForm({...form,spec:e.target.value})} style={{...iS,appearance:'none'}}>
                      <option value="any">Any available specialist</option>
                      <option value="longevity">Longevity MD</option>
                      <option value="nutritionist">Nutritionist / RD</option>
                      <option value="naturopath">Naturopath ND</option>
                      <option value="chiropractor">Chiropractor DC</option>
                      <option value="coach">Performance Coach</option>
                      <option value="functional">Functional Medicine MD</option>
                    </select>
                  </div>
                  <div><div style={{fontSize:16,color:T.textMid,marginBottom:5,fontWeight:700,textTransform:'uppercase',letterSpacing:'.1em'}}>What are you working on?</div><textarea value={form.topic} onChange={e=>setForm({...form,topic:e.target.value})} placeholder="Describe your goals or current protocol..." rows={3} style={{...iS,resize:'none'}}/></div>
                  <div style={{display:'flex',gap:9,marginTop:4}}>
                    <button onClick={()=>setModal(false)} style={{flex:1,padding:10,borderRadius:8,border:`1px solid ${T.border}`,background:'rgba(255,255,255,0.03)',color:T.textMid,fontSize:21,fontWeight:700,cursor:'pointer',fontFamily:'-apple-system,sans-serif',boxShadow:'inset 0 1px 0 rgba(255,255,255,0.04)'}}>Cancel</button>
                    <button onClick={()=>setDone(true)} style={{flex:2,padding:10,borderRadius:8,
                      border:'1px solid rgba(250,189,47,0.35)',
                      background:'linear-gradient(135deg,rgba(250,189,47,0.18),rgba(250,189,47,0.08))',
                      color:'#fabd2f',fontSize:21,fontWeight:700,cursor:'pointer',fontFamily:'-apple-system,sans-serif',
                      boxShadow:'0 4px 14px rgba(250,189,47,0.15),inset 0 1px 0 rgba(250,189,47,0.2)'}}>Submit Request</button>
                  </div>
                </div>
              </>
            ):(
              <div style={{textAlign:'center',padding:'18px 0'}}>
                <div style={{width:60,height:60,borderRadius:'50%',
                  background:'rgba(184,187,38,0.12)',border:'1px solid rgba(184,187,38,0.35)',
                  display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px',fontSize:40,color:'#b8bb26',fontWeight:700,
                  boxShadow:'0 0 24px rgba(184,187,38,0.2)'}}>✓</div>
                <div style={{fontSize:26,fontWeight:700,color:T.text,marginBottom:8}}>Request Submitted</div>
                <div style={{fontSize:21,color:T.textMid,lineHeight:1.65,marginBottom:20}}>A specialist will be in touch within 24 hours. You will receive a confirmation and next steps via secure message.</div>
                <button onClick={()=>{setModal(false);setDone(false)}} style={{padding:'9px 26px',borderRadius:8,
                  border:'1px solid rgba(250,189,47,0.3)',background:'rgba(250,189,47,0.1)',
                  color:'#fabd2f',fontSize:21,fontWeight:700,cursor:'pointer',fontFamily:'-apple-system,sans-serif'}}>Close</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}





