import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useDreamsStore = create(
  persist(
    (set) => ({
      businessName: '',
      searchStatus: 'idle', // idle | searching | complete | error
      searchError: null,
      profile: null,
      verticals: {
        D: { label: 'Debt',       color: '#fb4934', score: 0, confidence: 'none', gaps: [], found: {}, filled: {} },
        R: { label: 'Retirement', color: '#d3869b', score: 0, confidence: 'none', gaps: [], found: {}, filled: {} },
        E: { label: 'Expenses',   color: '#fabd2f', score: 0, confidence: 'none', gaps: [], found: {}, filled: {} },
        A: { label: 'Assets',     color: '#8ec07c', score: 0, confidence: 'none', gaps: [], found: {}, filled: {} },
        M: { label: 'Money',      color: '#83a598', score: 0, confidence: 'none', gaps: [], found: {}, filled: {} },
        S: { label: 'Security',   color: '#b8bb26', score: 0, confidence: 'none', gaps: [], found: {}, filled: {} },
      },
      gapList: [],
      dreamScore: null,
      totalSavings: null,
      savingsBreakdown: {},
      phase: 'search',
      chatMessages: [],
      nodePositions: {},

      setBusinessName: (name) => set({ businessName: name }),
      setSearchStatus: (s) => set({ searchStatus: s }),
      setSearchError: (e) => set({ searchError: e }),
      setProfile: (profile) => set({ profile }),
      setVerticals: (verticals) => set({ verticals }),
      setGapList: (gapList) => set({ gapList }),
      setDreamScore: (score) => set({ dreamScore: score }),
      setTotalSavings: (total, breakdown) => set({ totalSavings: total, savingsBreakdown: breakdown }),
      setPhase: (phase) => set({ phase }),
      addChatMessage: (msg) => set(state => ({
        chatMessages: [...state.chatMessages, { ...msg, id: Date.now(), ts: new Date().toISOString() }]
      })),
      clearChat: () => set({ chatMessages: [] }),
      saveNodePosition: (id, position) => set(state => ({
        nodePositions: { ...state.nodePositions, [id]: position }
      })),
      fillGap: (verticalKey, field, value) => set(state => ({
        verticals: {
          ...state.verticals,
          [verticalKey]: {
            ...state.verticals[verticalKey],
            filled: { ...state.verticals[verticalKey].filled, [field]: value },
            gaps: state.verticals[verticalKey].gaps.filter(g => g.field !== field),
          }
        }
      })),

      reset: () => set({
        businessName: '', searchStatus: 'idle', searchError: null,
        profile: null, gapList: [], dreamScore: null,
        totalSavings: null, savingsBreakdown: {}, phase: 'search', chatMessages: [],
        verticals: {
          D: { label: 'Debt',       color: '#fb4934', score: 0, confidence: 'none', gaps: [], found: {}, filled: {} },
          R: { label: 'Retirement', color: '#d3869b', score: 0, confidence: 'none', gaps: [], found: {}, filled: {} },
          E: { label: 'Expenses',   color: '#fabd2f', score: 0, confidence: 'none', gaps: [], found: {}, filled: {} },
          A: { label: 'Assets',     color: '#8ec07c', score: 0, confidence: 'none', gaps: [], found: {}, filled: {} },
          M: { label: 'Money',      color: '#83a598', score: 0, confidence: 'none', gaps: [], found: {}, filled: {} },
          S: { label: 'Security',   color: '#b8bb26', score: 0, confidence: 'none', gaps: [], found: {}, filled: {} },
        },
      }),
    }),
    { name: 'arkatek_dreams_store' }
  )
)
