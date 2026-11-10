import type { EvaluationResult, ResearchQuestion } from '@/types';
import { mockEvaluationResults, mockResearchQuestions } from '@/data/mockEvaluation';
import { delay } from '@/lib/utils';

export async function getEvaluationResults(_projectId: string): Promise<EvaluationResult[]> {
  await delay(100);
  return [...mockEvaluationResults];
}

export async function getResearchQuestions(_projectId: string): Promise<ResearchQuestion[]> {
  await delay(80);
  return [...mockResearchQuestions];
}
