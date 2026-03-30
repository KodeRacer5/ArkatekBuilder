'use client'
import { useState, useMemo } from 'react'
import TopBar from '@/app/_components/ui/dashboard/top-bar'

// ─── Theme ───────────────────────────────────────────────────────────────────
const T = {
  bg:       '#282828',
  sidebar:  'linear-gradient(160deg,#32302f 0%,#2e2c2a 100%)',
  card:     'linear-gradient(155deg,rgba(62,58,56,0.97) 0%,rgba(44,42,40,0.99) 100%)',
  cardHov:  'linear-gradient(155deg,rgba(72,68,64,0.98) 0%,rgba(52,50,48,0.99) 100%)',
  border:   'rgba(235,219,178,0.10)',
  borderHi: 'rgba(235,219,178,0.18)',
  text:     '#ebdbb2',
  textMid:  '#a89984',
  textLow:  '#7c6f64',
  accent:   '#fabd2f',
  green:    '#b8bb26',
  red:      '#fb4934',
  aqua:     '#83a598',
  purple:   '#d3869b',
}

// ─── Product catalog ─────────────────────────────────────────────────────────
const PRODUCTS = [
  // Peptides
  { id:1,  cat:'peptides',      name:'BPC-157 (250mcg)',          brand:'CortixRx',       price:89,   was:109,  rating:4.9, reviews:2341, badge:'Protocol Pick', badgeC:'#fb4934',
    desc:'Research-grade pentadecapeptide. Supports tissue repair, angiogenesis, and NO pathways. Verified purity 99.2%.', tags:['Healing','Anti-Inflammatory','SubQ'], inStock:true,
    protocol:'Dr. Rachel Monroe recommends for BPC-157 longevity stacks.' },
  { id:2,  cat:'peptides',      name:'TB-500 (2mg)',               brand:'CortixRx',       price:124,  was:149,  rating:4.8, reviews:1876, badge:'Best Seller',   badgeC:'#8ec07c',
    desc:'Thymosin Beta-4 fragment. Systemic healing via actin upregulation. Ideal paired with BPC-157.', tags:['Recovery','Systemic','SubQ'], inStock:true,
    protocol:'Marcus T. aligns TB-500 injections with compound lift days.' },
  { id:3,  cat:'peptides',      name:'GHK-Cu (1mg)',               brand:'CortixRx',       price:79,   was:94,   rating:4.7, reviews:987,  badge:'Protocol Stack', badgeC:'#fabd2f',
    desc:'Copper peptide. Stimulates collagen synthesis, wound healing, and anti-fibrotic action.', tags:['Collagen','Longevity','SubQ/Topical'], inStock:true,
    protocol:'Pair with copper bisglycinate 2mg for optimal synthesis support.' },
  { id:4,  cat:'peptides',      name:'Semax (400mcg)',             brand:'CortixRx',       price:67,   was:null, rating:4.6, reviews:743,  badge:'Cognitive',     badgeC:'#83a598',
    desc:'ACTH(4-7) analog. Upregulates BDNF, neuroprotective. Developed in Russia. Intranasal delivery.', tags:['Cognitive','BDNF','Intranasal'], inStock:true,
    protocol:'Dr. Claire Park cycles 5/2 to prevent receptor downregulation.' },
  { id:5,  cat:'peptides',      name:'Epithalon (10mg)',           brand:'CortixRx',       price:134,  was:159,  rating:4.8, reviews:1203, badge:'Anti-Aging',    badgeC:'#d3869b',
    desc:'Tetrapeptide. Activates telomerase, extends telomere length. Premier longevity peptide.', tags:['Telomeres','Longevity','SubQ'], inStock:false,
    protocol:'Dr. Amir Khan includes in cellular aging protocols.' },
  { id:6,  cat:'peptides',      name:'CJC-1295 / Ipamorelin',     brand:'CortixRx',       price:158,  was:189,  rating:4.9, reviews:2109, badge:'Growth Stack',  badgeC:'#b8bb26',
    desc:'GHRH/GHRP combo. Stimulates natural GH release. Supports body composition and recovery.', tags:['Growth Hormone','Body Comp','SubQ'], inStock:true,
    protocol:'Recommended pre-sleep dosing for optimal GH pulse.' },

  // Nutraceuticals
  { id:7,  cat:'nutraceuticals', name:'NAD+ Precursor Complex',   brand:'BioOptimal',     price:64,   was:79,   rating:4.7, reviews:3241, badge:'HOT',           badgeC:'#fe8019',
    desc:'NMN + NR blend 500mg. Cellular energy, DNA repair, and mitochondrial support. 3rd-party tested.', tags:['NAD+','Mitochondria','Oral'], inStock:true,
    protocol:'Biostarks NAD+ panel recommended before starting cycle.' },
  { id:8,  cat:'nutraceuticals', name:'Magnesium Glycinate 400mg', brand:'PureForm',       price:28,   was:null, rating:4.8, reviews:5672, badge:'Top Rated',     badgeC:'#8ec07c',
    desc:'Chelated magnesium for superior absorption. Sleep quality, cortisol regulation, and muscle function.', tags:['Sleep','Cortisol','Oral'], inStock:true,
    protocol:'Dr. Claire Park includes in evening stack for REM architecture.' },
  { id:9,  cat:'nutraceuticals', name:'Omega-3 EPA/DHA 3g',       brand:'PureForm',       price:42,   was:52,   rating:4.6, reviews:4123, badge:'Inflammation',  badgeC:'#83a598',
    desc:'Ultra-purified fish oil. 1800mg EPA / 1200mg DHA. Supports ApoB reduction and anti-inflammation.', tags:['ApoB','Inflammation','Oral'], inStock:true,
    protocol:'Dr. Rachel Monroe includes in metabolic panel optimization.' },
  { id:10, cat:'nutraceuticals', name:'Berberine HCL 500mg',      brand:'MetaboCore',     price:36,   was:44,   rating:4.7, reviews:2876, badge:'Metabolic',     badgeC:'#fabd2f',
    desc:'Activates AMPK pathway. Supports glucose metabolism, gut health, and lipid profiles.', tags:['AMPK','Glucose','Gut'], inStock:true,
    protocol:'Dr. Amir Khan pairs with ORI metabolic panels for tracking.' },
  { id:11, cat:'nutraceuticals', name:'Copper Bisglycinate 2mg',  brand:'PureForm',       price:18,   was:null, rating:4.5, reviews:891,  badge:'Stack Essential',badgeC:'#fb4934',
    desc:'Chelated copper. Essential GHK-Cu synthesis cofactor. Supports collagen and immune function.', tags:['Collagen','GHK-Cu','Oral'], inStock:true,
    protocol:'Required stack companion with GHK-Cu peptide protocol.' },
  { id:12, cat:'nutraceuticals', name:'Vitamin D3 5000IU + K2',   brand:'BioOptimal',     price:24,   was:29,   rating:4.8, reviews:7341, badge:'Foundation',    badgeC:'#b8bb26',
    desc:'D3 with MK-7 K2 for calcium metabolism. Immune modulation, bone density, metabolic health.', tags:['Immune','Bone','Metabolic'], inStock:true,
    protocol:'Included in all longevity baseline protocols.' },

  // Lab Kits
  { id:13, cat:'lab-kits',      name:'Longevity Baseline Panel',  brand:'SiPhox Health',  price:149,  was:179,  rating:4.9, reviews:1432, badge:'Most Popular',  badgeC:'#8ec07c',
    desc:'60 biomarkers. At-home finger prick. Metabolic, hormonal, inflammatory, and nutritional status.', tags:['60 Markers','At-Home','7–10 Days'], inStock:true,
    protocol:'Recommended starting point for all new CortixHealth patients.' },
  { id:14, cat:'lab-kits',      name:'Advanced Longevity Panel',  brand:'Superpower',     price:349,  was:399,  rating:4.8, reviews:987,  badge:'Most Comprehensive',badgeC:'#fabd2f',
    desc:'100+ biomarkers. Quest Labs draw. ApoB, Lp(a), LDL fractionation, IGF-1, full hormonal.', tags:['100+ Markers','Quest Draw','5–7 Days'], inStock:true,
    protocol:'For patients entering the loading phase or annual deep review.' },
  { id:15, cat:'lab-kits',      name:'NAD+ & Cellular Health',    brand:'Biostarks',      price:199,  was:239,  rating:4.7, reviews:654,  badge:'Best for NAD+', badgeC:'#d3869b',
    desc:'Intracellular NAD+ plus minerals. Cellular resilience, mitochondrial function, methylation.', tags:['NAD+','Minerals','10 Days'], inStock:true,
    protocol:'Biostarks recommended before starting NAD+ supplementation.' },
  { id:16, cat:'lab-kits',      name:'Mobile Phlebotomy Draw',    brand:'Geviti',         price:99,   was:null, rating:4.9, reviews:2341, badge:'Most Convenient',badgeC:'#fe8019',
    desc:'Certified phlebotomist comes to your home. 80 biomarkers. 3–5 day results. HSA/FSA eligible.', tags:['In-Home Draw','80 Markers','3–5 Days'], inStock:true,
    protocol:'CortixHealth LPS network partners for in-home blood draw.' },

  // Devices
  { id:17, cat:'devices',       name:'Continuous Glucose Monitor', brand:'Levels',         price:199,  was:249,  rating:4.8, reviews:3421, badge:'Biohacker Essential',badgeC:'#83a598',
    desc:'Real-time glucose tracking. Identify metabolic response to food, exercise, and stress. 2-week sensor.', tags:['CGM','Glucose','Wearable'], inStock:true,
    protocol:'Dr. Amir Khan uses CGM data in metabolic panel analysis.' },
  { id:18, cat:'devices',       name:'PEMF Recovery Device',      brand:'HigherDose',     price:549,  was:649,  rating:4.6, reviews:876,  badge:'Recovery',      badgeC:'#fabd2f',
    desc:'Pulsed electromagnetic field therapy. Accelerates tissue healing, reduces inflammation, improves sleep.', tags:['PEMF','Recovery','Inflammation'], inStock:true,
    protocol:'Synergistic with BPC-157 / TB-500 tissue repair protocols.' },
  { id:19, cat:'devices',       name:'Red Light Therapy Panel',   brand:'Mito Red',       price:299,  was:369,  rating:4.7, reviews:1243, badge:'Cellular',      badgeC:'#fb4934',
    desc:'660nm + 850nm wavelengths. Mitochondrial activation, collagen stimulation, inflammation reduction.', tags:['Red Light','Mitochondria','Collagen'], inStock:true,
    protocol:'Dr. Sara Voss pairs with soft tissue recovery protocols.' },
  { id:20, cat:'devices',       name:'Oura Ring Gen 4',           brand:'Oura',           price:349,  was:null, rating:4.8, reviews:8932, badge:'Top Rated',     badgeC:'#b8bb26',
    desc:'HRV, sleep staging, body temp, SPO2. The gold standard in longevity wearables. Exports to CortixHealth.', tags:['HRV','Sleep','Wearable'], inStock:true,
    protocol:'Wearable data auto-syncs to your specialist consultation room.' },
]

