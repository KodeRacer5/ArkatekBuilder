export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { scoreVerticals } from '@/app/_lib/dreams-scoring'

const INDUSTRY_NAICS = {
  'restaurant':'722','food':'722','cafe':'722','bar':'722','grill':'722',
  'retail':'441','shop':'441','store':'441','boutique':'441',
  'auto':'441','car':'441','dealer':'441','automotive':'441','motor':'441',
  'salon':'812','spa':'812','beauty':'812','barber':'812','nail':'812',
  'medical':'621','health':'621','dental':'621','clinic':'621','chiro':'621',
  'law':'541','legal':'541','attorney':'541',
  'consulting':'541','agency':'541','marketing':'541','design':'541',
  'construction':'236','contractor':'236','plumb':'238','electric':'238','hvac':'238',
  'tech':'541','software':'541',
  'manufacture':'339','manufacturing':'339',
  'gym':'713','fitness':'713','yoga':'713',
  'hotel':'721','motel':'721',
  'insurance':'524','finance':'522',
  'clean':'561','cleaning':'561','janitorial':'561',
  'childcare':'624','daycare':'624',
  'transport':'484','trucking':'484','logistics':'484',
  'realty':'531','real estate':'531',
}
const DEREGULATED_STATES=['TX','OH','PA','IL','NY','NJ','MA','CT','MD','ME','NH','DC','DE','MI','OR']

function guessNAICS(name) {
  const lower = name.toLowerCase()
  for (const [kw,code] of Object.entries(INDUSTRY_NAICS)) {
    if (lower.includes(kw)) return code
  }
  return '812'
}

function guessEmployees(name) {
  const lower = name.toLowerCase()
  if (lower.includes('group')||lower.includes('enterprise')||lower.includes('corp')||lower.includes('holdings')) return '25-49'
  if (lower.includes('llc')||lower.includes('inc')||lower.includes('co.')) return '10-24'
  return '1-9'
}

function guessState(name) {
  const stateMatch = name.match(/\b(AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY|DC)\b/)
  if (stateMatch) return stateMatch[1]
  const cityMap = {
    'oceanside':'CA','san diego':'CA','los angeles':'CA','dallas':'TX','houston':'TX',
    'austin':'TX','chicago':'IL','new york':'NY','miami':'FL','atlanta':'GA',
    'phoenix':'AZ','denver':'CO','seattle':'WA','boston':'MA','nashville':'TN',
  }
  const lower = name.toLowerCase()
  for (const [city,state] of Object.entries(cityMap)) {
    if (lower.includes(city)) return state
  }
  return 'TX' // default — deregulated
}

export async function POST(req) {
  try {
    const { businessName } = await req.json()
    if (!businessName?.trim()) return NextResponse.json({ error: 'Business name required' }, { status: 400 })

    // Simulate ~1.2s search latency for demo realism
    await new Promise(r => setTimeout(r, 1200))

    const naicsCode  = guessNAICS(businessName)
    const state      = guessState(businessName)
    const empBand    = guessEmployees(businessName)
    const isDeregulated = DEREGULATED_STATES.includes(state)
    const name       = businessName.trim()

    const profile = {
      businessName: name,
      naicsCode,
      state,
      estimatedEmployees: empBand,
      isDeregulated,
      entityType: name.toLowerCase().includes('llc') ? 'LLC' :
                  name.toLowerCase().includes('inc') ? 'Inc' :
                  name.toLowerCase().includes('corp') ? 'Corp' : 'Unknown',
      yearFounded: null,
      website: null,
      address: null,
      // All below are gaps — filled during meeting
      monthlyDebt: null, creditScore: null, fundingNeeded: null,
      has401k: null, employerContribution: null,
      monthlyEnergy: null, healthcareCost: null, payrollProvider: null,
      ownOrLease: null, equipmentAge: null, assetInsured: null,
      has1099Workers: null, taxCreditHistory: null,
      hasCyberInsurance: null, hasHIPAA: null, dataBreachPlan: null,
      searchedAt: new Date().toISOString(),
      // Signals found from public data
      signals: {
        deregulatedEnergy: isDeregulated,
        healthcareThreshold: empBand === '25-49' || empBand === '50-99' || empBand === '100+',
        rdEligibleIndustry: ['541','339','621','236'].includes(naicsCode.slice(0,3)),
        setcPotential: empBand === '1-9',
      }
    }

    const scoring = scoreVerticals(profile)
    return NextResponse.json({ profile, ...scoring })
  } catch (err) {
    console.error('[search-business]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
