import { create } from 'zustand';
import type { TraceLink, TraceLinkFilterParams } from '@/types';
import * as traceLinkService from '@/services/traceLinkService';

interface TraceLinkStore {
  traceLinks: TraceLink[];
  selectedLink: TraceLink | null;
  filters: TraceLinkFilterParams;
  isLoading: boolean;
  loadTraceLinks: (projectId: string) => Promise<void>;
  selectLink: (link: TraceLink | null) => void;
  setFilters: (params: Partial<TraceLinkFilterParams>) => void;
  resetFilters: () => void;
  applyFilters: (projectId: string) => Promise<void>;
}

const defaultFilters: TraceLinkFilterParams = {
  search: '',
  retrievalMethod: 'all',
  sortBy: 'requirement',
  sortOrder: 'asc',
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

  setFilters: (params) => set(state => ({ filters: { ...state.filters, ...params } })),

  resetFilters: () => set({ filters: { ...defaultFilters } }),

  applyFilters: async (projectId: string) => {
    set({ isLoading: true });
    const traceLinks = await traceLinkService.filterTraceLinks(projectId, get().filters);
    set({ traceLinks, isLoading: false });
  },
}));