const CATS = [
  { id:'all',          label:'All Products',  count:PRODUCTS.length },
  { id:'peptides',     label:'Peptides',      count:PRODUCTS.filter(p=>p.cat==='peptides').length },
  { id:'nutraceuticals',label:'Nutraceuticals',count:PRODUCTS.filter(p=>p.cat==='nutraceuticals').length },
  { id:'lab-kits',     label:'Lab Kits',      count:PRODUCTS.filter(p=>p.cat==='lab-kits').length },
  { id:'devices',      label:'Devices & Wearables',count:PRODUCTS.filter(p=>p.cat==='devices').length },
]

const SORT_OPTS = ['Protocol Recommended','Top Rated','Price: Low to High','Price: High to Low','Most Reviewed']

// ─── Components ───────────────────────────────────────────────────────────────
function Stars({ rating }) {
  return (
    <span style={{fontSize:11,color:T.accent,letterSpacing:1}}>
      {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5-Math.floor(rating))}
      <span style={{color:T.textLow,marginLeft:4}}>{rating}</span>
    </span>
  )
}

function Badge({ label, color }) {
  return (
    <span style={{fontSize:9,padding:'2px 7px',borderRadius:4,background:`${color}18`,border:`1px solid ${color}35`,color,fontWeight:800,letterSpacing:'.06em',textTransform:'uppercase',whiteSpace:'nowrap'}}>
      {label}
    </span>
  )
}

