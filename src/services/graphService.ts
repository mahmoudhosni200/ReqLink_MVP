import type { DependencyGraph } from '@/types';
import { mockDependencyGraph } from '@/data/mockGraph';
import { delay } from '@/lib/utils';

export async function getDependencyGraph(_projectId: string): Promise<DependencyGraph> {
  await delay(100);
  return { ...mockDependencyGraph };
}
