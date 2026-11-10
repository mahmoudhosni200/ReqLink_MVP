import type { EvaluationResult, ResearchQuestion } from '@/types';

export const mockEvaluationResults: EvaluationResult[] = [
  // eTour
  { dataset: 'eTour', config: 'A', configLabel: 'LiSSA Baseline', precision: 0.28, recall: 0.35, f1: 0.31, f2: 0.33, map: 0.25 },
  { dataset: 'eTour', config: 'B', configLabel: 'LiSSA + Preprocessing', precision: 0.39, recall: 0.46, f1: 0.42, f2: 0.44, map: 0.35 },
  { dataset: 'eTour', config: 'C', configLabel: 'LiSSA + Graph Retrieval', precision: 0.36, recall: 0.55, f1: 0.44, f2: 0.50, map: 0.38 },
  { dataset: 'eTour', config: 'D', configLabel: 'Full ReqLink Pipeline', precision: 0.48, recall: 0.62, f1: 0.54, f2: 0.59, map: 0.46 },
  // iTrust
  { dataset: 'iTrust', config: 'A', configLabel: 'LiSSA Baseline', precision: 0.30, recall: 0.33, f1: 0.31, f2: 0.32, map: 0.27 },
  { dataset: 'iTrust', config: 'B', configLabel: 'LiSSA + Preprocessing', precision: 0.41, recall: 0.44, f1: 0.42, f2: 0.43, map: 0.36 },
  { dataset: 'iTrust', config: 'C', configLabel: 'LiSSA + Graph Retrieval', precision: 0.38, recall: 0.52, f1: 0.44, f2: 0.49, map: 0.39 },
  { dataset: 'iTrust', config: 'D', configLabel: 'Full ReqLink Pipeline', precision: 0.50, recall: 0.60, f1: 0.55, f2: 0.58, map: 0.48 },
  // SMOS
  { dataset: 'SMOS', config: 'A', configLabel: 'LiSSA Baseline', precision: 0.25, recall: 0.30, f1: 0.27, f2: 0.29, map: 0.22 },
  { dataset: 'SMOS', config: 'B', configLabel: 'LiSSA + Preprocessing', precision: 0.35, recall: 0.40, f1: 0.37, f2: 0.39, map: 0.30 },
  { dataset: 'SMOS', config: 'C', configLabel: 'LiSSA + Graph Retrieval', precision: 0.33, recall: 0.48, f1: 0.39, f2: 0.44, map: 0.32 },
  { dataset: 'SMOS', config: 'D', configLabel: 'Full ReqLink Pipeline', precision: 0.44, recall: 0.56, f1: 0.49, f2: 0.53, map: 0.41 },
  // eAnci
  { dataset: 'eAnci', config: 'A', configLabel: 'LiSSA Baseline', precision: 0.27, recall: 0.32, f1: 0.29, f2: 0.31, map: 0.24 },
  { dataset: 'eAnci', config: 'B', configLabel: 'LiSSA + Preprocessing', precision: 0.38, recall: 0.43, f1: 0.40, f2: 0.42, map: 0.33 },
  { dataset: 'eAnci', config: 'C', configLabel: 'LiSSA + Graph Retrieval', precision: 0.35, recall: 0.50, f1: 0.41, f2: 0.46, map: 0.35 },
  { dataset: 'eAnci', config: 'D', configLabel: 'Full ReqLink Pipeline', precision: 0.46, recall: 0.58, f1: 0.51, f2: 0.55, map: 0.44 },
];

export const mockResearchQuestions: ResearchQuestion[] = [
  { id: 'RQ1', question: 'Does code-aware preprocessing improve traceability compared with the LiSSA baseline?', finding: 'Yes. Configuration B (LiSSA + preprocessing) improved average F1 from 0.30 to 0.40 (+33%) across all four datasets. The AST-based code cleaning and hierarchical LLM summaries bridge the vocabulary gap between natural-language requirements and code identifiers, producing richer semantic representations that improve embedding similarity.', supported: true },
  { id: 'RQ2', question: 'Does dependency-graph expansion improve candidate retrieval recall?', finding: 'Yes. Configuration C (LiSSA + graph retrieval) improved average recall from 0.33 to 0.51 (+55%) compared to the baseline. Graph expansion through call, inheritance, and interface dependencies discovers related artifacts that pure semantic similarity misses, particularly for scattered implementations.', supported: true },
  { id: 'RQ3', question: 'Does combining preprocessing and graph retrieval improve final performance more than either alone?', finding: 'Yes. Configuration D (full pipeline) achieved the best results with average F1 of 0.52, compared to 0.40 for B and 0.42 for C. The combination is synergistic: better code representations improve seed quality, which in turn makes graph expansion more effective.', supported: true },
  { id: 'RQ4', question: 'Can the system incrementally maintain useful trace links as the code changes?', finding: 'Partially supported. The GitHub PR integration successfully detects code changes, re-evaluates affected links, and identifies new trace link candidates. However, incremental evaluation accuracy depends on the scope of changes — large refactorings may require full re-analysis for optimal results.', supported: true },
];
