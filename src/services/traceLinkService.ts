import type { TraceLink, TraceLinkDecision, TraceLinkFilterParams } from '@/types';
import { mockTraceLinks, mockBenchmarkTraceLinks } from '@/data/mockTraceLinks';
import { delay } from '@/lib/utils';
import { getProject } from './projectService';

// Module-level mutable store
let traceLinks: TraceLink[] = [...mockTraceLinks, ...mockBenchmarkTraceLinks];

function loadOverrides(): void {
  try {
    const stored = localStorage.getItem('reqlink-tl-decisions');
    if (stored) {
      const overrides = JSON.parse(stored) as Record<string, TraceLinkDecision>;
      traceLinks = traceLinks.map(tl => overrides[tl.id] ? { ...tl, decision: overrides[tl.id] } : tl);
    }
  } catch { /* ignore */ }
}

function saveOverrides(): void {
  const overrides: Record<string, TraceLinkDecision> = {};
  traceLinks.forEach(tl => {
    overrides[tl.id] = tl.decision;
  });
  localStorage.setItem('reqlink-tl-decisions', JSON.stringify(overrides));
}

loadOverrides();

async function ensureProjectLinks(projectId: string): Promise<void> {
  const hasLinks = traceLinks.some(tl => tl.projectId === projectId);
  if (!hasLinks) {
    const project = await getProject(projectId);
    const sourceLinks = project?.type === 'benchmark' ? mockBenchmarkTraceLinks : mockTraceLinks;
    const projectLinks = sourceLinks.map(tl => ({
      ...tl,
      id: `${tl.id}-${projectId}`,
      projectId,
    }));
    traceLinks = [...traceLinks, ...projectLinks];
    loadOverrides();
  }
}

export async function getTraceLinks(projectId: string): Promise<TraceLink[]> {
  await delay(100);
  await ensureProjectLinks(projectId);
  return traceLinks.filter(tl => tl.projectId === projectId);
}

export async function getTraceLink(id: string): Promise<TraceLink | undefined> {
  await delay(50);
  return traceLinks.find(tl => tl.id === id);
}

export async function updateTraceLinkDecision(id: string, decision: TraceLinkDecision): Promise<TraceLink | undefined> {
  await delay(80);
  traceLinks = traceLinks.map(tl => tl.id === id ? { ...tl, decision } : tl);
  saveOverrides();
  return traceLinks.find(tl => tl.id === id);
}

export async function filterTraceLinks(projectId: string, params: TraceLinkFilterParams): Promise<TraceLink[]> {
  await delay(80);
  await ensureProjectLinks(projectId);
  let result = traceLinks.filter(tl => tl.projectId === projectId);

  if (params.search) {
    const q = params.search.toLowerCase();
    result = result.filter(tl =>
      tl.requirementIdentifier.toLowerCase().includes(q) ||
      tl.requirementText.toLowerCase().includes(q) ||
      tl.codeArtifactName.toLowerCase().includes(q) ||
      tl.explanation.toLowerCase().includes(q)
    );
  }
  if (params.decision && params.decision !== 'all') {
    result = result.filter(tl => tl.decision === params.decision);
  }
  if (params.confidenceMin !== undefined) {
    result = result.filter(tl => tl.confidence >= params.confidenceMin!);
  }
  if (params.confidenceMax !== undefined) {
    result = result.filter(tl => tl.confidence <= params.confidenceMax!);
  }
  if (params.retrievalMethod && params.retrievalMethod !== 'all') {
    result = result.filter(tl => tl.retrievalMethod === params.retrievalMethod);
  }
  if (params.sortBy) {
    result.sort((a, b) => {
      let cmp = 0;
      switch (params.sortBy) {
        case 'confidence': cmp = a.confidence - b.confidence; break;
        case 'requirement': cmp = a.requirementIdentifier.localeCompare(b.requirementIdentifier); break;
        case 'artifact': cmp = a.codeArtifactName.localeCompare(b.codeArtifactName); break;
        case 'decision': cmp = a.decision.localeCompare(b.decision); break;
      }
      return params.sortOrder === 'desc' ? -cmp : cmp;
    });
  }
  return result;
}
