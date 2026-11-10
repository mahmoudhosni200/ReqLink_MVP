import type { Project, CreateProjectData } from '@/types';
import { delay, generateId } from '@/lib/utils';

const sampleProjects: Project[] = [
  {
    id: 'proj-1', name: 'Hospital Management System', description: 'Traceability analysis for the HMS Java backend connecting 12 functional requirements to their implementing code artifacts.',
    type: 'standard', codeSource: 'github', githubUrl: 'https://github.com/example/hospital-management-system',
    requirementsFileName: 'HMS_SRS.docx', language: 'java', enableExperimentalC: false, status: 'completed',
    createdAt: '2024-11-07T08:00:00Z', completedAt: '2024-11-07T08:12:00Z',
    stats: { totalRequirements: 12, totalCodeArtifacts: 20, totalTraceLinks: 20, acceptedLinks: 20 },
  },
  {
    id: 'proj-bench-1', name: 'eTour Benchmark', description: 'Benchmark evaluation on the eTour dataset comparing ReqLink configurations A–D against gold-standard trace links.',
    type: 'benchmark', codeSource: 'upload', benchmarkDataset: 'eTour',
    requirementsFileName: 'eTour_requirements.txt', language: 'java', enableExperimentalC: false, status: 'completed',
    createdAt: '2024-11-06T10:00:00Z', completedAt: '2024-11-06T10:25:00Z',
    stats: { totalRequirements: 8, totalCodeArtifacts: 5, totalTraceLinks: 9, acceptedLinks: 9 },
  },
];

let projects: Project[] = [...sampleProjects];

function loadFromStorage(): void {
  try {
    const stored = localStorage.getItem('reqlink-projects');
    if (stored) {
      const parsed = JSON.parse(stored) as Project[];
      // Merge: keep stored versions, add samples if missing
      const ids = new Set(parsed.map(p => p.id));
      projects = [...parsed, ...sampleProjects.filter(s => !ids.has(s.id))];
    }
  } catch { /* ignore */ }
}

function saveToStorage(): void {
  localStorage.setItem('reqlink-projects', JSON.stringify(projects));
}

loadFromStorage();

export async function getProjects(): Promise<Project[]> {
  await delay(100);
  return [...projects];
}

export async function getProject(id: string): Promise<Project | undefined> {
  await delay(50);
  return projects.find(p => p.id === id);
}

export async function createProject(data: CreateProjectData): Promise<Project> {
  await delay(150);
  const project: Project = {
    ...data, id: `proj-${generateId()}`, status: 'created',
    createdAt: new Date().toISOString(),
  };
  projects = [project, ...projects];
  saveToStorage();
  return project;
}

export async function deleteProject(id: string): Promise<void> {
  await delay(100);
  projects = projects.filter(p => p.id !== id);
  saveToStorage();
}

export function updateProjectStatus(id: string, status: Project['status'], stats?: Project['stats']): void {
  projects = projects.map(p => p.id === id ? { ...p, status, ...(stats ? { stats } : {}), ...(status === 'completed' ? { completedAt: new Date().toISOString() } : {}) } : p);
  saveToStorage();
}
