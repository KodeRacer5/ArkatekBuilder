'use client'
import TopBar from '@/app/_components/ui/dashboard/top-bar'
import dynamic from 'next/dynamic'
import { useShelfTheme } from '@/app/_providers/shelf-theme-context'
const AnalyticalChain = dynamic(() => import('@/app/_components/ui/dashboard/AnalyticalChain'), { ssr: false })

const ACCENT = '#00e5ff'

const PUBLICATIONS = [
  { id: 1, title: 'GLP-1 Receptor Agonist Synergies with Bioactive Peptide Stacks', authors: 'CortixEngine Research Division', year: 2025, category: 'Metabolic Optimization', abstract: 'Systematic review of GLP-1 co-administration with BPC-157 and TB-500. Observed enhanced mucosal repair and attenuated GI side effects at therapeutic doses.' },
  { id: 2, title: 'BPC-157 Tissue Repair Cascade: Mechanistic Mapping', authors: 'CortixEngine Research Division', year: 2025, category: 'Tissue Repair', abstract: 'Detailed mechanistic analysis of BPC-157 cytoprotective pathways including NO system modulation, VEGFR2 upregulation, and fibroblast recruitment in musculoskeletal injury models.' },
  { id: 3, title: 'IGF-1/GH Stack Periodization for Lean Tissue Accrual', authors: 'CortixEngine Research Division', year: 2024, category: 'Anabolics & Recovery', abstract: 'Protocol design for pulsatile IGF-1 LR3 + GHRP-6 cycling with structured deload phases. Includes biomarker tracking intervals and contraindication screening criteria.' },
]

const PROTOCOL_TABLE = [
  { peptide: 'BPC-157', dose: '250–500 mcg', route: 'Subcutaneous', frequency: 'Daily AM fasted', cycle: '8 weeks on / 4 off' },
  { peptide: 'TB-500', dose: '2 mg', route: 'Subcutaneous', frequency: '2x / week', cycle: '8 weeks on / 4 off' },
  { peptide: 'IGF-1 LR3', dose: '50–100 mcg', route: 'Subcutaneous', frequency: 'Post-workout', cycle: '4 weeks on / 4 off' },
  { peptide: 'GHRP-6', dose: '100 mcg', route: 'Subcutaneous', frequency: '3x daily pre-meal', cycle: '12 weeks on / 4 off' },
]





