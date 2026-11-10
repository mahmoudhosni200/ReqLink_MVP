import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Project, CreateProjectData } from '@/types';
import * as projectService from '@/services/projectService';

interface ProjectStore {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  loadProjects: () => Promise<void>;
  loadProject: (id: string) => Promise<void>;
  createProject: (data: CreateProjectData) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
  setCurrentProject: (project: Project | null) => void;
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set) => ({
      projects: [],
      currentProject: null,
      isLoading: false,

      loadProjects: async () => {
        set({ isLoading: true });
        const projects = await projectService.getProjects();
        set({ projects, isLoading: false });
      },

      loadProject: async (id: string) => {
        set({ isLoading: true });
        const project = await projectService.getProject(id);
        set({ currentProject: project || null, isLoading: false });
      },

      createProject: async (data: CreateProjectData) => {
        const project = await projectService.createProject(data);
        set(state => ({ projects: [project, ...state.projects] }));
        return project;
      },

      deleteProject: async (id: string) => {
        await projectService.deleteProject(id);
        set(state => ({
          projects: state.projects.filter(p => p.id !== id),
          currentProject: state.currentProject?.id === id ? null : state.currentProject,
        }));
      },

      setCurrentProject: (project) => set({ currentProject: project }),
    }),
    { name: 'reqlink-project-store', partialize: (state) => ({ projects: state.projects }) }
  )
);
