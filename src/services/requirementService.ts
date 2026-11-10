import type { Requirement } from '@/types';
import { mockRequirements, mockBenchmarkRequirements } from '@/data/mockRequirements';
import { delay } from '@/lib/utils';
import { getProject } from './projectService';

let allRequirements = [...mockRequirements, ...mockBenchmarkRequirements];

async function ensureProjectRequirements(projectId: string): Promise<void> {
  const hasReqs = allRequirements.some(r => r.projectId === projectId);
  if (!hasReqs) {
    const project = await getProject(projectId);
    const sourceReqs = project?.type === 'benchmark' ? mockBenchmarkRequirements : mockRequirements;
    const projectReqs = sourceReqs.map(r => ({
      ...r,
      id: `${r.id}-${projectId}`,
      projectId,
    }));
    allRequirements = [...allRequirements, ...projectReqs];
  }
}

export async function getRequirements(projectId: string): Promise<Requirement[]> {
  await delay(80);
  await ensureProjectRequirements(projectId);
  return allRequirements.filter(r => r.projectId === projectId);
}

export async function getRequirement(id: string): Promise<Requirement | undefined> {
  await delay(50);
  return allRequirements.find(r => r.id === id);
}
