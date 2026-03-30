'use client'
import { useState, useRef } from 'react'
import { X, Upload, FileText } from 'lucide-react'
import { Button } from '../button'

export default function UploadModal({ onClose, onSuccess }) {
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({ title: '', subtitle: '', volume: '', issueDate: '', tags: '' })
  const inputRef = useRef()

  const handleFile = (f) => {
    if (f?.type === 'application/pdf') setFile(f)
  }

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  const handleSubmit = async () => {
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    Object.entries(form).forEach(([k, v]) => fd.append(k, v))
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (res.ok) { onSuccess(data); onClose() }
    } catch (e) { console.error(e) }
    setUploading(false)
  }

  const Field = ({ label, name, type = 'text', placeholder }) => (
    <div>
      <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
      <input
        type={type} value={form[name]} placeholder={placeholder}
        onChange={e => setForm(p => ({ ...p, [name]: e.target.value }))}
        className="w-full bg-secondary border border-border rounded px-3 py-1.5 text-sm outline-none focus:border-primary transition-colors"
      />
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-display font-semibold text-base">New Publication</h2>
          <button onClick={onClose}><X className="size-4 text-muted-foreground" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current.click()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${dragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
          >
            <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={e => handleFile(e.target.files[0])} />
            {file ? (
              <div className="flex items-center justify-center gap-2 text-sm">
                <FileText className="size-5 text-primary" />
                <span className="font-medium">{file.name}</span>
                <span className="text-muted-foreground">({(file.size / 1024 / 1024).toFixed(1)}MB)</span>
              </div>
            ) : (
              <div className="text-muted-foreground text-sm space-y-1">
                <Upload className="size-8 mx-auto mb-2 opacity-40" />
                <p>Drag & drop PDF or <span className="text-primary">browse</span></p>
              </div>
            )}
          </div>
          <Field label="Title" name="title" placeholder="Peptide Journal — July 2026" />
          <Field label="Subtitle" name="subtitle" placeholder="Longevity Protocols & Cellular Resets" />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Volume / Issue" name="volume" placeholder="Vol. 1 No. 3" />
            <Field label="Issue Date" name="issueDate" type="date" />
          </div>
          <Field label="Tags (comma separated)" name="tags" placeholder="peptides, longevity, protocols" />
        </div>
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-border">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!file || uploading} className="bg-primary text-primary-foreground hover:bg-primary/90">
            {uploading ? 'Publishing...' : 'Publish'}
          </Button>
        </div>
      </div>
    </div>
  )
}





