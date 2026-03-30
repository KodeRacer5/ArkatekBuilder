'use client'
import { useState } from 'react'
import TopBar from '@/app/_components/ui/dashboard/top-bar'

const SPECS = [
  { id:1, ini:'RM', name:'Dr. Rachel Monroe', role:'Longevity MD',      c:'#fb4934', bg:'linear-gradient(145deg,#c0392b,#7a1a14)', st:'online', reply:'Adherence strong at 88% — hold dose through week 6', specialty:'Peptide protocols, metabolic optimization, HRT' },
  { id:2, ini:'NJ', name:'Nathan J. RD',      role:'Nutritionist',      c:'#8ec07c', bg:'linear-gradient(145deg,#4a7a2e,#2d5218)', st:'online', reply:'Copper bisglycinate 2mg supports GHK-Cu synthesis', specialty:'Micronutrient therapy, longevity nutrition, GLP-1 support' },
  { id:3, ini:'CP', name:'Dr. Claire Park',   role:'Naturopath ND',     c:'#83a598', bg:'linear-gradient(145deg,#2e7d6e,#1a4e44)', st:'away',   reply:'Semax cycling 5/2 prevents receptor downregulation', specialty:'Adaptogenic protocols, sleep optimization, stress biomarkers' },
  { id:4, ini:'MT', name:'Marcus T.',          role:'Performance Coach', c:'#b8bb26', bg:'linear-gradient(145deg,#5a7a1a,#384e10)', st:'busy',   reply:'Training split aligned to TB-500 injection days', specialty:'Strength programming, recovery optimization, VO2 max' },
  { id:5, ini:'SV', name:'Dr. Sara Voss',      role:'Chiropractor DC',   c:'#fabd2f', bg:'linear-gradient(145deg,#a07a1a,#604808)', st:'online', reply:'L4-L5 mobility significantly improved — week 4', specialty:'Structural alignment, soft tissue recovery, fascial health' },
  { id:6, ini:'AK', name:'Dr. Amir Khan',      role:'Functional MD',     c:'#d3869b', bg:'linear-gradient(145deg,#8a3a5a,#5a2038)', st:'online', reply:'ORI score trending down — metabolic panel looks better', specialty:'Functional medicine, gut-brain axis, cellular aging' },
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
  { id:'lab-atHome',   name:'at-home-kits',         b:4, bc:'#8ec07c', icon:'📦', tip:'SiPhox, Geviti, Superpower — mail-in or mobile draw',
    kits:[
      { name:'SiPhox Health', price:'$149/kit', turnaround:'7–10 days', markers:'60 biomarkers', method:'At-home finger prick', badge:'Most Popular' },
      { name:'Superpower',    price:'$349/yr',  turnaround:'5–7 days',  markers:'100+ biomarkers',method:'Quest partner lab draw', badge:'Most Comprehensive' },
      { name:'Geviti',        price:'$99/mo',   turnaround:'3–5 days',  markers:'80 biomarkers', method:'Mobile phlebotomist', badge:'Most Convenient' },
      { name:'Biostarks',     price:'$199/kit', turnaround:'10 days',   markers:'39 biomarkers', method:'Dry blood spot mail-in', badge:'Best for NAD+' },
      { name:'Labcorp OnDemand', price:'$89',   turnaround:'2–3 days',  markers:'25 biomarkers', method:'Local Labcorp walk-in', badge:'Fastest Results' },
    ]
  },
  { id:'lab-blood',    name:'blood-panels',        b:2, bc:'#fb4934', icon:'🩸', tip:'Metabolic, hormones, CBC, lipids' },
  { id:'lab-hormone',  name:'hormone-testing',      b:0, bc:null,      icon:'⚗️', tip:'Testosterone, estrogen, thyroid, cortisol' },
  { id:'lab-genetic',  name:'genetic-panels',       b:1, bc:'#d3869b', icon:'🧬', tip:'DNA methylation, APOE, longevity SNPs' },
  { id:'lab-gut',      name:'gut-microbiome',       b:0, bc:null,      icon:'🔬', tip:'Gut Zoomer, microbiome diversity' },
  { id:'lab-inflam',   name:'inflammation-markers', b:3, bc:'#fabd2f', icon:'📊', tip:'CRP, IL-6, homocysteine, Lp(a)' },
  { id:'lab-imaging',  name:'advanced-imaging',     b:0, bc:null,      icon:'🏥', tip:'DEXA, full-body MRI, CT calcium score' },
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
  { id:'c10', label:'10-Day Reset', duration:'10 Days', desc:'Sleep, hydration, and inflammation baseline reset. Tracked daily with specialist check-ins.', participants:247, color:'#8ec07c', icon:'⚡' },
  { id:'c30', label:'30-Day Protocol', duration:'30 Days', desc:'Full longevity stack with bloodwork before/after. Peptide, nutrition, and training aligned.', participants:891, color:'#fabd2f', icon:'🏆' },
  { id:'c90', label:'90-Day Transform', duration:'90 Days', desc:'Comprehensive biometric overhaul. Lab panels at day 0, 45, and 90. Coach-guided weekly.', participants:312, color:'#fb4934', icon:'🔥' },
]

const WORKOUTS = [
  { id:'w1', name:'TB-500 Recovery Split', author:'Marcus T.', days:4, likes:142, tags:['Peptide-Aligned','Hypertrophy'] },
  { id:'w2', name:'Longevity Cardio Stack', author:'Dr. Rachel Monroe', days:5, likes:89, tags:['VO2 Max','Zone 2'] },
  { id:'w3', name:'Anti-Inflammatory Movement', author:'Dr. Sara Voss', days:3, likes:203, tags:['Mobility','Recovery'] },
]

const SC = { online:'#b8bb26', away:'#fabd2f', busy:'#fb4934' }

const T = {
  bg:'#282828', rail:'linear-gradient(180deg,#3c3836 0%,#32302f 100%)',
  side:'linear-gradient(160deg,#32302f 0%,#2e2c2a 100%)',
  mid:'linear-gradient(160deg,#2a2826 0%,#262422 100%)',
  card:'linear-gradient(155deg,rgba(60,56,54,0.98) 0%,rgba(44,42,40,0.99) 100%)',
  border:'rgba(235,219,178,0.10)', borderHi:'rgba(235,219,178,0.18)',
  text:'#ebdbb2', textMid:'#a89984', textLow:'#7c6f64',
  accent:'#fabd2f', accentDim:'rgba(250,189,47,0.14)',
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

function RailBtn({ icon, active, badge }) {
  return (
    <div style={{position:'relative',display:'flex',alignItems:'center',justifyContent:'center',
      width:'78%',aspectRatio:'1/1',borderRadius:16,cursor:'pointer',
      background:active?'linear-gradient(145deg,rgba(250,189,47,0.25),rgba(250,189,47,0.12))':'linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))',
      border:active?'1px solid rgba(250,189,47,0.38)':'1px solid rgba(235,219,178,0.09)',
      boxShadow:active?'0 6px 18px rgba(250,189,47,0.2),inset 0 1px 0 rgba(250,189,47,0.28),inset 0 -1px 0 rgba(0,0,0,0.38)':'0 3px 10px rgba(0,0,0,0.55),inset 0 1px 0 rgba(255,255,255,0.08),inset 0 -1px 0 rgba(0,0,0,0.42)',
      transition:'all 0.15s',
    }}>
      <span style={{fontSize:'clamp(20px,2.2vw,32px)',lineHeight:1,filter:active?'none':'brightness(0.6)'}}>{icon}</span>
      {badge>0&&<div style={{position:'absolute',top:-4,right:-4,minWidth:20,height:20,borderRadius:10,background:'#fb4934',border:'2px solid #282828',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:800,color:'#fff',padding:'0 4px',boxShadow:'0 2px 8px rgba(251,73,52,0.55)'}}>{badge}</div>}
    </div>
  )
}

// ── Shared glass modal shell ──────────────────────────────────────────────────
function Modal({ onClose, children, width=540 }) {
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.82)',backdropFilter:'blur(16px)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:20}} onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div style={{background:T.card,border:`1px solid ${T.borderHi}`,borderRadius:22,padding:'30px 34px',width,maxWidth:'95vw',maxHeight:'88vh',overflowY:'auto',
        boxShadow:'0 32px 80px rgba(0,0,0,0.85),inset 0 1px 0 rgba(235,219,178,0.1),inset 0 -1px 0 rgba(0,0,0,0.45)',position:'relative'}}>
        <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,rgba(235,219,178,0.2),transparent)',borderRadius:'22px 22px 0 0'}}/>
        <button onClick={onClose} style={{position:'absolute',top:14,right:16,width:28,height:28,borderRadius:8,border:`1px solid ${T.border}`,background:'rgba(255,255,255,0.04)',color:T.textMid,cursor:'pointer',fontSize:16,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'-apple-system,sans-serif'}}>&times;</button>
        {children}
      </div>
    </div>
  )
}

