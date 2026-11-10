import type { CodeArtifact } from '@/types';
import { mockCodeArtifacts, mockBenchmarkCodeArtifacts } from '@/data/mockCodeArtifacts';
import { delay } from '@/lib/utils';
import { getProject } from './projectService';

let allArtifacts = [...mockCodeArtifacts, ...mockBenchmarkCodeArtifacts];

async function ensureProjectArtifacts(projectId: string): Promise<void> {
  const hasArtifacts = allArtifacts.some(a => a.projectId === projectId);
  if (!hasArtifacts) {
    const project = await getProject(projectId);
    const sourceArtifacts = project?.type === 'benchmark' ? mockBenchmarkCodeArtifacts : mockCodeArtifacts;
    const projectArtifacts = sourceArtifacts.map(a => ({
      ...a,
      id: `${a.id}-${projectId}`,
      projectId,
    }));
    allArtifacts = [...allArtifacts, ...projectArtifacts];
  }
}

export async function getCodeArtifacts(projectId: string): Promise<CodeArtifact[]> {
  await delay(80);
  await ensureProjectArtifacts(projectId);
  return allArtifacts.filter(a => a.projectId === projectId);
}

export async function getCodeArtifact(id: string): Promise<CodeArtifact | undefined> {
  await delay(50);
  return allArtifacts.find(a => a.id === id);
}
