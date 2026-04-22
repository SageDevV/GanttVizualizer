import React, { createContext, useReducer, useEffect, useCallback } from 'react';
import type { ProjectState, ProjectAction, ProjectFormData, Project, Activity, ActivityFormData } from '../types/project';
import { projectReducer, initialState } from './projectReducer';
import { useAuth } from './AuthContext';
import { 
  loadUserDataFromFirestore, 
  saveProjectToFirestore, 
  deleteProjectFromFirestore, 
  saveActivityToFirestore,
  deleteActivityFromFirestore
} from '../services/firebaseService';

interface ProjectContextValue {
  state: ProjectState;
  dispatch: React.Dispatch<ProjectAction>;
  addProject: (formData: ProjectFormData) => Promise<void>;
  updateProject: (project: Project) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addActivity: (formData: ActivityFormData) => Promise<void>;
  updateActivity: (activity: Activity) => Promise<void>;
  deleteActivity: (id: string) => Promise<void>;
  updateActivityDates: (id: string, start: string, end: string) => Promise<void>;
}

export const ProjectContext = createContext<ProjectContextValue | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(projectReducer, initialState);
  const { user } = useAuth();

  // Load data only when user is authenticated
  useEffect(() => {
    let isMounted = true;

    async function initData() {
      if (!user) {
        // Se não tem usuário, limpa o estado
        dispatch({ type: 'LOAD_DATA', payload: { projects: [], activities: [] } });
        return;
      }

      console.log("[ProjectContext] Buscando dados no Firestore para o usuário:", user.uid);
      dispatch({ type: 'SET_LOADING', payload: true });

      try {
        const data = await loadUserDataFromFirestore(user.uid);
        if (isMounted) {
          dispatch({ type: 'LOAD_DATA', payload: data });
        }
      } catch (error) {
        console.error("[ProjectContext] Erro ao buscar dados no Firestore:", error);
      } finally {
        if (isMounted) {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      }
    }

    initData();

    return () => {
      isMounted = false;
    };
  }, [user]);

  // Removido efeito de salvamento no localStorage

  const addProject = useCallback(async (formData: ProjectFormData) => {
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
    
    if (user) {
      try {
        await saveProjectToFirestore(user.uid, newProject);
      } catch (error) {
        console.error("Erro ao salvar projeto no Firestore:", error);
        alert("Erro ao salvar no banco de dados. Verifique se o Firestore está ativado e com as regras corretas.");
      }
    }
  }, [user]);

  const updateProject = useCallback(async (project: Project) => {
    dispatch({ type: 'UPDATE_PROJECT', payload: project });
    if (user) {
      try {
        await saveProjectToFirestore(user.uid, project);
      } catch (error) {
        console.error("Erro ao atualizar projeto no Firestore:", error);
        alert("Erro ao atualizar no banco de dados.");
      }
    }
  }, [user]);

  const deleteProject = useCallback(async (id: string) => {
    dispatch({ type: 'DELETE_PROJECT', payload: id });
    if (user) {
      try {
        await deleteProjectFromFirestore(user.uid, id);
      } catch (error) {
        console.error("Erro ao deletar projeto no Firestore:", error);
        alert("Erro ao deletar do banco de dados.");
      }
    }
  }, [user]);

  const addActivity = useCallback(async (formData: ActivityFormData) => {
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
      status: 'dentro-do-prazo',
    };
    dispatch({ type: 'ADD_ACTIVITY', payload: newActivity });
    if (user) {
      try {
        await saveActivityToFirestore(user.uid, newActivity);
      } catch (error) {
        console.error("Erro ao salvar atividade no Firestore:", error);
        alert("Erro ao salvar atividade no banco de dados.");
      }
    }
  }, [user]);

  const updateActivity = useCallback(async (activity: Activity) => {
    dispatch({ type: 'UPDATE_ACTIVITY', payload: activity });
    if (user) {
      try {
        await saveActivityToFirestore(user.uid, activity);
      } catch (error) {
        console.error("Erro ao atualizar atividade no Firestore:", error);
        alert("Erro ao atualizar atividade.");
      }
    }
  }, [user]);

  const deleteActivity = useCallback(async (id: string) => {
    dispatch({ type: 'DELETE_ACTIVITY', payload: id });
    if (user) {
      try {
        await deleteActivityFromFirestore(id);
      } catch (error) {
        console.error("Erro ao deletar atividade no Firestore:", error);
        alert("Erro ao excluir atividade.");
      }
    }
  }, [user]);

  const updateActivityDates = useCallback(async (id: string, start: string, end: string) => {
    dispatch({ type: 'UPDATE_ACTIVITY_DATES', payload: { id, start, end } });
    if (user) {
      try {
        const activity = state.activities.find(a => a.id === id);
        if (activity) {
          await saveActivityToFirestore(user.uid, { ...activity, start, end });
        }
      } catch (error) {
        console.error("Erro ao atualizar datas no Firestore:", error);
        alert("Erro ao salvar alteração de datas na nuvem.");
      }
    }
  }, [user, state.activities]);

  const value = {
    state,
    dispatch,
    addProject,
    updateProject,
    deleteProject,
    addActivity,
    updateActivity,
    deleteActivity,
    updateActivityDates,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}
