import type { TraceLink, TraceLinkFilterParams } from '@/types';
import { mockTraceLinks, mockBenchmarkTraceLinks } from '@/data/mockTraceLinks';
import { delay } from '@/lib/utils';
import { getProject } from './projectService';

// Module-level store — only accepted links are kept in mock data
let traceLinks: TraceLink[] = [...mockTraceLinks, ...mockBenchmarkTraceLinks];

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
  }
}

export async function getTraceLinks(projectId: string): Promise<TraceLink[]> {
  await delay(100);
  await ensureProjectLinks(projectId);
  return traceLinks.filter(tl => tl.projectId === projectId && tl.decision === 'accepted');
}

export async function getTraceLink(id: string): Promise<TraceLink | undefined> {
  await delay(50);
  return traceLinks.find(tl => tl.id === id);
}

export async function filterTraceLinks(projectId: string, params: TraceLinkFilterParams): Promise<TraceLink[]> {
  await delay(80);
  await ensureProjectLinks(projectId);
  // Always show only accepted links
  let result = traceLinks.filter(tl => tl.projectId === projectId && tl.decision === 'accepted');

  if (params.search) {
    const q = params.search.toLowerCase();
    result = result.filter(tl =>
      tl.requirementIdentifier.toLowerCase().includes(q) ||
      tl.requirementText.toLowerCase().includes(q) ||
      tl.codeArtifactName.toLowerCase().includes(q) ||
      tl.explanation.toLowerCase().includes(q)
    );
  }
  if (params.retrievalMethod && params.retrievalMethod !== 'all') {
    result = result.filter(tl => tl.retrievalMethod === params.retrievalMethod);
  }
  if (params.sortBy) {
    result.sort((a, b) => {
      let cmp = 0;
      switch (params.sortBy) {
        case 'requirement': cmp = a.requirementIdentifier.localeCompare(b.requirementIdentifier); break;
        case 'artifact': cmp = a.codeArtifactName.localeCompare(b.codeArtifactName); break;
      }
      return params.sortOrder === 'desc' ? -cmp : cmp;
    });
  }
  return result;
}
