import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useMetoStore = create(
  persist(
    (set) => ({
      results: null,       // last scoring output
      form: null,          // last submitted form
      hasResults: false,

      setResults: (results, form) => set({ results, form, hasResults: true }),
      clearResults: () => set({ results: null, form: null, hasResults: false }),
    }),
    { name: 'pj_meto_store' }
  )
)
