import type { PullRequest } from '@/types';
import { mockPullRequests } from '@/data/mockPullRequests';
import { delay } from '@/lib/utils';

let pullRequests: PullRequest[] = [...mockPullRequests];

async function ensureProjectPRs(projectId: string): Promise<void> {
  const hasPRs = pullRequests.some(pr => pr.projectId === projectId);
  if (!hasPRs) {
    const projectPRs = mockPullRequests.map(pr => ({
      ...pr,
      id: `${pr.id}-${projectId}`,
      projectId,
    }));
    pullRequests = [...pullRequests, ...projectPRs];
  }
}

export async function getPullRequests(projectId: string): Promise<PullRequest[]> {
  await delay(100);
  await ensureProjectPRs(projectId);
  return pullRequests.filter(pr => pr.projectId === projectId);
}

export async function getPullRequest(id: string): Promise<PullRequest | undefined> {
  await delay(50);
  return pullRequests.find(pr => pr.id === id);
}