function SectionHead({ title, sub }) {
  return (
    <div style={{marginBottom:22}}>
      <div style={{fontSize:18,fontWeight:700,color:T.text}}>{title}</div>
      {sub&&<div style={{fontSize:13,color:T.textLow,marginTop:3}}>{sub}</div>}
    </div>
  )
}

function GoldBtn({ label, onClick, full, small }) {
  return (
    <button onClick={onClick} style={{
      width:full?'100%':'auto',padding:small?'8px 18px':'11px 22px',borderRadius:10,cursor:'pointer',
      border:'1px solid rgba(250,189,47,0.38)',
      background:'linear-gradient(135deg,rgba(250,189,47,0.22),rgba(215,153,33,0.12))',
      color:'#fabd2f',fontSize:small?12:13,fontWeight:700,letterSpacing:'.06em',
      fontFamily:'-apple-system,sans-serif',
      boxShadow:'0 4px 14px rgba(250,189,47,0.18),inset 0 1px 0 rgba(250,189,47,0.22),inset 0 -1px 0 rgba(0,0,0,0.3)',
      transition:'all 0.15s',
    }}>{label}</button>
  )
}

function GhostBtn({ label, onClick, small }) {
  return (
    <button onClick={onClick} style={{
      padding:small?'8px 16px':'11px 20px',borderRadius:10,cursor:'pointer',
      border:`1px solid ${T.border}`,background:'rgba(255,255,255,0.03)',
      color:T.textMid,fontSize:small?12:13,fontWeight:700,
      fontFamily:'-apple-system,sans-serif',transition:'all 0.15s',
    }}>{label}</button>
  )
}

// ── MODAL: Lab Kits ──────────────────────────────────────────────────────────
function KitModal({ onClose }) {
  const [ordered, setOrdered] = useState(null)
  return (
    <Modal onClose={onClose} width={620}>
      {ordered ? (
        <div style={{textAlign:'center',padding:'20px 0'}}>
          <div style={{fontSize:48,marginBottom:16}}>📦</div>
          <div style={{fontSize:20,fontWeight:700,color:T.text,marginBottom:8}}>Order Confirmed</div>
          <div style={{fontSize:14,color:T.textMid,lineHeight:1.7,marginBottom:8}}>Your <strong style={{color:T.accent}}>{ordered}</strong> kit is on its way.</div>
          <div style={{fontSize:13,color:T.textLow,marginBottom:24}}>Results will be available in your dashboard. Your care team will be notified automatically to review and build your protocol.</div>
          <GoldBtn label="View My Dashboard" onClick={onClose}/>
        </div>
      ) : (
        <>
          <SectionHead title="📦 At-Home Lab Kits" sub="Order from our partner network — results flow directly into your CortixHealth dashboard and are automatically shared with your care team."/>
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            {LABS[0].kits.map(k=>(
              <div key={k.name} style={{background:'linear-gradient(145deg,rgba(80,73,69,0.4),rgba(60,56,54,0.3))',border:`1px solid ${T.border}`,borderRadius:14,padding:'14px 18px',display:'flex',alignItems:'center',gap:14,
                boxShadow:'inset 0 1px 0 rgba(235,219,178,0.06)'}}>
                <div style={{flex:1}}>
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
                    <span style={{fontSize:15,fontWeight:700,color:T.text}}>{k.name}</span>
                    <span style={{fontSize:10,padding:'2px 8px',borderRadius:20,background:'rgba(250,189,47,0.15)',border:'1px solid rgba(250,189,47,0.28)',color:T.accent,fontWeight:700}}>{k.badge}</span>
                  </div>
                  <div style={{display:'flex',gap:16,flexWrap:'wrap'}}>
                    {[['Markers',k.markers],['Turnaround',k.turnaround],['Method',k.method]].map(([l,v])=>(
                      <span key={l} style={{fontSize:12,color:T.textLow}}><span style={{color:T.textMid,fontWeight:600}}>{l}:</span> {v}</span>
                    ))}
                  </div>
                </div>
                <div style={{textAlign:'right',flexShrink:0}}>
                  <div style={{fontSize:16,fontWeight:800,color:T.accent,marginBottom:6}}>{k.price}</div>
                  <GoldBtn label="Order Now" small onClick={()=>setOrdered(k.name)}/>
                </div>
              </div>
            ))}
          </div>
          <div style={{marginTop:18,padding:'12px 16px',borderRadius:10,background:'rgba(142,192,124,0.08)',border:'1px solid rgba(142,192,124,0.2)',fontSize:12,color:'#8ec07c'}}>
            ✓ All results automatically synced to your CortixHealth profile · Shared with your care team upon receipt · HSA/FSA eligible
          </div>
        </>
      )}
    </Modal>
  )
}

