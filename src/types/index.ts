/* ── ReqLink Type Definitions ── */

export type ProjectType = 'standard' | 'benchmark';
export type CodeSourceType = 'github' | 'upload';
export type ProjectStatus = 'created' | 'analyzing' | 'completed' | 'error';
export type AnalysisStageStatus = 'pending' | 'running' | 'completed' | 'error';
export type TraceLinkDecision = 'accepted' | 'rejected' | 'pending';
export type CodeArtifactType = 'method' | 'class' | 'package';
export type DependencyType = 'call' | 'inheritance' | 'interface' | 'import' | 'field_type';
export type PRStatus = 'open' | 'merged' | 'closed';
export type FileChangeType = 'added' | 'modified' | 'deleted' | 'renamed';
export type BenchmarkDataset = 'eTour' | 'iTrust' | 'SMOS' | 'eAnci';
export type EvalConfig = 'A' | 'B' | 'C' | 'D';
export type SupportedLanguage = 'java' | 'c';

/* ── Core Entities ── */

export interface Project {
  id: string;
  name: string;
  description: string;
  type: ProjectType;
  codeSource: CodeSourceType;
  githubUrl?: string;
  uploadedFileName?: string;
  requirementsFileName: string;
  language: SupportedLanguage;
  enableExperimentalC: boolean;
  status: ProjectStatus;
  benchmarkDataset?: BenchmarkDataset;
  createdAt: string;
  completedAt?: string;
  stats?: ProjectStats;
}

export interface ProjectStats {
  totalRequirements: number;
  totalCodeArtifacts: number;
  totalTraceLinks: number;
  acceptedLinks: number;
  rejectedLinks: number;
  avgConfidence: number;
}

export interface Requirement {
  id: string;
  projectId: string;
  identifier: string;
  text: string;
  source: string;
  linkedArtifacts: number;
}

export interface CodeArtifact {
  id: string;
  projectId: string;
  name: string;
  qualifiedName: string;
  type: CodeArtifactType;
  filePath: string;
  language: SupportedLanguage;
  summary: string;
  lineStart: number;
  lineEnd: number;
  parentId?: string;
  linkedRequirements: number;
}

export interface TraceLink {
  id: string;
  projectId: string;
  requirementId: string;
  requirementIdentifier: string;
  requirementText: string;
  codeArtifactId: string;
  codeArtifactName: string;
  codeArtifactType: CodeArtifactType;
  codeArtifactPath: string;
  decision: TraceLinkDecision;
  confidence: number;
  explanation: string;
  retrievalMethod: 'semantic_seed' | 'graph_expansion';
  verifiedAt: string;
}

export interface DependencyNode {
  id: string;
  label: string;
  type: CodeArtifactType;
  filePath: string;
  degree: number;
}

export interface DependencyEdge {
  id: string;
  source: string;
  target: string;
  type: DependencyType;
}

export interface DependencyGraph {
  nodes: DependencyNode[];
  edges: DependencyEdge[];
}

export interface AnalysisStage {
  id: number;
  name: string;
  description: string;
  status: AnalysisStageStatus;
  progress: number;
  detail?: string;
}

export interface AnalysisState {
  projectId: string;
  stages: AnalysisStage[];
  currentStageIndex: number;
  overallProgress: number;
  isRunning: boolean;
  isCompleted: boolean;
  error?: string;
}

export interface PullRequest {
  id: string;
  projectId: string;
  number: number;
  title: string;
  author: string;
  status: PRStatus;
  changedFiles: FileChange[];
  affectedLinks: number;
  newLinks: number;
  comments: PRComment[];
  createdAt: string;
}

export interface FileChange {
  path: string;
  changeType: FileChangeType;
  additions: number;
  deletions: number;
  affectedMethods: string[];
}

export interface PRComment {
  id: string;
  type: 'trace_link_suggestion' | 'unlinked_warning' | 'link_updated';
  content: string;
  relatedLinks: string[];
}

export interface EvaluationResult {
  dataset: BenchmarkDataset;
  config: EvalConfig;
  configLabel: string;
  precision: number;
  recall: number;
  f1: number;
  f2: number;
  map?: number;
}

export interface ResearchQuestion {
  id: string;
  question: string;
  finding: string;
  supported: boolean;
}

export interface FileTreeNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileTreeNode[];
  size?: number;
  extension?: string;
}

/* ── Filter / Form Types ── */

export interface CreateProjectData {
  name: string;
  description: string;
  type: ProjectType;
  codeSource: CodeSourceType;
  githubUrl?: string;
  uploadedFileName?: string;
  requirementsFileName: string;
  language: SupportedLanguage;
  enableExperimentalC: boolean;
  benchmarkDataset?: BenchmarkDataset;
}

export interface TraceLinkFilterParams {
  search?: string;
  decision?: TraceLinkDecision | 'all';
  confidenceMin?: number;
  confidenceMax?: number;
  retrievalMethod?: 'semantic_seed' | 'graph_expansion' | 'all';
  sortBy?: 'confidence' | 'requirement' | 'artifact' | 'decision';
  sortOrder?: 'asc' | 'desc';
}
