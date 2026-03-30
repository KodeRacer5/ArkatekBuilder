'use client'
import { useState } from 'react'
import TopBar from '@/app/_components/ui/dashboard/top-bar'

// ─── Data ────────────────────────────────────────────────────────────────────
const SPECS = [
  { id:1, ini:'RM', name:'Dr. Rachel Monroe', role:'Longevity MD',      c:'#fb4934', bg:'linear-gradient(145deg,#c0392b,#7a1a14)', st:'online',
    specialty:'Peptide protocols, metabolic optimization, HRT',
    response:'Reviewed your BPC-157 stack — hold dose through week 6. ORI score flagged.',
    unread:2, responseTime:'Usually responds in 2h' },
  { id:2, ini:'NJ', name:'Nathan J. RD',      role:'Nutritionist',      c:'#8ec07c', bg:'linear-gradient(145deg,#4a7a2e,#2d5218)', st:'online',
    specialty:'Micronutrient therapy, longevity nutrition, GLP-1 support',
    response:'Copper bisglycinate 2mg will support GHK-Cu synthesis pathway.',
    unread:0, responseTime:'Usually responds in 4h' },
  { id:3, ini:'CP', name:'Dr. Claire Park',   role:'Naturopath ND',     c:'#83a598', bg:'linear-gradient(145deg,#2e7d6e,#1a4e44)', st:'away',
    specialty:'Adaptogenic protocols, sleep optimization, stress biomarkers',
    response:'Semax cycling 5/2 prevents receptor downregulation — reviewed.',
    unread:1, responseTime:'Usually responds in 6h' },
  { id:4, ini:'MT', name:'Marcus T.',          role:'Performance Coach', c:'#b8bb26', bg:'linear-gradient(145deg,#5a7a1a,#384e10)', st:'busy',
    specialty:'Strength programming, recovery optimization, VO2 max',
    response:'Training split updated to align with TB-500 injection days.',
    unread:0, responseTime:'Usually responds in 3h' },
  { id:5, ini:'SV', name:'Dr. Sara Voss',      role:'Chiropractor DC',   c:'#fabd2f', bg:'linear-gradient(145deg,#a07a1a,#604808)', st:'online',
    specialty:'Structural alignment, soft tissue recovery, fascial health',
    response:'L4-L5 mobility significantly improved — week 4 assessment complete.',
    unread:0, responseTime:'Usually responds in 5h' },
  { id:6, ini:'AK', name:'Dr. Amir Khan',      role:'Functional MD',     c:'#d3869b', bg:'linear-gradient(145deg,#8a3a5a,#5a2038)', st:'online',
    specialty:'Functional medicine, gut-brain axis, cellular aging',
    response:'ORI score trending down — full metabolic panel looks better.',
    unread:1, responseTime:'Usually responds in 3h' },
]

const CHS = [
  { id:'lon', name:'longevity-medicine',  b:3, bc:'#fb4934' },
  { id:'nut', name:'nutrition',            b:7, bc:'#8ec07c' },
  { id:'nat', name:'naturopathic',         b:0, bc:null },
  { id:'chi', name:'chiropractic',         b:1, bc:'#83a598' },
  { id:'per', name:'performance-training', b:0, bc:null },
  { id:'pep', name:'peptide-protocols',    b:2, bc:'#fabd2f' },
  { id:'mob', name:'mobile-visits',        b:3, bc:'#fabd2f', mobile:true },
  { id:'gen', name:'general',              b:0, bc:null },
]

const LABS = [
  { id:'lab-atHome',  name:'at-home-kits',         b:4, bc:'#8ec07c', icon:'◈',
    kits:[
      { name:'SiPhox Health',    price:'$149/kit', turnaround:'7–10 days', markers:'60 biomarkers',   method:'At-home finger prick',   badge:'Most Popular' },
      { name:'Superpower',       price:'$349/yr',  turnaround:'5–7 days',  markers:'100+ biomarkers', method:'Quest partner lab draw',  badge:'Most Comprehensive' },
      { name:'Geviti',           price:'$99/mo',   turnaround:'3–5 days',  markers:'80 biomarkers',   method:'Mobile phlebotomist',     badge:'Most Convenient' },
      { name:'Biostarks',        price:'$199/kit', turnaround:'10 days',   markers:'39 biomarkers',   method:'Dry blood spot mail-in',  badge:'Best for NAD+' },
      { name:'Labcorp OnDemand', price:'$89',      turnaround:'2–3 days',  markers:'25 biomarkers',   method:'Local Labcorp walk-in',   badge:'Fastest Results' },
    ]},
  { id:'lab-blood',   name:'blood-panels',          b:2, bc:'#fb4934', icon:'◉' },
  { id:'lab-hormone', name:'hormone-testing',        b:0, bc:null,     icon:'◈' },
  { id:'lab-genetic', name:'genetic-panels',         b:1, bc:'#d3869b',icon:'◎' },
  { id:'lab-gut',     name:'gut-microbiome',         b:0, bc:null,     icon:'◌' },
  { id:'lab-inflam',  name:'inflammation-markers',   b:3, bc:'#fabd2f',icon:'◈' },
  { id:'lab-imaging', name:'advanced-imaging',       b:0, bc:null,     icon:'◎' },
]

const MSGS = [
  { id:1, s:1, t:'10:42 AM', hi:false, txt:'Reviewed your BPC-157 stack. Adherence is strong at 88%. Recommend holding current dose through week 6 before reassessing the loading phase. Good trajectory.', rx:[{e:'👍',n:1}] },
  { id:2, s:2, t:'11:05 AM', hi:false, txt:'Pair your GHK-Cu protocol with increased dietary copper — organ meats, shellfish, or supplemental copper bisglycinate 2mg daily. Supports the peptide\'s collagen synthesis pathway directly.', rx:[] },
  { id:3, s:4, t:'11:28 AM', hi:false, txt:'Adjusted your resistance training split to align heavy compound lifts with TB-500 injection days. Optimal recovery window is 24–36hrs post-injection.', rx:[{e:'👍',n:1},{e:'🔥',n:2}] },
  { id:4, s:1, t:'11:58 AM', hi:true,  txt:'@patient — your ORI score from the Meto Engine returned at 34. That\'s borderline elevated. I\'d like to schedule a follow-up to review your full metabolic panel before we enter peak phase.', rx:[], urgent:true },
  { id:5, s:3, t:'12:14 PM', hi:false, txt:'Semax intranasal at 400mcg daily is appropriate for cognitive support. Consider cycling 5 days on / 2 days off to prevent receptor downregulation. Monitor mood stability and sleep architecture.', rx:[] },
  { id:6, s:5, t:'12:41 PM', hi:false, txt:'Week 4 spinal assessment complete. Significant improvement in L4–L5 mobility. The BPC-157 + TB-500 combination appears to be accelerating soft tissue recovery. Continue current protocol.', rx:[{e:'👍',n:1}] },
]

const CHALLENGES = [
  { id:'c10', label:'10-Day Reset',      duration:'10 Days', desc:'Sleep, hydration, inflammation baseline reset. Daily specialist check-ins.', participants:247, color:'#8ec07c' },
  { id:'c30', label:'30-Day Protocol',   duration:'30 Days', desc:'Full longevity stack — bloodwork before/after. Peptide, nutrition, training aligned.', participants:891, color:'#fabd2f' },
  { id:'c90', label:'90-Day Transform',  duration:'90 Days', desc:'Comprehensive biometric overhaul. Lab panels at day 0, 45, and 90. Coach-guided.', participants:312, color:'#fb4934' },
]

const WORKOUTS = [
  { id:'w1', name:'TB-500 Recovery Split',       author:'Marcus T.',         days:4, likes:142, tags:['Peptide-Aligned','Hypertrophy'] },
  { id:'w2', name:'Longevity Cardio Stack',       author:'Dr. Rachel Monroe', days:5, likes:89,  tags:['VO2 Max','Zone 2'] },
  { id:'w3', name:'Anti-Inflammatory Movement',  author:'Dr. Sara Voss',     days:3, likes:203, tags:['Mobility','Recovery'] },
]

// Longevity Protocol Specialists — mobile field network
const LPS_NETWORK = [
  { id:101, ini:'JR', name:'Jessica R., NP-C',   role:'Longevity Protocol Specialist', c:'#fabd2f', bg:'linear-gradient(145deg,#8a7010,#504008)', st:'online',
    specialty:'Mobile draw · peptide protocols · metabolic panels · in-home consult',
    response:'Available today · serving your area · in-home visit ready',
    unread:0, responseTime:'Same-day availability', mobile:true, region:'Los Angeles Metro', rating:4.9, visits:312 },
  { id:102, ini:'DM', name:'Daniel M., PA-C',     role:'Longevity Protocol Specialist', c:'#fabd2f', bg:'linear-gradient(145deg,#8a7010,#504008)', st:'online',
    specialty:'Mobile draw · hormone optimization · nutraceutical review · wearable integration',
    response:'Available today · serving your area · in-home visit ready',
    unread:0, responseTime:'Same-day availability', mobile:true, region:'San Diego Metro', rating:4.8, visits:198 },
  { id:103, ini:'AL', name:'Amanda L., NP-C',     role:'Longevity Protocol Specialist', c:'#fabd2f', bg:'linear-gradient(145deg,#8a7010,#504008)', st:'away',
    specialty:'Mobile draw · gut health · inflammation markers · biometric baseline',
    response:'Available tomorrow · serving your area',
    unread:0, responseTime:'Next-day availability', mobile:true, region:'Phoenix Metro', rating:4.9, visits:441 },
]

// Platform free tier features — shown in sidebar
const FREE_FEATURES = [
  { id:'ff1', label:'Community Channels',   desc:'All longevity, nutrition, peptide, and training channels are free forever.' },
  { id:'ff2', label:'Lab Analysis Library', desc:'Full educational library — biomarker guides, panel comparisons, protocol research.' },
  { id:'ff3', label:'Challenges & Programs', desc:'10, 30, and 90-day programs with community tracking. No paywall.' },
  { id:'ff4', label:'Workout Programs',     desc:'Specialist-designed programs shared freely across the network.' },
]

// Simulated consultation room messages
const ROOM_MSGS = {
  1: [
    { from:'spec', t:'Yesterday 3:12 PM', txt:'I\'ve reviewed your latest BPC-157 adherence data. 88% is strong. I\'d like to see your full metabolic panel before we adjust dosing.' },
    { from:'user', t:'Yesterday 3:45 PM', txt:'I uploaded my SiPhox panel from last week. Should be in your dashboard now.' },
    { from:'spec', t:'Yesterday 4:01 PM', txt:'Got it. Your ORI score is at 34 — borderline elevated. I want to run a follow-up focused on your cortisol curve and IGF-1 before we enter the loading phase. Can you book a slot this week?' },
  ],
  3: [
    { from:'spec', t:'Today 9:05 AM', txt:'Semax protocol looks clean. One flag — your sleep architecture data shows fragmented REM. Cycling 5/2 should help but I want to review your evening stack.' },
    { from:'user', t:'Today 9:30 AM', txt:'I\'ll upload my Oura data from the last 30 days.' },
  ],
  6: [
    { from:'spec', t:'Today 11:14 AM', txt:'Your last metabolic panel shows real improvement — ApoB down, fasting glucose normalized. The gut protocol is working. Uploading your revised nutraceutical stack now.' },
  ],
}

const SC = { online:'#b8bb26', away:'#fabd2f', busy:'#fb4934' }

const T = {
  bg:'#282828',
  rail:'linear-gradient(180deg,#3c3836 0%,#32302f 100%)',
  side:'linear-gradient(160deg,#32302f 0%,#2e2c2a 100%)',
  mid:'linear-gradient(160deg,#2a2826 0%,#262422 100%)',
  card:'linear-gradient(155deg,rgba(60,56,54,0.98) 0%,rgba(44,42,40,0.99) 100%)',
  border:'rgba(235,219,178,0.10)',
  borderHi:'rgba(235,219,178,0.18)',
  text:'#ebdbb2', textMid:'#a89984', textLow:'#7c6f64',
  accent:'#fabd2f', accentDim:'rgba(250,189,47,0.14)',
}

// ─── Primitives ──────────────────────────────────────────────────────────────
function Av({ id, sz=36 }) {
  const s = SPECS.find(x=>x.id===id)
  if(!s) return null
  return (
    <div style={{width:sz,height:sz,borderRadius:'50%',background:s.bg,border:`1.5px solid ${s.c}55`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:sz*0.28,fontWeight:800,color:'rgba(235,219,178,0.9)',flexShrink:0,boxShadow:`0 4px 12px rgba(0,0,0,0.6),0 0 0 1px ${s.c}18,inset 0 1px 0 rgba(235,219,178,0.08)`}}>
      {s.ini}
    </div>
  )
}