// ── MODAL: Challenges ─────────────────────────────────────────────────────────
function ChallengeModal({ onClose }) {
  const [joined, setJoined] = useState(null)
  const [inviteSent, setInviteSent] = useState(false)
  const [email, setEmail] = useState('')
  return (
    <Modal onClose={onClose} width={600}>
      {joined ? (
        <div style={{textAlign:'center',padding:'16px 0'}}>
          <div style={{fontSize:48,marginBottom:12}}>{joined.icon}</div>
          <div style={{fontSize:20,fontWeight:700,color:T.text,marginBottom:6}}>You're in the {joined.label}!</div>
          <div style={{fontSize:13,color:T.textMid,lineHeight:1.7,marginBottom:20}}>Your specialist team has been notified. Day 1 check-in scheduled for tomorrow 8am. Track progress in your dashboard.</div>
          <div style={{background:'rgba(250,189,47,0.08)',border:'1px solid rgba(250,189,47,0.2)',borderRadius:12,padding:'14px 18px',marginBottom:20,textAlign:'left'}}>
            <div style={{fontSize:12,fontWeight:700,color:T.accent,marginBottom:8,letterSpacing:'.08em',textTransform:'uppercase'}}>Invite Friends</div>
            {inviteSent ? (
              <div style={{fontSize:13,color:'#8ec07c'}}>✓ Invite sent! Your friend will receive a link to join.</div>
            ) : (
              <div style={{display:'flex',gap:8}}>
                <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="friend@email.com"
                  style={{flex:1,background:'rgba(255,255,255,0.05)',border:`1px solid ${T.border}`,borderRadius:8,padding:'8px 12px',color:T.text,fontSize:13,outline:'none',fontFamily:'-apple-system,sans-serif'}}/>
                <GoldBtn label="Send Invite" small onClick={()=>setInviteSent(true)}/>
              </div>
            )}
          </div>
          <GoldBtn label="View Challenge Dashboard" onClick={onClose}/>
        </div>
      ) : (
        <>
          <SectionHead title="🏆 Challenges" sub="Join a structured program tracked by your care team. Invite friends — challenges are more effective together."/>
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            {CHALLENGES.map(c=>(
              <div key={c.id} style={{background:'linear-gradient(145deg,rgba(80,73,69,0.4),rgba(60,56,54,0.3))',border:`1px solid rgba(235,219,178,0.1)`,borderLeft:`3px solid ${c.color}`,borderRadius:14,padding:'16px 18px',display:'flex',alignItems:'center',gap:14,
                boxShadow:'inset 0 1px 0 rgba(235,219,178,0.06)'}}>
                <div style={{fontSize:32,flexShrink:0}}>{c.icon}</div>
                <div style={{flex:1}}>
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
                    <span style={{fontSize:15,fontWeight:700,color:T.text}}>{c.label}</span>
                    <span style={{fontSize:11,padding:'2px 8px',borderRadius:20,background:`${c.color}18`,border:`1px solid ${c.color}35`,color:c.color,fontWeight:700}}>{c.duration}</span>
                  </div>
                  <div style={{fontSize:13,color:T.textMid,lineHeight:1.6,marginBottom:6}}>{c.desc}</div>
                  <div style={{fontSize:11,color:T.textLow}}>👥 {c.participants.toLocaleString()} participants active</div>
                </div>
                <GoldBtn label="Join" small onClick={()=>setJoined(c)}/>
              </div>
            ))}
          </div>
        </>
      )}
    </Modal>
  )
}

// ── MODAL: Share Workout ──────────────────────────────────────────────────────
function WorkoutModal({ onClose }) {
  const [shared, setShared] = useState(null)
  const [tab, setTab] = useState('browse')
  const [newName, setNewName] = useState('')
  return (
    <Modal onClose={onClose} width={580}>
      <SectionHead title="💪 Workout Programs" sub="Browse specialist-designed programs or share your own with the community."/>
      <div style={{display:'flex',gap:8,marginBottom:20}}>
        {['browse','share'].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{padding:'7px 18px',borderRadius:8,border:`1px solid ${tab===t?'rgba(250,189,47,0.35)':T.border}`,background:tab===t?'rgba(250,189,47,0.12)':'transparent',color:tab===t?T.accent:T.textMid,fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:'-apple-system,sans-serif',transition:'all 0.15s',textTransform:'capitalize'}}>{t}</button>
        ))}
      </div>
      {tab==='browse' ? (
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {WORKOUTS.map(w=>(
            <div key={w.id} style={{background:'linear-gradient(145deg,rgba(80,73,69,0.4),rgba(60,56,54,0.3))',border:`1px solid ${T.border}`,borderRadius:12,padding:'14px 16px',display:'flex',alignItems:'center',gap:12,boxShadow:'inset 0 1px 0 rgba(235,219,178,0.06)'}}>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:3}}>{w.name}</div>
                <div style={{fontSize:12,color:T.textLow,marginBottom:6}}>by {w.author} · {w.days} days/week</div>
                <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                  {w.tags.map(tag=>(
                    <span key={tag} style={{fontSize:10,padding:'2px 8px',borderRadius:20,background:'rgba(235,219,178,0.07)',border:`1px solid ${T.border}`,color:T.textMid,fontWeight:600}}>{tag}</span>
                  ))}
                </div>
              </div>
              <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:6,flexShrink:0}}>
                <span style={{fontSize:12,color:T.textLow}}>❤️ {w.likes}</span>
                {shared===w.id ? <span style={{fontSize:12,color:'#8ec07c',fontWeight:700}}>✓ Saved</span> : <GoldBtn label="Add to Plan" small onClick={()=>setShared(w.id)}/>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          <div>
            <div style={{fontSize:11,color:T.textMid,marginBottom:6,fontWeight:700,textTransform:'uppercase',letterSpacing:'.08em'}}>Program Name</div>
            <input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="e.g. My BPC-157 Recovery Split"
              style={{width:'100%',background:'rgba(255,255,255,0.05)',border:`1px solid ${T.border}`,borderRadius:8,padding:'10px 14px',color:T.text,fontSize:13,outline:'none',fontFamily:'-apple-system,sans-serif',boxSizing:'border-box'}}/>
          </div>
          {[['Days per week','3–4 days'],['Focus Area','Strength & Recovery'],['Peptide Alignment','TB-500, BPC-157']].map(([l,p])=>(
            <div key={l}>
              <div style={{fontSize:11,color:T.textMid,marginBottom:6,fontWeight:700,textTransform:'uppercase',letterSpacing:'.08em'}}>{l}</div>
              <input placeholder={p} style={{width:'100%',background:'rgba(255,255,255,0.05)',border:`1px solid ${T.border}`,borderRadius:8,padding:'10px 14px',color:T.text,fontSize:13,outline:'none',fontFamily:'-apple-system,sans-serif',boxSizing:'border-box'}}/>
            </div>
          ))}
          <GoldBtn label="Share with Community" full onClick={()=>{setTab('browse');setShared('new')}}/>
        </div>
      )}
    </Modal>
  )
}

