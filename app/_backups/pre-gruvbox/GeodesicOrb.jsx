'use client'
import { useEffect, useRef } from 'react'

const VARIANTS = [
  { fn: 'latlon', ls: 20, lo: 30, tX: 0.45, speed: 0.6, thresh: 0.75, ea: 0.55, ns: 1.4, na: 0.75 },
  { fn: 'ico',                     tX: 0.45, speed: 0.5, thresh: 0.85, ea: 0.5,  ns: 1.3, na: 0.85 },
  { fn: 'latlon', ls: 15, lo: 20, tX: 0.5,  speed: 0.55,thresh: 0.7,  ea: 0.4,  ns: 2.4, na: 0.9  },
  { fn: 'pulse',  ls: 20, lo: 30, tX: 0.45, speed: 0.6, thresh: 0.75, ea: 0.28, ns: 1.4, na: 0.95 },
  { fn: 'latlon', ls: 30, lo: 45, tX: 0.45, speed: 0.5, thresh: 1.1,  ea: 0.45, ns: 2.6, na: 0.85 },
  { fn: 'dual'                                                                                       },
]

const LABELS = [
  'St. Petersburg Institute of\nBioregulation & Gerontology',
  'S.M. Kirov Military\nMedical Academy',
  'N.N. Petrov Research\nInstitute of Oncology',
  'Chita State\nMedical Academy',
  'V.P. Kukhar Institute of\nBioorganic Chemistry',
  'Roumen Tsanev\nBulgarian Academy of Sciences',
]

function proj(x,y,z,tX,tY){
  const y2=y*Math.cos(tX)-z*Math.sin(tX),z2=y*Math.sin(tX)+z*Math.cos(tX)
  const x3=x*Math.cos(tY)+z2*Math.sin(tY),z3=-x*Math.sin(tY)+z2*Math.cos(tY)
  const s=340/(340+z3*0.35)
  return{px:x3*s,py:y2*s,z:z3}
}
function latLon(R,ls,lo){
  const v=[]
  for(let lat=-80;lat<=80;lat+=ls)
    for(let lon=0;lon<360;lon+=lo){
      const phi=(90-lat)*Math.PI/180,th=lon*Math.PI/180
      v.push({x:R*Math.sin(phi)*Math.cos(th),y:R*Math.sin(phi)*Math.sin(th),z:R*Math.cos(phi)})
    }
  return v
}
function icoV(R){
  const ph=(1+Math.sqrt(5))/2
  const b=[[0,1,ph],[0,-1,ph],[0,1,-ph],[0,-1,-ph],[1,ph,0],[-1,ph,0],[1,-ph,0],[-1,-ph,0],[ph,0,1],[-ph,0,1],[ph,0,-1],[-ph,0,-1]]
  const v=b.map(([x,y,z])=>{const n=Math.sqrt(x*x+y*y+z*z);return{x:x/n*R,y:y/n*R,z:z/n*R}})
  const s=[]
  for(let i=0;i<v.length;i++)for(let j=i+1;j<v.length;j++){
    const m={x:(v[i].x+v[j].x)/2,y:(v[i].y+v[j].y)/2,z:(v[i].z+v[j].z)/2}
    const n=Math.sqrt(m.x*m.x+m.y*m.y+m.z*m.z)
    if(n>0)s.push({x:m.x/n*R,y:m.y/n*R,z:m.z/n*R})
  }
  return[...v,...s]
}
function drawE(ctx,verts,R,tX,tY,cx,cy,thresh,ea){
  for(let i=0;i<verts.length;i++)for(let j=i+1;j<verts.length;j++){
    const dx=verts[i].x-verts[j].x,dy=verts[i].y-verts[j].y,dz=verts[i].z-verts[j].z
    if(dx*dx+dy*dy+dz*dz<thresh*thresh*R*R){
      const pa=proj(verts[i].x,verts[i].y,verts[i].z,tX,tY)
      const pb=proj(verts[j].x,verts[j].y,verts[j].z,tX,tY)
      const a=ea*(0.3+(Math.max(pa.z,pb.z)/R+1)*0.5)
      ctx.beginPath();ctx.moveTo(cx+pa.px,cy+pa.py);ctx.lineTo(cx+pb.px,cy+pb.py)
      ctx.strokeStyle=`rgba(255,255,255,${a})`;ctx.lineWidth=0.55;ctx.stroke()
    }
  }
}
function drawN(ctx,verts,R,tX,tY,cx,cy,ns,na,pt){
  verts.forEach((v,idx)=>{
    const p=proj(v.x,v.y,v.z,tX,tY)
    let a,sz
    if(pt!==undefined){
      const pu=0.5+0.5*Math.sin(pt+idx*0.8)
      a=na*(0.15+pu*0.7*(0.3+(p.z/R+1)*0.4))
      sz=ns*(0.8+pu*2.0*(0.5+p.z/R*0.4))
    }else{
      a=na*(0.2+(p.z/R+1)*0.55)
      sz=ns*(0.7+p.z/R*0.5)
    }
    ctx.beginPath();ctx.arc(cx+p.px,cy+p.py,Math.max(0.3,sz),0,Math.PI*2)
    ctx.fillStyle=`rgba(255,255,255,${a})`;ctx.fill()
  })
}

function SingleOrb({ variant, size }) {
  const canvasRef = useRef(null)
  const animRef = useRef(null)
  const rotRef = useRef(0)
  const timeRef = useRef(0)
  const sc = size / 200
  const R = 80 * sc
  const cx = size / 2, cy = size / 2

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    function loop() {
      rotRef.current += 0.006
      timeRef.current += 0.04
      const r = rotRef.current, t = timeRef.current
      ctx.clearRect(0, 0, size, size)
      if (variant === 5) {
        const v1 = latLon(R, 20, 30)
        drawE(ctx,v1,R,0.45,r*0.6,cx,cy,0.75,0.4)
        drawN(ctx,v1,R,0.45,r*0.6,cx,cy,1.2*sc,0.85)
        const v2 = latLon(R*0.6, 25, 40)
        drawE(ctx,v2,R*0.6,0.55,-r*0.4,cx,cy,0.85,0.7)
        drawN(ctx,v2,R*0.6,0.55,-r*0.4,cx,cy,1.8*sc,0.85)
      } else {
        const cfg = VARIANTS[variant]
        const verts = cfg.fn === 'ico' ? icoV(R) : latLon(R, cfg.ls, cfg.lo)
        drawE(ctx,verts,R,cfg.tX,r*cfg.speed,cx,cy,cfg.thresh,cfg.ea)
        drawN(ctx,verts,R,cfg.tX,r*cfg.speed,cx,cy,cfg.ns*sc,cfg.na, cfg.fn==='pulse'?t:undefined)
      }
      animRef.current = requestAnimationFrame(loop)
    }
    loop()
    return () => cancelAnimationFrame(animRef.current)
  }, [size, variant])

  return <canvas ref={canvasRef} width={size} height={size} style={{ display: 'block' }} />
}

export default function GeodesicOrbRow({ size = 110 }) {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', justifyContent: 'center', flexWrap: 'wrap' }}>
      {VARIANTS.map((_, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <SingleOrb variant={i} size={size} />
          <div style={{
            fontSize: 14, fontWeight: 600, letterSpacing: '0.05em',
            color: 'rgba(255,255,255,0.75)', textTransform: 'none',
            textAlign: 'center', maxWidth: size, lineHeight: 1.5,
            whiteSpace: 'pre-line',
          }}>
            {LABELS[i]}
          </div>
        </div>
      ))}
    </div>
  )
}


