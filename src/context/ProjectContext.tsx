import React, { createContext, useReducer, useEffect, useCallback, useRef } from 'react';
import type { ProjectState, ProjectAction, ProjectFormData, Project, Activity, ActivityFormData } from '../types/project';
import { projectReducer, initialState } from './projectReducer';
import { loadData, saveData } from '../services/storageService';

interface ProjectContextValue {
  state: ProjectState;
  dispatch: React.Dispatch<ProjectAction>;
  addProject: (formData: ProjectFormData) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  addActivity: (formData: ActivityFormData) => void;
  updateActivity: (activity: Activity) => void;
  deleteActivity: (id: string) => void;
}

export const ProjectContext = createContext<ProjectContextValue | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(projectReducer, initialState);
  const isInitialLoad = useRef(true);

  // Load from localStorage on mount
  useEffect(() => {
    const data = loadData();
    dispatch({ type: 'LOAD_DATA', payload: data });
  }, []);

  // Save to localStorage whenever projects/activities change
  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }
    if (!state.loading) {
      saveData({ projects: state.projects, activities: state.activities });
    }
  }, [state.projects, state.activities, state.loading]);

  const addProject = useCallback((formData: ProjectFormData) => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      nome: formData.nome,
      responsavel: formData.responsavel,
      dataInicio: formData.dataInicio,
      dataFim: formData.dataFim,
      funcionalidades: formData.funcionalidades,
      descricao: formData.descricao,
    };
    dispatch({ type: 'ADD_PROJECT', payload: newProject });
  }, []);

  const updateProject = useCallback((project: Project) => {
    dispatch({ type: 'UPDATE_PROJECT', payload: project });
  }, []);

  const deleteProject = useCallback((id: string) => {
    dispatch({ type: 'DELETE_PROJECT', payload: id });
  }, []);

  const addActivity = useCallback((formData: ActivityFormData) => {
    const newActivity: Activity = {
      id: crypto.randomUUID(),
      type: formData.type,
      name: formData.name,
      assignee: formData.assignee,
      team: formData.team,
      category: formData.category,
      start: formData.start,
      end: formData.end,
      progress: formData.progress,
      dependencies: formData.dependencies,
      parentId: formData.parentId,
      projectId: formData.projectId,
      description: formData.description,
      status: 'dentro-do-prazo', // compute properly later if needed
    };
    dispatch({ type: 'ADD_ACTIVITY', payload: newActivity });
  }, []);

  const updateActivity = useCallback((activity: Activity) => {
    dispatch({ type: 'UPDATE_ACTIVITY', payload: activity });
  }, []);

  const deleteActivity = useCallback((id: string) => {
    dispatch({ type: 'DELETE_ACTIVITY', payload: id });
  }, []);

  const value = {
    state,
    dispatch,
    addProject,
    updateProject,
    deleteProject,
    addActivity,
    updateActivity,
    deleteActivity,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}
