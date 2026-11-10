import { create } from 'zustand';
import type { AnalysisState } from '@/types';
import * as analysisService from '@/services/analysisService';

interface AnalysisStore {
  analysisState: AnalysisState | null;
  isRunning: boolean;
  startAnalysis: (projectId: string) => Promise<void>;
  restartAnalysis: (projectId: string) => Promise<void>;
  cleanup: () => void;
}

export const useAnalysisStore = create<AnalysisStore>()((set) => ({
  analysisState: null,
  isRunning: false,

  startAnalysis: async (projectId: string) => {
    const unsub = analysisService.subscribeToProgress((state) => {
      set({ analysisState: state, isRunning: state.isRunning });
    });
    await analysisService.startAnalysis(projectId);
    // Store unsubscribe for cleanup
    set({ _unsub: unsub } as any);
  },

  restartAnalysis: async (projectId: string) => {
    const unsub = analysisService.subscribeToProgress((state) => {
      set({ analysisState: state, isRunning: state.isRunning });
    });
    await analysisService.restartAnalysis(projectId);
    set({ _unsub: unsub } as any);
  },

  cleanup: () => {
    analysisService.cleanupAnalysis();
    set({ analysisState: null, isRunning: false });
  },
}));
