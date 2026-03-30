// DREAMS Savings Scoring Engine
// Maps business profile data to D.R.E.A.M.S. vertical scores + gap analysis

const DEREGULATED_STATES = ['TX','OH','PA','IL','NY','NJ','MA','CT','MD','ME','NH','DC','DE','MI','OR']

const NAICS_VERTICALS = {
  '44': { name:'Retail', rdEligible: false, avgEmployees: 15 },
  '45': { name:'Retail', rdEligible: false, avgEmployees: 12 },
  '72': { name:'Food & Hospitality', rdEligible: false, avgEmployees: 25 },
  '54': { name:'Professional Services', rdEligible: true,  avgEmployees: 8  },
  '62': { name:'Healthcare', rdEligible: true,  avgEmployees: 20 },
  '81': { name:'Personal Services', rdEligible: false, avgEmployees: 6  },
  '23': { name:'Construction', rdEligible: true,  avgEmployees: 18 },
  '33': { name:'Manufacturing', rdEligible: true,  avgEmployees: 40 },
  '52': { name:'Finance & Insurance', rdEligible: false, avgEmployees: 10 },
  '56': { name:'Administrative', rdEligible: false, avgEmployees: 22 },
}

export function scoreVerticals(profile) {
  const { state, naicsCode, estimatedEmployees, website, entityType, yearFounded } = profile
  const naics2 = naicsCode ? naicsCode.slice(0, 2) : null
  const naicsData = NAICS_VERTICALS[naics2] || {}
  const empCount = parseEmployeeCount(estimatedEmployees)
  const isDeregulated = DEREGULATED_STATES.includes(state)
  const age = yearFounded ? new Date().getFullYear() - parseInt(yearFounded) : null

  const verticals = {}

  // ── D: DEBT ──────────────────────────────────────────────────────────────────
  const debtFound = { entityType, age, empCount }
  const debtGaps = []
  if (!profile.monthlyDebt) debtGaps.push({ field: 'monthlyDebt', question: 'What is your current monthly debt service?' })
  if (!profile.creditScore) debtGaps.push({ field: 'creditScore', question: 'Do you know the business credit score?' })
  if (!profile.fundingNeeded) debtGaps.push({ field: 'fundingNeeded', question: 'Are you looking to access capital or restructure existing debt?' })
  const debtScore = scoreFromGaps(debtGaps, 3, age > 2 ? 30 : 10)
  verticals.D = {
    label: 'Debt', color: '#fb4934',
    score: debtScore,
    confidence: gapConfidence(debtGaps, 3),
    gaps: debtGaps,
    found: debtFound,
    filled: {},
    projectedSavings: estimateSavings('D', empCount, debtScore),
  }

  // ── R: RETIREMENT ────────────────────────────────────────────────────────────
  const retGaps = []
  if (!profile.has401k) retGaps.push({ field: 'has401k', question: 'Do you currently offer a 401(k) or retirement plan?' })
  if (!profile.employerContribution) retGaps.push({ field: 'employerContribution', question: 'What is your current employer contribution rate?' })
  if (empCount < 10) retGaps.push({ field: 'growthPlan', question: 'Do you plan to hire in the next 12 months?' })
  const retScore = scoreFromGaps(retGaps, 3, empCount >= 10 ? 40 : 20)
  verticals.R = {
    label: 'Retirement', color: '#d3869b',
    score: retScore,
    confidence: gapConfidence(retGaps, 3),
    gaps: retGaps,
    found: { empCount, naicsData },
    filled: {},
    projectedSavings: estimateSavings('R', empCount, retScore),
  }

  // ── E: EXPENSES ──────────────────────────────────────────────────────────────
  const expGaps = []
  if (!profile.monthlyEnergy)  expGaps.push({ field: 'monthlyEnergy',  question: 'What is the average monthly energy bill?' })
  if (!profile.healthcareCost) expGaps.push({ field: 'healthcareCost', question: 'What does the business currently pay per employee for benefits?' })
  if (!profile.payrollProvider) expGaps.push({ field: 'payrollProvider', question: 'Who handles payroll processing?' })
  const expScore = scoreFromGaps(expGaps, 3, isDeregulated ? 50 : 30)
  verticals.E = {
    label: 'Expenses', color: '#fabd2f',
    score: expScore,
    confidence: gapConfidence(expGaps, 3),
    gaps: expGaps,
    found: { isDeregulated, state, empCount },
    filled: {},
    projectedSavings: estimateSavings('E', empCount, expScore),
  }

  // ── A: ASSETS ────────────────────────────────────────────────────────────────
  const assetGaps = []
  if (!profile.ownOrLease)   assetGaps.push({ field: 'ownOrLease',   question: 'Do you own or lease your business location?' })
  if (!profile.equipmentAge) assetGaps.push({ field: 'equipmentAge', question: 'How old is your primary equipment?' })
  if (!profile.assetInsured) assetGaps.push({ field: 'assetInsured', question: 'Are your key business assets currently insured?' })
  const assetScore = scoreFromGaps(assetGaps, 3, 20)
  verticals.A = {
    label: 'Assets', color: '#8ec07c',
    score: assetScore,
    confidence: gapConfidence(assetGaps, 3),
    gaps: assetGaps,
    found: { entityType, naicsData },
    filled: {},
    projectedSavings: estimateSavings('A', empCount, assetScore),
  }

  // ── M: MONEY ─────────────────────────────────────────────────────────────────
  const moneyGaps = []
  const rdEligible = naicsData.rdEligible || false
  if (!profile.has1099Workers) moneyGaps.push({ field: 'has1099Workers', question: 'Do you use any 1099 / self-employed workers?' })
  if (!profile.taxCreditHistory) moneyGaps.push({ field: 'taxCreditHistory', question: 'Have you ever claimed R&D or SETC tax credits?' })
  const moneyScore = scoreFromGaps(moneyGaps, 2, rdEligible ? 60 : 35)
  verticals.M = {
    label: 'Money', color: '#83a598',
    score: moneyScore,
    confidence: gapConfidence(moneyGaps, 2),
    gaps: moneyGaps,
    found: { rdEligible, naicsCode, naicsData },
    filled: {},
    projectedSavings: estimateSavings('M', empCount, moneyScore),
  }

  // ── S: SECURITY ──────────────────────────────────────────────────────────────
  const secGaps = []
  if (!profile.hasCyberInsurance) secGaps.push({ field: 'hasCyberInsurance', question: 'Do you carry cyber liability insurance?' })
  if (!profile.hasHIPAA && naics2 === '62') secGaps.push({ field: 'hasHIPAA', question: 'Are you HIPAA compliant?' })
  if (!profile.dataBreachPlan) secGaps.push({ field: 'dataBreachPlan', question: 'Do you have a data breach response plan?' })
  const secScore = scoreFromGaps(secGaps, 3, 25)
  verticals.S = {
    label: 'Security', color: '#b8bb26',
    score: secScore,
    confidence: gapConfidence(secGaps, 3),
    gaps: secGaps,
    found: { naics2, website: !!website },
    filled: {},
    projectedSavings: estimateSavings('S', empCount, secScore),
  }

  // ── DREAM SCORE ──────────────────────────────────────────────────────────────
  const scores = Object.values(verticals).map(v => v.score)
  const dreamScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  const totalSavings = Object.values(verticals).reduce((a, v) => a + (v.projectedSavings || 0), 0)
  const savingsBreakdown = Object.fromEntries(Object.entries(verticals).map(([k, v]) => [k, v.projectedSavings]))

  // ── GAP LIST — priority order ────────────────────────────────────────────────
  const allGaps = Object.entries(verticals).flatMap(([key, v]) =>
    v.gaps.map(g => ({ ...g, vertical: key, verticalLabel: v.label, color: v.color }))
  )

  return { verticals, dreamScore, totalSavings, savingsBreakdown, gapList: allGaps }
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function parseEmployeeCount(band) {
  if (!band) return 5
  if (band === '1-9') return 5
  if (band === '10-24') return 17
  if (band === '25-49') return 37
  if (band === '50-99') return 75
  if (band === '100+') return 150
  const n = parseInt(band)
  return isNaN(n) ? 10 : n
}

function scoreFromGaps(gaps, totalFields, baseScore) {
  const filled = totalFields - gaps.length
  const completeness = filled / totalFields
  return Math.round(baseScore + completeness * (100 - baseScore))
}

function gapConfidence(gaps, totalFields) {
  const filled = totalFields - gaps.length
  const pct = filled / totalFields
  if (pct >= 0.85) return 'high'
  if (pct >= 0.5)  return 'medium'
  if (pct > 0)     return 'low'
  return 'none'
}

function estimateSavings(vertical, empCount, score) {
  const emp = empCount || 10
  const multipliers = { D: 800, R: 650, E: 420, A: 300, M: 950, S: 250 }
  const base = (multipliers[vertical] || 400) * Math.max(emp * 0.8, 1)
  return Math.round(base * (score / 100) * (0.7 + Math.random() * 0.3))
}