function ProductCard({ product, onAdd, inCart }) {
  const [hov, setHov] = useState(false)
  const discount = product.was ? Math.round((1 - product.price/product.was)*100) : null

  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{background:hov?T.cardHov:T.card,border:`1px solid ${hov?T.borderHi:T.border}`,borderRadius:14,overflow:'hidden',transition:'all 0.18s',cursor:'pointer',
        boxShadow:hov?'0 12px 40px rgba(0,0,0,0.5),inset 0 1px 0 rgba(235,219,178,0.12)':'0 4px 16px rgba(0,0,0,0.35),inset 0 1px 0 rgba(235,219,178,0.07)',
        display:'flex',flexDirection:'column',position:'relative'}}>

      {/* Top edge highlight */}
      <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,rgba(235,219,178,0.12),transparent)',pointerEvents:'none'}}/>

      {/* Product visual / icon area */}
      <div style={{height:120,background:`linear-gradient(145deg,rgba(60,56,54,0.8),rgba(40,38,36,0.9))`,display:'flex',alignItems:'center',justifyContent:'center',borderBottom:`1px solid ${T.border}`,position:'relative',flexShrink:0}}>
        {/* Category icon */}
        <div style={{width:60,height:60,borderRadius:16,background:`${product.badgeC}14`,border:`1px solid ${product.badgeC}30`,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`0 0 20px ${product.badgeC}18`}}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={product.badgeC} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            {product.cat==='peptides'&&<><path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/></>}
            {product.cat==='nutraceuticals'&&<><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/></>}
            {product.cat==='lab-kits'&&<><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></>}
            {product.cat==='devices'&&<><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></>}
          </svg>
        </div>
        {discount&&<div style={{position:'absolute',top:10,right:10,fontSize:9,fontWeight:800,padding:'2px 7px',borderRadius:4,background:'rgba(251,73,52,0.2)',border:'1px solid rgba(251,73,52,0.4)',color:'#fb4934'}}>-{discount}%</div>}
        {!product.inStock&&<div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.55)',display:'flex',alignItems:'center',justifyContent:'center',borderRadius:'13px 13px 0 0'}}><span style={{fontSize:11,fontWeight:700,color:T.textLow,letterSpacing:'.08em',textTransform:'uppercase'}}>Out of Stock</span></div>}
      </div>

      {/* Card body */}
      <div style={{padding:'12px 14px',flex:1,display:'flex',flexDirection:'column',gap:6}}>
        <div style={{fontSize:10,color:T.textLow,fontWeight:600,letterSpacing:'.08em',textTransform:'uppercase'}}>{product.brand}</div>
        <div style={{fontSize:13,fontWeight:700,color:T.text,lineHeight:1.35}}>{product.name}</div>
        <Stars rating={product.rating}/>
        <div style={{fontSize:10,color:T.textLow}}>{product.reviews.toLocaleString()} reviews</div>
        <div style={{fontSize:11,color:T.textMid,lineHeight:1.55,flex:1}}>{product.desc}</div>

        {/* Tags */}
        <div style={{display:'flex',gap:4,flexWrap:'wrap',marginTop:2}}>
          {product.tags.map(tag=>(
            <span key={tag} style={{fontSize:9,padding:'2px 6px',borderRadius:4,background:'rgba(235,219,178,0.06)',border:`1px solid ${T.border}`,color:T.textLow,fontWeight:600}}>{tag}</span>
          ))}
        </div>

        {/* Protocol note */}
        <div style={{padding:'7px 10px',borderRadius:8,background:'rgba(250,189,47,0.06)',border:'1px solid rgba(250,189,47,0.14)',marginTop:2}}>
          <div style={{fontSize:9,fontWeight:800,color:'rgba(250,189,47,0.6)',letterSpacing:'.08em',textTransform:'uppercase',marginBottom:2}}>Protocol Note</div>
          <div style={{fontSize:10,color:T.textLow,lineHeight:1.5}}>{product.protocol}</div>
        </div>

        {/* Price + CTA */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:4}}>
          <div>
            <span style={{fontSize:18,fontWeight:800,color:T.accent}}>${product.price}</span>
            {product.was&&<span style={{fontSize:11,color:T.textLow,textDecoration:'line-through',marginLeft:6}}>${product.was}</span>}
          </div>
          <button onClick={e=>{e.stopPropagation();onAdd(product)}} disabled={!product.inStock}
            style={{padding:'7px 14px',borderRadius:8,cursor:product.inStock?'pointer':'not-allowed',
              border:`1px solid ${inCart?'rgba(184,187,38,0.45)':'rgba(250,189,47,0.4)'}`,
              background:inCart?'linear-gradient(135deg,rgba(184,187,38,0.2),rgba(184,187,38,0.1))':'linear-gradient(135deg,rgba(250,189,47,0.22),rgba(215,153,33,0.12))',
              color:inCart?'#b8bb26':T.accent,fontSize:11,fontWeight:800,
              fontFamily:'-apple-system,sans-serif',
              boxShadow:inCart?'0 2px 10px rgba(184,187,38,0.15)':'0 2px 10px rgba(250,189,47,0.15)',
              transition:'all 0.15s',opacity:product.inStock?1:0.4}}>
            {inCart ? '✓ Added' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Cart Drawer ──────────────────────────────────────────────────────────────
function CartDrawer({ items, onRemove, onClose, onCheckout }) {
  const total = items.reduce((a,i)=>a+i.price,0)
  return (
    <div style={{position:'fixed',inset:0,zIndex:200,display:'flex',justifyContent:'flex-end',fontFamily:'-apple-system,sans-serif'}} onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div style={{width:420,background:T.card,borderLeft:`1px solid ${T.borderHi}`,display:'flex',flexDirection:'column',boxShadow:'-20px 0 60px rgba(0,0,0,0.6)',height:'100%'}}>
        <div style={{padding:'18px 20px',borderBottom:`1px solid ${T.border}`,display:'flex',alignItems:'center',justifyContent:'space-between',background:'rgba(0,0,0,0.2)',flexShrink:0}}>
          <div>
            <div style={{fontSize:16,fontWeight:700,color:T.text}}>Your Cart</div>
            <div style={{fontSize:11,color:T.textLow,marginTop:2}}>{items.length} item{items.length!==1?'s':''} · Protocol-aligned stack</div>
          </div>
          <button onClick={onClose} style={{width:28,height:28,borderRadius:8,border:`1px solid ${T.border}`,background:'rgba(255,255,255,0.04)',color:T.textMid,cursor:'pointer',fontSize:16,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'-apple-system,sans-serif'}}>&times;</button>
        </div>

        <div style={{flex:1,overflowY:'auto',padding:'14px 18px'}}>
          {items.length===0 ? (
            <div style={{textAlign:'center',padding:'40px 20px',color:T.textLow}}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(235,219,178,0.2)" strokeWidth="1.5" style={{margin:'0 auto 14px',display:'block'}}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6"/></svg>
              <div style={{fontSize:13,fontWeight:600}}>Your cart is empty</div>
              <div style={{fontSize:11,marginTop:4}}>Add products to build your protocol stack</div>
            </div>
          ) : items.map(item=>(
            <div key={item.id} style={{display:'flex',gap:12,padding:'12px 0',borderBottom:`1px solid ${T.border}`,alignItems:'center'}}>
              <div style={{width:44,height:44,borderRadius:10,background:`${item.badgeC}14`,border:`1px solid ${item.badgeC}25`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={item.badgeC} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  {item.cat==='peptides'&&<><path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/></>}
                  {item.cat==='nutraceuticals'&&<><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/></>}
                  {item.cat==='lab-kits'&&<><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></>}
                  {item.cat==='devices'&&<><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></>}
                </svg>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:12,fontWeight:700,color:T.text,marginBottom:2}}>{item.name}</div>
                <div style={{fontSize:10,color:T.textLow}}>{item.brand}</div>
              </div>
              <div style={{textAlign:'right',flexShrink:0}}>
                <div style={{fontSize:14,fontWeight:800,color:T.accent,marginBottom:4}}>${item.price}</div>
                <button onClick={()=>onRemove(item.id)} style={{fontSize:10,padding:'2px 8px',borderRadius:5,border:`1px solid ${T.border}`,background:'transparent',color:T.textLow,cursor:'pointer',fontFamily:'-apple-system,sans-serif'}}>Remove</button>
              </div>
            </div>
          ))}
        </div>

        {items.length>0&&<>
          {/* Protocol coverage */}
          <div style={{padding:'12px 18px',borderTop:`1px solid ${T.border}`,background:'rgba(0,0,0,0.1)'}}>
            <div style={{fontSize:10,fontWeight:800,color:'rgba(250,189,47,0.6)',letterSpacing:'.08em',textTransform:'uppercase',marginBottom:8}}>Stack Coverage</div>
            {['Tissue Repair','Cognitive Support','Metabolic Optimization','Sleep & Recovery'].map((c,i)=>{
              const fill = [85,60,72,90][i]
              return (
                <div key={c} style={{display:'flex',alignItems:'center',gap:8,marginBottom:5}}>
                  <span style={{fontSize:11,color:T.textLow,width:150,flexShrink:0}}>{c}</span>
                  <div style={{flex:1,height:4,background:'rgba(255,255,255,0.06)',borderRadius:2,overflow:'hidden'}}>
                    <div style={{height:'100%',width:`${fill}%`,background:fill>80?T.green:fill>60?T.accent:'#83a598',borderRadius:2,transition:'width 0.3s'}}/>
                  </div>
                  <span style={{fontSize:10,color:T.textLow,width:30,textAlign:'right'}}>{fill}%</span>
                </div>
              )
            })}
          </div>

          {/* Totals */}
          <div style={{padding:'14px 18px',borderTop:`1px solid ${T.border}`,flexShrink:0}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
              <span style={{fontSize:12,color:T.textLow}}>Subtotal</span>
              <span style={{fontSize:12,color:T.textMid,fontWeight:600}}>${total}</span>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:14}}>
              <span style={{fontSize:12,color:'#8ec07c'}}>Member discount</span>
              <span style={{fontSize:12,color:'#8ec07c',fontWeight:600}}>-${Math.round(total*0.1)}</span>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:16}}>
              <span style={{fontSize:15,fontWeight:700,color:T.text}}>Total</span>
              <span style={{fontSize:18,fontWeight:800,color:T.accent}}>${total - Math.round(total*0.1)}</span>
            </div>
            <button onClick={onCheckout} style={{width:'100%',padding:'13px',borderRadius:10,cursor:'pointer',
              border:'1px solid rgba(250,189,47,0.45)',
              background:'linear-gradient(135deg,rgba(250,189,47,0.24),rgba(215,153,33,0.14))',
              color:T.accent,fontSize:13,fontWeight:800,letterSpacing:'.06em',
              fontFamily:'-apple-system,sans-serif',
              boxShadow:'0 4px 18px rgba(250,189,47,0.2),inset 0 1px 0 rgba(250,189,47,0.25)',
              transition:'all 0.15s'}}>
              Proceed to Checkout
            </button>
            <div style={{textAlign:'center',marginTop:8,fontSize:10,color:T.textLow}}>
              HSA/FSA eligible · Free shipping over $100 · Verified purity guaranteed
            </div>
          </div>
        </>}
      </div>
    </div>
  )
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function MarketplacePage() {
  const [cat, setCat]         = useState('all')
  const [sort, setSort]       = useState('Protocol Recommended')
  const [search, setSearch]   = useState('')
  const [cart, setCart]       = useState([])
  const [showCart, setShowCart] = useState(false)
  const [ordered, setOrdered] = useState(false)
  const [featuredTag, setFeaturedTag] = useState(null)

  const addToCart = (p) => {
    if(!cart.find(i=>i.id===p.id)) setCart(c=>[...c,p])
  }
  const removeFromCart = (id) => setCart(c=>c.filter(i=>i.id!==id))

  const filtered = useMemo(()=>{
    let p = PRODUCTS
    if(cat!=='all') p = p.filter(x=>x.cat===cat)
    if(search) p = p.filter(x=>x.name.toLowerCase().includes(search.toLowerCase())||x.desc.toLowerCase().includes(search.toLowerCase())||x.tags.some(t=>t.toLowerCase().includes(search.toLowerCase())))
    if(featuredTag) p = p.filter(x=>x.tags.some(t=>t===featuredTag))
    if(sort==='Top Rated') p=[...p].sort((a,b)=>b.rating-a.rating)
    else if(sort==='Price: Low to High') p=[...p].sort((a,b)=>a.price-b.price)
    else if(sort==='Price: High to Low') p=[...p].sort((a,b)=>b.price-a.price)
    else if(sort==='Most Reviewed') p=[...p].sort((a,b)=>b.reviews-a.reviews)
    return p
  },[cat,sort,search,featuredTag])

  if(ordered) return (
    <div style={{width:'100vw',height:'100vh',background:T.bg,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'-apple-system,sans-serif'}}>
      <div style={{textAlign:'center',maxWidth:480}}>
        <div style={{width:72,height:72,borderRadius:'50%',background:'rgba(184,187,38,0.12)',border:'1px solid rgba(184,187,38,0.35)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px',fontSize:32,color:'#b8bb26',boxShadow:'0 0 32px rgba(184,187,38,0.2)'}}>✓</div>
        <div style={{fontSize:22,fontWeight:700,color:T.text,marginBottom:8}}>Order Confirmed</div>
        <div style={{fontSize:14,color:T.textMid,lineHeight:1.7,marginBottom:8}}>{cart.length} item{cart.length!==1?'s':''} in your protocol stack. Estimated delivery 3–7 business days.</div>
        <div style={{fontSize:13,color:T.textLow,marginBottom:28}}>Your specialist team has been notified. Protocol tracking will update automatically on delivery.</div>
        <button onClick={()=>{setOrdered(false);setCart([]);setShowCart(false)}} style={{padding:'11px 28px',borderRadius:10,border:'1px solid rgba(250,189,47,0.35)',background:'rgba(250,189,47,0.12)',color:T.accent,fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:'-apple-system,sans-serif'}}>Continue Shopping</button>
      </div>
    </div>
  )

  return (
    <div style={{width:'100vw',height:'100vh',background:T.bg,display:'flex',flexDirection:'column',overflow:'hidden',fontFamily:'-apple-system,sans-serif'}}>
      <style>{`
        .sc::-webkit-scrollbar{width:3px} .sc::-webkit-scrollbar-thumb{background:rgba(235,219,178,0.1);border-radius:2px}
        .cat-btn:hover{background:rgba(235,219,178,0.06)!important;border-color:rgba(235,219,178,0.18)!important}
        input::placeholder{color:#504945}
        .sort-sel{background:#32302f;color:#ebdbb2;border:1px solid rgba(235,219,178,0.14);padding:6px 12px;border-radius:7px;font-size:12px;font-weight:600;cursor:pointer;outline:none;font-family:-apple-system,sans-serif}
        .sort-sel option{background:#32302f;color:#ebdbb2}
      `}</style>

      <TopBar view="list" setView={()=>{}} onUpload={null} searchQuery="" setSearchQuery={()=>{}}/>

      <div style={{flex:1,display:'flex',overflow:'hidden',minHeight:0}}>

        {/* ── LEFT SIDEBAR ── */}
        <div style={{width:240,flexShrink:0,background:T.sidebar,borderRight:`1px solid ${T.border}`,display:'flex',flexDirection:'column',boxShadow:'4px 0 20px rgba(0,0,0,0.4)'}}>
          {/* Store brand */}
          <div style={{padding:'16px 18px',borderBottom:`1px solid ${T.border}`,background:'rgba(0,0,0,0.2)',flexShrink:0}}>
            <div style={{fontSize:15,fontWeight:800,color:T.text,letterSpacing:'.06em'}}>CortixMarket</div>
            <div style={{fontSize:11,color:T.textLow,marginTop:2}}>Protocol-aligned nutraceuticals</div>
          </div>

          {/* Category filter */}
          <div className="sc" style={{flex:1,overflowY:'auto',padding:'12px 8px'}}>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:'.12em',color:T.textLow,textTransform:'uppercase',padding:'6px 10px 8px'}}>Categories</div>
            {CATS.map(c=>(
              <div key={c.id} className="cat-btn" onClick={()=>setCat(c.id)}
                style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'8px 12px',borderRadius:8,cursor:'pointer',marginBottom:2,transition:'all 0.15s',
                  background:cat===c.id?'linear-gradient(135deg,rgba(250,189,47,0.14),rgba(250,189,47,0.07))':'transparent',
                  border:cat===c.id?'1px solid rgba(250,189,47,0.22)':'1px solid transparent'}}>
                <span style={{fontSize:13,fontWeight:cat===c.id?600:400,color:cat===c.id?T.text:T.textMid}}>{c.label}</span>
                <span style={{fontSize:10,padding:'1px 6px',borderRadius:8,background:'rgba(235,219,178,0.07)',border:`1px solid ${T.border}`,color:T.textLow,fontWeight:700}}>{c.count}</span>
              </div>
            ))}

            {/* Protocol tags */}
            <div style={{fontSize:10,fontWeight:700,letterSpacing:'.12em',color:T.textLow,textTransform:'uppercase',padding:'14px 10px 8px',marginTop:4}}>Filter by Goal</div>
            {['Longevity','Recovery','Cognitive','Metabolic','Sleep','Collagen','NAD+','Inflammation'].map(tag=>(
              <div key={tag} onClick={()=>setFeaturedTag(featuredTag===tag?null:tag)}
                style={{display:'flex',alignItems:'center',gap:8,padding:'6px 12px',borderRadius:7,cursor:'pointer',marginBottom:2,transition:'all 0.15s',
                  background:featuredTag===tag?'rgba(250,189,47,0.1)':'transparent',
                  border:featuredTag===tag?'1px solid rgba(250,189,47,0.22)':'1px solid transparent'}}>
                <div style={{width:6,height:6,borderRadius:'50%',background:featuredTag===tag?T.accent:'rgba(235,219,178,0.2)',flexShrink:0}}/>
                <span style={{fontSize:12,color:featuredTag===tag?T.accent:T.textMid,fontWeight:featuredTag===tag?600:400}}>{tag}</span>
              </div>
            ))}

            {/* Trust badges */}
            <div style={{margin:'14px 8px 0',padding:'12px',borderRadius:10,background:'rgba(142,192,124,0.07)',border:'1px solid rgba(142,192,124,0.18)'}}>
              <div style={{fontSize:10,fontWeight:800,color:'#8ec07c',letterSpacing:'.08em',textTransform:'uppercase',marginBottom:8}}>Quality Guarantee</div>
              {['99%+ verified purity','3rd-party tested','COA available','HSA/FSA eligible','Free shipping $100+'].map(b=>(
                <div key={b} style={{display:'flex',gap:6,alignItems:'center',marginBottom:4}}>
                  <span style={{fontSize:10,color:'#8ec07c'}}>✓</span>
                  <span style={{fontSize:11,color:T.textLow}}>{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div style={{flex:1,display:'flex',flexDirection:'column',minWidth:0,overflow:'hidden'}}>

          {/* Top bar — search + sort + cart */}
          <div style={{padding:'12px 20px',borderBottom:`1px solid ${T.border}`,display:'flex',alignItems:'center',gap:12,background:'rgba(0,0,0,0.2)',flexShrink:0,boxShadow:'0 2px 12px rgba(0,0,0,0.3)'}}>
            {/* Search */}
            <div style={{flex:1,position:'relative',maxWidth:480}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(235,219,178,0.3)" strokeWidth="2" style={{position:'absolute',left:11,top:'50%',transform:'translateY(-50%)'}}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search peptides, nutraceuticals, lab kits..."
                style={{width:'100%',padding:'9px 12px 9px 32px',background:'rgba(255,255,255,0.04)',border:`1px solid ${T.border}`,borderRadius:9,color:T.text,fontSize:13,outline:'none',fontFamily:'-apple-system,sans-serif',boxSizing:'border-box'}}/>
            </div>

            <div style={{display:'flex',alignItems:'center',gap:6,flexShrink:0}}>
              <span style={{fontSize:12,color:T.textLow}}>Sort:</span>
              <select className="sort-sel" value={sort} onChange={e=>setSort(e.target.value)}>
                {SORT_OPTS.map(o=><option key={o}>{o}</option>)}
              </select>
            </div>

            <div style={{fontSize:12,color:T.textLow,flexShrink:0}}>
              <span style={{color:T.accent,fontWeight:700}}>{filtered.length}</span> products
            </div>

            {/* Cart button */}
            <button onClick={()=>setShowCart(true)} style={{position:'relative',padding:'8px 14px',borderRadius:9,cursor:'pointer',
              border:`1px solid ${cart.length>0?'rgba(250,189,47,0.4)':T.border}`,
              background:cart.length>0?'rgba(250,189,47,0.12)':'rgba(255,255,255,0.04)',
              color:cart.length>0?T.accent:T.textMid,fontSize:12,fontWeight:700,
              fontFamily:'-apple-system,sans-serif',display:'flex',alignItems:'center',gap:7,
              boxShadow:cart.length>0?'0 2px 10px rgba(250,189,47,0.15)':'none',
              transition:'all 0.15s',flexShrink:0}}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6"/></svg>
              Cart
              {cart.length>0&&<span style={{width:18,height:18,borderRadius:9,background:'#fb4934',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:800,color:'#fff'}}>{cart.length}</span>}
            </button>
          </div>

          {/* Featured banner — protocol stack suggestion */}
          {cat==='all'&&!search&&(
            <div style={{margin:'14px 20px 0',padding:'12px 18px',borderRadius:12,background:'linear-gradient(135deg,rgba(250,189,47,0.08),rgba(250,189,47,0.03))',border:'1px solid rgba(250,189,47,0.2)',display:'flex',alignItems:'center',gap:14,boxShadow:'inset 0 1px 0 rgba(250,189,47,0.08)',flexShrink:0}}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <div style={{flex:1}}>
                <span style={{fontSize:12,fontWeight:700,color:T.accent}}>Dr. Rachel Monroe's Recommended Starter Stack: </span>
                <span style={{fontSize:12,color:T.textMid}}>BPC-157 + TB-500 + Magnesium Glycinate + Omega-3 + Longevity Baseline Panel — complete tissue repair and metabolic baseline in one order.</span>
              </div>
              <button onClick={()=>{PRODUCTS.filter(p=>[1,2,8,9,13].includes(p.id)).forEach(p=>addToCart(p));setShowCart(true)}}
                style={{padding:'6px 14px',borderRadius:7,border:'1px solid rgba(250,189,47,0.35)',background:'rgba(250,189,47,0.14)',color:T.accent,fontSize:11,fontWeight:800,cursor:'pointer',fontFamily:'-apple-system,sans-serif',flexShrink:0,whiteSpace:'nowrap'}}>
                Add All to Cart
              </button>
            </div>
          )}

          {/* Product grid */}
          <div className="sc" style={{flex:1,overflowY:'auto',padding:'16px 20px 20px'}}>
            {filtered.length===0 ? (
              <div style={{textAlign:'center',padding:'60px 20px',color:T.textLow}}>
                <div style={{fontSize:32,marginBottom:12,opacity:0.3}}>◌</div>
                <div style={{fontSize:14,fontWeight:600}}>No products found</div>
                <div style={{fontSize:12,marginTop:4}}>Try a different search or category</div>
              </div>
            ) : (
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:14}}>
                {filtered.map(p=>(
                  <ProductCard key={p.id} product={p} onAdd={addToCart} inCart={!!cart.find(i=>i.id===p.id)}/>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cart Drawer */}
      {showCart&&<CartDrawer items={cart} onRemove={removeFromCart} onClose={()=>setShowCart(false)} onCheckout={()=>{setShowCart(false);setOrdered(true)}}/>}
    </div>
  )
}