// ── MODAL: Send Protocol to Clinician ─────────────────────────────────────────
function SendProtocolModal({ onClose }) {
  const [step, setStep] = useState(1)
  const [sel, setSel] = useState([])
  const [spec, setSpec] = useState(null)
  const toggleSel = id => setSel(s=>s.includes(id)?s.filter(x=>x!==id):[...s,id])
  const DOCS = [
    { id:'labs', label:'Latest Blood Panel', sub:'SiPhox · Nov 2024 · 60 markers', icon:'🩸' },
    { id:'protocol', label:'Current Protocol',  sub:'BPC-157, TB-500, GHK-Cu · Week 4', icon:'💊' },
    { id:'ori', label:'ORI Score Report',    sub:'Meto Engine · Score: 34 · Metabolic', icon:'📊' },
    { id:'training', label:'Training Log',   sub:'Marcus T. program · 4 weeks data', icon:'💪' },
    { id:'nutrition', label:'Nutrition Log', sub:'7-day macro + micronutrient summary', icon:'🥗' },
  ]
  return (
    <Modal onClose={onClose} width={560}>
      {step===1 && <>
        <SectionHead title="📤 Send My Protocol" sub="Select what to share with your specialist. Everything is end-to-end encrypted."/>
        <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:20}}>
          {DOCS.map(d=>(
            <div key={d.id} onClick={()=>toggleSel(d.id)} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 14px',borderRadius:12,cursor:'pointer',transition:'all 0.15s',
              background:sel.includes(d.id)?'linear-gradient(135deg,rgba(250,189,47,0.1),rgba(250,189,47,0.04))':'rgba(255,255,255,0.03)',
              border:sel.includes(d.id)?'1px solid rgba(250,189,47,0.28)':`1px solid ${T.border}`,
              boxShadow:sel.includes(d.id)?'inset 0 1px 0 rgba(250,189,47,0.08)':'none'}}>
              <span style={{fontSize:20}}>{d.icon}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:600,color:T.text}}>{d.label}</div>
                <div style={{fontSize:11,color:T.textLow,marginTop:2}}>{d.sub}</div>
              </div>
              <div style={{width:20,height:20,borderRadius:6,border:sel.includes(d.id)?'1px solid rgba(250,189,47,0.5)':`1px solid ${T.border}`,background:sel.includes(d.id)?'rgba(250,189,47,0.2)':'transparent',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                {sel.includes(d.id)&&<span style={{fontSize:11,color:T.accent}}>✓</span>}
              </div>
            </div>
          ))}
        </div>
        <GoldBtn label={`Continue with ${sel.length} item${sel.length!==1?'s':''} selected →`} full onClick={()=>sel.length>0&&setStep(2)}/>
      </>}
      {step===2 && <>
        <SectionHead title="Choose Specialist" sub="Select who receives your protocol package."/>
        <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:20}}>
          {SPECS.map(s=>(
            <div key={s.id} onClick={()=>setSpec(s.id)} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 14px',borderRadius:12,cursor:'pointer',transition:'all 0.15s',
              background:spec===s.id?'linear-gradient(135deg,rgba(250,189,47,0.1),rgba(250,189,47,0.04))':'rgba(255,255,255,0.03)',
              border:spec===s.id?'1px solid rgba(250,189,47,0.28)':`1px solid ${T.border}`}}>
              <Av id={s.id} sz={38}/>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:600,color:T.text}}>{s.name}</div>
                <div style={{fontSize:11,color:s.c,fontWeight:600,marginBottom:2}}>{s.role}</div>
                <div style={{fontSize:11,color:T.textLow}}>{s.specialty}</div>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:6,flexShrink:0}}>
                <div style={{width:8,height:8,borderRadius:'50%',background:SC[s.st]}}/>
                <span style={{fontSize:11,color:T.textLow,textTransform:'capitalize'}}>{s.st}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{display:'flex',gap:10}}>
          <GhostBtn label="← Back" onClick={()=>setStep(1)}/>
          <GoldBtn label="Send Protocol Securely →" full onClick={()=>spec&&setStep(3)}/>
        </div>
      </>}
      {step===3 && (
        <div style={{textAlign:'center',padding:'20px 0'}}>
          <div style={{fontSize:52,marginBottom:14}}>✅</div>
          <div style={{fontSize:20,fontWeight:700,color:T.text,marginBottom:8}}>Protocol Sent</div>
          <div style={{fontSize:14,color:T.textMid,lineHeight:1.7,marginBottom:8}}>
            <strong style={{color:T.accent}}>{SPECS.find(s=>s.id===spec)?.name}</strong> has received your protocol package.
          </div>
          <div style={{fontSize:13,color:T.textLow,marginBottom:24}}>They'll review your data and respond with recommendations within 24 hours. You'll be notified in this channel.</div>
          <GoldBtn label="Back to Dashboard" onClick={onClose}/>
        </div>
      )}
    </Modal>
  )
}

