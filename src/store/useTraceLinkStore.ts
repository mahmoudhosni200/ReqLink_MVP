import { create } from 'zustand';
import type { TraceLink, TraceLinkDecision, TraceLinkFilterParams } from '@/types';
import * as traceLinkService from '@/services/traceLinkService';

interface TraceLinkStore {
  traceLinks: TraceLink[];
  selectedLink: TraceLink | null;
  filters: TraceLinkFilterParams;
  isLoading: boolean;
  loadTraceLinks: (projectId: string) => Promise<void>;
  selectLink: (link: TraceLink | null) => void;
  updateDecision: (id: string, decision: TraceLinkDecision) => Promise<void>;
  setFilters: (params: Partial<TraceLinkFilterParams>) => void;
  resetFilters: () => void;
  applyFilters: (projectId: string) => Promise<void>;
}

const defaultFilters: TraceLinkFilterParams = {
  search: '', decision: 'all', confidenceMin: 0, confidenceMax: 1,
  retrievalMethod: 'all', sortBy: 'confidence', sortOrder: 'desc',
};

export const useTraceLinkStore = create<TraceLinkStore>()((set, get) => ({
  traceLinks: [],
  selectedLink: null,
  filters: { ...defaultFilters },
  isLoading: false,

  loadTraceLinks: async (projectId: string) => {
    set({ isLoading: true });
    const traceLinks = await traceLinkService.getTraceLinks(projectId);
    set({ traceLinks, isLoading: false });
  },

  selectLink: (link) => set({ selectedLink: link }),

  updateDecision: async (id: string, decision: TraceLinkDecision) => {
    const updated = await traceLinkService.updateTraceLinkDecision(id, decision);
    if (updated) {
      set(state => ({
        traceLinks: state.traceLinks.map(tl => tl.id === id ? { ...tl, decision } : tl),
        selectedLink: state.selectedLink?.id === id ? { ...state.selectedLink, decision } : state.selectedLink,
      }));
    }
  },

  setFilters: (params) => set(state => ({ filters: { ...state.filters, ...params } })),

  resetFilters: () => set({ filters: { ...defaultFilters } }),

  applyFilters: async (projectId: string) => {
    set({ isLoading: true });
    const traceLinks = await traceLinkService.filterTraceLinks(projectId, get().filters);
    set({ traceLinks, isLoading: false });
  },
}));
