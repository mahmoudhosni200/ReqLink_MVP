import type { AnalysisState, AnalysisStage } from '@/types';
import { updateProjectStatus, getProject } from './projectService';

const STAGES: Omit<AnalysisStage, 'status' | 'progress'>[] = [
  { id: 0, name: 'Parsing source code', description: 'AST-based parsing of Java source files into atomic code units', detail: 'Parsed 24 files, extracted 20 code units' },
  { id: 1, name: 'Building dependency graph', description: 'Constructing call, inheritance, interface, import, and field-type edges', detail: 'Built graph with 15 nodes and 20 edges' },
  { id: 2, name: 'Generating code summaries', description: 'Hierarchical LLM summarization at method, class, and package levels', detail: 'Generated 20 summaries (method: 12, class: 8)' },
  { id: 3, name: 'Embedding code & requirements', description: 'Computing semantic embeddings for code summaries and requirements', detail: 'Embedded 32 items into vector space' },
  { id: 4, name: 'Retrieving candidates', description: 'Semantic seed retrieval + dependency graph expansion with hub-node pruning', detail: 'Retrieved 25 candidates (10 seeds + 15 expanded)' },
  { id: 5, name: 'Verifying trace links', description: 'LLM-based verification with accept/reject iterative loop', detail: 'Verified 25 pairs over 3 iterations' },
  { id: 6, name: 'Generating final results', description: 'Compiling trace links with decisions, confidence scores, and explanations', detail: 'Produced 25 trace links (20 accepted, 3 rejected, 2 pending)' },
];

const STAGE_DURATIONS = [3000, 4000, 5000, 3000, 5000, 6000, 2000];

type ProgressCallback = (state: AnalysisState) => void;

let currentState: AnalysisState | null = null;
let subscribers: ProgressCallback[] = [];
let timers: ReturnType<typeof setInterval>[] = [];

function createInitialState(projectId: string): AnalysisState {
  return {
    projectId,
    stages: STAGES.map(s => ({ ...s, status: 'pending' as const, progress: 0 })),
    currentStageIndex: 0, overallProgress: 0, isRunning: false, isCompleted: false,
  };
}

function notify(): void {
  if (currentState) subscribers.forEach(cb => cb({ ...currentState! }));
}

function cleanup(): void {
  timers.forEach(t => clearInterval(t));
  timers = [];
}

function runStage(stageIndex: number): void {
  if (!currentState || stageIndex >= STAGES.length) {
    if (currentState) {
      currentState.isRunning = false;
      currentState.isCompleted = true;
      currentState.overallProgress = 100;
      const finishedPid = currentState.projectId;
      getProject(finishedPid).then(project => {
        const isBench = project?.type === 'benchmark';
        updateProjectStatus(finishedPid, 'completed', isBench ? {
          totalRequirements: 8, totalCodeArtifacts: 5, totalTraceLinks: 12,
          acceptedLinks: 10, rejectedLinks: 2, avgConfidence: 0.78,
        } : {
          totalRequirements: 12, totalCodeArtifacts: 20, totalTraceLinks: 25,
          acceptedLinks: 20, rejectedLinks: 3, avgConfidence: 0.84,
        });
        notify();
      });
    }
    return;
  }

  currentState.currentStageIndex = stageIndex;
  currentState.stages[stageIndex].status = 'running';
  notify();

  const duration = STAGE_DURATIONS[stageIndex];
  const interval = 200;
  const steps = duration / interval;
  let step = 0;

  const timer = setInterval(() => {
    if (!currentState) { clearInterval(timer); return; }
    step++;
    const progress = Math.min(100, Math.round((step / steps) * 100));
    currentState.stages[stageIndex].progress = progress;
    currentState.overallProgress = Math.round(((stageIndex * 100 + progress) / STAGES.length));

    if (progress >= 100) {
      clearInterval(timer);
      currentState.stages[stageIndex].status = 'completed';
      notify();
      runStage(stageIndex + 1);
    } else {
      notify();
    }
  }, interval);

  timers.push(timer);
}

export async function startAnalysis(projectId: string): Promise<void> {
  cleanup();
  currentState = createInitialState(projectId);
  currentState.isRunning = true;
  updateProjectStatus(projectId, 'analyzing');
  notify();
  runStage(0);
}

export async function restartAnalysis(projectId: string): Promise<void> {
  cleanup();
  currentState = createInitialState(projectId);
  currentState.isRunning = true;
  updateProjectStatus(projectId, 'analyzing');
  notify();
  runStage(0);
}

export function getAnalysisState(): AnalysisState | null {
  return currentState ? { ...currentState } : null;
}

export function subscribeToProgress(callback: ProgressCallback): () => void {
  subscribers.push(callback);
  if (currentState) callback({ ...currentState });
  return () => { subscribers = subscribers.filter(cb => cb !== callback); };
}

export function cleanupAnalysis(): void {
  cleanup();
  subscribers = [];
}
