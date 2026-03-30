'use client'
import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from '../button'

export default function EditModal({ issue, onClose, onSave }) {
  const [form, setForm] = useState({
    title: '', subtitle: '', volume: '', issueDate: '', tags: '', status: 'published'
  })

  useEffect(() => {
    if (issue) setForm({
      title: issue.title || '',
      subtitle: issue.subtitle || '',
      volume: issue.volume || '',
      issueDate: issue.issueDate || '',
      tags: (issue.tags || []).join(', '),
      status: issue.status || 'published',
    })
  }, [issue])

  const handleSave = async () => {
    const payload = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) }
    const res = await fetch(`/api/issues/${issue.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (res.ok) { onSave(await res.json()); onClose() }
  }

  const Field = ({ label, name, type = 'text', placeholder }) => (
    <div>
      <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
      <input type={type} value={form[name]} placeholder={placeholder}
        onChange={e => setForm(p => ({ ...p, [name]: e.target.value }))}
        className="w-full bg-secondary border border-border rounded px-3 py-1.5 text-sm outline-none focus:border-primary transition-colors"
      />
    </div>
  )

  if (!issue) return null
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-display font-semibold text-base">Edit Issue</h2>
          <button onClick={onClose}><X className="size-4 text-muted-foreground" /></button>
        </div>
        <div className="p-5 space-y-3">
          <Field label="Title" name="title" placeholder="Peptide Journal" />
          <Field label="Subtitle" name="subtitle" placeholder="Longevity Protocols" />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Volume / Issue" name="volume" placeholder="Vol. 1 No. 1" />
            <Field label="Issue Date" name="issueDate" type="date" />
          </div>
          <Field label="Tags" name="tags" placeholder="peptides, longevity" />
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Status</label>
            <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
              className="w-full bg-secondary border border-border rounded px-3 py-1.5 text-sm outline-none focus:border-primary">
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-border">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90">Save Changes</Button>
        </div>
      </div>
    </div>
  )
}





