export type ActivityType = 'project' | 'phase' | 'task' | 'milestone';

export type ActivityStatus = 'dentro-do-prazo' | 'proximo-do-prazo' | 'atrasada' | 'concluida';

export interface Activity {
  id: string;
  type: ActivityType;
  name: string;
  assignee: string;
  team?: string;
  category?: string;
  start: string; // YYYY-MM-DD
  end: string;   // YYYY-MM-DD
  progress: number; // 0-100
  dependencies: string[]; // IDs of tasks this depends on
  parentId?: string; // ID of the parent project/phase/task
  projectId: string; // The root project this belongs to
  status: ActivityStatus;
  description: string;
}

export interface ActivityFormData {
  type: ActivityType;
  name: string;
  assignee: string;
  team?: string;
  category?: string;
  start: string;
  end: string;
  progress: number;
  dependencies: string[];
  parentId?: string;
  projectId: string;
  description: string;
}

export interface Project {
  id: string;
  nome: string;
  responsavel: string;
  dataInicio: string; // formato YYYY-MM-DD
  dataFim: string;    // formato YYYY-MM-DD
  funcionalidades: string[]; // Keeping this for backward compat with some UI
  descricao: string;
}

export interface ProjectFormData {
  nome: string;
  responsavel: string;
  dataInicio: string;
  dataFim: string;
  funcionalidades: string[];
  descricao: string;
}

export interface ProjectState {
  projects: Project[];
  activities: Activity[];
  loading: boolean;
}

export type ProjectAction =
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: Project }
  | { type: 'DELETE_PROJECT'; payload: string }
  | { type: 'LOAD_DATA'; payload: { projects: Project[]; activities: Activity[] } }
  | { type: 'ADD_ACTIVITY'; payload: Activity }
  | { type: 'UPDATE_ACTIVITY'; payload: Activity }
  | { type: 'DELETE_ACTIVITY'; payload: string }
  | { type: 'UPDATE_ACTIVITY_DATES'; payload: { id: string; start: string; end: string } };

export interface ValidationError {
  field: string;
  message: string;
}
