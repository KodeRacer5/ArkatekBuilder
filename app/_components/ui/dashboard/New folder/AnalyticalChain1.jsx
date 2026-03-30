'use client'
import React, { useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import {
  ReactFlow, Background, Handle, Position,
  useNodesState, useEdgesState, addEdge,
  ReactFlowProvider, useReactFlow,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

const TYPE_META = {
  user:          { label: 'User',          icon: '👤', color: '#2563eb' },
  frontend:      { label: 'Frontend',      icon: '📦', color: '#7c3aed' },
  server:        { label: 'Server',        icon: '☰',  color: '#0f766e' },
  load_balancer: { label: 'Load Balancer', icon: '⇄',  color: '#b45309' },
  cache:         { label: 'Cache',         icon: '⚡', color: '#be185d' },
  database:      { label: 'Database',      icon: '🗄', color: '#15803d' },
  auth_service:  { label: 'Auth Service',  icon: '🔒', color: '#b91c1c' },
  analytics:     { label: 'Analytics',     icon: '📊', color: '#0369a1' },
  api_gateway:   { label: 'API Gateway',   icon: '🌐', color: '#4338ca' },
  api:           { label: 'API',           icon: '🌐', color: '#4338ca' },
  file_storage:  { label: 'File Storage',  icon: '📁', color: '#6b7280' },
  logging:       { label: 'Logging',       icon: '📝', color: '#92400e' },
}

function ChainNode({ data }) {
  const meta = TYPE_META[data.type] || { label: data.type, icon: '⚙', color: '#374151' }
  return (
    <div style={{ background:'var(--gb-bg-soft)', border:'1.5px solid rgba(255,255,255,0.25)',
      borderRadius:14, minWidth:160, maxWidth:180, boxShadow:'0 4px 20px rgba(0,0,0,0.5)',
      fontFamily:'-apple-system,system-ui,sans-serif', cursor:'grab' }}>
      <Handle type="target" position={Position.Left}
        style={{ width:8, height:8, background:'var(--gb-bg-1)', border:'2px solid rgba(255,255,255,0.5)', borderRadius:'50%' }} />
      <Handle type="source" position={Position.Right}
        style={{ width:8, height:8, background:'var(--gb-bg-1)', border:'2px solid rgba(255,255,255,0.5)', borderRadius:'50%' }} />
      <div style={{ padding:'8px 12px', display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ width:28, height:28, borderRadius:8, flexShrink:0,
          background: `${meta.color}22`, border:`1px solid ${meta.color}66`,
          display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>
          {meta.icon}
        </div>
        <div style={{ overflow:'hidden', flex:1 }}>
          <div style={{ fontSize:13, fontWeight:600, color:'#fff', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{data.label}</div>
          <div style={{ fontSize:10, color:`${meta.color}cc`, marginTop:1 }}>{meta.label}</div>
        </div>
      </div>
    </div>
  )
}

const nodeTypes = { chain: ChainNode }

export default function AnalyticalChain({ height = 420 }) {
  return (
    <ReactFlowProvider>
      <AnalyticalChainInner height={height} />
    </ReactFlowProvider>
  )
}

function AnalyticalChainInner({ height }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [ready, setReady] = React.useState(false)
  const { setViewport, getViewport } = useReactFlow()
  const onConnect = useCallback(p => setEdges(e => addEdge(p, e)), [setEdges])

  useEffect(() => {
    fetch('/templates/cortix_biohacker_chain.json')
      .then(r => r.json())
      .then(data => {
        setNodes(data.components.map(c => ({
          id: c.id, type: 'chain', position: c.position,
          data: { label: c.name, type: c.type },
        })))
        setEdges(data.connections.map((conn, i) => ({
          id: `e${i}`, source: conn.from, target: conn.to,
          label: conn.label || '', type: 'smoothstep', animated: true,
          style: { stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1.5 },
          labelStyle: { fill: 'rgba(255,255,255,0.5)', fontSize: 9, fontWeight: 500 },
          labelBgStyle: { fill: 'transparent', fillOpacity: 0 },
          labelBgPadding: [0, 0],
        })))
        setReady(true)
      })
  }, [setNodes, setEdges])

  useEffect(() => {
    if (!ready) return
    const saved = localStorage.getItem('pj_chain_viewport')
    const vp = saved ? JSON.parse(saved) : { x: -120, y: 10, zoom: 0.55 }
    setTimeout(() => setViewport(vp), 50)
  }, [ready, setViewport])

  const handleSave = useCallback(() => {
    const vp = getViewport()
    localStorage.setItem('pj_chain_viewport', JSON.stringify(vp))
    localStorage.setItem('pj_chain_nodes', JSON.stringify(nodes))
    alert('Layout saved')
  }, [getViewport, nodes])

  return (
    <div style={{ width: '100%', height, position: 'relative' }}>
      <style>{`.analytical-chain .react-flow__attribution{display:none}.analytical-chain .react-flow__edge.animated path{animation-duration:3s}`}</style>
      <div className="analytical-chain" style={{ width: '100%', height: '100%' }}>
        {ready && (
          <ReactFlow nodes={nodes} edges={edges}
            onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
            onConnect={onConnect} nodeTypes={nodeTypes}
            nodesDraggable={true} nodesConnectable={true}
            elementsSelectable={true} panOnDrag={true} zoomOnScroll={true}
            proOptions={{ hideAttribution: true }}>
            <Background color="rgba(255,255,255,0.06)" gap={20} />
          </ReactFlow>
        )}
      </div>
      {ready && typeof document !== 'undefined' && createPortal(
        <button onClick={handleSave} style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 99999,
          background: 'rgba(20,22,30,0.95)', border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: 7, color: '#fff', fontSize: 11, fontWeight: 700,
          letterSpacing: '0.12em', padding: '7px 16px', cursor: 'pointer',
          textTransform: 'uppercase', backdropFilter: 'blur(12px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
        }}>Save Layout</button>,
        document.body
      )}
    </div>
  )
}