function RailBtn({ svg, active, badge }) {
  return (
    <div style={{position:'relative',display:'flex',alignItems:'center',justifyContent:'center',
      width:'78%',aspectRatio:'1/1',borderRadius:14,cursor:'pointer',
      background:active?'linear-gradient(145deg,rgba(250,189,47,0.25),rgba(250,189,47,0.12))':'linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))',
      border:active?'1px solid rgba(250,189,47,0.40)':'1px solid rgba(235,219,178,0.09)',
      boxShadow:active?'0 6px 18px rgba(250,189,47,0.22),inset 0 1px 0 rgba(250,189,47,0.28),inset 0 -1px 0 rgba(0,0,0,0.38)':'0 3px 10px rgba(0,0,0,0.55),inset 0 1px 0 rgba(255,255,255,0.08),inset 0 -1px 0 rgba(0,0,0,0.42)',
      transition:'all 0.15s',
    }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active?'#fabd2f':'rgba(235,219,178,0.45)'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{svg}</svg>
      {badge>0&&<div style={{position:'absolute',top:-4,right:-4,minWidth:18,height:18,borderRadius:9,background:'#fb4934',border:'2px solid #282828',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:800,color:'#fff',padding:'0 3px',boxShadow:'0 2px 6px rgba(251,73,52,0.6)'}}>{badge}</div>}
    </div>
  )
}

function GoldBtn({ label, onClick, full, small, icon }) {
  return (
    <button onClick={onClick} style={{width:full?'100%':'auto',padding:small?'8px 16px':'11px 22px',borderRadius:10,cursor:'pointer',
      border:'1px solid rgba(250,189,47,0.40)',
      background:'linear-gradient(135deg,rgba(250,189,47,0.22),rgba(215,153,33,0.12))',
      color:'#fabd2f',fontSize:small?12:13,fontWeight:700,letterSpacing:'.05em',
      fontFamily:'-apple-system,sans-serif',display:'flex',alignItems:'center',justifyContent:'center',gap:6,
      boxShadow:'0 4px 14px rgba(250,189,47,0.18),inset 0 1px 0 rgba(250,189,47,0.22),inset 0 -1px 0 rgba(0,0,0,0.3)',
      transition:'all 0.15s',
    }}>{icon&&<span>{icon}</span>}{label}</button>
  )
}

function GhostBtn({ label, onClick, small }) {
  return (
    <button onClick={onClick} style={{padding:small?'8px 16px':'11px 20px',borderRadius:10,cursor:'pointer',
      border:`1px solid ${T.border}`,background:'rgba(255,255,255,0.03)',
      color:T.textMid,fontSize:small?12:13,fontWeight:700,
      fontFamily:'-apple-system,sans-serif',transition:'all 0.15s',
    }}>{label}</button>
  )
}

// ─── Notification Bell Item ───────────────────────────────────────────────────
function NotifItem({ spec, onClick }) {
  return (
    <div onClick={onClick} style={{display:'flex',gap:10,padding:'11px 14px',borderBottom:`1px solid ${T.border}`,cursor:'pointer',transition:'background 0.15s',background:'rgba(250,189,47,0.04)'}}
      className="notif-row">
      <div style={{position:'relative',flexShrink:0}}>
        <Av id={spec.id} sz={36}/>
        <div style={{position:'absolute',bottom:0,right:0,width:9,height:9,borderRadius:'50%',background:SC[spec.st],border:'2px solid #32302f'}}/>
      </div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:3}}>
          <span style={{fontSize:13,fontWeight:700,color:T.text}}>{spec.name}</span>
          <span style={{fontSize:10,color:T.textLow,flexShrink:0,marginLeft:8}}>Just now</span>
        </div>
        <div style={{fontSize:11,color:spec.c,fontWeight:600,marginBottom:3}}>{spec.role}</div>
        <div style={{fontSize:12,color:T.textMid,lineHeight:1.5,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{spec.response}</div>
      </div>
      {spec.unread>0&&<div style={{width:8,height:8,borderRadius:'50%',background:'#fb4934',flexShrink:0,marginTop:4,boxShadow:'0 0 6px rgba(251,73,52,0.6)'}}/>}
    </div>
  )
}

// ─── PRIVATE CONSULTATION ROOM ────────────────────────────────────────────────
function ConsultRoom({ spec, onClose }) {
  const [roomMsg, setRoomMsg] = useState('')
  const [tab, setTab] = useState('chat')
  const [uploaded, setUploaded] = useState([])
  const [dragOver, setDragOver] = useState(false)
  const [scheduled, setScheduled] = useState(null)
  const msgs = ROOM_MSGS[spec.id] || []
  const SLOTS = ['Tue Mar 19 · 10:00 AM','Tue Mar 19 · 2:00 PM','Wed Mar 20 · 9:00 AM','Wed Mar 20 · 3:30 PM','Thu Mar 21 · 11:00 AM']
  const UPLOAD_TYPES = ['Blood Panel PDF','Lab Results','ORI Score Report','Protocol Summary','Imaging / Scan','Nutrition Log','Training Data','Wearable Export']

  return (
    <div style={{position:'fixed',inset:0,zIndex:200,display:'flex',flexDirection:'column',background:'#1e1c1a',fontFamily:'-apple-system,sans-serif'}}>
      {/* Room Header */}
      <div style={{padding:'0 24px',height:56,display:'flex',alignItems:'center',gap:14,background:'linear-gradient(180deg,#2e2c2a 0%,#262422 100%)',borderBottom:`1px solid ${T.border}`,flexShrink:0,
        boxShadow:'0 2px 20px rgba(0,0,0,0.5),inset 0 1px 0 rgba(235,219,178,0.06)'}}>
        <button onClick={onClose} style={{width:32,height:32,borderRadius:8,border:`1px solid ${T.border}`,background:'rgba(255,255,255,0.04)',color:T.textMid,cursor:'pointer',fontSize:16,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontFamily:'-apple-system,sans-serif'}}>←</button>
        <Av id={spec.id} sz={34}/>
        <div style={{flex:1}}>
          <div style={{fontSize:15,fontWeight:700,color:T.text}}>{spec.name}</div>
          <div style={{fontSize:11,color:spec.c,fontWeight:600}}>{spec.role} · <span style={{color:T.textLow}}>{spec.specialty}</span></div>
        </div>
        <div style={{display:'flex',gap:6}}>
          {[
            {id:'chat',    label:'Secure Chat'},
            {id:'upload',  label:'Documents'},
            {id:'schedule',label:'Schedule'},
            {id:'rx',      label:'Protocol Rx'},
          ].map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{padding:'6px 14px',borderRadius:8,border:tab===t.id?`1px solid rgba(250,189,47,0.38)`:`1px solid ${T.border}`,background:tab===t.id?'rgba(250,189,47,0.14)':'rgba(255,255,255,0.03)',color:tab===t.id?T.accent:T.textMid,fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'-apple-system,sans-serif',transition:'all 0.15s'}}>{t.label}</button>
          ))}
        </div>
        <div style={{display:'flex',alignItems:'center',gap:6,padding:'5px 12px',borderRadius:8,background:'rgba(184,187,38,0.1)',border:'1px solid rgba(184,187,38,0.22)'}}>
          <div style={{width:7,height:7,borderRadius:'50%',background:SC[spec.st],boxShadow:`0 0 5px ${SC[spec.st]}`}}/>
          <span style={{fontSize:11,color:'#b8bb26',fontWeight:700,textTransform:'capitalize'}}>{spec.st}</span>
        </div>
        <div style={{fontSize:11,color:T.textLow,padding:'5px 10px',borderRadius:7,border:`1px solid ${T.border}`,background:'rgba(255,255,255,0.02)'}}>
          {spec.responseTime}
        </div>
      </div>

      {/* Room Body */}
      <div style={{flex:1,display:'flex',overflow:'hidden',minHeight:0}}>

        {/* Left — Chat / Upload / Schedule */}
        <div style={{flex:1,display:'flex',flexDirection:'column',borderRight:`1px solid ${T.border}`}}>

          {/* CHAT TAB */}
          {tab==='chat'&&<>
            <div className="sc" style={{flex:1,overflowY:'auto',padding:'24px 28px'}}>
              {/* HIPAA notice */}
              <div style={{display:'flex',alignItems:'center',gap:8,padding:'8px 14px',borderRadius:8,background:'rgba(142,192,124,0.07)',border:'1px solid rgba(142,192,124,0.18)',marginBottom:24}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8ec07c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <span style={{fontSize:11,color:'#8ec07c',fontWeight:600}}>End-to-end encrypted · HIPAA compliant · Private session</span>
              </div>

              {msgs.map((m,i)=>(
                <div key={i} style={{display:'flex',gap:12,marginBottom:18,alignItems:'flex-start',flexDirection:m.from==='user'?'row-reverse':'row'}}>
                  {m.from==='spec'&&<Av id={spec.id} sz={34}/>}
                  {m.from==='user'&&<div style={{width:34,height:34,borderRadius:'50%',background:'linear-gradient(145deg,#3c3836,#32302f)',border:`1px solid ${T.border}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:T.textMid,flexShrink:0}}>ME</div>}
                  <div style={{maxWidth:'68%'}}>
                    <div style={{fontSize:11,color:T.textLow,marginBottom:4,textAlign:m.from==='user'?'right':'left'}}>{m.t}</div>
                    <div style={{
                      background:m.from==='spec'?'linear-gradient(145deg,rgba(92,84,76,0.55),rgba(68,62,56,0.45))':'linear-gradient(145deg,rgba(250,189,47,0.14),rgba(215,153,33,0.08))',
                      border:m.from==='spec'?`1px solid ${T.border}`:'1px solid rgba(250,189,47,0.25)',
                      borderRadius:m.from==='spec'?'4px 14px 14px 14px':'14px 4px 14px 14px',
                      padding:'11px 16px',fontSize:14,lineHeight:1.65,
                      color:m.from==='spec'?T.textMid:T.text,
                      boxShadow:'0 4px 16px rgba(0,0,0,0.3),inset 0 1px 0 rgba(235,219,178,0.06)',
                      backdropFilter:'blur(12px)',WebkitBackdropFilter:'blur(12px)',
                    }}>{m.txt}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat input */}
            <div style={{padding:'12px 20px 18px',flexShrink:0}}>
              <div style={{borderRadius:16,background:'linear-gradient(160deg,#3c3836 0%,#32302f 100%)',border:`1px solid rgba(235,219,178,0.20)`,boxShadow:'0 8px 28px rgba(0,0,0,0.45),inset 0 1px 0 rgba(235,219,178,0.12)',overflow:'hidden'}}>
                <div style={{padding:'12px 16px 10px',borderBottom:`1px solid rgba(235,219,178,0.08)`}}>
                  <input value={roomMsg} onChange={e=>setRoomMsg(e.target.value)} placeholder={`Message ${spec.name}...`}
                    style={{width:'100%',background:'none',border:'none',outline:'none',color:T.text,fontSize:14,fontFamily:'-apple-system,sans-serif'}}/>
                </div>
                <div style={{padding:'8px 12px 9px',display:'flex',alignItems:'center',gap:6}}>
                  <button onClick={()=>setTab('upload')} style={{fontSize:11,padding:'4px 10px',borderRadius:6,border:`1px solid ${T.border}`,background:'rgba(235,219,178,0.04)',color:T.textMid,cursor:'pointer',fontWeight:700,fontFamily:'-apple-system,sans-serif'}}>Attach Document</button>
                  <button onClick={()=>setTab('schedule')} style={{fontSize:11,padding:'4px 10px',borderRadius:6,border:`1px solid ${T.border}`,background:'rgba(235,219,178,0.04)',color:T.textMid,cursor:'pointer',fontWeight:700,fontFamily:'-apple-system,sans-serif'}}>Schedule Visit</button>
                  <span style={{fontSize:12,color:T.textLow,marginLeft:4}}>Aa</span>
                  <button onClick={()=>setRoomMsg('')} style={{marginLeft:'auto',height:30,width:30,borderRadius:8,border:'1px solid rgba(250,189,47,0.42)',background:'linear-gradient(145deg,rgba(250,189,47,0.28),rgba(215,153,33,0.18))',color:T.accent,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,boxShadow:'0 3px 10px rgba(250,189,47,0.2),inset 0 1px 0 rgba(250,189,47,0.28)'}}>▶</button>
                </div>
              </div>
            </div>
          </>}

          {/* UPLOAD TAB */}
          {tab==='upload'&&<div style={{flex:1,overflowY:'auto',padding:'28px 32px'}}>
            <div style={{fontSize:16,fontWeight:700,color:T.text,marginBottom:4}}>Upload Documents</div>
            <div style={{fontSize:13,color:T.textLow,marginBottom:22}}>All files are encrypted and shared exclusively with {spec.name}.</div>

            {/* Drop zone */}
            <div onDragOver={e=>{e.preventDefault();setDragOver(true)}} onDragLeave={()=>setDragOver(false)}
              onDrop={e=>{e.preventDefault();setDragOver(false);setUploaded(u=>[...u,{name:'Uploaded File.pdf',type:'Document',time:'Just now'}])}}
              style={{border:`2px dashed ${dragOver?'rgba(250,189,47,0.5)':'rgba(235,219,178,0.15)'}`,borderRadius:16,padding:'36px 24px',textAlign:'center',marginBottom:20,transition:'all 0.2s',background:dragOver?'rgba(250,189,47,0.05)':'transparent',cursor:'pointer'}}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={dragOver?T.accent:'rgba(235,219,178,0.3)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{margin:'0 auto 12px',display:'block'}}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              <div style={{fontSize:14,fontWeight:600,color:dragOver?T.accent:T.textMid,marginBottom:4}}>Drop files here or click to browse</div>
              <div style={{fontSize:12,color:T.textLow}}>PDF, JPEG, PNG · Blood panels, lab reports, scans, exports</div>
            </div>

            {/* Quick upload types */}
            <div style={{fontSize:11,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',color:T.textLow,marginBottom:10}}>Quick Upload</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:22}}>
              {UPLOAD_TYPES.map(u=>(
                <button key={u} onClick={()=>setUploaded(prev=>[...prev,{name:u,type:'Quick Upload',time:'Just now'}])}
                  style={{padding:'9px 12px',borderRadius:9,border:`1px solid ${T.border}`,background:'rgba(255,255,255,0.03)',color:T.textMid,fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'-apple-system,sans-serif',textAlign:'left',transition:'all 0.15s'}}>
                  {u}
                </button>
              ))}
            </div>

            {/* Uploaded list */}
            {uploaded.length>0&&<>
              <div style={{fontSize:11,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',color:T.textLow,marginBottom:10}}>Shared with {spec.name}</div>
              {uploaded.map((f,i)=>(
                <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',borderRadius:10,background:'rgba(142,192,124,0.08)',border:'1px solid rgba(142,192,124,0.2)',marginBottom:6}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8ec07c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,color:T.text,fontWeight:600}}>{f.name}</div>
                    <div style={{fontSize:11,color:T.textLow}}>{f.time} · Encrypted</div>
                  </div>
                  <span style={{fontSize:11,color:'#8ec07c',fontWeight:700}}>✓ Sent</span>
                </div>
              ))}
            </>}
          </div>}

          {/* SCHEDULE TAB */}
          {tab==='schedule'&&<div style={{flex:1,overflowY:'auto',padding:'28px 32px'}}>
            <div style={{fontSize:16,fontWeight:700,color:T.text,marginBottom:4}}>Schedule a Visit</div>
            <div style={{fontSize:13,color:T.textLow,marginBottom:24}}>Available times with {spec.name} — video or async review.</div>

            <div style={{display:'flex',gap:8,marginBottom:22}}>
              {['Video Call','Async Review','In-Person'].map(t=>(
                <button key={t} style={{padding:'7px 16px',borderRadius:8,border:`1px solid ${T.border}`,background:'rgba(255,255,255,0.03)',color:T.textMid,fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'-apple-system,sans-serif'}}>{t}</button>
              ))}
            </div>

            <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:24}}>
              {SLOTS.map(s=>(
                <div key={s} onClick={()=>setScheduled(s)} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'13px 16px',borderRadius:11,cursor:'pointer',transition:'all 0.15s',
                  background:scheduled===s?'linear-gradient(135deg,rgba(250,189,47,0.14),rgba(250,189,47,0.06))':'rgba(255,255,255,0.03)',
                  border:scheduled===s?'1px solid rgba(250,189,47,0.32)':`1px solid ${T.border}`,
                  boxShadow:scheduled===s?'inset 0 1px 0 rgba(250,189,47,0.1)':'none'}}>
                  <span style={{fontSize:13,fontWeight:600,color:scheduled===s?T.text:T.textMid}}>{s}</span>
                  {scheduled===s&&<span style={{fontSize:11,color:T.accent,fontWeight:700}}>Selected</span>}
                </div>
              ))}
            </div>

            {scheduled&&<GoldBtn label={`Confirm · ${scheduled}`} full onClick={()=>setTab('chat')}/>}
          </div>}

          {/* PROTOCOL RX TAB */}
          {tab==='rx'&&<div style={{flex:1,overflowY:'auto',padding:'28px 32px'}}>
            <div style={{fontSize:16,fontWeight:700,color:T.text,marginBottom:4}}>Protocol Prescription</div>
            <div style={{fontSize:13,color:T.textLow,marginBottom:20}}>Issued by {spec.name} · {new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}</div>

            <div style={{padding:'14px 18px',borderRadius:13,background:'linear-gradient(145deg,rgba(250,189,47,0.1),rgba(250,189,47,0.04))',border:'1px solid rgba(250,189,47,0.25)',marginBottom:20,boxShadow:'inset 0 1px 0 rgba(250,189,47,0.1)'}}>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
                <Av id={spec.id} sz={32}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:700,color:T.text}}>{spec.name} · {spec.role}</div>
                  <div style={{fontSize:11,color:T.textLow}}>CortixHealth Longevity Network</div>
                </div>
                <span style={{fontSize:10,padding:'3px 9px',borderRadius:7,background:'rgba(184,187,38,0.14)',border:'1px solid rgba(184,187,38,0.3)',color:'#b8bb26',fontWeight:800}}>ACTIVE</span>
              </div>
              <div style={{fontSize:11,color:T.textLow}}>ORI Score: <span style={{color:'#fabd2f',fontWeight:700}}>34 · Borderline Elevated</span> · Phase: <span style={{color:'#8ec07c',fontWeight:700}}>Week 4 of 8</span></div>
            </div>

            <div style={{fontSize:10,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',color:T.textLow,marginBottom:10}}>Prescribed Compounds</div>
            {[
              { name:'BPC-157',  dose:'250mcg · Daily · SubQ',         status:'Active',   note:'Hold at current dose through week 6. Reassess after ORI follow-up.', c:'#fb4934' },
              { name:'TB-500',   dose:'2mg · Mon/Thu · SubQ',          status:'Active',   note:'Align with heavy compound lift days. 24–36hr recovery window.', c:'#83a598' },
              { name:'GHK-Cu',   dose:'1mg · Daily · SubQ/Topical',    status:'Active',   note:'Pair with copper bisglycinate 2mg dietary support.', c:'#fabd2f' },
              { name:'Semax',    dose:'400mcg · 5/2 · Intranasal',     status:'Cycling',  note:'Monitor sleep architecture. Do not stack with stimulants.', c:'#8ec07c' },
            ].map(rx=>(
              <div key={rx.name} style={{marginBottom:8,padding:'12px 14px',borderRadius:10,background:'rgba(255,255,255,0.03)',border:`1px solid ${T.border}`,borderLeft:`3px solid ${rx.c}`}}>
                <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:5,flexWrap:'wrap'}}>
                  <span style={{fontSize:13,fontWeight:700,color:T.text}}>{rx.name}</span>
                  <span style={{fontSize:11,color:T.textLow}}>{rx.dose}</span>
                  <span style={{marginLeft:'auto',fontSize:10,padding:'2px 7px',borderRadius:5,background:'rgba(184,187,38,0.12)',border:'1px solid rgba(184,187,38,0.25)',color:'#b8bb26',fontWeight:700}}>{rx.status}</span>
                </div>
                <div style={{fontSize:11,color:T.textMid,lineHeight:1.55}}>{rx.note}</div>
              </div>
            ))}

            <div style={{fontSize:10,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',color:T.textLow,marginTop:16,marginBottom:10}}>Nutraceutical Stack</div>
            {[
              ['Copper Bisglycinate','2mg daily','GHK-Cu support'],
              ['Magnesium Glycinate','400mg nightly','Sleep / cortisol'],
              ['Omega-3 EPA/DHA','3g daily','Inflammation / ApoB'],
              ['Vitamin D3 + K2','5000 IU / 200mcg','Metabolic normalization'],
            ].map(([n,d,p])=>(
              <div key={n} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 12px',borderRadius:8,background:'rgba(255,255,255,0.025)',border:`1px solid ${T.border}`,marginBottom:5}}>
                <span style={{fontSize:12,fontWeight:600,color:T.textMid,flex:1}}>{n}</span>
                <span style={{fontSize:11,color:T.textLow}}>{d}</span>
                <span style={{fontSize:10,color:T.textLow,textAlign:'right',minWidth:120}}>{p}</span>
              </div>
            ))}

            <div style={{marginTop:16,display:'flex',gap:8}}>
              <button style={{flex:1,padding:'10px',borderRadius:9,border:`1px solid ${T.border}`,background:'rgba(255,255,255,0.03)',color:T.textMid,fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'-apple-system,sans-serif'}}>Download PDF</button>
              <button style={{flex:2,padding:'10px',borderRadius:9,border:'1px solid rgba(250,189,47,0.35)',background:'linear-gradient(135deg,rgba(250,189,47,0.16),rgba(250,189,47,0.07))',color:T.accent,fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'-apple-system,sans-serif',boxShadow:'0 3px 12px rgba(250,189,47,0.15)'}}>Send to Compounding Lab</button>
            </div>
          </div>}
        </div>

        {/* Right panel — specialist profile + shared context */}
        <div style={{width:300,flexShrink:0,display:'flex',flexDirection:'column',background:'linear-gradient(160deg,#2e2c2a 0%,#262422 100%)'}}>
          {/* Spec card */}
          <div style={{padding:'24px 20px',borderBottom:`1px solid ${T.border}`}}>
            <div style={{display:'flex',gap:12,alignItems:'center',marginBottom:14}}>
              <Av id={spec.id} sz={44}/>
              <div>
                <div style={{fontSize:15,fontWeight:700,color:T.text}}>{spec.name}</div>
                <div style={{fontSize:12,color:spec.c,fontWeight:600}}>{spec.role}</div>
              </div>
            </div>
            <div style={{fontSize:12,color:T.textMid,lineHeight:1.65,marginBottom:14}}>{spec.specialty}</div>
            <div style={{display:'flex',gap:8}}>
              <div style={{flex:1,padding:'8px 10px',borderRadius:8,background:'rgba(255,255,255,0.03)',border:`1px solid ${T.border}`,textAlign:'center'}}>
                <div style={{fontSize:16,fontWeight:800,color:T.accent}}>98%</div>
                <div style={{fontSize:10,color:T.textLow,marginTop:1}}>Satisfaction</div>
              </div>
              <div style={{flex:1,padding:'8px 10px',borderRadius:8,background:'rgba(255,255,255,0.03)',border:`1px solid ${T.border}`,textAlign:'center'}}>
                <div style={{fontSize:16,fontWeight:800,color:'#8ec07c'}}>247</div>
                <div style={{fontSize:10,color:T.textLow,marginTop:1}}>Patients</div>
              </div>
              <div style={{flex:1,padding:'8px 10px',borderRadius:8,background:'rgba(255,255,255,0.03)',border:`1px solid ${T.border}`,textAlign:'center'}}>
                <div style={{fontSize:16,fontWeight:800,color:'#83a598'}}>4.9</div>
                <div style={{fontSize:10,color:T.textLow,marginTop:1}}>Rating</div>
              </div>
            </div>
          </div>

          {/* Shared context */}
          <div style={{flex:1,overflowY:'auto',padding:'18px 20px'}}>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase',color:T.textLow,marginBottom:12}}>Your Shared Context</div>
            {[
              {label:'Current Protocol',  val:'BPC-157 · TB-500 · GHK-Cu · Week 4', c:'#fb4934'},
              {label:'ORI Score',         val:'34 · Borderline Elevated',            c:'#fabd2f'},
              {label:'Last Blood Panel',  val:'SiPhox · Nov 2024 · 60 markers',      c:'#8ec07c'},
              {label:'Active Challenge',  val:'30-Day Protocol · Day 12',            c:'#83a598'},
              {label:'Training Program',  val:'TB-500 Recovery Split · 4 days/wk',   c:'#b8bb26'},
            ].map(item=>(
              <div key={item.label} style={{marginBottom:10,padding:'9px 12px',borderRadius:9,background:'rgba(255,255,255,0.03)',border:`1px solid ${T.border}`}}>
                <div style={{fontSize:10,color:T.textLow,marginBottom:2,fontWeight:600}}>{item.label}</div>
                <div style={{fontSize:12,color:item.c,fontWeight:600}}>{item.val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── VIRTUAL VISIT INTAKE (full-screen multi-step) ────────────────────────────
function VirtualVisitIntake({ onClose, onOpenRoom }) {
  const [step, setStep] = useState(1)
  const [intent, setIntent] = useState(null)
  const [selectedSpec, setSelectedSpec] = useState(null)
  const [uploads, setUploads] = useState([])
  const [notes, setNotes] = useState('')

  const INTENTS = [
    { id:'consult',  label:'Specialist Consultation', desc:'Connect with a longevity MD, nutritionist, chiropractor, or performance coach for a protocol review.',    icon:<><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></> },
    { id:'labs',     label:'Lab Analysis & Upload',   desc:'Upload bloodwork or order an at-home kit. Get specialist interpretation of your results.',                 icon:<><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></> },
    { id:'protocol', label:'Protocol Review',          desc:'Share your current peptide, supplement, or training stack for a full specialist audit.',                   icon:<><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></> },
    { id:'both',     label:'Full Intake — Labs + Consult', desc:'Upload your bloodwork first, then get matched with the best specialist for your data.',               icon:<><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></> },
  ]

  const UPLOAD_DOCS = ['Blood Panel (PDF)','Hormone Panel','Genetic Report','ORI Score Export','Imaging / Scan','Wearable Data Export','Current Protocol PDF','Nutrition Log']

  return (
    <div style={{position:'fixed',inset:0,zIndex:150,background:'rgba(0,0,0,0.88)',backdropFilter:'blur(20px)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'-apple-system,sans-serif',padding:24}}>
      <div style={{width:'100%',maxWidth:860,background:T.card,borderRadius:24,border:`1px solid ${T.borderHi}`,boxShadow:'0 40px 100px rgba(0,0,0,0.9),inset 0 1px 0 rgba(235,219,178,0.12)',position:'relative',overflow:'hidden',maxHeight:'90vh',display:'flex',flexDirection:'column'}}>

        {/* Top edge highlight */}
        <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,rgba(235,219,178,0.22),transparent)',pointerEvents:'none'}}/>

        {/* Header */}
        <div style={{padding:'22px 28px',borderBottom:`1px solid ${T.border}`,display:'flex',alignItems:'center',gap:14,flexShrink:0}}>
          <div style={{flex:1}}>
            <div style={{fontSize:18,fontWeight:700,color:T.text}}>Start a Virtual Visit</div>
            <div style={{fontSize:12,color:T.textLow,marginTop:2}}>CortixHealth · Longevity & Performance Platform · End-to-end encrypted</div>
          </div>
          {/* Step indicator */}
          <div style={{display:'flex',gap:6,alignItems:'center'}}>
            {[1,2,3,4].map(s=>(
              <div key={s} style={{display:'flex',alignItems:'center',gap:6}}>
                <div style={{width:28,height:28,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:800,
                  background:step>s?'rgba(184,187,38,0.2)':step===s?'rgba(250,189,47,0.2)':'rgba(255,255,255,0.04)',
                  border:step>s?'1px solid rgba(184,187,38,0.5)':step===s?'1px solid rgba(250,189,47,0.5)':`1px solid ${T.border}`,
                  color:step>s?'#b8bb26':step===s?T.accent:T.textLow,
                }}>
                  {step>s?'✓':s}
                </div>
                {s<4&&<div style={{width:20,height:1,background:step>s?'rgba(184,187,38,0.3)':'rgba(235,219,178,0.1)'}}/>}
              </div>
            ))}
          </div>
          <button onClick={onClose} style={{width:30,height:30,borderRadius:8,border:`1px solid ${T.border}`,background:'rgba(255,255,255,0.04)',color:T.textMid,cursor:'pointer',fontSize:16,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'-apple-system,sans-serif'}}>&times;</button>
        </div>

        {/* Body */}
        <div style={{flex:1,overflowY:'auto',padding:'28px 32px'}}>

          {/* STEP 1 — Intent */}
          {step===1&&<>
            <div style={{fontSize:15,fontWeight:700,color:T.text,marginBottom:4}}>What do you need today?</div>
            <div style={{fontSize:13,color:T.textLow,marginBottom:22}}>Select the type of visit. You can combine labs and consultation in a single session.</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              {INTENTS.map(i=>(
                <div key={i.id} onClick={()=>setIntent(i.id)} style={{padding:'18px 20px',borderRadius:14,cursor:'pointer',transition:'all 0.15s',
                  background:intent===i.id?'linear-gradient(145deg,rgba(250,189,47,0.12),rgba(250,189,47,0.05))':'rgba(255,255,255,0.03)',
                  border:intent===i.id?'1px solid rgba(250,189,47,0.35)':`1px solid ${T.border}`,
                  boxShadow:intent===i.id?'0 4px 18px rgba(250,189,47,0.12),inset 0 1px 0 rgba(250,189,47,0.1)':'none'}}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={intent===i.id?T.accent:'rgba(235,219,178,0.4)'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{marginBottom:10}}>{i.icon}</svg>
                  <div style={{fontSize:13,fontWeight:700,color:intent===i.id?T.text:T.textMid,marginBottom:5}}>{i.label}</div>
                  <div style={{fontSize:12,color:T.textLow,lineHeight:1.6}}>{i.desc}</div>
                </div>
              ))}
            </div>
          </>}

          {/* STEP 2 — Upload */}
          {step===2&&<>
            <div style={{fontSize:15,fontWeight:700,color:T.text,marginBottom:4}}>Upload Your Data</div>
            <div style={{fontSize:13,color:T.textLow,marginBottom:22}}>Share relevant documents with your specialist. All files are encrypted end-to-end.</div>

            <div style={{border:`2px dashed rgba(235,219,178,0.15)`,borderRadius:14,padding:'28px 20px',textAlign:'center',marginBottom:20,cursor:'pointer',transition:'all 0.15s'}}
              onClick={()=>setUploads(u=>[...u,{name:'Lab Panel — SiPhox Nov 2024.pdf',time:'Just now'}])}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(235,219,178,0.35)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{margin:'0 auto 10px',display:'block'}}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              <div style={{fontSize:13,color:T.textMid,fontWeight:600,marginBottom:3}}>Drop files or click to browse</div>
              <div style={{fontSize:11,color:T.textLow}}>PDF, JPEG, PNG, CSV accepted</div>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:20}}>
              {UPLOAD_DOCS.map(d=>(
                <button key={d} onClick={()=>setUploads(u=>[...u,{name:d,time:'Just now'}])}
                  style={{padding:'9px 12px',borderRadius:8,border:`1px solid ${T.border}`,background:'rgba(255,255,255,0.03)',color:T.textMid,fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'-apple-system,sans-serif',textAlign:'left',transition:'all 0.15s'}}>
                  {d}
                </button>
              ))}
            </div>

            {uploads.length>0&&uploads.map((f,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 13px',borderRadius:9,background:'rgba(142,192,124,0.08)',border:'1px solid rgba(142,192,124,0.2)',marginBottom:6}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8ec07c" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                <span style={{fontSize:12,color:T.text,fontWeight:600,flex:1}}>{f.name}</span>
                <span style={{fontSize:11,color:'#8ec07c',fontWeight:700}}>✓ Ready</span>
              </div>
            ))}

            <div style={{marginTop:20}}>
              <div style={{fontSize:11,color:T.textLow,marginBottom:8,fontWeight:700,textTransform:'uppercase',letterSpacing:'.08em'}}>Additional Notes for Specialist</div>
              <textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={3} placeholder="Describe your main concern, current symptoms, or protocol questions..."
                style={{width:'100%',background:'rgba(255,255,255,0.04)',border:`1px solid ${T.border}`,borderRadius:10,padding:'10px 14px',color:T.text,fontSize:13,outline:'none',fontFamily:'-apple-system,sans-serif',resize:'none',boxSizing:'border-box'}}/>
            </div>
          </>}

          {/* STEP 3 — Match Specialist */}
          {step===3&&<>
            <div style={{fontSize:15,fontWeight:700,color:T.text,marginBottom:4}}>Choose Your Specialist</div>
            <div style={{fontSize:13,color:T.textLow,marginBottom:20}}>Matched based on your visit type and uploaded data.</div>

            {/* ── LPS Mobile Visit — featured at top ── */}
            <div style={{marginBottom:22}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
                <div style={{height:1,flex:1,background:'linear-gradient(90deg,rgba(250,189,47,0.3),transparent)'}}/>
                <span style={{fontSize:10,fontWeight:800,letterSpacing:'.12em',textTransform:'uppercase',color:T.accent,padding:'3px 10px',borderRadius:10,background:'rgba(250,189,47,0.1)',border:'1px solid rgba(250,189,47,0.25)'}}>Mobile Visit — Comes to You</span>
                <div style={{height:1,flex:1,background:'linear-gradient(90deg,transparent,rgba(250,189,47,0.3))'}}/>
              </div>
              <div style={{padding:'16px 18px',borderRadius:14,cursor:'pointer',transition:'all 0.15s',marginBottom:8,
                background:'linear-gradient(145deg,rgba(250,189,47,0.1),rgba(250,189,47,0.04))',
                border:'1px solid rgba(250,189,47,0.28)',
                boxShadow:'0 4px 20px rgba(250,189,47,0.1),inset 0 1px 0 rgba(250,189,47,0.1)'}}>
                <div style={{display:'flex',alignItems:'flex-start',gap:14,marginBottom:12}}>
                  <div style={{width:44,height:44,borderRadius:'50%',background:'linear-gradient(145deg,#8a7010,#504008)',border:'1.5px solid rgba(250,189,47,0.4)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:800,color:'rgba(235,219,178,0.9)',flexShrink:0,boxShadow:'0 4px 12px rgba(0,0,0,0.5),inset 0 1px 0 rgba(250,189,47,0.15)'}}>LPS</div>
                  <div style={{flex:1}}>
                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:3,flexWrap:'wrap'}}>
                      <span style={{fontSize:14,fontWeight:700,color:T.text}}>Longevity Protocol Specialist</span>
                      <span style={{fontSize:10,padding:'2px 8px',borderRadius:5,background:'rgba(250,189,47,0.2)',border:'1px solid rgba(250,189,47,0.4)',color:T.accent,fontWeight:800}}>Mobile</span>
                      <span style={{fontSize:10,padding:'2px 8px',borderRadius:5,background:'rgba(184,187,38,0.14)',border:'1px solid rgba(184,187,38,0.3)',color:'#b8bb26',fontWeight:700}}>NP-C / PA-C Licensed</span>
                    </div>
                    <div style={{fontSize:12,color:T.textMid,lineHeight:1.6,marginBottom:8}}>A certified longevity NP or PA comes directly to your home. Includes blood draw, body composition assessment, biometric baseline, and full protocol consultation. Follow-up support through the CortixHealth platform.</div>
                    <div style={{display:'flex',gap:16,flexWrap:'wrap'}}>
                      {[['In-Home Visit','Your location'],['Blood Draw','Included'],['Protocol Review','Included'],['Platform Follow-up','Included']].map(([l,v])=>(
                        <div key={l} style={{fontSize:11,color:T.textLow}}><span style={{color:T.textMid,fontWeight:600}}>{l}:</span> {v}</div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Available LPS in network */}
                <div style={{display:'flex',flexDirection:'column',gap:6}}>
                  {LPS_NETWORK.map(lps=>(
                    <div key={lps.id} onClick={()=>setSelectedSpec(lps.id)} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',borderRadius:10,cursor:'pointer',transition:'all 0.15s',
                      background:selectedSpec===lps.id?'rgba(250,189,47,0.12)':'rgba(255,255,255,0.04)',
                      border:selectedSpec===lps.id?'1px solid rgba(250,189,47,0.38)':`1px solid rgba(235,219,178,0.1)`}}>
                      <div style={{width:32,height:32,borderRadius:'50%',background:'linear-gradient(145deg,#8a7010,#504008)',border:`1.5px solid rgba(250,189,47,0.35)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:800,color:'rgba(235,219,178,0.9)',flexShrink:0}}>{lps.ini}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:2}}>
                          <span style={{fontSize:13,fontWeight:700,color:T.text}}>{lps.name}</span>
                          <span style={{fontSize:10,color:T.textLow}}>· {lps.region}</span>
                        </div>
                        <div style={{fontSize:11,color:T.textLow,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{lps.specialty}</div>
                      </div>
                      <div style={{flexShrink:0,textAlign:'right'}}>
                        <div style={{display:'flex',alignItems:'center',gap:4,marginBottom:2,justifyContent:'flex-end'}}>
                          <div style={{width:6,height:6,borderRadius:'50%',background:SC[lps.st]}}/>
                          <span style={{fontSize:10,color:T.textLow}}>{lps.responseTime}</span>
                        </div>
                        <div style={{fontSize:11,color:T.accent,fontWeight:700}}>★ {lps.rating} · {lps.visits} visits</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div style={{display:'flex',alignItems:'center',gap:8,margin:'18px 0 14px'}}>
                <div style={{height:1,flex:1,background:`1px solid ${T.border}`}}/>
                <span style={{fontSize:10,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',color:T.textLow}}>or choose a remote specialist</span>
                <div style={{height:1,flex:1,background:`1px solid ${T.border}`}}/>
              </div>
            </div>

            {/* Regular specialists */}
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {SPECS.map(s=>(
                <div key={s.id} onClick={()=>setSelectedSpec(s.id)} style={{display:'flex',alignItems:'center',gap:14,padding:'13px 16px',borderRadius:13,cursor:'pointer',transition:'all 0.15s',
                  background:selectedSpec===s.id?'linear-gradient(135deg,rgba(250,189,47,0.1),rgba(250,189,47,0.04))':'rgba(255,255,255,0.03)',
                  border:selectedSpec===s.id?'1px solid rgba(250,189,47,0.32)':`1px solid ${T.border}`,
                  boxShadow:selectedSpec===s.id?'inset 0 1px 0 rgba(250,189,47,0.08)':'none'}}>
                  <Av id={s.id} sz={40}/>
                  <div style={{flex:1}}>
                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:3}}>
                      <span style={{fontSize:13,fontWeight:700,color:T.text}}>{s.name}</span>
                      <span style={{fontSize:10,padding:'2px 8px',borderRadius:5,background:`${s.c}14`,border:`1px solid ${s.c}28`,color:s.c,fontWeight:700}}>{s.role}</span>
                    </div>
                    <div style={{fontSize:12,color:T.textLow,marginBottom:3}}>{s.specialty}</div>
                    <div style={{fontSize:11,color:T.textLow}}>{s.responseTime}</div>
                  </div>
                  <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:5,flexShrink:0}}>
                    <div style={{display:'flex',alignItems:'center',gap:5}}>
                      <div style={{width:7,height:7,borderRadius:'50%',background:SC[s.st]}}/>
                      <span style={{fontSize:11,color:T.textLow,textTransform:'capitalize'}}>{s.st}</span>
                    </div>
                    {s.unread>0&&<span style={{fontSize:10,padding:'2px 7px',borderRadius:8,background:'rgba(251,73,52,0.14)',border:'1px solid rgba(251,73,52,0.28)',color:'#fb4934',fontWeight:700}}>{s.unread} new</span>}
                  </div>
                </div>
              ))}
            </div>
          </>}

          {/* STEP 4 — Confirm */}
          {step===4&&<>
            <div style={{textAlign:'center',padding:'10px 0 20px'}}>
              <div style={{width:64,height:64,borderRadius:'50%',background:'rgba(184,187,38,0.12)',border:'1px solid rgba(184,187,38,0.35)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 18px',fontSize:28,color:'#b8bb26',boxShadow:'0 0 28px rgba(184,187,38,0.2)'}}>✓</div>
              <div style={{fontSize:20,fontWeight:700,color:T.text,marginBottom:8}}>Your Visit Is Ready</div>
              <div style={{fontSize:13,color:T.textMid,lineHeight:1.75,marginBottom:24,maxWidth:480,margin:'0 auto 24px'}}>
                {selectedSpec&&`${SPECS.find(s=>s.id===selectedSpec)?.name} has been notified. `}
                {uploads.length>0&&`${uploads.length} document${uploads.length>1?'s':''} uploaded. `}
                Your private consultation room is open — all communications are encrypted.
              </div>
              <div style={{display:'flex',gap:10,justifyContent:'center'}}>
                <GhostBtn label="Back to Dashboard" onClick={onClose}/>
                <GoldBtn label="Open Consultation Room" onClick={()=>{onClose();selectedSpec&&onOpenRoom(SPECS.find(s=>s.id===selectedSpec))}}/>
              </div>
            </div>
          </>}
        </div>

        {/* Footer nav */}
        {step<4&&<div style={{padding:'16px 28px',borderTop:`1px solid ${T.border}`,display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0,background:'rgba(0,0,0,0.2)'}}>
          <div style={{fontSize:12,color:T.textLow}}>Step {step} of 4 · {['Choose Visit Type','Upload Documents','Select Specialist','Confirm'][step-1]}</div>
          <div style={{display:'flex',gap:10}}>
            {step>1&&<GhostBtn label="Back" small onClick={()=>setStep(s=>s-1)}/>}
            <GoldBtn small label={step===3?'Review & Confirm →':'Continue →'} onClick={()=>{if(step===1&&!intent)return;setStep(s=>s+1)}}/>
          </div>
        </div>}
      </div>
    </div>
  )
}

// ─── MODAL: Request Consultation Intake ──────────────────────────────────────
function RequestConsultModal({ onClose }) {
  const [step, setStep] = useState(1)
  const [done, setDone] = useState(false)
  const [form, setForm] = useState({ name:'', email:'', phone:'', dob:'', goal:'', current:'', labs:'', specialist:'any', timing:'asap', notes:'' })
  const u = (k,v) => setForm(f=>({...f,[k]:v}))
  const iS = { width:'100%', background:'rgba(255,255,255,0.04)', border:`1px solid ${T.border}`, borderRadius:8, padding:'9px 13px', color:T.text, fontSize:13, outline:'none', fontFamily:'-apple-system,sans-serif', boxSizing:'border-box' }
  const lbl = (t) => <div style={{fontSize:10,color:'#a89984',marginBottom:5,fontWeight:700,textTransform:'uppercase',letterSpacing:'.1em'}}>{t}</div>

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.82)',backdropFilter:'blur(16px)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:20,fontFamily:'-apple-system,sans-serif'}} onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div style={{width:'100%',maxWidth:560,background:'linear-gradient(155deg,rgba(62,58,56,0.98),rgba(44,42,40,0.99))',border:'1px solid rgba(235,219,178,0.18)',borderRadius:22,boxShadow:'0 32px 80px rgba(0,0,0,0.85),inset 0 1px 0 rgba(235,219,178,0.1)',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,rgba(235,219,178,0.2),transparent)',pointerEvents:'none'}}/>

        {/* Header */}
        <div style={{padding:'20px 26px',borderBottom:'1px solid rgba(235,219,178,0.1)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div>
            <div style={{fontSize:17,fontWeight:700,color:'#ebdbb2'}}>Request a Consultation</div>
            <div style={{fontSize:11,color:'#7c6f64',marginTop:2}}>CortixHealth · Longevity & Performance Network · Step {step} of 3</div>
          </div>
          <div style={{display:'flex',gap:6,alignItems:'center'}}>
            {[1,2,3].map(s=>(
              <div key={s} style={{width:24,height:24,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:800,
                background:step>s?'rgba(184,187,38,0.2)':step===s?'rgba(250,189,47,0.2)':'rgba(255,255,255,0.04)',
                border:step>s?'1px solid rgba(184,187,38,0.5)':step===s?'1px solid rgba(250,189,47,0.5)':'1px solid rgba(235,219,178,0.1)',
                color:step>s?'#b8bb26':step===s?'#fabd2f':'#7c6f64'}}>{step>s?'✓':s}</div>
            ))}
          </div>
          <button onClick={onClose} style={{width:28,height:28,borderRadius:8,border:'1px solid rgba(235,219,178,0.1)',background:'rgba(255,255,255,0.04)',color:'#a89984',cursor:'pointer',fontSize:16,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'-apple-system,sans-serif'}}>&times;</button>
        </div>

        <div style={{padding:'24px 26px',maxHeight:'60vh',overflowY:'auto'}}>
          {done ? (
            <div style={{textAlign:'center',padding:'16px 0'}}>
              <div style={{width:60,height:60,borderRadius:'50%',background:'rgba(184,187,38,0.12)',border:'1px solid rgba(184,187,38,0.35)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px',fontSize:26,color:'#b8bb26'}}>✓</div>
              <div style={{fontSize:18,fontWeight:700,color:'#ebdbb2',marginBottom:8}}>Request Submitted</div>
              <div style={{fontSize:13,color:'#a89984',lineHeight:1.7,marginBottom:24}}>A CortixHealth specialist will review your intake and respond within 24 hours via secure message. Check your consultation room for updates.</div>
              <button onClick={onClose} style={{padding:'10px 28px',borderRadius:9,border:'1px solid rgba(250,189,47,0.35)',background:'rgba(250,189,47,0.12)',color:'#fabd2f',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:'-apple-system,sans-serif'}}>Done</button>
            </div>
          ) : <>
            {step===1&&(
              <div style={{display:'flex',flexDirection:'column',gap:14}}>
                <div style={{fontSize:14,fontWeight:700,color:'#ebdbb2',marginBottom:4}}>Personal Information</div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                  <div>{lbl('Full Name')}<input value={form.name} onChange={e=>u('name',e.target.value)} placeholder="Your full name" style={iS}/></div>
                  <div>{lbl('Date of Birth')}<input value={form.dob} onChange={e=>u('dob',e.target.value)} placeholder="MM/DD/YYYY" style={iS}/></div>
                </div>
                <div>{lbl('Email Address')}<input value={form.email} onChange={e=>u('email',e.target.value)} placeholder="your@email.com" style={iS}/></div>
                <div>{lbl('Phone Number')}<input value={form.phone} onChange={e=>u('phone',e.target.value)} placeholder="+1 (555) 000-0000" style={iS}/></div>
                <div>{lbl('Primary Health Goal')}
                  <select value={form.goal} onChange={e=>u('goal',e.target.value)} style={{...iS,appearance:'none'}}>
                    <option value="">Select your primary goal</option>
                    {['Longevity & Anti-Aging','Peptide Protocol Optimization','Metabolic Health & Weight','Hormonal Balance','Cognitive Performance','Athletic Recovery & Performance','Gut Health & Microbiome','Sleep Optimization','Inflammation Reduction'].map(o=><option key={o}>{o}</option>)}
                  </select>
                </div>
              </div>
            )}
            {step===2&&(
              <div style={{display:'flex',flexDirection:'column',gap:14}}>
                <div style={{fontSize:14,fontWeight:700,color:'#ebdbb2',marginBottom:4}}>Health Background</div>
                <div>{lbl('Current Medications & Supplements')}<textarea value={form.current} onChange={e=>u('current',e.target.value)} rows={3} placeholder="List any current medications, peptides, supplements, or protocols..." style={{...iS,resize:'none'}}/></div>
                <div>{lbl('Recent Lab Work')}<textarea value={form.labs} onChange={e=>u('labs',e.target.value)} rows={3} placeholder="Describe any recent bloodwork, panels, or biomarker data you have available..." style={{...iS,resize:'none'}}/></div>
                <div>{lbl('Specialist Preference')}
                  <select value={form.specialist} onChange={e=>u('specialist',e.target.value)} style={{...iS,appearance:'none'}}>
                    <option value="any">Best match for my goals</option>
                    <option value="lps">Mobile LPS Specialist — In-Home Visit</option>
                    {['Dr. Rachel Monroe — Longevity MD','Nathan J. RD — Nutritionist','Dr. Claire Park — Naturopath ND','Marcus T. — Performance Coach','Dr. Sara Voss — Chiropractor DC','Dr. Amir Khan — Functional MD'].map(o=><option key={o}>{o}</option>)}
                  </select>
                </div>
              </div>
            )}
            {step===3&&(
              <div style={{display:'flex',flexDirection:'column',gap:14}}>
                <div style={{fontSize:14,fontWeight:700,color:'#ebdbb2',marginBottom:4}}>Scheduling & Notes</div>
                <div>{lbl('Preferred Timing')}
                  <select value={form.timing} onChange={e=>u('timing',e.target.value)} style={{...iS,appearance:'none'}}>
                    <option value="asap">As soon as possible</option>
                    <option value="week">Within this week</option>
                    <option value="twoweeks">Within 2 weeks</option>
                    <option value="flexible">Flexible — no rush</option>
                  </select>
                </div>
                <div>{lbl('Visit Type')}
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginTop:2}}>
                    {[['video','Video Consultation'],['async','Async Review'],['mobile','In-Home Mobile Visit'],['platform','Platform Chat Only']].map(([v,l])=>(
                      <div key={v} onClick={()=>u('visitType',v)} style={{padding:'10px 14px',borderRadius:9,cursor:'pointer',transition:'all 0.15s',
                        background:form.visitType===v?'rgba(250,189,47,0.1)':'rgba(255,255,255,0.03)',
                        border:form.visitType===v?'1px solid rgba(250,189,47,0.35)':'1px solid rgba(235,219,178,0.1)'}}>
                        <div style={{fontSize:12,fontWeight:600,color:form.visitType===v?'#fabd2f':'#a89984'}}>{l}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>{lbl('Additional Notes')}<textarea value={form.notes} onChange={e=>u('notes',e.target.value)} rows={3} placeholder="Anything else your specialist should know before your consultation..." style={{...iS,resize:'none'}}/></div>
                {/* Summary */}
                <div style={{padding:'12px 14px',borderRadius:10,background:'rgba(250,189,47,0.06)',border:'1px solid rgba(250,189,47,0.18)'}}>
                  <div style={{fontSize:10,fontWeight:800,color:'rgba(250,189,47,0.7)',letterSpacing:'.1em',textTransform:'uppercase',marginBottom:8}}>Intake Summary</div>
                  {[['Name',form.name||'—'],['Goal',form.goal||'—'],['Specialist',form.specialist==='any'?'Best match':form.specialist],['Timing',form.timing]].map(([l,v])=>(
                    <div key={l} style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                      <span style={{fontSize:11,color:'#7c6f64'}}>{l}</span>
                      <span style={{fontSize:11,color:'#a89984',fontWeight:600,maxWidth:260,textAlign:'right',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>}
        </div>

        {!done&&<div style={{padding:'14px 26px',borderTop:'1px solid rgba(235,219,178,0.1)',display:'flex',justifyContent:'space-between',alignItems:'center',background:'rgba(0,0,0,0.15)'}}>
          <div style={{fontSize:11,color:'#7c6f64'}}>End-to-end encrypted · HIPAA compliant</div>
          <div style={{display:'flex',gap:8}}>
            {step>1&&<button onClick={()=>setStep(s=>s-1)} style={{padding:'8px 18px',borderRadius:9,border:'1px solid rgba(235,219,178,0.1)',background:'rgba(255,255,255,0.03)',color:'#a89984',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'-apple-system,sans-serif'}}>Back</button>}
            <button onClick={()=>step<3?setStep(s=>s+1):setDone(true)} style={{padding:'8px 22px',borderRadius:9,border:'1px solid rgba(250,189,47,0.4)',background:'linear-gradient(135deg,rgba(250,189,47,0.22),rgba(215,153,33,0.12))',color:'#fabd2f',fontSize:12,fontWeight:800,cursor:'pointer',fontFamily:'-apple-system,sans-serif',boxShadow:'0 3px 12px rgba(250,189,47,0.18)'}}>
              {step===3?'Submit Request':'Continue →'}
            </button>
          </div>
        </div>}
      </div>
    </div>
  )
}

// ─── MODAL: Add a Friend ──────────────────────────────────────────────────────
function AddFriendModal({ onClose }) {
  const [sent, setSent] = useState(false)
  const [tab, setTab] = useState('invite')
  const [email, setEmail] = useState('')
  const [emails, setEmails] = useState([])
  const [msg, setMsg] = useState('Join me on CortixHealth — the longevity platform I\'ve been using to track my protocol. It\'s free to join.')
  const iS = { width:'100%', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(235,219,178,0.10)', borderRadius:8, padding:'9px 13px', color:'#ebdbb2', fontSize:13, outline:'none', fontFamily:'-apple-system,sans-serif', boxSizing:'border-box' }

  const addEmail = () => { if(email.includes('@')&&!emails.includes(email)){setEmails(e=>[...e,email]);setEmail('')} }

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.82)',backdropFilter:'blur(16px)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:20,fontFamily:'-apple-system,sans-serif'}} onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div style={{width:'100%',maxWidth:500,background:'linear-gradient(155deg,rgba(62,58,56,0.98),rgba(44,42,40,0.99))',border:'1px solid rgba(235,219,178,0.18)',borderRadius:22,boxShadow:'0 32px 80px rgba(0,0,0,0.85),inset 0 1px 0 rgba(235,219,178,0.1)',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,rgba(235,219,178,0.2),transparent)',pointerEvents:'none'}}/>

        <div style={{padding:'20px 26px',borderBottom:'1px solid rgba(235,219,178,0.1)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div>
            <div style={{fontSize:17,fontWeight:700,color:'#ebdbb2'}}>Add a Friend</div>
            <div style={{fontSize:11,color:'#7c6f64',marginTop:2}}>Invite friends to join CortixHealth — free forever</div>
          </div>
          <button onClick={onClose} style={{width:28,height:28,borderRadius:8,border:'1px solid rgba(235,219,178,0.1)',background:'rgba(255,255,255,0.04)',color:'#a89984',cursor:'pointer',fontSize:16,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'-apple-system,sans-serif'}}>&times;</button>
        </div>

        <div style={{padding:'20px 26px'}}>
          {sent ? (
            <div style={{textAlign:'center',padding:'16px 0'}}>
              <div style={{width:56,height:56,borderRadius:'50%',background:'rgba(184,187,38,0.12)',border:'1px solid rgba(184,187,38,0.35)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px',fontSize:24,color:'#b8bb26'}}>✓</div>
              <div style={{fontSize:17,fontWeight:700,color:'#ebdbb2',marginBottom:8}}>{emails.length} Invite{emails.length!==1?'s':''} Sent</div>
              <div style={{fontSize:13,color:'#a89984',lineHeight:1.7,marginBottom:22}}>Your friends will receive an invitation to join CortixHealth. They'll have full free access to all community channels, challenges, and the lab library.</div>
              <button onClick={onClose} style={{padding:'9px 26px',borderRadius:9,border:'1px solid rgba(250,189,47,0.35)',background:'rgba(250,189,47,0.12)',color:'#fabd2f',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:'-apple-system,sans-serif'}}>Done</button>
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div style={{display:'flex',gap:8,marginBottom:18}}>
                {[['invite','Email Invite'],['link','Share Link'],['social','Share to Social']].map(([id,label])=>(
                  <button key={id} onClick={()=>setTab(id)} style={{padding:'6px 14px',borderRadius:8,border:tab===id?'1px solid rgba(250,189,47,0.35)':'1px solid rgba(235,219,178,0.1)',background:tab===id?'rgba(250,189,47,0.12)':'transparent',color:tab===id?'#fabd2f':'#a89984',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'-apple-system,sans-serif',transition:'all 0.15s'}}>{label}</button>
                ))}
              </div>

              {tab==='invite'&&(
                <div style={{display:'flex',flexDirection:'column',gap:14}}>
                  <div>
                    <div style={{fontSize:10,color:'#a89984',marginBottom:5,fontWeight:700,textTransform:'uppercase',letterSpacing:'.1em'}}>Add Email Addresses</div>
                    <div style={{display:'flex',gap:8}}>
                      <input value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addEmail()} placeholder="friend@email.com" style={{...iS,flex:1}}/>
                      <button onClick={addEmail} style={{padding:'9px 16px',borderRadius:8,border:'1px solid rgba(250,189,47,0.35)',background:'rgba(250,189,47,0.12)',color:'#fabd2f',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'-apple-system,sans-serif',whiteSpace:'nowrap'}}>Add</button>
                    </div>
                    {emails.length>0&&<div style={{display:'flex',flexWrap:'wrap',gap:6,marginTop:8}}>
                      {emails.map(e=>(
                        <span key={e} onClick={()=>setEmails(prev=>prev.filter(x=>x!==e))} style={{fontSize:11,padding:'3px 10px',borderRadius:20,background:'rgba(184,187,38,0.12)',border:'1px solid rgba(184,187,38,0.28)',color:'#b8bb26',cursor:'pointer',fontWeight:600}}>{e} ×</span>
                      ))}
                    </div>}
                  </div>
                  <div>
                    <div style={{fontSize:10,color:'#a89984',marginBottom:5,fontWeight:700,textTransform:'uppercase',letterSpacing:'.1em'}}>Personal Message</div>
                    <textarea value={msg} onChange={e=>setMsg(e.target.value)} rows={3} style={{...iS,resize:'none'}}/>
                  </div>
                  <div style={{padding:'10px 14px',borderRadius:9,background:'rgba(184,187,38,0.07)',border:'1px solid rgba(184,187,38,0.18)'}}>
                    <div style={{fontSize:11,color:'#b8bb26',fontWeight:700,marginBottom:4}}>What your friends get — free:</div>
                    {['All community channels','Lab analysis library','10/30/90-day challenges','Workout programs','Marketplace access'].map(f=>(
                      <div key={f} style={{fontSize:11,color:'#7c6f64',marginBottom:2}}>✓ {f}</div>
                    ))}
                  </div>
                </div>
              )}

              {tab==='link'&&(
                <div style={{display:'flex',flexDirection:'column',gap:12}}>
                  <div style={{padding:'12px 14px',borderRadius:9,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(235,219,178,0.1)',display:'flex',alignItems:'center',gap:10}}>
                    <span style={{flex:1,fontSize:12,color:'#a89984',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>https://cortixhealth.com/join?ref=user_abc123</span>
                    <button onClick={()=>setSent(true)} style={{padding:'5px 12px',borderRadius:6,border:'1px solid rgba(250,189,47,0.35)',background:'rgba(250,189,47,0.12)',color:'#fabd2f',fontSize:11,fontWeight:700,cursor:'pointer',fontFamily:'-apple-system,sans-serif',flexShrink:0}}>Copy</button>
                  </div>
                  <div style={{fontSize:11,color:'#7c6f64',lineHeight:1.6}}>Share this link anywhere. You'll earn credits when friends join and complete their first protocol check-in.</div>
                </div>
              )}

              {tab==='social'&&(
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                  {[['X / Twitter','Share on X'],['Instagram','Share Story'],['Facebook','Share Post'],['WhatsApp','Send via WA'],['LinkedIn','Post Update'],['SMS','Send Text']].map(([platform,label])=>(
                    <button key={platform} onClick={()=>setSent(true)} style={{padding:'11px 14px',borderRadius:9,border:'1px solid rgba(235,219,178,0.1)',background:'rgba(255,255,255,0.03)',color:'#a89984',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'-apple-system,sans-serif',textAlign:'left',transition:'all 0.15s'}}>
                      <div style={{fontSize:10,color:'#7c6f64',marginBottom:3}}>{platform}</div>
                      {label}
                    </button>
                  ))}
                </div>
              )}

              {(tab==='invite'||tab==='link')&&<button onClick={()=>emails.length>0||tab==='link'?setSent(true):null} style={{width:'100%',marginTop:8,padding:'11px',borderRadius:10,border:'1px solid rgba(250,189,47,0.4)',background:'linear-gradient(135deg,rgba(250,189,47,0.22),rgba(215,153,33,0.12))',color:'#fabd2f',fontSize:13,fontWeight:800,cursor:'pointer',fontFamily:'-apple-system,sans-serif',boxShadow:'0 3px 14px rgba(250,189,47,0.18)'}}>
                {tab==='invite'?`Send ${emails.length} Invite${emails.length!==1?'s':''}` : 'Copy Link'}
              </button>}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── MODAL: Join as a Provider ────────────────────────────────────────────────
function JoinProviderModal({ onClose }) {
  const [step, setStep] = useState(1)
  const [done, setDone] = useState(false)
  const [form, setForm] = useState({ name:'', email:'', phone:'', credentials:'', license:'', state:'', specialty:'', experience:'', modality:'', bio:'', region:'', mobile:false })
  const u = (k,v) => setForm(f=>({...f,[k]:v}))
  const iS = { width:'100%', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(235,219,178,0.10)', borderRadius:8, padding:'9px 13px', color:'#ebdbb2', fontSize:13, outline:'none', fontFamily:'-apple-system,sans-serif', boxSizing:'border-box' }
  const lbl = (t) => <div style={{fontSize:10,color:'#a89984',marginBottom:5,fontWeight:700,textTransform:'uppercase',letterSpacing:'.1em'}}>{t}</div>

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.82)',backdropFilter:'blur(16px)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:20,fontFamily:'-apple-system,sans-serif'}} onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div style={{width:'100%',maxWidth:580,background:'linear-gradient(155deg,rgba(62,58,56,0.98),rgba(44,42,40,0.99))',border:'1px solid rgba(131,165,152,0.25)',borderRadius:22,boxShadow:'0 32px 80px rgba(0,0,0,0.85),inset 0 1px 0 rgba(131,165,152,0.12)',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,rgba(131,165,152,0.25),transparent)',pointerEvents:'none'}}/>

        <div style={{padding:'20px 26px',borderBottom:'1px solid rgba(235,219,178,0.1)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div>
            <div style={{fontSize:17,fontWeight:700,color:'#ebdbb2'}}>Join as a Provider</div>
            <div style={{fontSize:11,color:'#7c6f64',marginTop:2}}>CortixHealth Provider Network · NPs, PAs, MDs, Nutritionists, Coaches, Chiropractors</div>
          </div>
          <div style={{display:'flex',gap:6,alignItems:'center'}}>
            {[1,2,3].map(s=>(
              <div key={s} style={{width:24,height:24,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:800,
                background:step>s?'rgba(131,165,152,0.2)':step===s?'rgba(131,165,152,0.18)':'rgba(255,255,255,0.04)',
                border:step>s?'1px solid rgba(131,165,152,0.5)':step===s?'1px solid rgba(131,165,152,0.45)':'1px solid rgba(235,219,178,0.1)',
                color:step>s?'#83a598':step===s?'#83a598':'#7c6f64'}}>{step>s?'✓':s}</div>
            ))}
          </div>
          <button onClick={onClose} style={{width:28,height:28,borderRadius:8,border:'1px solid rgba(235,219,178,0.1)',background:'rgba(255,255,255,0.04)',color:'#a89984',cursor:'pointer',fontSize:16,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'-apple-system,sans-serif'}}>&times;</button>
        </div>

        <div style={{padding:'24px 26px',maxHeight:'60vh',overflowY:'auto'}}>
          {done ? (
            <div style={{textAlign:'center',padding:'16px 0'}}>
              <div style={{width:60,height:60,borderRadius:'50%',background:'rgba(131,165,152,0.12)',border:'1px solid rgba(131,165,152,0.35)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px',fontSize:26,color:'#83a598'}}>✓</div>
              <div style={{fontSize:18,fontWeight:700,color:'#ebdbb2',marginBottom:8}}>Application Submitted</div>
              <div style={{fontSize:13,color:'#a89984',lineHeight:1.7,marginBottom:8}}>Thank you, <strong style={{color:'#ebdbb2'}}>{form.name||'Provider'}</strong>. Our network team will review your credentials and contact you within 2 business days.</div>
              <div style={{fontSize:12,color:'#7c6f64',marginBottom:24}}>Once approved you'll have access to the provider dashboard, patient matching, and the CortixHealth protocol toolkit.</div>
              <button onClick={onClose} style={{padding:'9px 26px',borderRadius:9,border:'1px solid rgba(131,165,152,0.35)',background:'rgba(131,165,152,0.12)',color:'#83a598',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:'-apple-system,sans-serif'}}>Done</button>
            </div>
          ) : <>
            {step===1&&(
              <div style={{display:'flex',flexDirection:'column',gap:14}}>
                <div style={{fontSize:14,fontWeight:700,color:'#ebdbb2',marginBottom:4}}>Your Credentials</div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                  <div>{lbl('Full Name')}<input value={form.name} onChange={e=>u('name',e.target.value)} placeholder="Dr. / NP / PA name" style={iS}/></div>
                  <div>{lbl('Email')}<input value={form.email} onChange={e=>u('email',e.target.value)} placeholder="professional@email.com" style={iS}/></div>
                </div>
                <div>{lbl('Phone')}<input value={form.phone} onChange={e=>u('phone',e.target.value)} placeholder="+1 (555) 000-0000" style={iS}/></div>
                <div>{lbl('Provider Type')}
                  <select value={form.credentials} onChange={e=>u('credentials',e.target.value)} style={{...iS,appearance:'none'}}>
                    <option value="">Select your credential</option>
                    {['MD — Medical Doctor','DO — Doctor of Osteopathy','NP-C — Nurse Practitioner','PA-C — Physician Assistant','RD — Registered Dietitian','ND — Naturopathic Doctor','DC — Doctor of Chiropractic','CPT — Certified Personal Trainer','CSCS — Strength & Conditioning Specialist','PhD — Research / Functional Medicine'].map(o=><option key={o}>{o}</option>)}
                  </select>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                  <div>{lbl('License Number')}<input value={form.license} onChange={e=>u('license',e.target.value)} placeholder="License #" style={iS}/></div>
                  <div>{lbl('Licensed State(s)')}<input value={form.state} onChange={e=>u('state',e.target.value)} placeholder="CA, TX, FL..." style={iS}/></div>
                </div>
              </div>
            )}
            {step===2&&(
              <div style={{display:'flex',flexDirection:'column',gap:14}}>
                <div style={{fontSize:14,fontWeight:700,color:'#ebdbb2',marginBottom:4}}>Clinical Focus</div>
                <div>{lbl('Primary Specialty')}
                  <select value={form.specialty} onChange={e=>u('specialty',e.target.value)} style={{...iS,appearance:'none'}}>
                    <option value="">Select specialty</option>
                    {['Longevity & Anti-Aging','Peptide Protocols','Metabolic & Weight Optimization','Hormonal Health & HRT','Functional Medicine','Sports Performance & Recovery','Gut Health & Microbiome','Cognitive Enhancement','Structural & Chiropractic','Nutritional Therapy'].map(o=><option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>{lbl('Years of Experience')}
                  <select value={form.experience} onChange={e=>u('experience',e.target.value)} style={{...iS,appearance:'none'}}>
                    <option value="">Select range</option>
                    {['1–3 years','3–5 years','5–10 years','10–15 years','15+ years'].map(o=><option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>{lbl('Preferred Consultation Mode')}
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginTop:2}}>
                    {[['video','Video Consultation'],['async','Async Protocol Review'],['mobile','Mobile / In-Home Visits'],['platform','Platform Messaging Only']].map(([v,l])=>(
                      <div key={v} onClick={()=>u('modality',v)} style={{padding:'10px 14px',borderRadius:9,cursor:'pointer',transition:'all 0.15s',
                        background:form.modality===v?'rgba(131,165,152,0.1)':'rgba(255,255,255,0.03)',
                        border:form.modality===v?'1px solid rgba(131,165,152,0.35)':'1px solid rgba(235,219,178,0.1)'}}>
                        <div style={{fontSize:12,fontWeight:600,color:form.modality===v?'#83a598':'#a89984'}}>{l}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div onClick={()=>u('mobile',!form.mobile)} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',borderRadius:9,cursor:'pointer',background:form.mobile?'rgba(250,189,47,0.08)':'rgba(255,255,255,0.02)',border:form.mobile?'1px solid rgba(250,189,47,0.25)':'1px solid rgba(235,219,178,0.1)',transition:'all 0.15s'}}>
                  <div style={{width:18,height:18,borderRadius:5,border:form.mobile?'1px solid rgba(250,189,47,0.5)':'1px solid rgba(235,219,178,0.2)',background:form.mobile?'rgba(250,189,47,0.2)':'transparent',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                    {form.mobile&&<span style={{fontSize:11,color:'#fabd2f',fontWeight:800}}>✓</span>}
                  </div>
                  <div>
                    <div style={{fontSize:12,fontWeight:700,color:'#fabd2f'}}>Join the Mobile LPS Network</div>
                    <div style={{fontSize:11,color:'#7c6f64'}}>Conduct in-home visits in your region. Earn premium per-visit rates.</div>
                  </div>
                </div>
                {form.mobile&&<div>{lbl('Service Region')}<input value={form.region} onChange={e=>u('region',e.target.value)} placeholder="e.g. Los Angeles Metro, San Diego County..." style={iS}/></div>}
              </div>
            )}
            {step===3&&(
              <div style={{display:'flex',flexDirection:'column',gap:14}}>
                <div style={{fontSize:14,fontWeight:700,color:'#ebdbb2',marginBottom:4}}>Professional Profile</div>
                <div>{lbl('Professional Bio')}<textarea value={form.bio} onChange={e=>u('bio',e.target.value)} rows={4} placeholder="Describe your clinical background, areas of expertise, and approach to longevity and performance medicine..." style={{...iS,resize:'none'}}/></div>
                <div style={{padding:'12px 14px',borderRadius:10,background:'rgba(131,165,152,0.07)',border:'1px solid rgba(131,165,152,0.2)'}}>
                  <div style={{fontSize:10,fontWeight:800,color:'#83a598',letterSpacing:'.1em',textTransform:'uppercase',marginBottom:8}}>Provider Benefits</div>
                  {['Access to the full CortixHealth protocol toolkit','Patient matching based on your specialty','Flexible scheduling — set your own hours','Premium per-consultation rates','Protocol Rx issuing through the platform','Mobile visit premium earnings (LPS network)'].map(b=>(
                    <div key={b} style={{display:'flex',gap:7,alignItems:'flex-start',marginBottom:5}}>
                      <span style={{fontSize:10,color:'#83a598',flexShrink:0,marginTop:1}}>✓</span>
                      <span style={{fontSize:11,color:'#7c6f64',lineHeight:1.5}}>{b}</span>
                    </div>
                  ))}
                </div>
                <div style={{display:'flex',alignItems:'flex-start',gap:8}}>
                  <div style={{width:14,height:14,borderRadius:3,border:'1px solid rgba(235,219,178,0.2)',background:'rgba(255,255,255,0.04)',flexShrink:0,marginTop:2}}/>
                  <div style={{fontSize:11,color:'#7c6f64',lineHeight:1.6}}>I confirm that my license and credentials are current and valid. I agree to the CortixHealth Provider Terms of Service and HIPAA Business Associate Agreement.</div>
                </div>
              </div>
            )}
          </>}
        </div>

        {!done&&<div style={{padding:'14px 26px',borderTop:'1px solid rgba(235,219,178,0.1)',display:'flex',justifyContent:'space-between',alignItems:'center',background:'rgba(0,0,0,0.15)'}}>
          <div style={{fontSize:11,color:'#7c6f64'}}>Step {step} of 3 · {['Credentials','Clinical Focus','Profile & Submit'][step-1]}</div>
          <div style={{display:'flex',gap:8}}>
            {step>1&&<button onClick={()=>setStep(s=>s-1)} style={{padding:'8px 18px',borderRadius:9,border:'1px solid rgba(235,219,178,0.1)',background:'rgba(255,255,255,0.03)',color:'#a89984',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'-apple-system,sans-serif'}}>Back</button>}
            <button onClick={()=>step<3?setStep(s=>s+1):setDone(true)} style={{padding:'8px 22px',borderRadius:9,border:'1px solid rgba(131,165,152,0.4)',background:'linear-gradient(135deg,rgba(131,165,152,0.18),rgba(131,165,152,0.08))',color:'#83a598',fontSize:12,fontWeight:800,cursor:'pointer',fontFamily:'-apple-system,sans-serif',boxShadow:'0 3px 12px rgba(131,165,152,0.15)'}}>
              {step===3?'Submit Application':'Continue →'}
            </button>
          </div>
        </div>}
      </div>
    </div>
  )
}

// ─── NOTIFICATION PANEL ────────────────────────────────────────────────────────
function NotifPanel({ onOpenRoom, onClose }) {
  const active = SPECS.filter(s=>s.unread>0||ROOM_MSGS[s.id])
  return (
    <div style={{position:'fixed',top:56,left:85,width:380,background:T.card,border:`1px solid ${T.borderHi}`,borderRadius:'0 0 16px 16px',boxShadow:'0 20px 50px rgba(0,0,0,0.7),inset 0 1px 0 rgba(235,219,178,0.08)',zIndex:120,fontFamily:'-apple-system,sans-serif',overflow:'hidden'}}>
      <div style={{padding:'12px 16px',borderBottom:`1px solid ${T.border}`,display:'flex',alignItems:'center',justifyContent:'space-between',background:'rgba(0,0,0,0.2)'}}>
        <span style={{fontSize:13,fontWeight:700,color:T.text,letterSpacing:'.04em'}}>Specialist Responses</span>
        <span style={{fontSize:10,padding:'2px 8px',borderRadius:8,background:'rgba(251,73,52,0.15)',border:'1px solid rgba(251,73,52,0.3)',color:'#fb4934',fontWeight:800}}>{active.length} NEW</span>
      </div>
      {active.map(s=>(
        <NotifItem key={s.id} spec={s} onClick={()=>{onOpenRoom(s);onClose()}}/>
      ))}
      <div style={{padding:'10px 16px',background:'rgba(0,0,0,0.15)',textAlign:'center'}}>
        <span onClick={onClose} style={{fontSize:12,color:T.textLow,cursor:'pointer',fontWeight:700}}>View All Messages</span>
      </div>
    </div>
  )
}

// ─── MODAL: Lab Kits ──────────────────────────────────────────────────────────
function KitModal({ onClose }) {
  const [ordered, setOrdered] = useState(null)
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.82)',backdropFilter:'blur(16px)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:20}} onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div style={{background:T.card,border:`1px solid ${T.borderHi}`,borderRadius:22,padding:'28px 32px',width:640,maxWidth:'95vw',maxHeight:'88vh',overflowY:'auto',boxShadow:'0 32px 80px rgba(0,0,0,0.85),inset 0 1px 0 rgba(235,219,178,0.1)',position:'relative'}}>
        <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,rgba(235,219,178,0.2),transparent)',borderRadius:'22px 22px 0 0'}}/>
        <button onClick={onClose} style={{position:'absolute',top:14,right:16,width:28,height:28,borderRadius:8,border:`1px solid ${T.border}`,background:'rgba(255,255,255,0.04)',color:T.textMid,cursor:'pointer',fontSize:16,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'-apple-system,sans-serif'}}>&times;</button>
        {ordered ? (
          <div style={{textAlign:'center',padding:'20px 0'}}>
            <div style={{fontSize:42,marginBottom:14}}>✓</div>
            <div style={{fontSize:18,fontWeight:700,color:T.text,marginBottom:8}}>Order Confirmed</div>
            <div style={{fontSize:13,color:T.textMid,lineHeight:1.7,marginBottom:24}}>Your <strong style={{color:T.accent}}>{ordered}</strong> kit is on its way. Results auto-sync to your CortixHealth dashboard and your care team is notified on receipt.</div>
            <GoldBtn label="Back to Dashboard" onClick={onClose}/>
          </div>
        ) : (
          <>
            <div style={{marginBottom:22}}>
              <div style={{fontSize:18,fontWeight:700,color:T.text}}>At-Home Lab Kits</div>
              <div style={{fontSize:13,color:T.textLow,marginTop:3}}>Order from our partner network — results flow directly into your CortixHealth profile and are shared with your care team.</div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {LABS[0].kits.map(k=>(
                <div key={k.name} style={{background:'rgba(80,73,69,0.3)',border:`1px solid ${T.border}`,borderRadius:13,padding:'14px 18px',display:'flex',alignItems:'center',gap:14,boxShadow:'inset 0 1px 0 rgba(235,219,178,0.06)'}}>
                  <div style={{flex:1}}>
                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:5}}>
                      <span style={{fontSize:14,fontWeight:700,color:T.text}}>{k.name}</span>
                      <span style={{fontSize:10,padding:'2px 8px',borderRadius:10,background:'rgba(250,189,47,0.14)',border:'1px solid rgba(250,189,47,0.28)',color:T.accent,fontWeight:700}}>{k.badge}</span>
                    </div>
                    <div style={{display:'flex',gap:16,flexWrap:'wrap'}}>
                      {[['Markers',k.markers],['Turnaround',k.turnaround],['Method',k.method]].map(([l,v])=>(
                        <span key={l} style={{fontSize:12,color:T.textLow}}><span style={{color:T.textMid,fontWeight:600}}>{l}:</span> {v}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{textAlign:'right',flexShrink:0}}>
                    <div style={{fontSize:15,fontWeight:800,color:T.accent,marginBottom:7}}>{k.price}</div>
                    <GoldBtn label="Order" small onClick={()=>setOrdered(k.name)}/>
                  </div>
                </div>
              ))}
            </div>
            <div style={{marginTop:16,padding:'11px 14px',borderRadius:9,background:'rgba(142,192,124,0.08)',border:'1px solid rgba(142,192,124,0.18)',fontSize:12,color:'#8ec07c',lineHeight:1.6}}>
              All results automatically synced · Shared with care team on receipt · HSA/FSA eligible
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ─── MODAL: Challenges ────────────────────────────────────────────────────────
function ChallengeModal({ onClose }) {
  const [joined, setJoined] = useState(null)
  const [inviteSent, setInviteSent] = useState(false)
  const [email, setEmail] = useState('')
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.82)',backdropFilter:'blur(16px)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:20}} onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div style={{background:T.card,border:`1px solid ${T.borderHi}`,borderRadius:22,padding:'28px 32px',width:600,maxWidth:'95vw',maxHeight:'88vh',overflowY:'auto',boxShadow:'0 32px 80px rgba(0,0,0,0.85),inset 0 1px 0 rgba(235,219,178,0.1)',position:'relative'}}>
        <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,rgba(235,219,178,0.2),transparent)',borderRadius:'22px 22px 0 0'}}/>
        <button onClick={onClose} style={{position:'absolute',top:14,right:16,width:28,height:28,borderRadius:8,border:`1px solid ${T.border}`,background:'rgba(255,255,255,0.04)',color:T.textMid,cursor:'pointer',fontSize:16,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'-apple-system,sans-serif'}}>&times;</button>
        {joined ? (
          <div style={{textAlign:'center',padding:'16px 0'}}>
            <div style={{fontSize:42,marginBottom:12}}>✓</div>
            <div style={{fontSize:18,fontWeight:700,color:T.text,marginBottom:6}}>You're in the {joined.label}</div>
            <div style={{fontSize:13,color:T.textMid,lineHeight:1.7,marginBottom:20}}>Day 1 check-in scheduled tomorrow 8am. Your specialist team has been notified.</div>
            <div style={{background:'rgba(250,189,47,0.07)',border:'1px solid rgba(250,189,47,0.18)',borderRadius:12,padding:'14px 18px',marginBottom:20,textAlign:'left'}}>
              <div style={{fontSize:11,fontWeight:700,color:T.accent,marginBottom:8,letterSpacing:'.08em',textTransform:'uppercase'}}>Invite a Friend</div>
              {inviteSent ? <div style={{fontSize:13,color:'#8ec07c'}}>✓ Invite sent successfully.</div> : (
                <div style={{display:'flex',gap:8}}>
                  <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="friend@email.com"
                    style={{flex:1,background:'rgba(255,255,255,0.05)',border:`1px solid ${T.border}`,borderRadius:8,padding:'8px 12px',color:T.text,fontSize:13,outline:'none',fontFamily:'-apple-system,sans-serif'}}/>
                  <GoldBtn label="Send" small onClick={()=>setInviteSent(true)}/>
                </div>
              )}
            </div>
            <GoldBtn label="View Challenge Dashboard" onClick={onClose}/>
          </div>
        ) : (
          <>
            <div style={{marginBottom:22}}>
              <div style={{fontSize:18,fontWeight:700,color:T.text}}>Challenges</div>
              <div style={{fontSize:13,color:T.textLow,marginTop:3}}>Structured programs tracked by your care team. Invite friends — challenges are more effective together.</div>
            </div>
            {CHALLENGES.map(c=>(
              <div key={c.id} style={{background:'rgba(80,73,69,0.3)',border:`1px solid ${T.border}`,borderLeft:`3px solid ${c.color}`,borderRadius:13,padding:'16px 18px',display:'flex',alignItems:'center',gap:14,marginBottom:10,boxShadow:'inset 0 1px 0 rgba(235,219,178,0.05)'}}>
                <div style={{flex:1}}>
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
                    <span style={{fontSize:14,fontWeight:700,color:T.text}}>{c.label}</span>
                    <span style={{fontSize:11,padding:'2px 8px',borderRadius:10,background:`${c.color}18`,border:`1px solid ${c.color}35`,color:c.color,fontWeight:700}}>{c.duration}</span>
                  </div>
                  <div style={{fontSize:13,color:T.textMid,lineHeight:1.6,marginBottom:5}}>{c.desc}</div>
                  <div style={{fontSize:11,color:T.textLow}}>{c.participants.toLocaleString()} participants active</div>
                </div>
                <GoldBtn label="Join" small onClick={()=>setJoined(c)}/>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

// ─── MODAL: Workouts ──────────────────────────────────────────────────────────
function WorkoutModal({ onClose }) {
  const [saved, setSaved] = useState(null)
  const [tab, setTab] = useState('browse')
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.82)',backdropFilter:'blur(16px)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:20}} onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div style={{background:T.card,border:`1px solid ${T.borderHi}`,borderRadius:22,padding:'28px 32px',width:580,maxWidth:'95vw',maxHeight:'88vh',overflowY:'auto',boxShadow:'0 32px 80px rgba(0,0,0,0.85),inset 0 1px 0 rgba(235,219,178,0.1)',position:'relative'}}>
        <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,rgba(235,219,178,0.2),transparent)',borderRadius:'22px 22px 0 0'}}/>
        <button onClick={onClose} style={{position:'absolute',top:14,right:16,width:28,height:28,borderRadius:8,border:`1px solid ${T.border}`,background:'rgba(255,255,255,0.04)',color:T.textMid,cursor:'pointer',fontSize:16,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'-apple-system,sans-serif'}}>&times;</button>
        <div style={{marginBottom:20}}>
          <div style={{fontSize:18,fontWeight:700,color:T.text}}>Workout Programs</div>
          <div style={{fontSize:13,color:T.textLow,marginTop:3}}>Specialist-designed programs aligned to your protocol.</div>
        </div>
        <div style={{display:'flex',gap:8,marginBottom:20}}>
          {['browse','share'].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{padding:'7px 18px',borderRadius:8,border:tab===t?`1px solid rgba(250,189,47,0.35)`:T.border,background:tab===t?'rgba(250,189,47,0.12)':'transparent',color:tab===t?T.accent:T.textMid,fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:'-apple-system,sans-serif',textTransform:'capitalize'}}>{t}</button>
          ))}
        </div>
        {tab==='browse' ? WORKOUTS.map(w=>(
          <div key={w.id} style={{background:'rgba(80,73,69,0.3)',border:`1px solid ${T.border}`,borderRadius:12,padding:'14px 16px',display:'flex',alignItems:'center',gap:12,marginBottom:8,boxShadow:'inset 0 1px 0 rgba(235,219,178,0.05)'}}>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:3}}>{w.name}</div>
              <div style={{fontSize:12,color:T.textLow,marginBottom:6}}>by {w.author} · {w.days} days/week</div>
              <div style={{display:'flex',gap:6}}>
                {w.tags.map(tag=><span key={tag} style={{fontSize:10,padding:'2px 8px',borderRadius:10,background:'rgba(235,219,178,0.07)',border:`1px solid ${T.border}`,color:T.textMid,fontWeight:600}}>{tag}</span>)}
              </div>
            </div>
            <div style={{flexShrink:0,textAlign:'right'}}>
              <div style={{fontSize:12,color:T.textLow,marginBottom:6}}>❤ {w.likes}</div>
              {saved===w.id ? <span style={{fontSize:12,color:'#8ec07c',fontWeight:700}}>✓ Added</span> : <GoldBtn label="Add" small onClick={()=>setSaved(w.id)}/>}
            </div>
          </div>
        )) : (
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            {['Program Name','Days per Week','Focus Area','Peptide Alignment'].map(l=>(
              <div key={l}>
                <div style={{fontSize:10,color:T.textMid,marginBottom:5,fontWeight:700,textTransform:'uppercase',letterSpacing:'.08em'}}>{l}</div>
                <input placeholder={l} style={{width:'100%',background:'rgba(255,255,255,0.04)',border:`1px solid ${T.border}`,borderRadius:8,padding:'9px 13px',color:T.text,fontSize:13,outline:'none',fontFamily:'-apple-system,sans-serif',boxSizing:'border-box'}}/>
              </div>
            ))}
            <GoldBtn label="Share with Community" full onClick={()=>setTab('browse')}/>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function MessageBoardPage() {
  const [ch, setCh]                 = useState('lon')
  const [tr, setTr]                 = useState(0)
  const [railTab, setRailTab]       = useState('msg')
  const [msg, setMsg]               = useState('')
  const [activeModal, setActiveModal] = useState(null)
  const [consultRoom, setConsultRoom] = useState(null)
  const [showNotif, setShowNotif]   = useState(false)
  const [showIntake, setShowIntake] = useState(false)

  const totalUnread = SPECS.reduce((a,s)=>a+s.unread,0)

  // SVG paths for rail icons
  const RAIL_ITEMS = [
    { id:'msg',    badge:13, svg:<><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></> },
    { id:'visits', badge:totalUnread, svg:<><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></> },
    { id:'labs',   badge:4, svg:<><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></> },
    { id:'market', badge:0, svg:<><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></> },
  ]
  const RAIL_BOTTOM = [
    { id:'cal',  badge:0, svg:<><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></> },
    { id:'cfg',  badge:0, svg:<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></> },
  ]

  if(consultRoom) return <ConsultRoom spec={consultRoom} onClose={()=>setConsultRoom(null)}/>

  return (
    <div style={{width:'100vw',height:'100vh',background:T.bg,display:'flex',flexDirection:'column',overflow:'hidden',fontFamily:'-apple-system,sans-serif'}} onClick={()=>showNotif&&setShowNotif(false)}>
      <style>{`
        .sc::-webkit-scrollbar{width:3px} .sc::-webkit-scrollbar-thumb{background:rgba(235,219,178,0.1);border-radius:2px}
        .ch-r:hover{background:rgba(235,219,178,0.05)!important;border-color:rgba(235,219,178,0.1)!important}
        .dm-r:hover{background:rgba(235,219,178,0.04)!important}
        .tr-r:hover{background:rgba(235,219,178,0.03)!important}
        .msg-b:hover{background:rgba(235,219,178,0.025)!important}
        .notif-row:hover{background:rgba(250,189,47,0.06)!important}
        .action-chip:hover{background:rgba(235,219,178,0.07)!important;border-color:rgba(235,219,178,0.18)!important}
        input::placeholder,textarea::placeholder{color:#504945}
        select option{background:#1c1a18;color:#ebdbb2}
        .rxbtn:hover{background:rgba(235,219,178,0.07)!important}
      `}</style>

      <TopBar view="list" setView={()=>{}} onUpload={null} searchQuery="" setSearchQuery={()=>{}}/>

      <div style={{flex:1,display:'flex',overflow:'hidden',minHeight:0}}>

        {/* ── ICON RAIL ── */}
        <div style={{width:85,flexShrink:0,background:T.rail,borderRight:`1px solid ${T.border}`,display:'flex',flexDirection:'column',alignItems:'center',paddingTop:12,paddingBottom:14,gap:8,
          boxShadow:`3px 0 20px rgba(0,0,0,0.5),inset -1px 0 0 rgba(235,219,178,0.05)`,zIndex:10}}>

          {/* Logo */}
          <div style={{width:'78%',aspectRatio:'1/1',borderRadius:14,marginBottom:6,flexShrink:0,overflow:'hidden',
            boxShadow:'0 4px 18px rgba(75,171,19,0.3),inset 0 1px 0 rgba(255,255,255,0.15),inset 0 -1px 0 rgba(0,0,0,0.4)',
            cursor:'pointer'}} title="CortixHealth">
            <img src="/icons/CortixHealth_icon.svg" alt="CortixHealth" style={{width:'100%',height:'100%',display:'block',objectFit:'cover'}}/>
          </div>

          <div style={{width:24,height:1,background:'linear-gradient(90deg,transparent,rgba(235,219,178,0.1),transparent)',marginBottom:2}}/>

          {RAIL_ITEMS.map(item=>(
            <div key={item.id} onClick={e=>{e.stopPropagation();setRailTab(item.id);if(item.id==='visits')setShowNotif(v=>!v);if(item.id==='market')window.location.href='/Market_Place'}} style={{cursor:'pointer',width:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}>
              <RailBtn svg={item.svg} active={railTab===item.id} badge={item.badge}/>
            </div>
          ))}

          <div style={{flex:1}}/>

          {RAIL_BOTTOM.map(item=>(
            <div key={item.id} style={{cursor:'pointer',width:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}>
              <RailBtn svg={item.svg} active={false} badge={item.badge}/>
            </div>
          ))}
        </div>

        {/* ── NOTIFICATION PANEL ── */}
        {showNotif&&<NotifPanel onOpenRoom={s=>{setConsultRoom(s);setShowNotif(false)}} onClose={()=>setShowNotif(false)}/>}

        {/* ── CHANNEL SIDEBAR ── */}
        <div style={{width:335,flexShrink:0,background:T.side,borderRight:`1px solid ${T.border}`,display:'flex',flexDirection:'column',boxShadow:`4px 0 20px rgba(0,0,0,0.45),inset -1px 0 0 rgba(235,219,178,0.04)`}}>
          <div style={{padding:'15px 16px',borderBottom:`1px solid ${T.border}`,background:'rgba(0,0,0,0.2)',display:'flex',alignItems:'center',gap:10,flexShrink:0,cursor:'pointer'}}>
            <div style={{flex:1}}>
              <div style={{fontSize:15,fontWeight:800,color:T.text,letterSpacing:'.08em',textTransform:'uppercase'}}>CortixHealth</div>
              <div style={{fontSize:12,color:T.textLow,marginTop:2}}>Integrated Longevity Platform</div>
            </div>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{color:T.textLow}}><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>

          {/* Quick action chips */}
          <div style={{padding:'10px 12px',borderBottom:`1px solid ${T.border}`,display:'flex',gap:6,flexWrap:'wrap'}}>
            {[
              {label:'Order Kit',     onClick:()=>setActiveModal('kit')},
              {label:'Challenges',    onClick:()=>setActiveModal('challenge')},
              {label:'Workouts',      onClick:()=>setActiveModal('workout')},
            ].map(a=>(
              <button key={a.label} className="action-chip" onClick={a.onClick} style={{fontSize:11,padding:'5px 11px',borderRadius:7,border:`1px solid ${T.border}`,background:'rgba(255,255,255,0.03)',color:T.textMid,cursor:'pointer',fontWeight:700,fontFamily:'-apple-system,sans-serif',transition:'all 0.15s'}}>{a.label}</button>
            ))}
          </div>

          <div className="sc" style={{flex:1,overflowY:'auto',paddingBottom:10}}>

            {/* Free tier banner */}
            <div style={{margin:'10px 10px 4px',padding:'9px 12px',borderRadius:9,background:'linear-gradient(135deg,rgba(184,187,38,0.08),rgba(184,187,38,0.03))',border:'1px solid rgba(184,187,38,0.2)'}}>
              <div style={{fontSize:10,fontWeight:800,color:'#b8bb26',letterSpacing:'.1em',textTransform:'uppercase',marginBottom:3}}>Free Forever</div>
              <div style={{fontSize:11,color:T.textLow,lineHeight:1.5}}>All channels, labs library, challenges, and workouts are free. Upgrade for private specialist access.</div>
            </div>

            <div style={{fontSize:11,fontWeight:700,letterSpacing:'.13em',color:T.textLow,textTransform:'uppercase',padding:'12px 16px 5px'}}>Channels</div>
            {CHS.map(c=>(
              <div key={c.id} className="ch-r" onClick={()=>setCh(c.id)}
                style={{display:'flex',alignItems:'center',gap:8,padding:'8px 12px',margin:'1px 7px',borderRadius:8,cursor:'pointer',transition:'all 0.15s',
                  background:ch===c.id?(c.mobile?'linear-gradient(135deg,rgba(250,189,47,0.16),rgba(250,189,47,0.08))':'linear-gradient(135deg,rgba(250,189,47,0.14),rgba(250,189,47,0.07))'):'transparent',
                  border:ch===c.id?`1px solid rgba(250,189,47,0.25)`:'1px solid transparent',
                  boxShadow:ch===c.id&&c.mobile?'0 2px 12px rgba(250,189,47,0.1)':'none'}}>
                <span style={{fontSize:16,color:ch===c.id?'rgba(250,189,47,0.75)':'rgba(235,219,178,0.22)',lineHeight:1,fontWeight:300}}>#</span>
                <span style={{fontSize:14,color:ch===c.id?T.text:T.textMid,fontWeight:ch===c.id?600:400,flex:1,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{c.name}</span>
                {c.mobile&&<span style={{fontSize:9,padding:'2px 6px',borderRadius:5,background:'rgba(250,189,47,0.18)',border:'1px solid rgba(250,189,47,0.32)',color:T.accent,fontWeight:800,flexShrink:0}}>NEW</span>}
                {c.b>0&&!c.mobile&&<span style={{fontSize:11,fontWeight:800,padding:'2px 7px',borderRadius:10,background:ch===c.id?`${c.bc}28`:`${c.bc}18`,color:c.bc,border:`1px solid ${c.bc}30`,minWidth:20,textAlign:'center'}}>{c.b}</span>}
                {c.mobile&&c.b>0&&<span style={{fontSize:11,fontWeight:800,padding:'2px 7px',borderRadius:10,background:'rgba(250,189,47,0.2)',color:T.accent,border:'1px solid rgba(250,189,47,0.35)',minWidth:20,textAlign:'center'}}>{c.b}</span>}
              </div>
            ))}

            <div style={{fontSize:11,fontWeight:700,letterSpacing:'.13em',color:T.textLow,textTransform:'uppercase',padding:'12px 16px 5px',marginTop:4,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <span>Lab Analysis</span>
              <span style={{fontSize:10,padding:'2px 8px',borderRadius:10,background:'rgba(142,192,124,0.15)',border:'1px solid rgba(142,192,124,0.28)',color:'#8ec07c',fontWeight:800}}>7</span>
            </div>
            {LABS.map(l=>(
              <div key={l.id} className="ch-r" onClick={()=>{setCh(l.id);if(l.id==='lab-atHome')setActiveModal('kit')}}
                style={{display:'flex',alignItems:'center',gap:8,padding:'8px 12px',margin:'1px 7px',borderRadius:8,cursor:'pointer',transition:'all 0.15s',
                  background:ch===l.id?'linear-gradient(135deg,rgba(142,192,124,0.1),rgba(142,192,124,0.04))':'transparent',
                  border:ch===l.id?'1px solid rgba(142,192,124,0.22)':'1px solid transparent'}}>
                <span style={{fontSize:13,color:'rgba(235,219,178,0.4)',lineHeight:1,flexShrink:0}}>{l.icon}</span>
                <span style={{fontSize:16,color:ch===l.id?'rgba(142,192,124,0.5)':'rgba(235,219,178,0.18)',lineHeight:1,fontWeight:300,flexShrink:0}}>#</span>
                <span style={{fontSize:14,color:ch===l.id?T.text:T.textMid,fontWeight:ch===l.id?600:400,flex:1,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{l.name}</span>
                {l.id==='lab-atHome'&&<span style={{fontSize:9,padding:'2px 6px',borderRadius:5,background:'rgba(142,192,124,0.18)',border:'1px solid rgba(142,192,124,0.3)',color:'#8ec07c',fontWeight:800,flexShrink:0}}>HOT</span>}
                {l.b>0&&l.id!=='lab-atHome'&&<span style={{fontSize:11,fontWeight:800,padding:'2px 7px',borderRadius:10,background:l.bc?`${l.bc}18`:'rgba(235,219,178,0.08)',color:l.bc||T.textMid,border:`1px solid ${l.bc?l.bc+'30':'rgba(235,219,178,0.1)'}`,minWidth:20,textAlign:'center'}}>{l.b}</span>}
              </div>
            ))}

            <div style={{fontSize:11,fontWeight:700,letterSpacing:'.13em',color:T.textLow,textTransform:'uppercase',padding:'12px 16px 5px',marginTop:4,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <span>Direct Messages</span>
              <span onClick={()=>setShowIntake(true)} style={{fontSize:11,padding:'3px 8px',borderRadius:5,border:`1px solid ${T.border}`,color:T.textMid,cursor:'pointer',fontWeight:700,background:'rgba(255,255,255,0.04)'}}>New</span>
            </div>

            {/* Mobile LPS specialists — shown first with gold treatment */}
            <div style={{fontSize:10,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',color:'rgba(250,189,47,0.6)',padding:'6px 14px 3px',display:'flex',alignItems:'center',gap:6}}>
              <div style={{width:6,height:6,borderRadius:'50%',background:'#b8bb26'}}/>
              Mobile Specialists · In Your Area
            </div>
            {LPS_NETWORK.map(s=>(
              <div key={s.id} className="dm-r" onClick={()=>setShowIntake(true)} style={{display:'flex',alignItems:'center',gap:10,padding:'7px 12px',margin:'1px 7px',borderRadius:8,cursor:'pointer',transition:'background 0.15s'}}>
                <div style={{position:'relative',flexShrink:0}}>
                  <div style={{width:32,height:32,borderRadius:'50%',background:'linear-gradient(145deg,#8a7010,#504008)',border:'1.5px solid rgba(250,189,47,0.4)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:800,color:'rgba(235,219,178,0.9)'}}>{s.ini}</div>
                  <div style={{position:'absolute',bottom:0,right:0,width:8,height:8,borderRadius:'50%',background:SC[s.st],border:'2px solid #32302f'}}/>
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:12,color:T.textMid,fontWeight:600,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{s.name}</div>
                  <div style={{fontSize:10,color:'rgba(250,189,47,0.6)',marginTop:1,fontWeight:600}}>{s.responseTime}</div>
                </div>
              </div>
            ))}

            {/* Remote specialists */}
            <div style={{fontSize:10,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',color:T.textLow,padding:'8px 14px 3px'}}>Remote Specialists</div>
            {SPECS.map(s=>(
              <div key={s.id} className="dm-r" onClick={()=>setConsultRoom(s)} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 12px',margin:'1px 7px',borderRadius:8,cursor:'pointer',transition:'background 0.15s',position:'relative'}}>
                <div style={{position:'relative',flexShrink:0}}>
                  <Av id={s.id} sz={32}/>
                  <div style={{position:'absolute',bottom:1,right:1,width:8,height:8,borderRadius:'50%',background:SC[s.st],border:'2px solid #32302f'}}/>
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:12,color:T.textMid,fontWeight:500,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{s.name}</div>
                  <div style={{fontSize:10,color:T.textLow,marginTop:1}}>{s.role}</div>
                </div>
                {s.unread>0&&<div style={{width:17,height:17,borderRadius:9,background:'#fb4934',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:800,color:'#fff',flexShrink:0,boxShadow:'0 0 6px rgba(251,73,52,0.5)'}}>{s.unread}</div>}
              </div>
            ))}
          </div>

          {/* Left sidebar bottom — Add a Friend */}
          <div style={{padding:'14px',borderTop:`1px solid ${T.border}`,background:'rgba(0,0,0,0.15)',flexShrink:0}}>
            <button onClick={()=>setActiveModal('addFriend')} style={{width:'100%',padding:'12px 16px',borderRadius:12,cursor:'pointer',
              border:`1px solid ${T.border}`,
              background:'linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))',
              color:T.textMid,fontSize:13,fontWeight:700,letterSpacing:'.06em',
              fontFamily:'-apple-system,sans-serif',
              boxShadow:'inset 0 1px 0 rgba(235,219,178,0.06),inset 0 -1px 0 rgba(0,0,0,0.25)',
              display:'flex',alignItems:'center',justifyContent:'center',gap:8,transition:'all 0.2s',
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
              Add a Friend
            </button>
          </div>
        </div>

        {/* ── CENTER ── */}
        <div style={{flex:1,display:'flex',flexDirection:'column',background:T.mid,borderRight:`1px solid ${T.border}`,minWidth:0}}>

          {/* Channel header */}
          <div style={{padding:'13px 22px',borderBottom:`1px solid ${T.border}`,display:'flex',alignItems:'center',gap:12,background:'rgba(0,0,0,0.25)',flexShrink:0,
            boxShadow:'0 2px 16px rgba(0,0,0,0.35),inset 0 -1px 0 rgba(235,219,178,0.04)'}}>
            <div style={{width:40,height:40,borderRadius:10,background:'linear-gradient(145deg,rgba(251,73,52,0.18),rgba(251,73,52,0.08))',border:'1px solid rgba(251,73,52,0.28)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,fontWeight:300,color:'rgba(251,73,52,0.85)',flexShrink:0,boxShadow:'inset 0 1px 0 rgba(255,255,255,0.06)'}}>
              #
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:16,fontWeight:600,color:T.text}}>{[...CHS,...LABS].find(c=>c.id===ch)?.name||ch}</div>
              <div style={{fontSize:11,color:T.textLow,marginTop:2}}>6 specialists · 3 active consultations · Peptide Protocol support</div>
            </div>

            {/* ★ HEADER CTAs — Request Consultation + Start Virtual Visit */}
            <div style={{display:'flex',gap:7,alignItems:'center'}}>
              <button onClick={()=>setActiveModal('requestConsult')} style={{padding:'8px 16px',borderRadius:9,cursor:'pointer',
                border:`1px solid ${T.border}`,
                background:'rgba(255,255,255,0.04)',
                color:T.textMid,fontSize:12,fontWeight:700,letterSpacing:'.05em',
                fontFamily:'-apple-system,sans-serif',
                display:'flex',alignItems:'center',gap:6,transition:'all 0.15s',
                boxShadow:'inset 0 1px 0 rgba(255,255,255,0.05)',
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
                Request Consultation
              </button>

              <button onClick={()=>setShowIntake(true)} style={{padding:'8px 18px',borderRadius:9,cursor:'pointer',
                border:'1px solid rgba(250,189,47,0.45)',
                background:'linear-gradient(135deg,rgba(250,189,47,0.22),rgba(215,153,33,0.12))',
                color:T.accent,fontSize:12,fontWeight:800,letterSpacing:'.06em',
                fontFamily:'-apple-system,sans-serif',
                boxShadow:'0 3px 14px rgba(250,189,47,0.2),inset 0 1px 0 rgba(250,189,47,0.22)',
                display:'flex',alignItems:'center',gap:6,transition:'all 0.15s',
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fabd2f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.61a19.79 19.79 0 01-3.07-8.63A2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14z"/></svg>
                Start Virtual Visit
              </button>

              <button onClick={()=>setActiveModal('kit')} style={{padding:'8px 14px',borderRadius:9,border:`1px solid ${T.border}`,background:'rgba(255,255,255,0.04)',color:T.textLow,cursor:'pointer',fontWeight:700,fontSize:12,fontFamily:'-apple-system,sans-serif',display:'flex',alignItems:'center',gap:5}}>
                Order Lab Kit
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="sc" style={{flex:1,overflowY:'auto',padding:'20px 24px 16px'}}>
            <div style={{background:'linear-gradient(145deg,rgba(92,84,52,0.38),rgba(68,62,36,0.30))',backdropFilter:'blur(16px)',WebkitBackdropFilter:'blur(16px)',border:'1px solid rgba(250,189,47,0.24)',borderRadius:14,padding:'12px 16px',marginBottom:22,display:'flex',gap:12,alignItems:'flex-start',boxShadow:'0 4px 20px rgba(0,0,0,0.3),inset 0 1px 0 rgba(250,189,47,0.1)',position:'relative',overflow:'hidden'}}>
              <div style={{position:'absolute',top:0,left:20,right:20,height:1,background:'linear-gradient(90deg,transparent,rgba(250,189,47,0.22),transparent)',pointerEvents:'none'}}/>
              <div style={{flex:1}}>
                <div style={{fontSize:10,fontWeight:800,letterSpacing:'.12em',color:'rgba(250,189,47,0.78)',textTransform:'uppercase',marginBottom:5}}>Pinned</div>
                <span style={{fontSize:13,color:T.textMid,lineHeight:1.65}}>Complete your Meto Engine assessment before your first consultation. Your protocol data and ORI score will be shared securely with your assigned clinician.</span>
              </div>
              <span style={{fontSize:16,color:T.textLow,cursor:'pointer',flexShrink:0,marginTop:-2}}>&times;</span>
            </div>

            {MSGS.map(m=>{
              const sp=SPECS.find(x=>x.id===m.s)
              if(!sp) return null
              return (
                <div key={m.id} className="msg-b" style={{display:'flex',gap:14,marginBottom:16,padding:'8px 10px',borderRadius:12,transition:'background 0.15s',alignItems:'flex-start'}}>
                  <div style={{flexShrink:0,paddingTop:3}}><Av id={m.s} sz={44}/></div>
                  <div style={{minWidth:0,maxWidth:'82%'}}>
                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:7,flexWrap:'wrap'}}>
                      <span style={{fontSize:15,fontWeight:700,color:T.text}}>{sp.name}</span>
                      <span style={{fontSize:11,color:T.textLow}}>{m.t}</span>
                      {m.urgent&&<span style={{fontSize:10,padding:'2px 8px',borderRadius:4,fontWeight:700,background:'rgba(251,73,52,0.16)',border:'1px solid rgba(251,73,52,0.32)',color:'#fb4934',letterSpacing:'.06em'}}>URGENT</span>}
                      <span style={{fontSize:10,padding:'3px 10px',borderRadius:5,fontWeight:700,background:`${sp.c}14`,border:`1px solid ${sp.c}28`,color:sp.c}}>{sp.role}</span>
                      {m.urgent&&<div style={{width:20,height:20,borderRadius:'50%',background:'rgba(251,73,52,0.18)',border:'1px solid rgba(251,73,52,0.45)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,boxShadow:'0 0 10px rgba(251,73,52,0.3)'}}><div style={{width:7,height:7,borderRadius:'50%',background:'#fb4934'}}/></div>}
                    </div>
                    <div style={{display:'inline-block',
                      background:m.hi?'linear-gradient(145deg,rgba(250,189,47,0.14),rgba(215,153,33,0.07))':'linear-gradient(145deg,rgba(92,84,76,0.48),rgba(68,62,56,0.38))',
                      backdropFilter:'blur(20px) saturate(140%)',WebkitBackdropFilter:'blur(20px) saturate(140%)',
                      border:m.hi?'1px solid rgba(250,189,47,0.30)':'1px solid rgba(235,219,178,0.14)',
                      borderRadius:'4px 16px 16px 16px',padding:'12px 18px',fontSize:14,
                      color:m.hi?T.text:'rgba(189,174,147,0.94)',lineHeight:1.7,
                      boxShadow:m.hi?'0 6px 24px rgba(0,0,0,0.35),inset 0 1px 0 rgba(250,189,47,0.1)':'0 6px 24px rgba(0,0,0,0.28),inset 0 1px 0 rgba(235,219,178,0.09)',
                      maxWidth:'100%',wordBreak:'break-word',position:'relative'}}>
                      <div style={{position:'absolute',top:0,left:14,right:14,height:1,background:m.hi?'linear-gradient(90deg,transparent,rgba(250,189,47,0.28),transparent)':'linear-gradient(90deg,transparent,rgba(235,219,178,0.14),transparent)',borderRadius:1,pointerEvents:'none'}}/>
                      {m.txt.includes('@patient')?<>{m.txt.split('@patient')[0]}<span style={{color:T.accent,fontWeight:700,background:'rgba(250,189,47,0.12)',padding:'0 4px',borderRadius:3}}>@patient</span>{m.txt.split('@patient')[1]}</>:m.txt}
                    </div>
                    {/* Open room button on urgent messages */}
                    {m.urgent&&<div style={{marginTop:8}}>
                      <button onClick={()=>setConsultRoom(sp)} style={{fontSize:11,padding:'5px 12px',borderRadius:7,border:'1px solid rgba(250,189,47,0.32)',background:'rgba(250,189,47,0.1)',color:T.accent,cursor:'pointer',fontWeight:700,fontFamily:'-apple-system,sans-serif'}}>Open Consultation Room →</button>
                    </div>}
                    {m.rx&&m.rx.length>0&&(
                      <div style={{display:'flex',gap:5,marginTop:7,flexWrap:'wrap'}}>
                        {m.rx.map((r,i)=>(
                          <button key={i} className="rxbtn" style={{display:'inline-flex',alignItems:'center',gap:5,padding:'4px 12px',borderRadius:20,border:`1px solid rgba(235,219,178,0.15)`,background:'linear-gradient(145deg,rgba(80,73,69,0.55),rgba(60,56,54,0.45))',backdropFilter:'blur(8px)',cursor:'pointer',fontSize:13,color:T.textMid,fontFamily:'-apple-system,sans-serif',transition:'all 0.15s',boxShadow:'0 2px 8px rgba(0,0,0,0.25),inset 0 1px 0 rgba(235,219,178,0.08)'}}>
                            <span>{r.e}</span><span style={{fontSize:12,fontWeight:700}}>{r.n}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Floating Pill Input */}
          <div style={{padding:'0 22px 18px',flexShrink:0}}>
            <div style={{borderRadius:16,background:'linear-gradient(160deg,#3c3836 0%,#32302f 100%)',border:`1px solid rgba(235,219,178,0.20)`,boxShadow:'0 8px 28px rgba(0,0,0,0.45),inset 0 1px 0 rgba(235,219,178,0.12)',overflow:'hidden'}}>
              <div style={{padding:'12px 16px 10px',borderBottom:`1px solid rgba(235,219,178,0.08)`}}>
                <input value={msg} onChange={e=>setMsg(e.target.value)} placeholder={`Message #${[...CHS,...LABS].find(c=>c.id===ch)?.name||ch}...`}
                  style={{width:'100%',background:'none',border:'none',outline:'none',color:T.text,fontSize:14,fontFamily:'-apple-system,sans-serif'}}/>
              </div>
              <div style={{padding:'8px 14px 9px',display:'flex',alignItems:'center',gap:4}}>
                {[{l:'B',fw:800,fs:'normal',td:'none'},{l:'I',fw:400,fs:'italic',td:'none'},{l:'S',fw:600,fs:'normal',td:'line-through'}].map(f=>(
                  <button key={f.l} style={{fontSize:12,width:26,height:26,borderRadius:5,border:`1px solid rgba(235,219,178,0.11)`,background:'rgba(235,219,178,0.05)',color:T.textLow,cursor:'pointer',fontWeight:f.fw,fontStyle:f.fs,textDecoration:f.td,fontFamily:'-apple-system,sans-serif',flexShrink:0}}>{f.l}</button>
                ))}
                <div style={{width:1,height:14,background:'rgba(235,219,178,0.1)',margin:'0 4px'}}/>
                {['Protocol','Lab Results','Schedule'].map(a=>(
                  <button key={a} onClick={a==='Lab Results'?()=>setActiveModal('kit'):a==='Schedule'?()=>setShowIntake(true):undefined} style={{fontSize:11,padding:'4px 9px',borderRadius:5,border:`1px solid rgba(235,219,178,0.11)`,background:'rgba(235,219,178,0.05)',color:T.textMid,cursor:'pointer',fontWeight:700,fontFamily:'-apple-system,sans-serif',flexShrink:0,whiteSpace:'nowrap'}}>{a}</button>
                ))}
                <span style={{fontSize:11,color:T.textLow,marginLeft:5}}>Aa</span>
                <button onClick={()=>setMsg('')} style={{marginLeft:'auto',height:30,width:30,borderRadius:8,border:'1px solid rgba(250,189,47,0.42)',background:'linear-gradient(145deg,rgba(250,189,47,0.28),rgba(215,153,33,0.18))',color:T.accent,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 3px 10px rgba(250,189,47,0.2)',fontSize:13}}>▶</button>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT THREADS ── */}
        <div style={{width:300,flexShrink:0,background:T.side,display:'flex',flexDirection:'column',boxShadow:`-3px 0 18px rgba(0,0,0,0.4),inset 1px 0 0 rgba(235,219,178,0.04)`}}>
          <div style={{padding:'14px 16px',borderBottom:`1px solid ${T.border}`,display:'flex',alignItems:'center',justifyContent:'space-between',background:'rgba(0,0,0,0.2)',flexShrink:0}}>
            <span style={{fontSize:14,fontWeight:700,color:T.textMid,letterSpacing:'.05em',textTransform:'uppercase'}}>Specialists</span>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <span style={{fontSize:11,padding:'3px 9px',borderRadius:9,background:'rgba(250,189,47,0.15)',border:'1px solid rgba(250,189,47,0.30)',color:T.accent,fontWeight:800}}>{SPECS.filter(s=>s.st==='online').length} online</span>
              <span style={{fontSize:15,color:T.textLow,cursor:'pointer'}}>&times;</span>
            </div>
          </div>

          <div className="sc" style={{flex:1,overflowY:'auto'}}>
            {SPECS.map((sp,i)=>(
              <div key={sp.id} className="tr-r" onClick={()=>{setTr(i);setConsultRoom(sp)}}
                style={{display:'flex',gap:11,padding:'13px 14px',borderBottom:`1px solid ${T.border}`,cursor:'pointer',transition:'all 0.15s',
                  borderLeft:tr===i?'3px solid rgba(250,189,47,0.55)':'3px solid transparent',
                  background:tr===i?'linear-gradient(135deg,rgba(250,189,47,0.08),rgba(250,189,47,0.03))':'transparent'}}>
                <div style={{position:'relative',flexShrink:0}}>
                  <Av id={sp.id} sz={38}/>
                  <div style={{position:'absolute',bottom:0,right:0,width:10,height:10,borderRadius:'50%',background:SC[sp.st],border:'2px solid #32302f'}}/>
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:3}}>
                    <span style={{fontSize:12,fontWeight:700,color:T.textMid}}>{sp.name}</span>
                    {sp.unread>0&&<span style={{fontSize:10,padding:'1px 6px',borderRadius:7,background:'rgba(251,73,52,0.15)',border:'1px solid rgba(251,73,52,0.28)',color:'#fb4934',fontWeight:800,flexShrink:0}}>{sp.unread}</span>}
                  </div>
                  <div style={{fontSize:11,color:sp.c,fontWeight:600,marginBottom:3}}>{sp.role}</div>
                  <div style={{fontSize:11,color:'rgba(168,153,132,0.65)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{sp.response}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{padding:'12px 14px 16px',borderTop:`1px solid ${T.border}`,background:'rgba(0,0,0,0.2)',flexShrink:0}}>
            <button onClick={()=>setActiveModal('joinProvider')} style={{width:'100%',padding:'11px',borderRadius:9,cursor:'pointer',
              border:'1px solid rgba(131,165,152,0.32)',
              background:'linear-gradient(135deg,rgba(131,165,152,0.12),rgba(131,165,152,0.05))',
              color:'#83a598',fontSize:12,fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',
              fontFamily:'-apple-system,sans-serif',
              boxShadow:'0 3px 14px rgba(131,165,152,0.1),inset 0 1px 0 rgba(131,165,152,0.14)',
              transition:'all 0.2s',display:'flex',alignItems:'center',justifyContent:'center',gap:6,
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#83a598" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              Join as a Provider
            </button>
          </div>
        </div>
      </div>

      {/* ── OVERLAYS ── */}
      {showIntake  && <VirtualVisitIntake onClose={()=>setShowIntake(false)} onOpenRoom={s=>{setConsultRoom(s);setShowIntake(false)}}/>}
      {activeModal==='kit'            && <KitModal           onClose={()=>setActiveModal(null)}/>}
      {activeModal==='challenge'      && <ChallengeModal     onClose={()=>setActiveModal(null)}/>}
      {activeModal==='workout'        && <WorkoutModal       onClose={()=>setActiveModal(null)}/>}
      {activeModal==='requestConsult' && <RequestConsultModal onClose={()=>setActiveModal(null)}/>}
      {activeModal==='addFriend'      && <AddFriendModal      onClose={()=>setActiveModal(null)}/>}
      {activeModal==='joinProvider'   && <JoinProviderModal   onClose={()=>setActiveModal(null)}/>}
    </div>
  )
}