// ── MODAL: Consult Request ────────────────────────────────────────────────────
function ConsultModal({ onClose }) {
  const [done, setDone] = useState(false)
  const [form, setForm] = useState({name:'',email:'',spec:'any',topic:''})
  const iS = {background:'rgba(255,255,255,0.04)',border:`1px solid ${T.border}`,borderRadius:8,color:T.text,fontSize:13,padding:'9px 13px',width:'100%',outline:'none',fontFamily:'-apple-system,sans-serif',boxShadow:'inset 0 2px 8px rgba(0,0,0,0.3)',boxSizing:'border-box'}
  return (
    <Modal onClose={onClose} width={480}>
      {done ? (
        <div style={{textAlign:'center',padding:'20px 0'}}>
          <div style={{width:64,height:64,borderRadius:'50%',background:'rgba(184,187,38,0.12)',border:'1px solid rgba(184,187,38,0.35)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px',fontSize:28,color:'#b8bb26',boxShadow:'0 0 24px rgba(184,187,38,0.2)'}}>✓</div>
          <div style={{fontSize:18,fontWeight:700,color:T.text,marginBottom:8}}>Request Submitted</div>
          <div style={{fontSize:13,color:T.textMid,lineHeight:1.65,marginBottom:22}}>A specialist will be in touch within 24 hours via secure message.</div>
          <GoldBtn label="Close" onClick={()=>{onClose()}}/>
        </div>
      ) : (
        <>
          <SectionHead title="Request a Consultation" sub="Connect with a specialist on the CortixHealth network"/>
          <div style={{display:'flex',flexDirection:'column',gap:14}}>
            {[['Your Name','Full name','name'],['Email','your@email.com','email']].map(([l,p,k])=>(
              <div key={k}><div style={{fontSize:10,color:T.textMid,marginBottom:5,fontWeight:700,textTransform:'uppercase',letterSpacing:'.1em'}}>{l}</div>
              <input value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} placeholder={p} style={iS}/></div>
            ))}
            <div>
              <div style={{fontSize:10,color:T.textMid,marginBottom:5,fontWeight:700,textTransform:'uppercase',letterSpacing:'.1em'}}>Specialist Type</div>
              <select value={form.spec} onChange={e=>setForm({...form,spec:e.target.value})} style={{...iS,appearance:'none'}}>
                <option value="any">Any available specialist</option>
                {SPECS.map(s=><option key={s.id} value={s.id}>{s.name} — {s.role}</option>)}
              </select>
            </div>
            <div><div style={{fontSize:10,color:T.textMid,marginBottom:5,fontWeight:700,textTransform:'uppercase',letterSpacing:'.1em'}}>What are you working on?</div>
            <textarea value={form.topic} onChange={e=>setForm({...form,topic:e.target.value})} placeholder="Describe your goals or current protocol..." rows={3} style={{...iS,resize:'none'}}/></div>
            <div style={{display:'flex',gap:10,marginTop:4}}>
              <GhostBtn label="Cancel" onClick={onClose}/>
              <GoldBtn label="Submit Request" full onClick={()=>setDone(true)}/>
            </div>
          </div>
        </>
      )}
    </Modal>
  )
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function MessageBoardPage() {
  const [ch, setCh] = useState('lon')
  const [tr, setTr] = useState(0)
  const [railTab, setRailTab] = useState('msg')
  const [msg, setMsg] = useState('')
  const [activeModal, setActiveModal] = useState(null) // 'consult'|'kit'|'challenge'|'workout'|'protocol'

  const RAIL_ITEMS = [
    { id:'msg',       icon:'💬', badge:13 },
    { id:'challenge', icon:'🏆', badge:2  },
    { id:'team',      icon:'👥', badge:0  },
  ]
  const RAIL_BOTTOM = [
    { id:'workout', icon:'💪', badge:0 },
    { id:'cfg',     icon:'⚙️', badge:0 },
  ]

  const openKit = () => setActiveModal('kit')

  return (
    <div style={{width:'100vw',height:'100vh',background:T.bg,display:'flex',flexDirection:'column',overflow:'hidden',fontFamily:'-apple-system,sans-serif'}}>
      <style>{`
        .sc::-webkit-scrollbar{width:3px} .sc::-webkit-scrollbar-thumb{background:rgba(235,219,178,0.1);border-radius:2px}
        .ch-r:hover{background:rgba(235,219,178,0.04)!important;border-color:rgba(235,219,178,0.08)!important}
        .dm-r:hover{background:rgba(235,219,178,0.04)!important}
        .tr-r:hover{background:rgba(235,219,178,0.03)!important}
        .msg-b:hover{background:rgba(235,219,178,0.025)!important}
        .lab-r:hover{background:rgba(142,192,124,0.06)!important;border-color:rgba(142,192,124,0.15)!important}
        input::placeholder,textarea::placeholder{color:#504945}
        select option{background:#1c1a18;color:#ebdbb2}
        .rxbtn:hover{background:rgba(235,219,178,0.07)!important}
        .jump-btn:hover{background:linear-gradient(135deg,rgba(250,189,47,0.14),rgba(250,189,47,0.06))!important;color:#fabd2f!important;border-color:rgba(250,189,47,0.3)!important}
        .rail-btn:hover>div{border-color:rgba(235,219,178,0.18)!important}
        .action-btn:hover{background:rgba(235,219,178,0.06)!important;border-color:rgba(235,219,178,0.18)!important}
      `}</style>

      <TopBar view="list" setView={()=>{}} onUpload={null} searchQuery="" setSearchQuery={()=>{}}/>

      <div style={{flex:1,display:'flex',overflow:'hidden',minHeight:0}}>

        {/* ── ICON RAIL ── */}
        <div style={{width:85,flexShrink:0,background:T.rail,borderRight:`1px solid ${T.border}`,display:'flex',flexDirection:'column',alignItems:'center',paddingTop:12,paddingBottom:14,gap:8,
          boxShadow:`3px 0 20px rgba(0,0,0,0.5),inset -1px 0 0 rgba(235,219,178,0.05)`,zIndex:2}}>
          <div style={{width:'78%',aspectRatio:'1/1',borderRadius:16,marginBottom:6,flexShrink:0,
            background:'linear-gradient(145deg,rgba(250,189,47,0.28),rgba(250,189,47,0.12))',
            border:'1px solid rgba(250,189,47,0.40)',display:'flex',alignItems:'center',justifyContent:'center',
            fontSize:'clamp(13px,1.4vw,20px)',fontWeight:900,color:T.accent,letterSpacing:'-0.03em',
            boxShadow:'0 4px 18px rgba(250,189,47,0.24),inset 0 1px 0 rgba(250,189,47,0.34),inset 0 -1px 0 rgba(0,0,0,0.42)'}}>CH</div>
          <div style={{width:24,height:1,background:'linear-gradient(90deg,transparent,rgba(235,219,178,0.1),transparent)',marginBottom:2}}/>
          {RAIL_ITEMS.map(item=>(
            <div key={item.id} className="rail-btn" onClick={()=>{setRailTab(item.id);if(item.id==='challenge')setActiveModal('challenge')}} style={{cursor:'pointer',width:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}>
              <RailBtn icon={item.icon} active={railTab===item.id} badge={item.badge}/>
            </div>
          ))}
          <div style={{flex:1}}/>
          {RAIL_BOTTOM.map(item=>(
            <div key={item.id} className="rail-btn" onClick={()=>{if(item.id==='workout')setActiveModal('workout')}} style={{cursor:'pointer',width:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}>
              <RailBtn icon={item.icon} active={false} badge={item.badge}/>
            </div>
          ))}
        </div>

        {/* ── CHANNEL SIDEBAR ── */}
        <div style={{width:335,flexShrink:0,background:T.side,borderRight:`1px solid ${T.border}`,display:'flex',flexDirection:'column',boxShadow:`4px 0 20px rgba(0,0,0,0.45),inset -1px 0 0 rgba(235,219,178,0.04)`}}>
          <div style={{padding:'15px 16px',borderBottom:`1px solid ${T.border}`,background:'rgba(0,0,0,0.2)',display:'flex',alignItems:'center',gap:10,flexShrink:0,cursor:'pointer'}}>
            <div style={{flex:1}}>
              <div style={{fontSize:15,fontWeight:800,color:T.text,letterSpacing:'.08em',textTransform:'uppercase'}}>CortixHealth</div>
              <div style={{fontSize:12,color:T.textLow,marginTop:2}}>Integrated Longevity Platform</div>
            </div>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{color:T.textLow}}><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>

          {/* Quick Action Bar */}
          <div style={{padding:'10px 12px',borderBottom:`1px solid ${T.border}`,display:'flex',gap:6,flexWrap:'wrap'}}>
            {[
              {label:'📦 Order Kit',     onClick:()=>setActiveModal('kit')},
              {label:'🏆 Challenge',     onClick:()=>setActiveModal('challenge')},
              {label:'💪 Workouts',      onClick:()=>setActiveModal('workout')},
              {label:'📤 Send Protocol', onClick:()=>setActiveModal('protocol')},
            ].map(a=>(
              <button key={a.label} className="action-btn" onClick={a.onClick} style={{fontSize:11,padding:'5px 10px',borderRadius:7,border:`1px solid ${T.border}`,background:'rgba(255,255,255,0.03)',color:T.textMid,cursor:'pointer',fontWeight:700,fontFamily:'-apple-system,sans-serif',transition:'all 0.15s',whiteSpace:'nowrap'}}>{a.label}</button>
            ))}
          </div>

          <div className="sc" style={{flex:1,overflowY:'auto',paddingBottom:10}}>
            {/* Channels */}
            <div style={{fontSize:12,fontWeight:700,letterSpacing:'.13em',color:T.textLow,textTransform:'uppercase',padding:'12px 16px 5px'}}>Channels</div>
            {CHS.map(c=>(
              <div key={c.id} className="ch-r" onClick={()=>setCh(c.id)}
                style={{display:'flex',alignItems:'center',gap:8,padding:'8px 12px',margin:'1px 7px',borderRadius:8,cursor:'pointer',transition:'all 0.15s',
                  background:ch===c.id?'linear-gradient(135deg,rgba(250,189,47,0.14),rgba(250,189,47,0.07))':'transparent',
                  border:ch===c.id?`1px solid rgba(250,189,47,0.22)`:'1px solid transparent',
                  boxShadow:ch===c.id?'inset 0 1px 0 rgba(250,189,47,0.1),0 2px 8px rgba(0,0,0,0.3)':'none'}}>
                <span style={{fontSize:18,color:ch===c.id?'rgba(250,189,47,0.75)':'rgba(235,219,178,0.22)',lineHeight:1,fontWeight:300}}>#</span>
                <span style={{fontSize:14,color:ch===c.id?T.text:T.textMid,fontWeight:ch===c.id?600:400,flex:1,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{c.name}</span>
                {c.b>0&&<span style={{fontSize:11,fontWeight:800,padding:'2px 7px',borderRadius:10,background:ch===c.id?`${c.bc}28`:`${c.bc}18`,color:c.bc,border:`1px solid ${c.bc}30`,minWidth:20,textAlign:'center'}}>{c.b}</span>}
              </div>
            ))}

            {/* Lab Analysis */}
            <div style={{fontSize:12,fontWeight:700,letterSpacing:'.13em',color:T.textLow,textTransform:'uppercase',padding:'12px 16px 5px',marginTop:4,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <span>Lab Analysis</span>
              <span style={{fontSize:10,padding:'2px 8px',borderRadius:10,background:'rgba(142,192,124,0.15)',border:'1px solid rgba(142,192,124,0.28)',color:'#8ec07c',fontWeight:800}}>7</span>
            </div>
            {LABS.map(l=>(
              <div key={l.id} className={l.id==='lab-atHome'?'lab-r':'ch-r'} onClick={()=>{setCh(l.id);if(l.id==='lab-atHome')setActiveModal('kit')}}
                title={l.tip}
                style={{display:'flex',alignItems:'center',gap:8,padding:'8px 12px',margin:'1px 7px',borderRadius:8,cursor:'pointer',transition:'all 0.15s',
                  background:ch===l.id?(l.id==='lab-atHome'?'linear-gradient(135deg,rgba(142,192,124,0.12),rgba(142,192,124,0.05))':'linear-gradient(135deg,rgba(251,73,52,0.1),rgba(251,73,52,0.04))'):'transparent',
                  border:ch===l.id?(l.id==='lab-atHome'?'1px solid rgba(142,192,124,0.25)':'1px solid rgba(251,73,52,0.18)'):'1px solid transparent',
                }}>
                <span style={{fontSize:15,lineHeight:1,width:20,textAlign:'center',flexShrink:0}}>{l.icon}</span>
                <span style={{fontSize:18,color:ch===l.id?'rgba(251,73,52,0.55)':'rgba(235,219,178,0.18)',lineHeight:1,fontWeight:300,flexShrink:0}}>#</span>
                <span style={{fontSize:14,color:ch===l.id?T.text:T.textMid,fontWeight:ch===l.id?600:400,flex:1,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{l.name}</span>
                {l.id==='lab-atHome'&&<span style={{fontSize:9,padding:'2px 6px',borderRadius:6,background:'rgba(142,192,124,0.18)',border:'1px solid rgba(142,192,124,0.3)',color:'#8ec07c',fontWeight:800,flexShrink:0}}>HOT</span>}
                {l.b>0&&l.id!=='lab-atHome'&&<span style={{fontSize:11,fontWeight:800,padding:'2px 7px',borderRadius:10,background:l.bc?`${l.bc}18`:'rgba(235,219,178,0.08)',color:l.bc||T.textMid,border:`1px solid ${l.bc?l.bc+'30':'rgba(235,219,178,0.1)'}`,minWidth:20,textAlign:'center'}}>{l.b}</span>}
              </div>
            ))}

            {/* DMs */}
            <div style={{fontSize:12,fontWeight:700,letterSpacing:'.13em',color:T.textLow,textTransform:'uppercase',padding:'12px 16px 5px',marginTop:4,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <span>Direct Messages</span>
              <span onClick={()=>setActiveModal('consult')} style={{fontSize:11,padding:'3px 8px',borderRadius:5,border:`1px solid ${T.border}`,color:T.textMid,cursor:'pointer',fontWeight:700,background:'rgba(255,255,255,0.04)'}}>New DM</span>
            </div>
            {SPECS.map(s=>(
              <div key={s.id} className="dm-r" style={{display:'flex',alignItems:'center',gap:10,padding:'8px 12px',margin:'1px 7px',borderRadius:8,cursor:'pointer',transition:'background 0.15s'}}>
                <div style={{position:'relative',flexShrink:0}}>
                  <Av id={s.id} sz={34}/>
                  <div style={{position:'absolute',bottom:1,right:1,width:9,height:9,borderRadius:'50%',background:SC[s.st],border:'2px solid #32302f',boxShadow:`0 0 5px ${SC[s.st]}99`}}/>
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,color:T.textMid,fontWeight:500,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{s.name}</div>
                  <div style={{fontSize:11,color:T.textLow,marginTop:1}}>{s.role}</div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{padding:'12px',borderTop:`1px solid ${T.border}`,background:'rgba(0,0,0,0.2)',flexShrink:0}}>
            <button onClick={()=>setActiveModal('consult')} style={{width:'100%',padding:'11px',borderRadius:9,
              border:'1px solid rgba(250,189,47,0.32)',
              background:'linear-gradient(135deg,rgba(250,189,47,0.16),rgba(250,189,47,0.07))',
              color:T.accent,fontSize:12,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',cursor:'pointer',
              boxShadow:'0 3px 14px rgba(250,189,47,0.14),inset 0 1px 0 rgba(250,189,47,0.22),inset 0 -1px 0 rgba(0,0,0,0.3)',
              fontFamily:'-apple-system,sans-serif',transition:'all 0.2s'}}>
              Request Consultation
            </button>
          </div>
        </div>

        {/* ── CENTER MESSAGES ── */}
        <div style={{flex:1,display:'flex',flexDirection:'column',background:T.mid,borderRight:`1px solid ${T.border}`,minWidth:0}}>
          {/* Header */}
          <div style={{padding:'13px 24px',borderBottom:`1px solid ${T.border}`,display:'flex',alignItems:'center',gap:14,background:'rgba(0,0,0,0.25)',flexShrink:0,
            boxShadow:`0 2px 16px rgba(0,0,0,0.35),inset 0 -1px 0 rgba(235,219,178,0.04)`}}>
            <div style={{width:42,height:42,borderRadius:11,
              background:'linear-gradient(145deg,rgba(251,73,52,0.18),rgba(251,73,52,0.08))',
              border:'1px solid rgba(251,73,52,0.28)',display:'flex',alignItems:'center',justifyContent:'center',
              fontSize:20,fontWeight:300,color:'rgba(251,73,52,0.85)',flexShrink:0,
              boxShadow:'inset 0 1px 0 rgba(255,255,255,0.06),inset 0 -1px 0 rgba(0,0,0,0.4)'}}>#</div>
            <div style={{flex:1}}>
              <div style={{fontSize:17,fontWeight:600,color:T.text}}>{[...CHS,...LABS].find(c=>c.id===ch)?.name || ch}</div>
              <div style={{fontSize:12,color:T.textLow,marginTop:2}}>6 specialists · 3 active consultations · Peptide Protocol support</div>
            </div>
            <div style={{display:'flex',gap:7,alignItems:'center'}}>
              <button onClick={()=>setActiveModal('protocol')} style={{fontSize:12,padding:'6px 14px',borderRadius:7,border:'1px solid rgba(142,192,124,0.25)',background:'rgba(142,192,124,0.1)',color:'#8ec07c',cursor:'pointer',fontWeight:700,fontFamily:'-apple-system,sans-serif',display:'flex',alignItems:'center',gap:5,boxShadow:'inset 0 1px 0 rgba(142,192,124,0.1)'}}>
                📤 Send Protocol
              </button>
              <button onClick={()=>setActiveModal('kit')} style={{fontSize:12,padding:'6px 14px',borderRadius:7,border:'1px solid rgba(250,189,47,0.25)',background:'rgba(250,189,47,0.1)',color:T.accent,cursor:'pointer',fontWeight:700,fontFamily:'-apple-system,sans-serif',display:'flex',alignItems:'center',gap:5}}>
                📦 Order Lab Kit
              </button>
              <button onClick={()=>setActiveModal('challenge')} style={{fontSize:12,padding:'6px 14px',borderRadius:7,border:`1px solid ${T.border}`,background:'rgba(255,255,255,0.04)',color:T.textLow,cursor:'pointer',fontWeight:700,fontFamily:'-apple-system,sans-serif',display:'flex',alignItems:'center',gap:5}}>
                🏆 Challenges
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="sc" style={{flex:1,overflowY:'auto',padding:'20px 24px 16px'}}>
            {/* Pinned */}
            <div style={{background:'linear-gradient(145deg,rgba(92,84,52,0.38) 0%,rgba(68,62,36,0.30) 100%)',backdropFilter:'blur(16px)',WebkitBackdropFilter:'blur(16px)',border:'1px solid rgba(250,189,47,0.24)',borderRadius:14,padding:'12px 16px',marginBottom:22,display:'flex',gap:12,alignItems:'flex-start',boxShadow:'0 4px 20px rgba(0,0,0,0.3),inset 0 1px 0 rgba(250,189,47,0.1)',position:'relative',overflow:'hidden'}}>
              <div style={{position:'absolute',top:0,left:20,right:20,height:1,background:'linear-gradient(90deg,transparent,rgba(250,189,47,0.22),transparent)',pointerEvents:'none'}}/>
              <span style={{fontSize:13,marginTop:1,flexShrink:0}}>📌</span>
              <div style={{flex:1}}>
                <div style={{fontSize:11,fontWeight:800,letterSpacing:'.12em',color:'rgba(250,189,47,0.78)',textTransform:'uppercase',marginBottom:5}}>Pinned Messages</div>
                <span style={{fontSize:13,color:T.textMid,lineHeight:1.65}}>Complete your Meto Engine assessment before your first consultation. Your protocol data and ORI score will be shared securely with your assigned clinician.</span>
              </div>
              <span style={{fontSize:16,color:T.textLow,cursor:'pointer',flexShrink:0,marginTop:-2}}>&times;</span>
            </div>

            {MSGS.map(m=>{
              const sp = SPECS.find(x=>x.id===m.s)
              if(!sp) return null
              return (
                <div key={m.id} className="msg-b" style={{display:'flex',gap:14,marginBottom:16,padding:'8px 10px',borderRadius:12,transition:'background 0.15s',position:'relative',alignItems:'flex-start'}}>
                  <div style={{flexShrink:0,paddingTop:3}}><Av id={m.s} sz={44}/></div>
                  <div style={{minWidth:0,maxWidth:'82%'}}>
                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:7,flexWrap:'wrap'}}>
                      <span style={{fontSize:15,fontWeight:700,color:T.text}}>{sp.name}</span>
                      <span style={{fontSize:12,color:T.textLow}}>{m.t}</span>
                      {m.urgent&&<span style={{fontSize:11,padding:'2px 8px',borderRadius:4,fontWeight:700,background:'rgba(251,73,52,0.16)',border:'1px solid rgba(251,73,52,0.32)',color:'#fb4934',letterSpacing:'.06em'}}>URGENT</span>}
                      <span style={{fontSize:11,padding:'3px 10px',borderRadius:5,fontWeight:700,letterSpacing:'.06em',background:`${sp.c}14`,border:`1px solid ${sp.c}28`,color:sp.c}}>{sp.role}</span>
                      {m.urgent&&<div style={{width:20,height:20,borderRadius:'50%',background:'rgba(251,73,52,0.18)',border:'1px solid rgba(251,73,52,0.45)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,boxShadow:'0 0 10px rgba(251,73,52,0.3)'}}><div style={{width:7,height:7,borderRadius:'50%',background:'#fb4934'}}/></div>}
                    </div>
                    <div style={{display:'inline-block',
                      background:m.hi?'linear-gradient(145deg,rgba(250,189,47,0.14) 0%,rgba(215,153,33,0.07) 100%)':'linear-gradient(145deg,rgba(92,84,76,0.48) 0%,rgba(68,62,56,0.38) 100%)',
                      backdropFilter:'blur(20px) saturate(140%)',WebkitBackdropFilter:'blur(20px) saturate(140%)',
                      border:m.hi?'1px solid rgba(250,189,47,0.30)':'1px solid rgba(235,219,178,0.14)',
                      borderRadius:'4px 16px 16px 16px',padding:'12px 18px',fontSize:14,
                      color:m.hi?T.text:'rgba(189,174,147,0.94)',lineHeight:1.7,
                      boxShadow:m.hi?'0 6px 24px rgba(0,0,0,0.35),inset 0 1px 0 rgba(250,189,47,0.1)':'0 6px 24px rgba(0,0,0,0.28),inset 0 1px 0 rgba(235,219,178,0.09)',
                      maxWidth:'100%',wordBreak:'break-word',position:'relative'}}>
                      <div style={{position:'absolute',top:0,left:14,right:14,height:1,background:m.hi?'linear-gradient(90deg,transparent,rgba(250,189,47,0.28),transparent)':'linear-gradient(90deg,transparent,rgba(235,219,178,0.14),transparent)',borderRadius:1,pointerEvents:'none'}}/>
                      {m.txt.includes('@patient')?<>{m.txt.split('@patient')[0]}<span style={{color:T.accent,fontWeight:700,background:'rgba(250,189,47,0.12)',padding:'0 4px',borderRadius:3}}>@patient</span>{m.txt.split('@patient')[1]}</>:m.txt}
                    </div>
                    {m.rx&&m.rx.length>0&&(
                      <div style={{display:'flex',gap:5,marginTop:7,flexWrap:'wrap'}}>
                        {m.rx.map((r,i)=>(
                          <button key={i} className="rxbtn" style={{display:'inline-flex',alignItems:'center',gap:5,padding:'4px 12px',borderRadius:20,border:`1px solid rgba(235,219,178,0.15)`,background:'linear-gradient(145deg,rgba(80,73,69,0.55),rgba(60,56,54,0.45))',backdropFilter:'blur(8px)',cursor:'pointer',fontSize:13,color:T.textMid,fontFamily:'-apple-system,sans-serif',transition:'all 0.15s',boxShadow:'0 2px 8px rgba(0,0,0,0.25),inset 0 1px 0 rgba(235,219,178,0.08)'}}>
                            <span>{r.e}</span><span style={{fontSize:12,fontWeight:700}}>{r.n}</span>
                          </button>
                        ))}
                        <button className="rxbtn" style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:30,height:30,borderRadius:20,border:`1px solid rgba(235,219,178,0.11)`,background:'linear-gradient(145deg,rgba(80,73,69,0.45),rgba(60,56,54,0.35))',cursor:'pointer',fontSize:14,color:T.textLow,fontFamily:'-apple-system,sans-serif',transition:'all 0.15s'}}>☺</button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Floating Pill Input */}
          <div style={{padding:'0 24px 20px',flexShrink:0}}>
            <div style={{borderRadius:18,background:'linear-gradient(160deg,#3c3836 0%,#32302f 100%)',border:`1px solid rgba(235,219,178,0.22)`,boxShadow:'0 10px 36px rgba(0,0,0,0.5),inset 0 1px 0 rgba(235,219,178,0.13),inset 0 -1px 0 rgba(0,0,0,0.35)',overflow:'hidden'}}>
              <div style={{padding:'13px 18px 11px',borderBottom:`1px solid rgba(235,219,178,0.09)`}}>
                <input value={msg} onChange={e=>setMsg(e.target.value)} placeholder={`Message #${[...CHS,...LABS].find(c=>c.id===ch)?.name||ch}...`}
                  style={{width:'100%',background:'none',border:'none',outline:'none',color:T.text,fontSize:14,fontFamily:'-apple-system,sans-serif',lineHeight:1.5}}/>
              </div>
              <div style={{padding:'8px 14px 10px',display:'flex',alignItems:'center',gap:4}}>
                <button style={{width:28,height:28,borderRadius:6,border:`1px solid rgba(235,219,178,0.11)`,background:'rgba(235,219,178,0.05)',color:T.textLow,cursor:'pointer',fontSize:14,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>📎</button>
                <div style={{width:1,height:16,background:'rgba(235,219,178,0.1)',margin:'0 4px',flexShrink:0}}/>
                {[{l:'B',fw:800,fs:'normal',td:'none'},{l:'I',fw:400,fs:'italic',td:'none'},{l:'S',fw:600,fs:'normal',td:'line-through'}].map(f=>(
                  <button key={f.l} style={{fontSize:12,width:26,height:26,borderRadius:5,border:`1px solid rgba(235,219,178,0.11)`,background:'rgba(235,219,178,0.05)',color:T.textLow,cursor:'pointer',fontWeight:f.fw,fontStyle:f.fs,textDecoration:f.td,transition:'all 0.15s',fontFamily:'-apple-system,sans-serif',flexShrink:0}}>{f.l}</button>
                ))}
                {['🔗','ƒ','≡','⌨'].map(i=>(
                  <button key={i} style={{width:26,height:26,borderRadius:5,border:`1px solid rgba(235,219,178,0.11)`,background:'rgba(235,219,178,0.05)',color:T.textLow,cursor:'pointer',fontSize:13,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontFamily:'monospace'}}>{i}</button>
                ))}
                <div style={{width:1,height:16,background:'rgba(235,219,178,0.1)',margin:'0 4px',flexShrink:0}}/>
                {['Protocol','Lab Results','Schedule'].map(a=>(
                  <button key={a} onClick={a==='Protocol'?()=>setActiveModal('protocol'):a==='Lab Results'?()=>setActiveModal('kit'):undefined} style={{fontSize:11,padding:'4px 10px',borderRadius:6,border:`1px solid rgba(235,219,178,0.11)`,background:'rgba(235,219,178,0.05)',color:T.textMid,cursor:'pointer',fontWeight:700,fontFamily:'-apple-system,sans-serif',transition:'all 0.15s',flexShrink:0,whiteSpace:'nowrap'}}>{a}</button>
                ))}
                <span style={{fontSize:11,color:T.textLow,marginLeft:6,flexShrink:0,fontWeight:600}}>Aa</span>
                <span style={{fontSize:14,color:T.textLow,cursor:'pointer',padding:'0 4px',flexShrink:0}}>☺</span>
                <button onClick={()=>setMsg('')} style={{marginLeft:'auto',height:32,width:32,borderRadius:9,flexShrink:0,border:'1px solid rgba(250,189,47,0.42)',background:'linear-gradient(145deg,rgba(250,189,47,0.30),rgba(215,153,33,0.20))',color:T.accent,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 12px rgba(250,189,47,0.22),inset 0 1px 0 rgba(250,189,47,0.32)',fontSize:14,transition:'all 0.15s'}}>▶</button>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT THREADS ── */}
        <div style={{width:375,flexShrink:0,background:T.side,display:'flex',flexDirection:'column',boxShadow:`-3px 0 18px rgba(0,0,0,0.4),inset 1px 0 0 rgba(235,219,178,0.04)`}}>
          <div style={{padding:'14px 16px',borderBottom:`1px solid ${T.border}`,display:'flex',alignItems:'center',justifyContent:'space-between',background:'rgba(0,0,0,0.2)',flexShrink:0}}>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <span style={{fontSize:14,color:T.textLow}}>💬</span>
              <span style={{fontSize:14,fontWeight:700,color:T.textMid,letterSpacing:'.05em',textTransform:'uppercase'}}>Threads</span>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <span style={{fontSize:12,padding:'3px 10px',borderRadius:10,background:'rgba(250,189,47,0.15)',border:'1px solid rgba(250,189,47,0.30)',color:T.accent,fontWeight:800}}>{SPECS.length}</span>
              <span style={{fontSize:16,color:T.textLow,cursor:'pointer'}}>&times;</span>
            </div>
          </div>

          <div className="sc" style={{flex:1,overflowY:'auto'}}>
            {SPECS.map((sp,i)=>(
              <div key={sp.id} className="tr-r" onClick={()=>setTr(i)}
                style={{display:'flex',gap:11,padding:'13px 14px',borderBottom:`1px solid ${T.border}`,cursor:'pointer',transition:'all 0.15s',
                  borderLeft:tr===i?'3px solid rgba(250,189,47,0.55)':'3px solid transparent',
                  background:tr===i?'linear-gradient(135deg,rgba(250,189,47,0.08),rgba(250,189,47,0.03))':'transparent'}}>
                <div style={{position:'relative',flexShrink:0}}>
                  <Av id={sp.id} sz={38}/>
                  <div style={{position:'absolute',bottom:0,right:0,width:10,height:10,borderRadius:'50%',background:SC[sp.st],border:'2px solid #32302f'}}/>
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:3}}>
                    <span style={{fontSize:13,fontWeight:600,color:T.textMid}}>{sp.name}</span>
                    <span style={{fontSize:11,color:T.textLow}}>{MSGS.find(m=>m.s===sp.id)?.t||'--'}</span>
                  </div>
                  <div style={{fontSize:11,color:sp.c,fontWeight:600,marginBottom:3}}>{sp.role}</div>
                  <div style={{fontSize:12,color:'rgba(168,153,132,0.65)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{sp.reply}</div>
                  <button onClick={e=>{e.stopPropagation();setActiveModal('protocol')}} style={{marginTop:6,fontSize:10,padding:'3px 9px',borderRadius:6,border:`1px solid ${T.border}`,background:'rgba(255,255,255,0.03)',color:T.textLow,cursor:'pointer',fontFamily:'-apple-system,sans-serif',fontWeight:700,transition:'all 0.15s'}}>📤 Send Protocol</button>
                </div>
              </div>
            ))}
          </div>

          <div style={{padding:'12px 14px 16px',borderTop:`1px solid ${T.border}`,background:'rgba(0,0,0,0.2)',flexShrink:0}}>
            <div className="jump-btn" onClick={()=>setActiveModal('challenge')} style={{borderRadius:9,padding:'11px 14px',textAlign:'center',background:'linear-gradient(135deg,rgba(60,56,54,0.9),rgba(44,42,40,0.95))',border:`1px solid ${T.border}`,color:T.textMid,fontSize:13,fontWeight:700,letterSpacing:'.08em',cursor:'pointer',textTransform:'uppercase',boxShadow:'inset 0 1px 0 rgba(235,219,178,0.06)',transition:'all 0.15s'}}>
              🏆 View Challenges
            </div>
          </div>
        </div>
      </div>

      {/* ── MODALS ── */}
      {activeModal==='consult'   && <ConsultModal      onClose={()=>setActiveModal(null)}/>}
      {activeModal==='kit'       && <KitModal          onClose={()=>setActiveModal(null)}/>}
      {activeModal==='challenge' && <ChallengeModal    onClose={()=>setActiveModal(null)}/>}
      {activeModal==='workout'   && <WorkoutModal      onClose={()=>setActiveModal(null)}/>}
      {activeModal==='protocol'  && <SendProtocolModal onClose={()=>setActiveModal(null)}/>}
    </div>
  )
}
